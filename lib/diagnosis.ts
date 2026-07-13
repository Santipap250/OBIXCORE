// lib/diagnosis.ts — ConfigDoctor (Diagnosis Engine)
//
// Rule-based + physics-estimation analysis of a drone build. This file
// intentionally does NOT reimplement PID/filter/rate baselines or
// current-draw/flight-time physics — it calls calculateTuning() (the
// Wizard, lib/wizard.ts) and the shared helpers in lib/estimation.ts and
// lib/droneSpec.ts for all of that, then adds a diagnostic layer on top:
// severity-tiered warnings, prioritized recommendations, and 5 composite
// scores (Health/Safety/Efficiency/Performance/Reliability).
//
// Supports all 6 setup classes (Tiny Whoop/Micro, Cinewhoop/Toothpick,
// Freestyle 5", Racing 5", Long Range, Heavy Lifter) since it's built on
// the Wizard's own classifier.

import type { WizardInput, WizardResult, SetupClass } from "@/types";
import { calculateTuning, EXPECTED_FRAME_RANGE_MM, NOMINAL_WEIGHT_G } from "./wizard";
import { estimatePeakCurrentA, deviationPenalty, twrRating } from "./estimation";
import { idealKvRange, type CompatibilityLevel, compatLabel, compatColor } from "./droneSpec";
import { clamp, round, SETUP_CLASS_LABEL_TH } from "./utils";

// ── Public types ─────────────────────────────────────────────────────

export type Severity = "critical" | "high" | "medium" | "low";
export type MetricStatus = "good" | "watch" | "bad" | "info";

export interface CurrentTune {
  /** Roll and pitch are diagnosed together — this is how virtually all
   * Betaflight tunes are set (same P/I/D/F on both axes), and it halves
   * the form the person has to fill in. */
  pidRollPitch?: { p: number; i: number; d: number; f: number };
  pidYaw?: { p: number; i: number; d: number };
  gyroLpf1Hz?: number;
  dTermLpf1Hz?: number;
  dynamicNotch?: "OFF" | "LOW" | "MEDIUM" | "HIGH";
  ratesRollPitch?: { rc_rate: number; rate: number; expo: number };
  ratesYaw?: { rc_rate: number; rate: number; expo: number };
}

export interface DiagnosisInput {
  frameSize: number; // mm
  motorKV: number;
  batteryS: number;
  propSize: number; // ×10 inches (e.g. 51 = 5.1"), same convention as WizardInput
  propBlades?: 2 | 3 | 4 | 5 | 6;
  weight: number; // AUW grams
  style: WizardInput["style"];
  motorCount?: number;
  batteryMah?: number;
  escCurrentRatingA?: number;
  payloadG?: number;
  /** Optional — enables a real TWR/Power-to-Weight reading via twrRating(),
   * matching the Calculator. Without it, TWR is skipped rather than guessed
   * (thrust can't be reliably estimated from KV/prop alone). */
  thrustPerMotorG?: number;
  /** Informational only — displayed, not scored (no reliable FC/ESC
   * database to validate against). */
  fcName?: string;
  escName?: string;
  /** The tune actually flashed on the drone right now, if known. Enables
   * PID/Filter/Rates deviation analysis; omit to just see the Wizard's
   * recommended target for this build. */
  currentTune?: CurrentTune;
}

export interface DiagnosisWarning {
  id: string;
  severity: Severity;
  category: string;
  title: string;
  /** What's wrong/at risk, and why. */
  description: string;
  /** How to address it. */
  recommendation: string;
}

export interface DiagnosisRecommendation {
  priority: 1 | 2 | 3;
  title: string;
  reason: string;
  action: string;
}

export interface DiagnosisMetric {
  label: string;
  value: string;
  status: MetricStatus;
  note?: string;
}

export interface DiagnosisScores {
  /** Weighted overall: safety 30% + efficiency 20% + performance 25% + reliability 25%. */
  health: number;
  safety: number;
  efficiency: number;
  performance: number;
  reliability: number;
}

export interface MechanicalCheck {
  label: string;
  level: CompatibilityLevel;
  levelLabel: string;
  color: string;
  note: string;
}

export interface DiagnosisResult {
  setupClass: SetupClass;
  setupClassLabel: string;
  summary: string;
  scores: DiagnosisScores;
  warnings: DiagnosisWarning[];
  recommendations: DiagnosisRecommendation[];
  powerSystem: DiagnosisMetric[];
  flightCharacteristics: DiagnosisMetric[];
  mechanicalCompatibility: { overall: CompatibilityLevel; overallLabel: string; score: number; checks: MechanicalCheck[] };
  pidAnalysis: {
    metrics: DiagnosisMetric[];
    recommended: WizardResult["pid"];
    current?: { rollPitch: NonNullable<CurrentTune["pidRollPitch"]>; yaw: NonNullable<CurrentTune["pidYaw"]> };
  };
  filterAnalysis: {
    metrics: DiagnosisMetric[];
    recommended: WizardResult["filters"];
    current?: { gyroLpf1Hz?: number; dTermLpf1Hz?: number; dynamicNotch?: string };
  };
  ratesAnalysis: {
    metrics: DiagnosisMetric[];
    recommended: WizardResult["rates"];
    current?: { rollPitch?: NonNullable<CurrentTune["ratesRollPitch"]>; yaw?: NonNullable<CurrentTune["ratesYaw"]> };
  };
  cliSuggestions: string[];
  wizardConfidence: number;
  estimatedFields: string[];
}

// ── Helpers ───────────────────────────────────────────────────────────

function pct(deviationRatio: number): string {
  const p = (deviationRatio - 1) * 100;
  return `${p >= 0 ? "+" : ""}${round(p)}%`;
}

/** Mirrors lib/wizard.ts's own `estimateMotorCount` fallback exactly (4
 * motors, 6 for heavy lifters) — kept in sync deliberately since the
 * Wizard doesn't expose the resolved count in WizardResult. */
function resolveMotorCount(setupClass: SetupClass, provided: number | undefined): number {
  if (provided && provided > 0) return provided;
  return setupClass === "heavylift" ? 6 : 4;
}

function levelScore(l: CompatibilityLevel): number {
  return { perfect: 100, compatible: 80, tight: 55, risky: 25, incompatible: 0 }[l];
}

function overallLevelFromScore(score: number): CompatibilityLevel {
  if (score >= 90) return "perfect";
  if (score >= 70) return "compatible";
  if (score >= 45) return "tight";
  if (score >= 20) return "risky";
  return "incompatible";
}

function toWizardInput(input: DiagnosisInput): WizardInput {
  return {
    frameSize: input.frameSize,
    motorKV: input.motorKV,
    batteryS: input.batteryS,
    propSize: input.propSize,
    weight: input.weight,
    style: input.style,
    propBlades: input.propBlades,
    motorCount: input.motorCount,
    batteryMah: input.batteryMah,
    escCurrentRatingA: input.escCurrentRatingA,
    payloadG: input.payloadG,
  };
}

// ── Mechanical Compatibility ──────────────────────────────────────────
// Deliberately NOT reusing lib/droneSpec.ts's computeCompatibility() as-is
// — that engine only models 4 frame buckets (2/3/5/7") and would silently
// misclassify a tiny whoop or a 10"+ heavy lifter. Instead this reuses the
// same *reference tables and helpers* (EXPECTED_FRAME_RANGE_MM from the
// Wizard, idealKvRange/compatLabel/compatColor from droneSpec.ts) scaled to
// all 6 classes.
function checkMechanicalCompatibility(
  input: DiagnosisInput,
  setupClass: SetupClass,
  inertia: number
): { overall: CompatibilityLevel; overallLabel: string; score: number; checks: MechanicalCheck[] } {
  const checks: MechanicalCheck[] = [];

  // Frame vs prop
  const [frLo, frHi] = EXPECTED_FRAME_RANGE_MM[setupClass];
  let frameLevel: CompatibilityLevel;
  if (input.frameSize < frLo * 0.85 || input.frameSize > frHi * 1.15) frameLevel = "risky";
  else if (input.frameSize < frLo * 0.95 || input.frameSize > frHi * 1.05) frameLevel = "tight";
  else frameLevel = "perfect";
  checks.push({
    label: "Frame / Prop",
    level: frameLevel,
    levelLabel: compatLabel(frameLevel),
    color: compatColor(frameLevel),
    note:
      frameLevel === "perfect"
        ? `เฟรม ${input.frameSize}mm สอดคล้องกับกลุ่ม ${SETUP_CLASS_LABEL_TH[setupClass]} (ปกติ ${frLo}–${frHi}mm)`
        : `เฟรม ${input.frameSize}mm อยู่นอกช่วงปกติของกลุ่ม ${SETUP_CLASS_LABEL_TH[setupClass]} (${frLo}–${frHi}mm) — ตรวจว่ากรอกสเปกถูกกลุ่มหรือไม่`,
  });

  // KV vs battery S — reuses droneSpec.ts's own curve
  const [kvLo, kvHi] = idealKvRange(input.batteryS);
  let kvLevel: CompatibilityLevel;
  if (input.motorKV < kvLo * 0.75 || input.motorKV > kvHi * 1.3) kvLevel = "risky";
  else if (input.motorKV < kvLo || input.motorKV > kvHi) kvLevel = "compatible";
  else kvLevel = "perfect";
  checks.push({
    label: "KV / Battery S",
    level: kvLevel,
    levelLabel: compatLabel(kvLevel),
    color: compatColor(kvLevel),
    note:
      kvLevel === "perfect"
        ? `${input.motorKV}KV เหมาะกับ ${input.batteryS}S (แนะนำ ${kvLo}–${kvHi}KV)`
        : `${input.motorKV}KV กับ ${input.batteryS}S ห่างจากช่วงแนะนำ (${kvLo}–${kvHi}KV) — ${
            input.motorKV > kvHi ? "เสี่ยงมอเตอร์ร้อน/ใบพัดหนักเกินไป" : "เสียประสิทธิภาพและแรงบิด"
          }`,
  });

  // Weight vs class nominal (reuses the Wizard's own inertia number)
  let weightLevel: CompatibilityLevel;
  if (inertia > 1.6) weightLevel = "risky";
  else if (inertia > 1.25) weightLevel = "tight";
  else if (inertia < 0.65) weightLevel = "compatible";
  else weightLevel = "perfect";
  const nominalWeight = NOMINAL_WEIGHT_G[setupClass];
  checks.push({
    label: "Weight (AUW)",
    level: weightLevel,
    levelLabel: compatLabel(weightLevel),
    color: compatColor(weightLevel),
    note:
      weightLevel === "perfect"
        ? `น้ำหนักรวมใกล้เคียงค่าอ้างอิงของกลุ่ม ${SETUP_CLASS_LABEL_TH[setupClass]} (~${nominalWeight}g)`
        : `น้ำหนักรวมห่างจากค่าอ้างอิงกลุ่ม ${SETUP_CLASS_LABEL_TH[setupClass]} (~${nominalWeight}g) ${pct(inertia)} — ${
            inertia > 1 ? "อาจ handling หนัก/TWR ต่ำ" : "อาจไวเกินจนควบคุมยาก"
          }`,
  });

  const score = Math.round(checks.reduce((s, c) => s + levelScore(c.level), 0) / checks.length);
  const overall = overallLevelFromScore(score);

  return { overall, overallLabel: compatLabel(overall), score, checks };
}

// ── Main entry point ──────────────────────────────────────────────────

export function diagnose(input: DiagnosisInput): DiagnosisResult {
  const wizardInput = toWizardInput(input);
  const w = calculateTuning(wizardInput);
  const { setupClass, propLoad, inertia } = w;
  const setupClassLabel = SETUP_CLASS_LABEL_TH[setupClass];
  const motorCount = resolveMotorCount(setupClass, input.motorCount);

  const warnings: DiagnosisWarning[] = [];
  const pushWarning = (wrn: DiagnosisWarning) => warnings.push(wrn);

  // ── Motor Load / Motor Temperature Risk ─────────────────────────────
  if (propLoad > 1.4) {
    pushWarning({
      id: "motor-load-critical", severity: "critical", category: "Motor Load",
      title: "โหลดมอเตอร์สูงมาก",
      description: `Prop/KV/แบต/จำนวนใบพัดชุดนี้ให้ค่าโหลด ${propLoad.toFixed(2)}× ค่าอ้างอิงของกลุ่ม ${setupClassLabel} — สูงกว่าปกติมาก เสี่ยงมอเตอร์ไหม้และ ESC ไหม้`,
      recommendation: "ลด prop pitch/diameter, ลด KV, หรือลด cell count ลงหนึ่งขั้น แล้วเช็คอุณหภูมิมอเตอร์ทันทีหลังบินรอบแรก",
    });
  } else if (propLoad > 1.28) {
    pushWarning({
      id: "motor-load-high", severity: "high", category: "Motor Load",
      title: "โหลดมอเตอร์สูงกว่าปกติ",
      description: `โหลด ${propLoad.toFixed(2)}× ค่าอ้างอิงของกลุ่ม ${setupClassLabel}`,
      recommendation: "ลด pitch ใบพัดหรือเช็คอุณหภูมิมอเตอร์หลังบินรอบแรก",
    });
  } else if (propLoad > 1.15) {
    pushWarning({
      id: "motor-load-medium", severity: "medium", category: "Motor Load",
      title: "โหลดมอเตอร์ค่อนข้างสูง",
      description: `โหลด ${propLoad.toFixed(2)}× ค่าอ้างอิงของกลุ่ม ${setupClassLabel} — ยังอยู่ในเกณฑ์ใช้งานได้`,
      recommendation: "ไม่จำเป็นต้องแก้ทันที แต่เฝ้าดูอุณหภูมิมอเตอร์เป็นระยะ",
    });
  } else if (propLoad < 0.78) {
    pushWarning({
      id: "motor-load-low", severity: "low", category: "Motor Load",
      title: "โหลดมอเตอร์ต่ำกว่าปกติ",
      description: `โหลด ${propLoad.toFixed(2)}× ค่าอ้างอิงของกลุ่ม ${setupClassLabel} — prop อาจเบา/เล็กไปสำหรับสเปกนี้`,
      recommendation: "ถ้าต้องการ performance เต็มที่ ลองเพิ่ม pitch/diameter ของใบพัด",
    });
  }

  // ── Battery Stress (class-specific, mirrors the Wizard's own checks) ─
  if (setupClass === "micro" && input.batteryS > 2) {
    pushWarning({
      id: "battery-micro-overvolt", severity: "high", category: "Battery Stress",
      title: "แบตแรงเกินสำหรับ Micro/Whoop",
      description: `Micro/Tiny Whoop ปกติใช้ 1S–2S แต่ build นี้ใช้ ${input.batteryS}S`,
      recommendation: "ใช้แบต 1S–2S ตามสเปกเดิม หรือถ้าจงใจอัพ S ต้องมั่นใจว่าเฟรม/มอเตอร์รองรับแรงที่เพิ่มขึ้น",
    });
  }
  if (setupClass !== "micro" && setupClass !== "heavylift" && input.motorKV > 2600 && input.batteryS >= 5) {
    pushWarning({
      id: "battery-kv-high-s", severity: "medium", category: "Battery Stress",
      title: "KV สูงร่วมกับแบตหลาย cell",
      description: `${input.motorKV}KV กับ ${input.batteryS}S อาจทำให้มอเตอร์ร้อนเร็วกว่าปกติ`,
      recommendation: "ตรวจอุณหภูมิมอเตอร์หลังบินรอบแรก ถ้าร้อนเกินให้ลด KV หรือลด cell count",
    });
  }

  // ── ESC Headroom (peak-current based, graded — not just binary) ─────
  const peakCurrentA = estimatePeakCurrentA(w.estimatedFlightCurrentA, input.style);
  if (input.escCurrentRatingA) {
    const ratio = input.escCurrentRatingA / peakCurrentA;
    if (ratio < 1.0) {
      pushWarning({
        id: "esc-headroom-critical", severity: "critical", category: "ESC Headroom",
        title: "ESC อาจต่ำกว่าที่ต้องการ",
        description: `ESC ${input.escCurrentRatingA}A ต่ำกว่าประมาณการกระแส peak (~${peakCurrentA}A ต่อตัว) ในช่วง full-throttle/punch`,
        recommendation: "เปลี่ยน ESC ที่รับกระแสได้สูงกว่านี้ก่อนบินหนัก",
      });
    } else if (ratio < 1.15) {
      pushWarning({
        id: "esc-headroom-high", severity: "high", category: "ESC Headroom",
        title: "ESC headroom ค่อนข้างชิด",
        description: `ESC ${input.escCurrentRatingA}A ใกล้เคียงกับ peak โดยประมาณ (~${peakCurrentA}A) — เผื่อ margin น้อย`,
        recommendation: "เผื่อ ESC headroom เพิ่มถ้าบินหนักหรืออากาศร้อน",
      });
    } else if (ratio < 1.3) {
      pushWarning({
        id: "esc-headroom-medium", severity: "medium", category: "ESC Headroom",
        title: "ESC headroom พอใช้",
        description: `ESC ${input.escCurrentRatingA}A เทียบ peak โดยประมาณ ~${peakCurrentA}A`,
        recommendation: "ใช้ได้ตามปกติ แต่ยังมี margin ไม่มากนักถ้าบินสไตล์หนักขึ้น",
      });
    }
  }

  // ── Voltage Sag (C-rate based) ───────────────────────────────────────
  if (input.batteryMah) {
    const cRate = (peakCurrentA * 1000) / input.batteryMah;
    if (cRate > 35) {
      pushWarning({
        id: "voltage-sag-critical", severity: "critical", category: "Voltage Sag",
        title: "เสี่ยง voltage sag รุนแรง",
        description: `C-rate โดยประมาณ ~${round(cRate, 1)}C ที่กระแส peak — แบตอาจ sag แรงจน FC brownout หรือ cutoff กลางอากาศ`,
        recommendation: "ใช้แบตความจุสูงขึ้นหรือ C-rating สูงขึ้น ลดกระแส peak ที่ต้องการ",
      });
    } else if (cRate > 25) {
      pushWarning({
        id: "voltage-sag-high", severity: "high", category: "Voltage Sag",
        title: "C-rate สูง เสี่ยง voltage sag",
        description: `C-rate โดยประมาณ ~${round(cRate, 1)}C ที่กระแส peak`,
        recommendation: "จับตาดูแรงดันขณะบินหนัก ถ้า sag มากให้เปลี่ยนแบตความจุ/C-rating สูงขึ้น",
      });
    } else if (cRate > 15) {
      pushWarning({
        id: "voltage-sag-medium", severity: "medium", category: "Voltage Sag",
        title: "C-rate ปานกลาง",
        description: `C-rate โดยประมาณ ~${round(cRate, 1)}C ที่กระแส peak — อยู่ในเกณฑ์ปกติ`,
        recommendation: "ไม่จำเป็นต้องแก้ไข",
      });
    }
  }

  // ── Weight / Inertia ──────────────────────────────────────────────────
  if (inertia > 1.6) {
    pushWarning({
      id: "weight-critical", severity: "high", category: "Weight",
      title: "น้ำหนักรวมสูงกว่าค่าอ้างอิงมาก",
      description: `น้ำหนักรวม (รวม payload) ${pct(inertia)} เทียบค่าอ้างอิงกลุ่ม ${setupClassLabel} — กระทบ TWR, handling, และเวลาบิน`,
      recommendation: "ลดน้ำหนัก build หรือยอมรับว่า performance จะลดลงกว่าสเปกมาตรฐานของกลุ่มนี้",
    });
  } else if (inertia > 1.25) {
    pushWarning({
      id: "weight-medium", severity: "medium", category: "Weight",
      title: "น้ำหนักรวมสูงกว่าปกติ",
      description: `น้ำหนักรวม ${pct(inertia)} เทียบค่าอ้างอิงกลุ่ม ${setupClassLabel}`,
      recommendation: "ค่าที่ได้จาก Wizard ควรใช้เป็น starting point เท่านั้น อาจต้องปรับเพิ่มหลังบินจริง",
    });
  }
  if (setupClass === "micro" && w.totalWeightG > 60) {
    pushWarning({
      id: "weight-micro-heavy", severity: "medium", category: "Weight",
      title: "Micro frame หนักเกินไป",
      description: `น้ำหนักรวม ${w.totalWeightG}g สำหรับ micro/whoop จะตอบสนองช้าลงและสั่นง่ายกว่าเดิม`,
      recommendation: "ลดน้ำหนักอุปกรณ์เสริม (กล้อง/VTX/สาย) ถ้าเป็นไปได้",
    });
  }

  // ── Class-specific safety notes ──────────────────────────────────────
  if (setupClass === "heavylift") {
    pushWarning({
      id: "heavylift-thermal", severity: "high", category: "Motor Temperature Risk",
      title: "Heavy Lifter: ความร้อนสะสมคือความเสี่ยงหลัก",
      description: "มอเตอร์/ESC ของ heavy lifter ทำงานที่โหลดสูงต่อเนื่อง ความร้อนสะสมมีโอกาสเป็นจุดพังอันดับ 1",
      recommendation: "เช็คอุณหภูมิมอเตอร์/ESC ถี่ๆ ระหว่างและหลังบิน เผื่อ headroom มากกว่าคลาสอื่น",
    });
    if (!input.escCurrentRatingA) {
      pushWarning({
        id: "heavylift-no-esc-rating", severity: "medium", category: "ESC Headroom",
        title: "ไม่ได้ใส่ค่าพิกัดกระแส ESC",
        description: "สำหรับ Heavy Lifter ควรใส่ค่านี้เพื่อเช็ก thermal/headroom เพราะความเสี่ยง ESC ไหม้สูงกว่าคลาสอื่น",
        recommendation: "กรอกค่าพิกัดกระแส ESC เพื่อให้วิเคราะห์ headroom ได้แม่นยำขึ้น",
      });
    }
  }
  if (setupClass === "longrange" && propLoad > 1.15) {
    pushWarning({
      id: "longrange-propload", severity: "medium", category: "Efficiency",
      title: "โหลด prop สูงกว่าปกติสำหรับ Long Range",
      description: "จะลดเวลาบินและเพิ่มความร้อนสะสมระหว่างบินไกล",
      recommendation: "ลด pitch ใบพัดลงเล็กน้อยเพื่อแลกกับเวลาบินและความเย็นของมอเตอร์",
    });
  }

  // ── PID / Filter / Rates deviation analysis (only if current tune given) ─
  const pidMetrics: DiagnosisMetric[] = [];
  const filterMetrics: DiagnosisMetric[] = [];
  const rateMetrics: DiagnosisMetric[] = [];
  const ct = input.currentTune;

  if (ct?.pidRollPitch) {
    const rec = w.pid.roll; // roll/pitch share the same baseline+bias, diagnose against roll
    const dP = ct.pidRollPitch.p / rec.p - 1;
    const dD = ct.pidRollPitch.d / rec.d - 1;
    const dI = ct.pidRollPitch.i / rec.i - 1;

    if (dD > 0.7) {
      pushWarning({
        id: "pid-d-critical", severity: "critical", category: "PID / Oscillation Risk",
        title: "D-term สูงกว่าค่าแนะนำมาก",
        description: `D ปัจจุบัน ${ct.pidRollPitch.d} vs แนะนำ ${rec.d} (${pct(1 + dD)}) — เสี่ยงมอเตอร์ร้อน, noise, และ oscillation ความถี่สูง`,
        recommendation: `ลด D ลงมาใกล้ ${rec.d} ทีละ 3-5 หน่วย แล้วเช็ค motor temp`,
      });
    } else if (dD > 0.4) {
      pushWarning({
        id: "pid-d-high", severity: "high", category: "PID / Oscillation Risk",
        title: "D-term สูงกว่าค่าแนะนำ",
        description: `D ปัจจุบัน ${ct.pidRollPitch.d} vs แนะนำ ${rec.d} (${pct(1 + dD)})`,
        recommendation: `ลด D ลงทีละ 2-3 หน่วยจนใกล้ ${rec.d}`,
      });
    } else if (dD < -0.4) {
      pushWarning({
        id: "pid-d-low", severity: "medium", category: "PID / Propwash Risk",
        title: "D-term ต่ำกว่าค่าแนะนำ",
        description: `D ปัจจุบัน ${ct.pidRollPitch.d} vs แนะนำ ${rec.d} (${pct(1 + dD)}) — เสี่ยง propwash/oscillation ตอน throttle drop`,
        recommendation: `เพิ่ม D ทีละ 2-3 หน่วยจนใกล้ ${rec.d}`,
      });
    }

    if (dP > 0.4) {
      pushWarning({
        id: "pid-p-high", severity: "medium", category: "PID / Oscillation Risk",
        title: "P-term สูงกว่าค่าแนะนำ",
        description: `P ปัจจุบัน ${ct.pidRollPitch.p} vs แนะนำ ${rec.p} (${pct(1 + dP)}) — เสี่ยง high-frequency oscillation`,
        recommendation: `ลด P ลงทีละ 2-3 หน่วยจนใกล้ ${rec.p}`,
      });
    } else if (dP < -0.3) {
      pushWarning({
        id: "pid-p-low", severity: "low", category: "PID / Performance",
        title: "P-term ต่ำกว่าค่าแนะนำ",
        description: `P ปัจจุบัน ${ct.pidRollPitch.p} vs แนะนำ ${rec.p} (${pct(1 + dP)}) — โดรนอาจตอบสนองช้า/หลวม`,
        recommendation: `เพิ่ม P ทีละ 2-3 หน่วยจนใกล้ ${rec.p}`,
      });
    }

    if (dI < -0.35) {
      pushWarning({
        id: "pid-i-low", severity: "medium", category: "PID / Propwash Risk",
        title: "I-term ต่ำกว่าค่าแนะนำ",
        description: `I ปัจจุบัน ${ct.pidRollPitch.i} vs แนะนำ ${rec.i} (${pct(1 + dI)}) — เสี่ยง propwash ตอน throttle drop มากขึ้น`,
        recommendation: `เพิ่ม I ทีละ 2-4 หน่วยจนใกล้ ${rec.i}`,
      });
    }

    pidMetrics.push(
      { label: "P (roll/pitch)", value: `${ct.pidRollPitch.p} (แนะนำ ${rec.p})`, status: Math.abs(dP) > 0.4 ? "bad" : Math.abs(dP) > 0.2 ? "watch" : "good" },
      { label: "I (roll/pitch)", value: `${ct.pidRollPitch.i} (แนะนำ ${rec.i})`, status: dI < -0.35 ? "bad" : Math.abs(dI) > 0.2 ? "watch" : "good" },
      { label: "D (roll/pitch)", value: `${ct.pidRollPitch.d} (แนะนำ ${rec.d})`, status: dD > 0.4 ? "bad" : Math.abs(dD) > 0.2 ? "watch" : "good" },
      { label: "F (roll/pitch)", value: `${ct.pidRollPitch.f} (แนะนำ ${rec.f})`, status: "info" }
    );
  } else {
    pidMetrics.push(
      { label: "P (roll/pitch)", value: `${w.pid.roll.p}`, status: "info", note: "ค่าแนะนำจาก Wizard" },
      { label: "I (roll/pitch)", value: `${w.pid.roll.i}`, status: "info", note: "ค่าแนะนำจาก Wizard" },
      { label: "D (roll/pitch)", value: `${w.pid.roll.d}`, status: "info", note: "ค่าแนะนำจาก Wizard" },
      { label: "F (roll/pitch)", value: `${w.pid.roll.f}`, status: "info", note: "ค่าแนะนำจาก Wizard" }
    );
  }

  if (ct?.gyroLpf1Hz) {
    const dGyro = ct.gyroLpf1Hz / w.filters.gyroLpf1Hz - 1;
    if (dGyro > 0.35) {
      pushWarning({
        id: "filter-gyro-open", severity: "high", category: "Noise",
        title: "Gyro low-pass เปิดกว้างกว่าค่าแนะนำ",
        description: `Gyro LPF ปัจจุบัน ${ct.gyroLpf1Hz}Hz vs แนะนำ ${w.filters.gyroLpf1Hz}Hz — noise ผ่านเข้ามาเยอะกว่าปกติ เสี่ยงมอเตอร์ร้อนจาก noise`,
        recommendation: `ลด gyro_lowpass_hz ลงมาใกล้ ${w.filters.gyroLpf1Hz}`,
      });
    } else if (dGyro < -0.3) {
      pushWarning({
        id: "filter-gyro-tight", severity: "medium", category: "Filter",
        title: "Gyro low-pass แคบกว่าค่าแนะนำ",
        description: `Gyro LPF ปัจจุบัน ${ct.gyroLpf1Hz}Hz vs แนะนำ ${w.filters.gyroLpf1Hz}Hz — อาจเพิ่ม latency ให้ควบคุมรู้สึกหน่วง`,
        recommendation: `เพิ่ม gyro_lowpass_hz ขึ้นมาใกล้ ${w.filters.gyroLpf1Hz}`,
      });
    }
    filterMetrics.push({ label: "Gyro LPF1", value: `${ct.gyroLpf1Hz}Hz (แนะนำ ${w.filters.gyroLpf1Hz}Hz)`, status: Math.abs(dGyro) > 0.35 ? "bad" : Math.abs(dGyro) > 0.15 ? "watch" : "good" });
  } else {
    filterMetrics.push({ label: "Gyro LPF1", value: `${w.filters.gyroLpf1Hz}Hz`, status: "info", note: "ค่าแนะนำจาก Wizard" });
  }

  if (ct?.dTermLpf1Hz) {
    const dDterm = ct.dTermLpf1Hz / w.filters.dTermLpf1Hz - 1;
    filterMetrics.push({ label: "D-term LPF", value: `${ct.dTermLpf1Hz}Hz (แนะนำ ${w.filters.dTermLpf1Hz}Hz)`, status: Math.abs(dDterm) > 0.35 ? "bad" : Math.abs(dDterm) > 0.15 ? "watch" : "good" });
  } else {
    filterMetrics.push({ label: "D-term LPF", value: `${w.filters.dTermLpf1Hz}Hz`, status: "info", note: "ค่าแนะนำจาก Wizard" });
  }
  filterMetrics.push({
    label: "Dynamic Notch",
    value: ct?.dynamicNotch ?? w.filters.dynamicNotch,
    status: !ct?.dynamicNotch ? "info" : ct.dynamicNotch === w.filters.dynamicNotch ? "good" : "watch",
    note: !ct?.dynamicNotch ? "ค่าแนะนำจาก Wizard" : undefined,
  });

  if (ct?.ratesRollPitch) {
    const rec = w.rates.roll;
    rateMetrics.push(
      { label: "RC Rate", value: `${ct.ratesRollPitch.rc_rate} (แนะนำ ${rec.rc_rate})`, status: "info" },
      { label: "Rate (super)", value: `${ct.ratesRollPitch.rate} (แนะนำ ${rec.rate})`, status: "info" },
      { label: "Expo", value: `${ct.ratesRollPitch.expo} (แนะนำ ${rec.expo})`, status: "info" }
    );
  } else {
    rateMetrics.push(
      { label: "RC Rate", value: `${w.rates.roll.rc_rate}`, status: "info", note: "ค่าแนะนำจาก Wizard" },
      { label: "Rate (super)", value: `${w.rates.roll.rate}`, status: "info", note: "ค่าแนะนำจาก Wizard" },
      { label: "Expo", value: `${w.rates.roll.expo}`, status: "info", note: "ค่าแนะนำจาก Wizard" }
    );
  }

  // ── Propwash Risk (generic, class/style-level note if no current tune) ─
  if (!ct && (setupClass === "freestyle" || setupClass === "racing")) {
    pushWarning({
      id: "propwash-generic", severity: "low", category: "Propwash Risk",
      title: "Freestyle/Racing 5\" มักเจอ propwash เป็นปกติ",
      description: "กลุ่มนี้มักเจอ propwash ตอน throttle drop มากกว่ากลุ่ม long range/heavy lifter ที่ prop ใหญ่และหมุนช้ากว่า",
      recommendation: "ถ้าเจอ ให้ลอง iterm_relax = RP ก่อน แล้วค่อยปรับ I/D",
    });
  }

  // ── Mechanical Compatibility ──────────────────────────────────────────
  const mechanicalCompatibility = checkMechanicalCompatibility(input, setupClass, inertia);
  if (mechanicalCompatibility.overall === "risky" || mechanicalCompatibility.overall === "incompatible") {
    for (const c of mechanicalCompatibility.checks) {
      if (c.level === "risky" || c.level === "incompatible") {
        pushWarning({
          id: `mech-${c.label.toLowerCase().replace(/[^a-z]/g, "-")}`,
          severity: c.level === "incompatible" ? "critical" : "high",
          category: "Mechanical Compatibility",
          title: `${c.label}: ${c.levelLabel}`,
          description: c.note,
          recommendation: "ตรวจสอบสเปกอีกครั้ง หรือปรับ build ให้เข้ากลุ่มมากขึ้น",
        });
      }
    }
  }

  // ── Power System metrics ──────────────────────────────────────────────
  const powerSystem: DiagnosisMetric[] = [
    { label: "Hover Current", value: `~${w.estimatedHoverCurrentA.typical}A`, status: "info", note: `ช่วง ${w.estimatedHoverCurrentA.low}–${w.estimatedHoverCurrentA.high}A` },
    { label: "Avg Flight Current", value: `~${w.estimatedFlightCurrentA.typical}A`, status: "info", note: `ช่วง ${w.estimatedFlightCurrentA.low}–${w.estimatedFlightCurrentA.high}A` },
    { label: "Est. Peak Current", value: `~${peakCurrentA}A`, status: "info", note: "ใช้เช็ก ESC headroom" },
    { label: "Flight Time", value: w.estimatedFlightTimeMin ? `~${w.estimatedFlightTimeMin.typical} นาที` : "N/A", status: w.estimatedFlightTimeMin ? "info" : "info", note: w.estimatedFlightTimeMin ? `ช่วง ${w.estimatedFlightTimeMin.low}–${w.estimatedFlightTimeMin.high} นาที` : "ไม่ได้ใส่ความจุแบต" },
  ];
  if (input.escCurrentRatingA) {
    const ratio = input.escCurrentRatingA / peakCurrentA;
    powerSystem.push({ label: "ESC Headroom", value: `${round(ratio, 2)}×`, status: ratio < 1 ? "bad" : ratio < 1.15 ? "watch" : "good", note: `ESC ${input.escCurrentRatingA}A / peak ~${peakCurrentA}A` });
  }
  if (input.batteryMah) {
    const cRate = round((peakCurrentA * 1000) / input.batteryMah, 1);
    powerSystem.push({ label: "C-Rate (peak)", value: `~${cRate}C`, status: cRate > 25 ? "bad" : cRate > 15 ? "watch" : "good" });
  }
  if (input.thrustPerMotorG) {
    const totalThrust = input.thrustPerMotorG * motorCount;
    const twr = totalThrust / w.totalWeightG;
    const rating = twrRating(twr);
    powerSystem.push({
      label: "Power-to-Weight (TWR)",
      value: `${round(twr, 2)}:1`,
      status: rating.color === "green" ? "good" : rating.color === "amber" ? "watch" : "bad",
      note: rating.label,
    });
  } else {
    powerSystem.push({ label: "Power-to-Weight (TWR)", value: "N/A", status: "info", note: "กรอกแรงขับ/มอเตอร์ (g) เพื่อดู TWR จริง" });
  }
  if (input.escName) powerSystem.push({ label: "ESC", value: input.escName, status: "info" });
  if (input.fcName) powerSystem.push({ label: "Flight Controller", value: input.fcName, status: "info" });

  // ── Flight Characteristics metrics ────────────────────────────────────
  const flightCharacteristics: DiagnosisMetric[] = [
    { label: "Setup Class", value: setupClassLabel, status: "info" },
    { label: "Flying Style", value: input.style, status: "info" },
    { label: "Motor Load", value: `${propLoad.toFixed(2)}×`, status: propLoad > 1.28 ? "bad" : propLoad > 1.15 ? "watch" : "good", note: "เทียบค่าอ้างอิงของกลุ่ม" },
    { label: "Inertia (Weight Load)", value: `${inertia.toFixed(2)}×`, status: inertia > 1.25 ? "bad" : inertia > 1.1 ? "watch" : "good", note: "เทียบค่าอ้างอิงของกลุ่ม" },
    {
      label: "Throttle Resolution",
      value: w.filters.rpmFilter ? "DSHOT + RPM Filter" : "Standard",
      status: "good",
      note: w.filters.rpmFilter ? "รองรับ bidirectional DSHOT — ความละเอียด throttle ดี" : undefined,
    },
  ];

  // ── Scores ─────────────────────────────────────────────────────────
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const wrn of warnings) counts[wrn.severity]++;

  const safety = Math.round(clamp(100 - counts.critical * 25 - counts.high * 12 - counts.medium * 6 - counts.low * 2, 0, 100));
  const efficiency = Math.round(
    clamp(100 - deviationPenalty(propLoad, 0.85, 1.15, 40) - deviationPenalty(inertia, 0.8, 1.2, 25) - (w.escWarning ? 10 : 0), 0, 100)
  );
  const performance = Math.round(clamp(w.confidence * 0.8 + mechanicalCompatibility.score * 0.2, 0, 100));
  const reliability = Math.round(
    clamp(100 - counts.critical * 20 - counts.high * 10 - counts.medium * 4 - counts.low * 1 - w.estimatedFields.length * 2, 0, 100)
  );
  const health = Math.round(clamp(safety * 0.3 + efficiency * 0.2 + performance * 0.25 + reliability * 0.25, 0, 100));

  const scores: DiagnosisScores = { health, safety, efficiency, performance, reliability };

  // ── Recommendations (priority 1/2/3 from warnings, then Wizard tips) ──
  const severityRank: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedWarnings = [...warnings].sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
  const recommendations: DiagnosisRecommendation[] = [];
  const seenCategories = new Set<string>();
  for (const wrn of sortedWarnings) {
    if (recommendations.length >= 3) break;
    if (seenCategories.has(wrn.category)) continue;
    seenCategories.add(wrn.category);
    recommendations.push({
      priority: (recommendations.length + 1) as 1 | 2 | 3,
      title: wrn.title,
      reason: wrn.description,
      action: wrn.recommendation,
    });
  }
  for (const tip of w.tips) {
    if (recommendations.length >= 3) break;
    recommendations.push({ priority: (recommendations.length + 1) as 1 | 2 | 3, title: "แนวทางปรับจูนเพิ่มเติม", reason: tip, action: tip });
  }

  // ── CLI Suggestions ────────────────────────────────────────────────
  let cliSuggestions: string[];
  if (ct?.pidRollPitch || ct?.gyroLpf1Hz || ct?.dTermLpf1Hz) {
    cliSuggestions = [
      `# ConfigDoctor — ค่าที่แนะนำให้ปรับ (เทียบกับค่าปัจจุบันที่กรอกมา)`,
      `# กลุ่ม: ${setupClassLabel} · Health Score: ${health}/100`,
      `#`,
    ];
    if (ct.pidRollPitch) {
      cliSuggestions.push(
        `set p_roll = ${w.pid.roll.p}`, `set i_roll = ${w.pid.roll.i}`, `set d_roll = ${w.pid.roll.d}`, `set f_roll = ${w.pid.roll.f}`,
        `set p_pitch = ${w.pid.pitch.p}`, `set i_pitch = ${w.pid.pitch.i}`, `set d_pitch = ${w.pid.pitch.d}`, `set f_pitch = ${w.pid.pitch.f}`
      );
    }
    if (ct.gyroLpf1Hz) cliSuggestions.push(`set gyro_lowpass_hz = ${w.filters.gyroLpf1Hz}`);
    if (ct.dTermLpf1Hz) cliSuggestions.push(`set dterm_lowpass_hz = ${w.filters.dTermLpf1Hz}`);
    cliSuggestions.push(`save`);
  } else {
    cliSuggestions = w.cliCommands;
  }

  return {
    setupClass,
    setupClassLabel,
    summary: w.summary,
    scores,
    warnings: sortedWarnings,
    recommendations,
    powerSystem,
    flightCharacteristics,
    mechanicalCompatibility,
    pidAnalysis: {
      metrics: pidMetrics,
      recommended: w.pid,
      current: ct?.pidRollPitch && ct?.pidYaw ? { rollPitch: ct.pidRollPitch, yaw: ct.pidYaw } : undefined,
    },
    filterAnalysis: {
      metrics: filterMetrics,
      recommended: w.filters,
      current: ct ? { gyroLpf1Hz: ct.gyroLpf1Hz, dTermLpf1Hz: ct.dTermLpf1Hz, dynamicNotch: ct.dynamicNotch } : undefined,
    },
    ratesAnalysis: {
      metrics: rateMetrics,
      recommended: w.rates,
      current: ct ? { rollPitch: ct.ratesRollPitch, yaw: ct.ratesYaw } : undefined,
    },
    cliSuggestions,
    wizardConfidence: w.confidence,
    estimatedFields: w.estimatedFields,
  };
}
