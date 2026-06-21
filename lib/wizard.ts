// lib/wizard.ts — PID, filter, and estimation helpers
import type { WizardInput, WizardResult } from "@/types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number): number {
  return Math.round(value);
}

function classifyFrame(frameSize: number): WizardResult["setupClass"] {
  if (frameSize <= 110) return "micro";
  if (frameSize <= 160) return "small";
  if (frameSize <= 240) return "mid";
  if (frameSize <= 285) return "standard";
  return "long-range";
}

function nominalPropByClass(setupClass: WizardResult["setupClass"]): number {
  switch (setupClass) {
    case "micro":
      return 2.5;
    case "small":
      return 3.5;
    case "mid":
      return 5.0;
    case "standard":
      return 5.1;
    default:
      return 7.0;
  }
}

function nominalWeightByClass(setupClass: WizardResult["setupClass"]): number {
  switch (setupClass) {
    case "micro":
      return 95;
    case "small":
      return 180;
    case "mid":
      return 330;
    case "standard":
      return 450;
    default:
      return 680;
  }
}

export function calculateTuning(input: WizardInput): WizardResult {
  const { frameSize, motorKV, batteryS, propSize, weight, style } = input;
  const setupClass = classifyFrame(frameSize);
  const propDiameter = propSize / 10;

  const nominalProp = nominalPropByClass(setupClass);
  const nominalWeight = nominalWeightByClass(setupClass);

  const propLoad = clamp(
    Math.pow(propDiameter / nominalProp, 2.05) *
      Math.pow(motorKV / 2306, 0.28) *
      Math.pow(batteryS / 4, 0.32),
    0.75,
    1.42
  );

  const inertia = clamp(weight / nominalWeight, 0.7, 1.55);

  const baseByClass = {
    micro: {
      roll: { p: 41, i: 54, d: 22, f: 78 },
      pitch: { p: 42, i: 54, d: 22, f: 78 },
      yaw: { p: 30, i: 84, d: 0 },
      filters: { gyroLpf1Hz: 250, gyroLpf2Hz: 250, dTermLpf1Hz: 120 },
      rates: {
        roll: { rc_rate: 0.92, rate: 0.66, expo: 0.08 },
        pitch: { rc_rate: 0.92, rate: 0.66, expo: 0.08 },
        yaw: { rc_rate: 0.90, rate: 0.48, expo: 0.08 },
      },
    },
    small: {
      roll: { p: 44, i: 53, d: 25, f: 90 },
      pitch: { p: 45, i: 53, d: 25, f: 90 },
      yaw: { p: 33, i: 88, d: 0 },
      filters: { gyroLpf1Hz: 250, gyroLpf2Hz: 250, dTermLpf1Hz: 112 },
      rates: {
        roll: { rc_rate: 0.96, rate: 0.68, expo: 0.08 },
        pitch: { rc_rate: 0.96, rate: 0.68, expo: 0.08 },
        yaw: { rc_rate: 0.94, rate: 0.50, expo: 0.08 },
      },
    },
    mid: {
      roll: { p: 47, i: 52, d: 30, f: 102 },
      pitch: { p: 48, i: 52, d: 30, f: 102 },
      yaw: { p: 35, i: 90, d: 0 },
      filters: { gyroLpf1Hz: 250, gyroLpf2Hz: 250, dTermLpf1Hz: 100 },
      rates: {
        roll: { rc_rate: 1.00, rate: 0.70, expo: 0.10 },
        pitch: { rc_rate: 1.00, rate: 0.70, expo: 0.10 },
        yaw: { rc_rate: 1.00, rate: 0.50, expo: 0.10 },
      },
    },
    standard: {
      roll: { p: 48, i: 51, d: 31, f: 106 },
      pitch: { p: 49, i: 51, d: 31, f: 106 },
      yaw: { p: 36, i: 90, d: 0 },
      filters: { gyroLpf1Hz: 200, gyroLpf2Hz: 200, dTermLpf1Hz: 92 },
      rates: {
        roll: { rc_rate: 1.00, rate: 0.71, expo: 0.10 },
        pitch: { rc_rate: 1.00, rate: 0.71, expo: 0.10 },
        yaw: { rc_rate: 1.00, rate: 0.50, expo: 0.10 },
      },
    },
    "long-range": {
      roll: { p: 40, i: 48, d: 22, f: 92 },
      pitch: { p: 41, i: 48, d: 22, f: 92 },
      yaw: { p: 29, i: 82, d: 0 },
      filters: { gyroLpf1Hz: 200, gyroLpf2Hz: 200, dTermLpf1Hz: 82 },
      rates: {
        roll: { rc_rate: 0.90, rate: 0.58, expo: 0.12 },
        pitch: { rc_rate: 0.90, rate: 0.58, expo: 0.12 },
        yaw: { rc_rate: 0.95, rate: 0.46, expo: 0.10 },
      },
    },
  } as const;

  const base = baseByClass[setupClass];

  const styleGain = {
    race: { p: 1.08, i: 0.98, d: 1.06 },
    freestyle: { p: 1.00, i: 1.00, d: 1.00 },
    cinematic: { p: 0.82, i: 1.05, d: 0.82 },
  }[style];

  const loadBias = clamp(1 + (inertia - 1) * 0.10 + (propLoad - 1) * 0.12, 0.85, 1.22);
  const gripBias = clamp(1 + (inertia - 1) * 0.14 - (propLoad - 1) * 0.05, 0.88, 1.18);
  const dampingBias = clamp(1 - (propLoad - 1) * 0.20 - Math.max(0, inertia - 1) * 0.08, 0.72, 1.08);

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

  const filteredLoad = clamp(propLoad + Math.max(0, inertia - 1) * 0.2, 0.75, 1.8);
  const filterBias = style === "race" ? 1.0 : style === "cinematic" ? 0.88 : 0.96;

  const filters = {
    gyroLpf1Hz: round(clamp(base.filters.gyroLpf1Hz * (1 - (filteredLoad - 1) * 0.10), 180, 250)),
    gyroLpf2Hz: round(clamp(base.filters.gyroLpf2Hz * (1 - (filteredLoad - 1) * 0.08), 180, 250)),
    dTermLpf1Hz: round(clamp(base.filters.dTermLpf1Hz * dampingBias * filterBias, 70, 130)),
    rpmFilter: true,
    dynamicNotch: style === "race" ? "LOW" : style === "cinematic" ? "MEDIUM" : setupClass === "long-range" ? "HIGH" : "MEDIUM",
    dTermLpfType: style === "cinematic" ? "PT1" : setupClass === "long-range" ? "PT1" : "BIQUAD",
  };

  const rates = {
    roll: {
      rc_rate: clamp(base.rates.roll.rc_rate * (style === "race" ? 1.02 : style === "cinematic" ? 0.92 : 1.0), 0.6, 1.2),
      rate: clamp(base.rates.roll.rate * (style === "race" ? 1.04 : style === "cinematic" ? 0.88 : 1.0), 0.35, 0.82),
      expo: clamp(base.rates.roll.expo * (style === "race" ? 0.5 : style === "cinematic" ? 1.6 : 1.0), 0, 0.35),
    },
    pitch: {
      rc_rate: clamp(base.rates.pitch.rc_rate * (style === "race" ? 1.02 : style === "cinematic" ? 0.92 : 1.0), 0.6, 1.2),
      rate: clamp(base.rates.pitch.rate * (style === "race" ? 1.04 : style === "cinematic" ? 0.88 : 1.0), 0.35, 0.82),
      expo: clamp(base.rates.pitch.expo * (style === "race" ? 0.5 : style === "cinematic" ? 1.6 : 1.0), 0, 0.35),
    },
    yaw: {
      rc_rate: clamp(base.rates.yaw.rc_rate * (style === "race" ? 1.02 : 1.0), 0.75, 1.1),
      rate: clamp(base.rates.yaw.rate * (style === "race" ? 1.04 : style === "cinematic" ? 0.92 : 1.0), 0.35, 0.65),
      expo: clamp(base.rates.yaw.expo * (style === "race" ? 0.5 : style === "cinematic" ? 1.4 : 1.0), 0, 0.3),
    },
  };

  const cliCommands = [
    `# OBIXCORE Tuning Wizard — ${style.toUpperCase()} ${frameSize}mm`,
    `# Generated ${new Date().toLocaleDateString("th-TH")}`,
    `# Setup class: ${setupClass}`,
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

  const warnings: string[] = [];
  const tips: string[] = [];

  if (motorKV > 2600 && batteryS >= 5) {
    warnings.push("KV สูง + 5S/6S อาจทำให้มอเตอร์ร้อนเร็ว ตรวจอุณหภูมิหลังบินรอบแรก");
  }
  if (propLoad > 1.22) {
    warnings.push("ชุด prop / KV / cell ใหม่นี้มีโหลดสูงกว่าค่าอ้างอิง ควรลด pitch หรือเช็กอุณหภูมิมอเตอร์");
  }
  if (weight > nominalWeight * 1.2) {
    warnings.push(`น้ำหนักรวมสูงกว่ากลุ่ม ${setupClass} ปกติ ค่าที่ได้ควรใช้เป็น starting point เท่านั้น`);
  }
  if (setupClass === "micro" && weight > 180) {
    warnings.push("Micro frame ที่หนักเกินไปจะตอบสนองช้าลงและสั่นง่ายกว่าเดิม");
  }
  if (style === "race" && weight > 400) {
    warnings.push("Race style บนโดรนที่หนักมากจะเสียความคล่องตัวและทำให้ค่า D สูงเกินจำเป็นได้");
  }

  tips.push("เริ่มบินด้วยค่าที่ได้ แล้วไล่เช็ก motor temp, propwash และ oscillation ทีละจุด");
  tips.push("ถ้าโดรนสั่นหลัง throttle drop ให้ลอง iterm_relax = RP และลด D ทีละ 2-5");
  tips.push("ถ้าโดรนลอยช้าแต่มั่นคง ให้ปรับ P ขึ้นเล็กน้อยก่อนแตะ D");
  if (style === "freestyle") {
    tips.push("Freestyle ที่ต้องการ stick feel หนักขึ้น มักเพิ่ม F หรือ RC rate ทีละน้อยจะชัดกว่า");
  }
  if (style === "cinematic") {
    tips.push("Cinematic เน้นนิ่งและเนียนกว่าเดิม ลด D มากเกินไปอาจทำให้แกว่งตอนหยุดมุม");
  }

  const confidenceBase =
    setupClass === "mid"
      ? 88
      : setupClass === "standard"
      ? 84
      : setupClass === "small"
      ? 79
      : setupClass === "micro"
      ? 72
      : 76;

  let confidence = confidenceBase;
  if (Math.abs(propLoad - 1) < 0.12) confidence += 5;
  if (Math.abs(inertia - 1) < 0.15) confidence += 4;
  if (style === "freestyle" && (setupClass === "mid" || setupClass === "standard")) confidence += 3;
  if (style === "cinematic" && setupClass !== "long-range") confidence += 2;
  if (propLoad > 1.22) confidence -= 12;
  if (weight > nominalWeight * 1.2) confidence -= 8;
  if (motorKV > 3000 || motorKV < 1100) confidence -= 6;
  confidence = Math.round(clamp(confidence, 45, 96));

  const summary = {
    micro: "เหมาะกับเฟรมเล็ก น้ำหนักเบา เน้นตอบสนองไวและลดความร้อน",
    small: "เหมาะกับ 3 นิ้วหรือเฟรมเล็กที่ต้องการบาลานซ์ระหว่างแรงและความนิ่ง",
    mid: "ใกล้กับ 5 นิ้วมาตรฐาน ค่าที่ได้ตั้งต้นได้ดีสำหรับ freestyle ทั่วไป",
    standard: "เหมาะกับ 5–6 นิ้วโหลดกลาง ค่าจะเอนทางนิ่งและคุมแรงสั่น",
    "long-range": "เหมาะกับ 7 นิ้วหรือ long-range ที่ต้องการความนิ่งและความประหยัดพลังงาน",
  }[setupClass];

  return { pid, filters, rates, cliCommands, warnings, tips, confidence, setupClass, summary };
}

export function calculateFlightTime(
  batteryMah: number,
  batteryS: number,
  estimatedCurrentA: number
): number {
  const usableCapacityAh = (batteryMah / 1000) * 0.78;
  const current = Math.max(estimatedCurrentA, 0.1);
  const voltageBonus = clamp(1 - Math.max(0, batteryS - 4) * 0.02, 0.88, 1.0);
  return (usableCapacityAh / current) * 60 * voltageBonus;
}

export function estimateCurrentDraw(
  motorKV: number,
  batteryS: number,
  motorCount: number,
  propSize: number
): number {
  const propDiameter = propSize / 10;
  const diameterNorm = clamp(propDiameter / 5.1, 0.45, 1.65);
  const kvNorm = clamp(motorKV / 2306, 0.55, 1.75);
  const voltageNorm = clamp((batteryS * 3.7) / 14.8, 0.55, 1.7);

  const motorStress = Math.pow(diameterNorm, 2.1) * Math.pow(kvNorm, 0.42) * Math.pow(voltageNorm, 0.92);
  const perMotor = 4.4 * motorStress * (0.92 + Math.min(0.18, (diameterNorm - 1) * 0.08));

  return clamp(perMotor * motorCount, 3.5, 180);
}
