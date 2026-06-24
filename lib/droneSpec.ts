// lib/droneSpec.ts — Drone Build Spec & Compatibility Engine
// Shared source of truth used by the 3D Visualizer

export type FlightStyle = "race" | "freestyle" | "cinematic";
export type FrameSize = "2inch" | "3inch" | "5inch" | "7inch";
export type CompatibilityLevel = "perfect" | "compatible" | "tight" | "risky" | "incompatible";

export interface DroneSpec {
  frameSize: FrameSize;      // canonical size string
  frameMm: number;           // diagonal in mm
  propIn: number;            // prop diameter in inches (e.g. 5.1)
  propBlades: 2 | 3 | 4;
  motorKV: number;
  batteryS: 2 | 3 | 4 | 5 | 6;
  batteryMah?: number;
  weightG: number;           // AUW grams
  style: FlightStyle;
  escCurrentA?: number;
}

export interface CompatibilityCheck {
  label: string;
  level: CompatibilityLevel;
  note: string;
}

export interface DroneCompatibility {
  overall: CompatibilityLevel;
  score: number;             // 0–100
  checks: CompatibilityCheck[];
  visualTags: string[];      // short display tags for the visualizer
}

// ── Canonical frame → prop clearance mapping ───────────────
// Maximum safe prop diameter per frame size (community consensus clearance rules)
const MAX_PROP_BY_FRAME: Record<FrameSize, number> = {
  "2inch": 2.1,
  "3inch": 3.1,
  "5inch": 5.2,
  "7inch": 7.5,
};
const MIN_PROP_BY_FRAME: Record<FrameSize, number> = {
  "2inch": 1.8,
  "3inch": 2.4,
  "5inch": 4.0,
  "7inch": 5.5,
};

// ── Ideal KV per S-count ────────────────────────────────────
// Higher S → lower KV needed for same tip-speed. Roughly KV ≈ 2250 / S (4S reference 2250KV)
function idealKvRange(s: number): [number, number] {
  const center = Math.round(2250 / (s / 4));
  return [Math.round(center * 0.7), Math.round(center * 1.35)];
}

// ── Individual checks ───────────────────────────────────────
function checkPropClearance(spec: DroneSpec): CompatibilityCheck {
  const max = MAX_PROP_BY_FRAME[spec.frameSize];
  const min = MIN_PROP_BY_FRAME[spec.frameSize];
  const p = spec.propIn;

  if (p > max + 0.2) {
    return { label: "Prop/Frame", level: "incompatible", note: `${p}" prop เกินขอบเฟรม ${spec.frameSize} — ใบพัดชนเฟรม` };
  }
  if (p > max) {
    return { label: "Prop/Frame", level: "risky", note: `${p}" บนเฟรม ${spec.frameSize} ชิดมาก ต้องการ standoff สูงหรือ prop guard` };
  }
  if (p > max - 0.3) {
    return { label: "Prop/Frame", level: "tight", note: `${p}" พอดีกับ ${spec.frameSize} แต่ clearance แคบ ระวังการบิด` };
  }
  if (p < min) {
    return { label: "Prop/Frame", level: "tight", note: `${p}" เล็กกว่าที่แนะนำสำหรับ ${spec.frameSize} — thrust อาจไม่เหมาะ` };
  }
  return { label: "Prop/Frame", level: "perfect", note: `${p}" เหมาะกับ ${spec.frameSize} — clearance ดี` };
}

function checkKvVoltage(spec: DroneSpec): CompatibilityCheck {
  const [lo, hi] = idealKvRange(spec.batteryS);
  const kv = spec.motorKV;
  if (kv < lo * 0.75) {
    return { label: "KV/S-Count", level: "risky", note: `${kv}KV ต่ำมากสำหรับ ${spec.batteryS}S — สูญเสีย efficiency และ rpm` };
  }
  if (kv > hi * 1.3) {
    return { label: "KV/S-Count", level: "risky", note: `${kv}KV สูงมากสำหรับ ${spec.batteryS}S — มอเตอร์ร้อน ใบพัดหนักเกินไป` };
  }
  if (kv < lo || kv > hi) {
    return { label: "KV/S-Count", level: "compatible", note: `${kv}KV บน ${spec.batteryS}S ใช้ได้แต่ไม่ optimal (range แนะนำ ${lo}–${hi}KV)` };
  }
  return { label: "KV/S-Count", level: "perfect", note: `${kv}KV เหมาะกับ ${spec.batteryS}S (range ${lo}–${hi}KV)` };
}

function checkWeightClass(spec: DroneSpec): CompatibilityCheck {
  // Expected AUW per frame size
  const expectedWeight: Record<FrameSize, [number, number]> = {
    "2inch": [60, 150],
    "3inch": [100, 220],
    "5inch": [200, 650],
    "7inch": [450, 1100],
  };
  const [lo, hi] = expectedWeight[spec.frameSize];
  if (spec.weightG > hi * 1.25) {
    return { label: "Weight", level: "risky", note: `${spec.weightG}g หนักมากสำหรับ ${spec.frameSize} — TWR ต่ำ, handling หนัก` };
  }
  if (spec.weightG > hi) {
    return { label: "Weight", level: "tight", note: `${spec.weightG}g สูงกว่าปกติสำหรับ ${spec.frameSize} — ยอมรับได้แต่ไม่ ideal` };
  }
  if (spec.weightG < lo * 0.8) {
    return { label: "Weight", level: "compatible", note: `${spec.weightG}g เบามาก อาจไวเกินจนควบคุมยากถ้า KV สูง` };
  }
  return { label: "Weight", level: "perfect", note: `${spec.weightG}g เหมาะกับ ${spec.frameSize}` };
}

function checkStyleMatch(spec: DroneSpec): CompatibilityCheck {
  const raceFrame = spec.frameSize === "3inch" || spec.frameSize === "5inch";
  const longRangeFrame = spec.frameSize === "7inch";

  if (spec.style === "race") {
    if (spec.frameSize === "7inch") {
      return { label: "Style", level: "tight", note: "Race style บนเฟรม 7\" — หนักและ drag สูง ไม่ ideal สำหรับแข่ง" };
    }
    if (spec.motorKV < 1500) {
      return { label: "Style", level: "compatible", note: "Race style แต่ KV ต่ำ — อาจไม่ได้ punch ที่ต้องการ" };
    }
  }
  if (spec.style === "cinematic" && spec.frameSize === "2inch") {
    return { label: "Style", level: "tight", note: "Cinematic บน 2\" — สั่นมากขึ้น ต้องการ tune ดีมาก" };
  }
  if (spec.style === "freestyle" && longRangeFrame) {
    return { label: "Style", level: "compatible", note: "Freestyle 7\" ได้แต่ response หน่วงกว่า 5\" มาก" };
  }

  return { label: "Style", level: "perfect", note: `${spec.style} เหมาะกับ ${spec.frameSize}` };
}

function levelScore(l: CompatibilityLevel): number {
  return { perfect: 100, compatible: 80, tight: 55, risky: 25, incompatible: 0 }[l];
}

function overallLevel(score: number): CompatibilityLevel {
  if (score >= 90) return "perfect";
  if (score >= 70) return "compatible";
  if (score >= 45) return "tight";
  if (score >= 20) return "risky";
  return "incompatible";
}

export function computeCompatibility(spec: DroneSpec): DroneCompatibility {
  const checks: CompatibilityCheck[] = [
    checkPropClearance(spec),
    checkKvVoltage(spec),
    checkWeightClass(spec),
    checkStyleMatch(spec),
  ];

  const score = Math.round(checks.reduce((s, c) => s + levelScore(c.level), 0) / checks.length);
  const overall = overallLevel(score);

  const visualTags: string[] = [];
  if (overall === "perfect") visualTags.push("✓ Build สมบูรณ์");
  if (checks.some(c => c.level === "risky" || c.level === "incompatible")) {
    visualTags.push("⚠ ตรวจสอบ compatibility");
  }
  visualTags.push(`${spec.batteryS}S · ${spec.propIn}" · ${spec.motorKV}KV`);

  return { overall, score, checks, visualTags };
}

// ── Preset visual templates ─────────────────────────────────
export interface VisualPreset {
  id: string;
  name: string;
  style: FlightStyle;
  spec: DroneSpec;
  description: string;
  accentColor: string;
}

export const VISUAL_PRESETS: VisualPreset[] = [
  {
    id: "race-5in",
    name: "Race 5\"",
    style: "race",
    accentColor: "#ff4060",
    description: "ตั้งค่าสำหรับการแข่งขัน เน้น TWR สูงและ response ไว",
    spec: {
      frameSize: "5inch", frameMm: 220, propIn: 5.0, propBlades: 3,
      motorKV: 2400, batteryS: 4, batteryMah: 1300, weightG: 380, style: "race", escCurrentA: 45,
    },
  },
  {
    id: "freestyle-5in",
    name: "Freestyle 5\"",
    style: "freestyle",
    accentColor: "#b060ff",
    description: "เฟรมกลาง เน้นความสนุก flip/roll และ trick ทุกประเภท",
    spec: {
      frameSize: "5inch", frameMm: 230, propIn: 5.1, propBlades: 3,
      motorKV: 2306, batteryS: 4, batteryMah: 1500, weightG: 450, style: "freestyle", escCurrentA: 45,
    },
  },
  {
    id: "cinewhoop-3in",
    name: "Cinewhoop 3\"",
    style: "cinematic",
    accentColor: "#00aaff",
    description: "เฟรมป้องกัน prop สำหรับถ่ายวิดีโอในพื้นที่แคบและใกล้คน",
    spec: {
      frameSize: "3inch", frameMm: 145, propIn: 3.0, propBlades: 3,
      motorKV: 1600, batteryS: 3, batteryMah: 1000, weightG: 180, style: "cinematic", escCurrentA: 25,
    },
  },
  {
    id: "longrange-7in",
    name: "Long-Range 7\"",
    style: "cinematic",
    accentColor: "#00e87a",
    description: "เฟรมใหญ่สำหรับบินระยะไกล เน้น efficiency และเวลาบินนาน",
    spec: {
      frameSize: "7inch", frameMm: 295, propIn: 7.0, propBlades: 2,
      motorKV: 1700, batteryS: 4, batteryMah: 3000, weightG: 680, style: "cinematic", escCurrentA: 35,
    },
  },
];

// ── Frame size → mm decoder ────────────────────────────────
export function frameSizeToMm(fs: FrameSize): number {
  return { "2inch": 100, "3inch": 145, "5inch": 230, "7inch": 295 }[fs];
}

export function frameMmToSize(mm: number): FrameSize {
  if (mm <= 115) return "2inch";
  if (mm <= 170) return "3inch";
  if (mm <= 260) return "5inch";
  return "7inch";
}

// ── Compatibility color helpers ────────────────────────────
export function compatColor(level: CompatibilityLevel): string {
  return {
    perfect: "#00e87a",
    compatible: "#00aaff",
    tight: "#ffbb00",
    risky: "#ff8a3d",
    incompatible: "#ff4060",
  }[level];
}

export function compatLabel(level: CompatibilityLevel): string {
  return {
    perfect: "Perfect",
    compatible: "Compatible",
    tight: "Tight Fit",
    risky: "Risky",
    incompatible: "Incompatible",
  }[level];
}
