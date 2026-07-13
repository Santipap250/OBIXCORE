// lib/wizard.ts — PID, filter, and rate tuning engine
//
// This file owns the *tuning* logic (PID/filter/rate baselines + how they
// scale with prop load, inertia, and flying style). All current-draw /
// flight-time / efficiency physics now live in lib/estimation.ts and are
// imported here so the Wizard and the Calculator always agree on numbers.
//
// Class model (per OBIXCORE spec): the Wizard detects one of 6 drone
// classes primarily from PROP SIZE (the most reliable signal for how a
// build actually flies), with flying style splitting the 5" bracket into
// "freestyle" vs "racing":
//   micro      Tiny Whoop / Micro     1.2"–2"    1S–2S
//   cinewhoop  Cinewhoop / Toothpick  2.5"–3.5"  3S–4S (up to 6S)
//   freestyle  Freestyle 5"           4S–6S
//   racing     Racing 5"              4S–6S
//   longrange  Long Range             7"–9"      6S
//   heavylift  Heavy Lifter           10"+       6S–12S
import type { WizardInput, WizardResult } from "@/types";
import { clamp, round, confidenceLabel as toConfidenceLabel, SETUP_CLASS_LABEL_TH } from "./utils";
import {
  estimateHoverCurrentA,
  estimateAverageFlightCurrentA,
  estimateFlightTimeMinutes,
  escHeadroomWarning,
} from "./estimation";

type SetupClass = WizardResult["setupClass"];

// ── Classification ──────────────────────────────────────────────────
// Prop diameter is the primary signal (it's what the spec's classes are
// actually defined by). Frame size is used only as a secondary sanity
// check — a mismatch there is a warning, not a re-classification, since a
// wrongly-typed frame number shouldn't silently change which PID table
// gets used.
function classifyDrone(propDiameterIn: number, style: WizardInput["style"]): SetupClass {
  if (propDiameterIn <= 2.1) return "micro";
  if (propDiameterIn <= 3.7) return "cinewhoop";
  if (propDiameterIn <= 6.2) return style === "race" ? "racing" : "freestyle";
  if (propDiameterIn <= 9.6) return "longrange";
  return "heavylift";
}

// Nominal reference prop/weight per class. These are the "typical build"
// anchors that propLoad/inertia are measured against — not hard rules,
// just the center of the bell curve for that class.
export const NOMINAL_PROP_IN: Record<SetupClass, number> = {
  micro: 1.6,
  cinewhoop: 3.0,
  freestyle: 5.1,
  racing: 5.1,
  longrange: 7.5,
  heavylift: 12.0,
};

export const NOMINAL_WEIGHT_G: Record<SetupClass, number> = {
  micro: 35,
  cinewhoop: 200,
  freestyle: 420,
  racing: 360,
  longrange: 650,
  heavylift: 3000,
};

// Reasonable estimate fallbacks used when optional fields are missing —
// tracked in `estimatedFields` so the UI/CLI can label them clearly.
function estimateMotorCount(setupClass: SetupClass, provided: number | undefined): { value: number; estimated: boolean } {
  if (provided && provided > 0) return { value: provided, estimated: false };
  return { value: setupClass === "heavylift" ? 6 : 4, estimated: true };
}

function estimatePropBlades(provided: number | undefined): { value: number; estimated: boolean } {
  if (provided && provided > 0) return { value: provided, estimated: false };
  return { value: 3, estimated: true };
}

// Single source of truth lives in lib/utils.ts (shared with Preset Library
// and ConfigCoctor/Diagnosis Engine) — kept as a local alias so the rest of
// this file doesn't need to change.
const CLASS_LABEL_TH = SETUP_CLASS_LABEL_TH as Record<SetupClass, string>;

interface AxisPid { p: number; i: number; d: number; f: number }
interface YawPid { p: number; i: number; d: number }
interface AxisRate { rc_rate: number; rate: number; expo: number }
interface ClassBaseline {
  roll: AxisPid;
  pitch: AxisPid;
  yaw: YawPid;
  filters: { gyroLpf1Hz: number; gyroLpf2Hz: number; dTermLpf1Hz: number };
  rates: { roll: AxisRate; pitch: AxisRate; yaw: AxisRate };
}

// PID/filter/rate baselines, one full table per class. Values are
// starting points calibrated against commonly reported community tunes
// for each class — the Wizard nudges them from here based on propLoad,
// inertia, and style, it never treats these as final numbers.
const BASE_BY_CLASS: Record<SetupClass, ClassBaseline> = {
  micro: {
    // Tiny/light airframe, 1S–2S: low mass = low inertia, but very high
    // prop RPM means noise sits at high frequency, so filters can stay
    // relatively open. Keep gains soft — micro frames overshoot easily.
    roll: { p: 40, i: 55, d: 20, f: 75 },
    pitch: { p: 41, i: 55, d: 20, f: 75 },
    yaw: { p: 28, i: 80, d: 0 },
    filters: { gyroLpf1Hz: 250, gyroLpf2Hz: 250, dTermLpf1Hz: 130 },
    rates: {
      roll: { rc_rate: 0.85, rate: 0.60, expo: 0.10 },
      pitch: { rc_rate: 0.85, rate: 0.60, expo: 0.10 },
      yaw: { rc_rate: 0.80, rate: 0.45, expo: 0.10 },
    },
  },
  cinewhoop: {
    // Ducted props disturb their own airflow more than open props, which
    // both loads the motor more and injects extra broadband noise — a
    // touch more filtering than the equivalent open-prop class.
    roll: { p: 45, i: 53, d: 26, f: 92 },
    pitch: { p: 46, i: 53, d: 26, f: 92 },
    yaw: { p: 33, i: 88, d: 0 },
    filters: { gyroLpf1Hz: 240, gyroLpf2Hz: 240, dTermLpf1Hz: 110 },
    rates: {
      roll: { rc_rate: 0.95, rate: 0.65, expo: 0.10 },
      pitch: { rc_rate: 0.95, rate: 0.65, expo: 0.10 },
      yaw: { rc_rate: 0.92, rate: 0.48, expo: 0.10 },
    },
  },
  freestyle: {
    roll: { p: 47, i: 52, d: 30, f: 102 },
    pitch: { p: 48, i: 52, d: 30, f: 102 },
    yaw: { p: 35, i: 90, d: 0 },
    filters: { gyroLpf1Hz: 250, gyroLpf2Hz: 250, dTermLpf1Hz: 100 },
    rates: {
      roll: { rc_rate: 1.00, rate: 0.70, expo: 0.12 },
      pitch: { rc_rate: 1.00, rate: 0.70, expo: 0.12 },
      yaw: { rc_rate: 1.00, rate: 0.50, expo: 0.12 },
    },
  },
  racing: {
    // Punchier P/D and F, tighter filters (less group delay), and much
    // less expo — race sticks want a direct, linear response, not a
    // smoothed one.
    roll: { p: 52, i: 50, d: 33, f: 115 },
    pitch: { p: 53, i: 50, d: 33, f: 115 },
    yaw: { p: 38, i: 88, d: 0 },
    filters: { gyroLpf1Hz: 250, gyroLpf2Hz: 250, dTermLpf1Hz: 95 },
    rates: {
      roll: { rc_rate: 1.05, rate: 0.78, expo: 0.05 },
      pitch: { rc_rate: 1.05, rate: 0.78, expo: 0.05 },
      yaw: { rc_rate: 1.02, rate: 0.55, expo: 0.05 },
    },
  },
  longrange: {
    // Big, slow-spinning props → low-frequency noise, so cutoffs drop.
    // Rates/gains lean soft: efficiency, throttle smoothness, and low
    // vibration matter more than raw agility out here.
    roll: { p: 38, i: 47, d: 21, f: 88 },
    pitch: { p: 39, i: 47, d: 21, f: 88 },
    yaw: { p: 28, i: 82, d: 0 },
    filters: { gyroLpf1Hz: 200, gyroLpf2Hz: 200, dTermLpf1Hz: 80 },
    rates: {
      roll: { rc_rate: 0.85, rate: 0.55, expo: 0.15 },
      pitch: { rc_rate: 0.85, rate: 0.55, expo: 0.15 },
      yaw: { rc_rate: 0.90, rate: 0.45, expo: 0.12 },
    },
  },
  heavylift: {
    // Huge inertia + slow, heavy props: aggressive P/D would ring/overshoot
    // and cook motors. Everything here is deliberately gentle — this class
    // prioritizes not falling out of the sky over agility.
    roll: { p: 28, i: 42, d: 16, f: 65 },
    pitch: { p: 29, i: 42, d: 16, f: 65 },
    yaw: { p: 22, i: 75, d: 0 },
    filters: { gyroLpf1Hz: 130, gyroLpf2Hz: 130, dTermLpf1Hz: 55 },
    rates: {
      roll: { rc_rate: 0.65, rate: 0.40, expo: 0.20 },
      pitch: { rc_rate: 0.65, rate: 0.40, expo: 0.20 },
      yaw: { rc_rate: 0.70, rate: 0.35, expo: 0.18 },
    },
  },
};

const CONFIDENCE_BASE_BY_CLASS: Record<SetupClass, number> = {
  freestyle: 88,
  racing: 86,
  cinewhoop: 80,
  longrange: 78,
  micro: 70,
  // Widest spread of real-world builds (payload, motor count, frame design
  // all vary a lot), so we're less confident a generic baseline fits.
  heavylift: 60,
};

// Frame-vs-prop expected range per class, mm. Exported so ConfigDoctor's
// Mechanical Compatibility check uses the exact same reference ranges as
// the Wizard's own frame/prop consistency warning above — one table, not
// two that could quietly drift apart.
export const EXPECTED_FRAME_RANGE_MM: Record<SetupClass, [number, number]> = {
  micro: [55, 130],
  cinewhoop: [110, 190],
  freestyle: [200, 260],
  racing: [200, 260],
  longrange: [260, 400],
  heavylift: [380, 900],
};

const SUMMARY_BY_CLASS: Record<SetupClass, string> = {
  micro: "เหมาะกับ Tiny Whoop / Micro 1S–2S เน้นความนุ่ม นิ่ง และปลอดภัยต่อมอเตอร์เล็ก",
  cinewhoop: "เหมาะกับ Cinewhoop/Toothpick ที่มีใบพัดในกรง บาลานซ์ระหว่างความนิ่ง ความลื่น และความประหยัดไฟ",
  freestyle: "เหมาะกับ 5\" freestyle ทั่วไป ค่าตั้งต้นที่ดีสำหรับท่า flip/roll และบินอิสระ",
  racing: "เหมาะกับ 5\" racing เน้น response ไว ตอบสนองตรงไปตรงมา ไม่หน่วง",
  longrange: "เหมาะกับ 7\"–9\" long range เน้น efficiency, ความนิ่ง และ throttle smoothness",
  heavylift: "เหมาะกับ 10\"+ heavy lifter ที่แบก payload — ค่าจูนเน้นความปลอดภัยของมอเตอร์/ESC มากกว่าความไว",
};

export function calculateTuning(input: WizardInput): WizardResult {
  const { frameSize, motorKV, batteryS, propSize, weight, style } = input;
  const propDiameter = propSize / 10;

  const estimatedFields: string[] = [];
  const { value: propBlades, estimated: bladesEstimated } = estimatePropBlades(input.propBlades);
  if (bladesEstimated) estimatedFields.push("จำนวนใบพัด (ใช้ค่าประมาณ 3-blade)");

  const setupClass = classifyDrone(propDiameter, style);

  const { value: motorCount, estimated: motorCountEstimated } = estimateMotorCount(setupClass, input.motorCount);
  if (motorCountEstimated) {
    estimatedFields.push(`จำนวนมอเตอร์ (ใช้ค่าประมาณ ${motorCount} ตัวสำหรับกลุ่ม ${CLASS_LABEL_TH[setupClass]})`);
  }

  const payloadG = input.payloadG && input.payloadG > 0 ? input.payloadG : 0;
  const totalWeight = weight + payloadG;

  const nominalProp = NOMINAL_PROP_IN[setupClass];
  const nominalWeight = NOMINAL_WEIGHT_G[setupClass];

  // More blades on the same diameter load the motor more (more swept area
  // pushing against already-disturbed air) — nudge propLoad accordingly
  // instead of silently ignoring blade count like the previous version did.
  const bladeLoadFactor = Math.pow(propBlades / 3, 0.5);

  const propLoad = clamp(
    Math.pow(propDiameter / nominalProp, 2.05) *
      Math.pow(motorKV / 2306, 0.28) *
      Math.pow(batteryS / 4, 0.32) *
      bladeLoadFactor,
    0.6,
    1.6
  );

  // Payload adds mass without adding prop area, so it loads inertia (and
  // therefore how sluggish/overshoot-prone the airframe feels) directly.
  const inertia = clamp(totalWeight / nominalWeight, 0.5, 2.4);

  const base = BASE_BY_CLASS[setupClass];

  const styleGain = {
    race: { p: 1.08, i: 0.98, d: 1.06 },
    freestyle: { p: 1.00, i: 1.00, d: 1.00 },
    cinematic: { p: 0.82, i: 1.05, d: 0.82 },
  }[style];

  const loadBias = clamp(1 + (inertia - 1) * 0.10 + (propLoad - 1) * 0.12, 0.8, 1.3);
  const gripBias = clamp(1 + (inertia - 1) * 0.14 - (propLoad - 1) * 0.05, 0.82, 1.25);
  const dampingBias = clamp(1 - (propLoad - 1) * 0.20 - Math.max(0, inertia - 1) * 0.08, 0.6, 1.1);

  const pid = {
    roll: {
      p: round(base.roll.p * styleGain.p * loadBias),
      i: round(base.roll.i * styleGain.i * gripBias),
      d: round(base.roll.d * styleGain.d * dampingBias),
      f: round(base.roll.f * (style === "race" ? 1.10 : style === "cinematic" ? 0.92 : 1.0)),
    },
    pitch: {
      p: round(base.pitch.p * styleGain.p * loadBias),
      i: round(base.pitch.i * styleGain.i * gripBias),
      d: round(base.pitch.d * styleGain.d * dampingBias),
      f: round(base.pitch.f * (style === "race" ? 1.10 : style === "cinematic" ? 0.92 : 1.0)),
    },
    yaw: {
      p: round(base.yaw.p * (style === "race" ? 1.06 : style === "cinematic" ? 0.92 : 1.0)),
      i: round(base.yaw.i * (style === "cinematic" ? 1.04 : 1.0)),
      d: base.yaw.d,
    },
  };

  const filteredLoad = clamp(propLoad + Math.max(0, inertia - 1) * 0.2, 0.6, 2.0);
  const filterBias = style === "race" ? 1.0 : style === "cinematic" ? 0.88 : 0.96;

  // Filter floor/ceiling scale with class: heavy-lift/long-range props are
  // physically incapable of the high-frequency noise a micro prop makes,
  // so their cutoff band sits much lower.
  const lpfCeiling = base.filters.gyroLpf1Hz;
  const lpfFloor = clamp(lpfCeiling * 0.55, 60, 220);
  const dtermCeiling = clamp(base.filters.dTermLpf1Hz * 1.25, 40, 160);
  const dtermFloor = clamp(base.filters.dTermLpf1Hz * 0.55, 30, 120);

  const filters = {
    gyroLpf1Hz: round(clamp(base.filters.gyroLpf1Hz * (1 - (filteredLoad - 1) * 0.10), lpfFloor, lpfCeiling)),
    gyroLpf2Hz: round(clamp(base.filters.gyroLpf2Hz * (1 - (filteredLoad - 1) * 0.08), lpfFloor, lpfCeiling)),
    dTermLpf1Hz: round(clamp(base.filters.dTermLpf1Hz * dampingBias * filterBias, dtermFloor, dtermCeiling)),
    rpmFilter: true,
    dynamicNotch:
      style === "race"
        ? "LOW"
        : style === "cinematic"
        ? "MEDIUM"
        : setupClass === "longrange" || setupClass === "heavylift"
        ? "HIGH"
        : "MEDIUM",
    dTermLpfType: style === "cinematic" || setupClass === "longrange" || setupClass === "heavylift" ? "PT1" : "BIQUAD",
  };

  const rates = {
    roll: {
      rc_rate: clamp(base.rates.roll.rc_rate * (style === "race" ? 1.02 : style === "cinematic" ? 0.92 : 1.0), 0.4, 1.3),
      rate: clamp(base.rates.roll.rate * (style === "race" ? 1.04 : style === "cinematic" ? 0.88 : 1.0), 0.25, 0.90),
      expo: clamp(base.rates.roll.expo * (style === "race" ? 0.5 : style === "cinematic" ? 1.6 : 1.0), 0, 0.4),
    },
    pitch: {
      rc_rate: clamp(base.rates.pitch.rc_rate * (style === "race" ? 1.02 : style === "cinematic" ? 0.92 : 1.0), 0.4, 1.3),
      rate: clamp(base.rates.pitch.rate * (style === "race" ? 1.04 : style === "cinematic" ? 0.88 : 1.0), 0.25, 0.90),
      expo: clamp(base.rates.pitch.expo * (style === "race" ? 0.5 : style === "cinematic" ? 1.6 : 1.0), 0, 0.4),
    },
    yaw: {
      rc_rate: clamp(base.rates.yaw.rc_rate * (style === "race" ? 1.02 : 1.0), 0.5, 1.15),
      rate: clamp(base.rates.yaw.rate * (style === "race" ? 1.04 : style === "cinematic" ? 0.92 : 1.0), 0.25, 0.70),
      expo: clamp(base.rates.yaw.expo * (style === "race" ? 0.5 : style === "cinematic" ? 1.4 : 1.0), 0, 0.35),
    },
  };

  // ── Shared physics: current draw / flight time / ESC headroom ─────────
  const estimatedHoverCurrentA = estimateHoverCurrentA({
    weightG: totalWeight,
    motorCount,
    propDiameterIn: propDiameter,
    bladeCount: propBlades,
    motorKV,
    batteryS,
  });
  const estimatedFlightCurrentA = estimateAverageFlightCurrentA(estimatedHoverCurrentA, style);
  if (!input.batteryMah) estimatedFields.push("ความจุแบต (ไม่ได้ใส่ — ไม่แสดงเวลาบินโดยประมาณ)");
  const estimatedFlightTimeMin = input.batteryMah
    ? estimateFlightTimeMinutes(input.batteryMah, estimatedFlightCurrentA)
    : null;
  const escWarning = escHeadroomWarning(input.escCurrentRatingA, estimatedFlightCurrentA, style);
  if (!input.escCurrentRatingA) estimatedFields.push("ค่าพิกัดกระแส ESC (ไม่ได้ใส่ — ข้ามการเช็ก headroom)");

  // ── Warnings & tips ─────────────────────────────────────────────────
  const warnings: string[] = [];
  const tips: string[] = [];

  // Frame-vs-prop consistency check (classification is prop-driven, but a
  // wildly mismatched frame number is worth flagging rather than ignoring).
  const [frLo, frHi] = EXPECTED_FRAME_RANGE_MM[setupClass];
  if (frameSize < frLo * 0.85 || frameSize > frHi * 1.15) {
    warnings.push(
      `Frame ${frameSize}mm ดูไม่สอดคล้องกับ prop ${propDiameter.toFixed(1)}" (กลุ่ม ${CLASS_LABEL_TH[setupClass]} ปกติเฟรมประมาณ ${frLo}–${frHi}mm) — ตรวจสอบว่าใส่ค่าถูกกลุ่มหรือไม่`
    );
  }

  if (setupClass === "micro" && batteryS > 2) {
    warnings.push("Micro/Tiny Whoop ปกติใช้ 1S–2S — แบตที่สูงกว่านี้อาจแรงเกินเฟรมขนาดเล็ก");
  }
  if (setupClass !== "micro" && setupClass !== "heavylift" && motorKV > 2600 && batteryS >= 5) {
    warnings.push("KV สูง + 5S/6S อาจทำให้มอเตอร์ร้อนเร็ว ตรวจอุณหภูมิหลังบินรอบแรก");
  }
  if (propLoad > 1.28) {
    warnings.push("ชุด prop / KV / cell / จำนวนใบพัดนี้มีโหลดสูงกว่าค่าอ้างอิงของกลุ่มนี้ ควรลด pitch หรือเช็กอุณหภูมิมอเตอร์");
  }
  if (totalWeight > nominalWeight * 1.25) {
    warnings.push(`น้ำหนักรวม (รวม payload) สูงกว่ากลุ่ม ${CLASS_LABEL_TH[setupClass]} ปกติ ค่าที่ได้ควรใช้เป็น starting point เท่านั้น`);
  }
  if (setupClass === "micro" && totalWeight > 60) {
    warnings.push("Micro frame ที่หนักเกินไปจะตอบสนองช้าลงและสั่นง่ายกว่าเดิม");
  }
  if (style === "race" && totalWeight > 500) {
    warnings.push("Race style บนโดรนที่หนักมากจะเสียความคล่องตัวและทำให้ค่า D สูงเกินจำเป็นได้");
  }
  if (setupClass === "heavylift") {
    warnings.push("Heavy Lifter: ความร้อนสะสมที่มอเตอร์/ESC คือความเสี่ยงหลัก — เช็คอุณหภูมิถี่ๆ และเผื่อ ESC/มอเตอร์ headroom มากกว่าปกติ");
    if (payloadG > 0) {
      warnings.push(`Payload ${payloadG}g เพิ่มโหลดให้มอเตอร์ทุกตัวโดยตรง — ทดสอบ hover กับ payload จริงก่อนบินภารกิจเต็มรูปแบบ`);
    }
    if (!input.escCurrentRatingA) {
      warnings.push("ไม่ได้ใส่ค่าพิกัดกระแส ESC — สำหรับ Heavy Lifter ควรใส่เพื่อเช็ก thermal/headroom เพราะความเสี่ยง ESC ไหม้สูงกว่าคลาสอื่น");
    }
  }
  if (setupClass === "longrange" && propLoad > 1.15) {
    warnings.push("โหลด prop สูงกว่าปกติสำหรับ long range จะลดเวลาบินและเพิ่มความร้อนสะสมระหว่างบินไกล");
  }
  if (escWarning) {
    warnings.push(escWarning);
  }

  tips.push("เริ่มบินด้วยค่าที่ได้ แล้วไล่เช็ก motor temp, propwash และ oscillation ทีละจุด");
  tips.push("ถ้าโดรนสั่นหลัง throttle drop ให้ลอง iterm_relax = RP และลด D ทีละ 2-5");
  tips.push("ถ้าโดรนลอยช้าแต่มั่นคง ให้ปรับ P ขึ้นเล็กน้อยก่อนแตะ D");
  if (setupClass === "freestyle") {
    tips.push("Freestyle ที่ต้องการ stick feel หนักขึ้น มักเพิ่ม F หรือ RC rate ทีละน้อยจะชัดกว่า");
  }
  if (setupClass === "racing") {
    tips.push("Racing เน้นความตรงไปตรงมาของสติ๊ก — ถ้ารู้สึกลื่นเกินไป ให้ลด expo ก่อนไปแตะ rate");
  }
  if (style === "cinematic") {
    tips.push("Cinematic เน้นนิ่งและเนียนกว่าเดิม ลด D มากเกินไปอาจทำให้แกว่งตอนหยุดมุม");
  }
  if (setupClass === "cinewhoop") {
    tips.push("Cinewhoop: กรงป้องกันใบพัดรบกวนการไหลของอากาศ ถ้าเจอ oscillation แปลกๆ ลองปรับ dynamic notch เป็น MEDIUM/HIGH ก่อน");
  }
  if (setupClass === "micro") {
    tips.push("Micro/Whoop: ถ้าบินในร่มพื้นที่แคบ ลด rc_rate/rate ลงอีกเพื่อความคุมง่าย โดยเฉพาะมือใหม่");
  }
  if (setupClass === "longrange") {
    tips.push("Long Range: บินคุมความเร็ว cruise คงที่จะประหยัดแบตกว่าการเร่ง/ผ่อน throttle บ่อยๆ อย่างมีนัยสำคัญ");
  }
  if (setupClass === "heavylift") {
    tips.push("Heavy Lifter: ชั่งน้ำหนัก payload จริงก่อนบินเสมอ และเผื่อ margin ของ TWR อย่างน้อย 2:1 เพื่อความปลอดภัย");
  }
  if (input.batteryMah) {
    tips.push("เวลาบินจริงอาจต่างจากค่าประมาณ ±15–20% ตามสภาพแบต อุณหภูมิ และความหนักมือ throttle");
  }
  if (estimatedFields.length > 0) {
    tips.push("บางค่าที่ใช้เป็นค่าประมาณเพราะไม่ได้กรอกมา — ดูรายละเอียดใน Setup Summary เพื่อความแม่นยำที่สูงขึ้น");
  }

  // ── Confidence score (rule-based, with explainable factors) ───────────
  let confidence = CONFIDENCE_BASE_BY_CLASS[setupClass];
  if (Math.abs(propLoad - 1) < 0.12) confidence += 5;
  if (Math.abs(inertia - 1) < 0.15) confidence += 4;
  if (setupClass === "freestyle" || setupClass === "racing") confidence += 3;
  if (style === "cinematic" && setupClass !== "longrange" && setupClass !== "heavylift") confidence += 2;
  if (propLoad > 1.28) confidence -= 12;
  if (totalWeight > nominalWeight * 1.25) confidence -= 8;
  if (motorKV > 3000 && setupClass !== "micro") confidence -= 6;
  if (escWarning) confidence -= 5;
  confidence -= estimatedFields.length * 2; // more unknowns → less confident
  confidence = Math.round(clamp(confidence, 35, 96));

  // ── Reasoning: short, concrete "why these numbers" bullets ────────────
  const reasoning: string[] = [
    `Prop ${propDiameter.toFixed(1)}" (${propBlades}-blade${bladesEstimated ? ", ประมาณ" : ""}) + สไตล์ "${style}" → จัดกลุ่มเป็น "${CLASS_LABEL_TH[setupClass]}" ใช้ค่าพื้นฐาน PID/Filter/Rates ของกลุ่มนี้เป็นจุดตั้งต้น`,
    `Prop load ${propLoad.toFixed(2)}× ค่าอ้างอิง (${motorKV}KV, ${batteryS}S, ${motorCount}${motorCountEstimated ? " (ประมาณ)" : ""} มอเตอร์) → ดัน P/D ตามโหลด ${loadBias.toFixed(2)}× และปรับความหน่วง D ${dampingBias.toFixed(2)}×`,
    payloadG > 0
      ? `น้ำหนักลำ ${weight}g + payload ${payloadG}g = รวม ${totalWeight}g เทียบค่ามาตรฐานกลุ่ม ${nominalWeight}g → inertia ${inertia.toFixed(2)}× → ปรับ I/grip ${gripBias.toFixed(2)}×`
      : `น้ำหนัก ${weight}g เทียบค่ามาตรฐานกลุ่ม ${nominalWeight}g → inertia ${inertia.toFixed(2)}× → ปรับ I/grip ${gripBias.toFixed(2)}×`,
    `สไตล์ "${style}" → ปรับ P/D gain (${styleGain.p.toFixed(2)}/${styleGain.d.toFixed(2)}×) และ rate/expo ให้เข้ากับการบินแบบนี้`,
  ];
  if (estimatedFields.length > 0) {
    reasoning.push(`ใช้ค่าประมาณสำหรับ: ${estimatedFields.join(", ")}`);
  }

  const summary = SUMMARY_BY_CLASS[setupClass];

  const cliCommands = [
    `# OBIXCORE Tuning Wizard — ${style.toUpperCase()} ${CLASS_LABEL_TH[setupClass]} (${frameSize}mm)`,
    `# Generated ${new Date().toLocaleDateString("th-TH")}`,
    `# Setup class: ${setupClass} · Confidence: ${confidence}% (${toConfidenceLabel(confidence)})`,
    `# Est. hover current: ~${estimatedHoverCurrentA.typical}A · Est. avg flight current: ~${estimatedFlightCurrentA.typical}A`,
    `#`,
    `# ── PID ─────────────────────────────────────`,
    `set p_roll = ${pid.roll.p}`,
    `set i_roll = ${pid.roll.i}`,
    `set d_roll = ${pid.roll.d}`,
    `set f_roll = ${pid.roll.f}`,
    `set p_pitch = ${pid.pitch.p}`,
    `set i_pitch = ${pid.pitch.i}`,
    `set d_pitch = ${pid.pitch.d}`,
    `set f_pitch = ${pid.pitch.f}`,
    `set p_yaw = ${pid.yaw.p}`,
    `set i_yaw = ${pid.yaw.i}`,
    `set d_yaw = ${pid.yaw.d}`,
    `#`,
    `# ── Filters ─────────────────────────────────`,
    `set gyro_lowpass_hz = ${filters.gyroLpf1Hz}`,
    `set gyro_lowpass2_hz = ${filters.gyroLpf2Hz}`,
    `set dterm_lowpass_hz = ${filters.dTermLpf1Hz}`,
    `set dterm_lowpass_type = ${filters.dTermLpfType}`,
    `set dyn_notch_mode = ${filters.dynamicNotch}`,
    `set rpm_filter_harmonics = 3`,
    `#`,
    `# ── Rates ────────────────────────────────────`,
    `set roll_rc_rate = ${Math.round(rates.roll.rc_rate * 100)}`,
    `set roll_expo = ${Math.round(rates.roll.expo * 100)}`,
    `set roll_srate = ${Math.round(rates.roll.rate * 100)}`,
    `set pitch_rc_rate = ${Math.round(rates.pitch.rc_rate * 100)}`,
    `set pitch_expo = ${Math.round(rates.pitch.expo * 100)}`,
    `set pitch_srate = ${Math.round(rates.pitch.rate * 100)}`,
    `set yaw_rc_rate = ${Math.round(rates.yaw.rc_rate * 100)}`,
    `set yaw_expo = ${Math.round(rates.yaw.expo * 100)}`,
    `set yaw_srate = ${Math.round(rates.yaw.rate * 100)}`,
    `save`,
  ];

  return {
    pid,
    filters,
    rates,
    cliCommands,
    warnings,
    tips,
    reasoning,
    confidence,
    confidenceLabel: toConfidenceLabel(confidence),
    setupClass,
    summary,
    estimatedHoverCurrentA,
    estimatedFlightCurrentA,
    estimatedFlightTimeMin,
    escWarning,
    totalWeightG: totalWeight,
    estimatedFields,
    // Exposed (additive) so ConfigDoctor/Diagnosis Engine can reuse the
    // exact same load/inertia numbers the Wizard tuned against, instead of
    // recomputing a parallel formula.
    propLoad,
    inertia,
  };
}
