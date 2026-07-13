// scripts/generate-presets.ts
//
// Generates data/presets.json FROM the Wizard's own calculateTuning()
// function — the same one lib/wizard.ts uses — so Preset Library numbers
// are guaranteed to agree with what the Wizard would recommend for an
// equivalent build. No parallel/hand-typed PID formula exists anywhere in
// this file; it only supplies representative WizardInput specs per class
// and packages whatever calculateTuning() returns.
//
// Run with: npx tsx scripts/generate-presets.ts

import { calculateTuning } from "../lib/wizard";
import type { WizardInput, WizardResult } from "../types";

type SetupClass = WizardResult["setupClass"];

interface PresetSeed {
  id: string;
  name: string;
  description: string;
  useCase: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  frameSizeLabel: string;
  tags: string[];
  notes: string;
  bfVersion: string;
  /** Baseline reliability/testing confidence for this preset entry itself
   * (distinct from the Wizard's per-calculation confidence score) — how
   * well-established this exact spec/style combo is in the community. */
  presetConfidence: number;
  input: WizardInput;
}

// ── Representative builds, 2–3 per class, spanning the spec's 5 named
// groups (Tiny Whoop/Micro, Cinewhoop/Toothpick, Freestyle/Racing 5",
// Long Range 7"-9", Heavy Lifter 10"+) via the Wizard's 6 setupClasses. ──
const SEEDS: PresetSeed[] = [
  // ── Micro / Tiny Whoop ──────────────────────────────────────────
  {
    id: "preset-micro-1s-whoop-001",
    name: "Whoop Cruiser 1S",
    description: "ค่านุ่มสำหรับ Tiny Whoop 1S บินในบ้าน/ในร่ม เน้นควบคุมง่ายและไม่ชนง่าย",
    useCase: "บินในบ้าน ในร่ม พื้นที่แคบ มือใหม่หัดบิน whoop",
    difficulty: "beginner",
    frameSizeLabel: "65mm (1S Whoop)",
    tags: ["tinywhoop", "1s", "indoor", "beginner", "soft"],
    notes: "ถ้าเฟรมมีการ์ดใบพัดหนา อาจต้องเพิ่ม dynamic notch เป็น HIGH ถ้าเจอ oscillation ตอน throttle punch",
    bfVersion: "4.4",
    presetConfidence: 82,
    input: {
      frameSize: 65, motorKV: 19000, batteryS: 1, propSize: 12, weight: 27,
      style: "cinematic", propBlades: 3, motorCount: 4,
    },
  },
  {
    id: "preset-micro-2s-whoop-001",
    name: "Whoop Punch 2S",
    description: "ค่าเน้น punch สำหรับ Tiny Whoop 2S บินนอกบ้านลานเล็กๆ ได้ ตอบสนองไวขึ้นกว่ารุ่น 1S",
    useCase: "สวนหลังบ้าน ลานเล็ก มือที่ผ่าน 1S มาแล้วอยากได้ punch เพิ่ม",
    difficulty: "intermediate",
    frameSizeLabel: "75mm (2S Whoop)",
    tags: ["tinywhoop", "2s", "outdoor-small", "punchy"],
    notes: "2S แรงกว่า 1S มาก — ระวังชนของแตกง่ายกว่าเดิม ค่อยๆ เพิ่ม throttle จนคุ้นมือ",
    bfVersion: "4.4",
    presetConfidence: 80,
    input: {
      frameSize: 75, motorKV: 20000, batteryS: 2, propSize: 16, weight: 34,
      style: "freestyle", propBlades: 3, motorCount: 4,
    },
  },

  // ── Cinewhoop / Toothpick ───────────────────────────────────────
  {
    id: "preset-cinewhoop-3in-4s-001",
    name: "CineDuct 3\" 4S Smooth",
    description: "ค่านิ่งมากสำหรับ cinewhoop 3\" 4S เน้นภาพนิ่งสำหรับถ่ายวิดีโอใกล้คน/ในที่แคบ",
    useCase: "ถ่ายวิดีโอในร่ม ใกล้คน โชว์ event ต้องการภาพนิ่งไม่สั่น",
    difficulty: "intermediate",
    frameSizeLabel: "145mm (3\" Cinewhoop)",
    tags: ["cinewhoop", "3inch", "4s", "smooth", "video"],
    notes: "กรงป้องกันใบพัดรบกวนการไหลของอากาศ ถ้าเจอ oscillation แปลกๆ ลองปรับ dynamic notch เป็น MEDIUM/HIGH ก่อน",
    bfVersion: "4.4",
    presetConfidence: 85,
    input: {
      frameSize: 145, motorKV: 1700, batteryS: 4, propSize: 30, weight: 190,
      style: "cinematic", propBlades: 3, motorCount: 4,
    },
  },
  {
    id: "preset-cinewhoop-toothpick-3s-001",
    name: "Toothpick Ripper 2.7\" 3S",
    description: "ค่า freestyle เบาสำหรับ toothpick 2.7\" 3S ว่องไว เหมาะบินในสวนหรือพื้นที่แคบ",
    useCase: "freestyle เบาๆ ในพื้นที่แคบ สวน หรือ backyard",
    difficulty: "intermediate",
    frameSizeLabel: "120mm (2.7\" Toothpick)",
    tags: ["toothpick", "2.7inch", "3s", "freestyle", "light", "indoor"],
    notes: "เฟรมเบา ไวต่อลม — ถ้าบินนอกบ้านลมแรงให้ลด rate ลงเล็กน้อย",
    bfVersion: "4.4",
    presetConfidence: 78,
    input: {
      frameSize: 120, motorKV: 2000, batteryS: 3, propSize: 27, weight: 150,
      style: "freestyle", propBlades: 3, motorCount: 4,
    },
  },

  // ── Freestyle 5" ─────────────────────────────────────────────────
  {
    id: "preset-freestyle-5in-4s-safe-001",
    name: "SafeStart 5\" 4S",
    description: "ค่าเริ่มต้นสำหรับมือใหม่ โดรนตอบสนองช้า ให้เวลาปรับตัว ลดโอกาสพัง",
    useCase: "มือใหม่หัดบิน 5\" คนแรกที่เพิ่งจบ simulator",
    difficulty: "beginner",
    frameSizeLabel: "5inch",
    tags: ["5inch", "4s", "freestyle", "beginner", "safe", "forgiving"],
    notes: "เมื่อเก่งขึ้นค่อยๆ เพิ่ม P และ F term ทีละ 5 จนรู้สึกว่าโดรนตอบสนองพอดี — ลองสลับไปใช้ Smooth Gremlin เมื่อคุมโดรนได้มั่นใจแล้ว",
    bfVersion: "4.4",
    presetConfidence: 88,
    input: {
      frameSize: 220, motorKV: 2000, batteryS: 4, propSize: 51, weight: 400,
      style: "cinematic", propBlades: 3, motorCount: 4,
    },
  },
  {
    id: "preset-freestyle-5in-4s-001",
    name: "Smooth Gremlin 5\" 4S",
    description: "ค่า freestyle สำหรับ 5\" 4S เน้น smooth feel และ propwash ต่ำ เหมาะสำหรับคนชอบบิน flow",
    useCase: "freestyle ทั่วไป ท่า flip/roll บินเล่นทั่วไป",
    difficulty: "intermediate",
    frameSizeLabel: "5inch",
    tags: ["5inch", "4s", "freestyle", "smooth", "propwash"],
    notes: "ถ้า propwash ยังอยู่ให้เพิ่ม iterm_relax = RP และลอง set iterm_relax_cutoff = 15",
    bfVersion: "4.4",
    presetConfidence: 90,
    input: {
      frameSize: 220, motorKV: 2306, batteryS: 4, propSize: 51, weight: 420,
      style: "freestyle", propBlades: 3, motorCount: 4,
    },
  },
  {
    id: "preset-freestyle-5in-6s-001",
    name: "Freestyle 5\" 6S Punch",
    description: "ค่า freestyle สำหรับ 5\" 6S แรงบิดสูงขึ้น เหมาะกับคนที่ต้องการ punch แรงกว่า 4S",
    useCase: "freestyle ระดับกลาง-สูง ต้องการ punch/vertical ที่แรงกว่า 4S เดิม",
    difficulty: "advanced",
    frameSizeLabel: "5inch (6S)",
    tags: ["5inch", "6s", "freestyle", "punch"],
    notes: "6S ร้อนไวกว่า 4S — เช็คอุณหภูมิมอเตอร์หลังบินรอบแรกเสมอ",
    bfVersion: "4.4",
    presetConfidence: 84,
    input: {
      frameSize: 225, motorKV: 1700, batteryS: 6, propSize: 51, weight: 480,
      style: "freestyle", propBlades: 3, motorCount: 4,
    },
  },

  // ── Racing 5" ────────────────────────────────────────────────────
  {
    id: "preset-racing-5in-4s-001",
    name: "RaceSharp 5\" 4S Sprint",
    description: "ค่า race เบาสำหรับ 5\" 4S เน้น response ไวและน้ำหนักเบา เหมาะ sprint/gate racing ระยะสั้น",
    useCase: "gate racing sprint, sim-to-real transition, นักบินที่เริ่มแข่ง",
    difficulty: "advanced",
    frameSizeLabel: "5inch (4S Race)",
    tags: ["5inch", "4s", "race", "responsive", "light"],
    notes: "ปรับ D term ได้ถ้ามอเตอร์ร้อน — ลด d_roll และ d_pitch ทีละ 2",
    bfVersion: "4.4",
    presetConfidence: 83,
    input: {
      frameSize: 210, motorKV: 2750, batteryS: 4, propSize: 51, weight: 320,
      style: "race", propBlades: 3, motorCount: 4,
    },
  },
  {
    id: "preset-racing-5in-6s-001",
    name: "RaceSharp 5\" 6S",
    description: "ค่า race สำหรับ 5\" 6S เน้น responsive และ precise เหมาะสำหรับ gate racing",
    useCase: "gate racing ระดับแข่งขันจริง ต้องการความไวสูงสุด",
    difficulty: "advanced",
    frameSizeLabel: "5inch (6S Race)",
    tags: ["5inch", "6s", "race", "responsive", "precise"],
    notes: "ปรับ D term ได้ถ้ามอเตอร์ร้อน — ลด d_roll และ d_pitch ทีละ 2",
    bfVersion: "4.4",
    presetConfidence: 90,
    input: {
      frameSize: 220, motorKV: 1900, batteryS: 6, propSize: 51, weight: 360,
      style: "race", propBlades: 3, motorCount: 4,
    },
  },

  // ── Long Range 7"–9" ─────────────────────────────────────────────
  {
    id: "preset-longrange-7in-6s-001",
    name: "LongHaul 7\" 6S Cruiser",
    description: "ค่า long range สำหรับ 7\" 6S เน้น efficiency, ความนิ่ง และ throttle smoothness",
    useCase: "บินระยะไกล สำรวจ ถ่าย FPV cruise เก็บวิว",
    difficulty: "intermediate",
    frameSizeLabel: "7inch",
    tags: ["longrange", "7inch", "6s", "efficiency", "cruise"],
    notes: "บินคุมความเร็ว cruise คงที่จะประหยัดแบตกว่าการเร่ง/ผ่อน throttle บ่อยๆ อย่างมีนัยสำคัญ",
    bfVersion: "4.4",
    presetConfidence: 86,
    input: {
      frameSize: 295, motorKV: 1700, batteryS: 6, propSize: 70, weight: 650,
      style: "cinematic", propBlades: 2, motorCount: 4, batteryMah: 3000,
    },
  },
  {
    id: "preset-longrange-9in-6s-001",
    name: "LongHaul 9\" 6S Endurance",
    description: "ค่า long range สำหรับ 9\" 6S เน้นเวลาบินสูงสุด ใช้กับเฟรมใหญ่ที่ต้องการระยะทางไกลสุด",
    useCase: "mission บินไกลสุดๆ, mapping, long-range FPV touring",
    difficulty: "advanced",
    frameSizeLabel: "9inch",
    tags: ["longrange", "9inch", "6s", "endurance", "mapping"],
    notes: "โหลด prop สูงกว่าปกติสำหรับ long range จะลดเวลาบินและเพิ่มความร้อนสะสมระหว่างบินไกล — ตรวจ prop pitch ให้เหมาะกับ cruise speed ที่ต้องการ",
    bfVersion: "4.4",
    presetConfidence: 80,
    input: {
      frameSize: 350, motorKV: 1300, batteryS: 6, propSize: 90, weight: 850,
      style: "cinematic", propBlades: 2, motorCount: 4, batteryMah: 6000,
    },
  },

  // ── Heavy Lifter 10"+ ─────────────────────────────────────────────
  {
    id: "preset-heavylift-10in-cargo-001",
    name: "HeavyLift 10\" Cargo",
    description: "ค่า heavy lifter สำหรับเฟรม 10\" ที่แบก payload เน้นความปลอดภัยของมอเตอร์/ESC มากกว่าความไว",
    useCase: "งานส่งของเบา, ยก sensor/gimbal, งาน agriculture ขนาดเล็ก",
    difficulty: "advanced",
    frameSizeLabel: "10inch (Hexacopter)",
    tags: ["heavylift", "10inch", "cargo", "payload", "hex"],
    notes: "Heavy Lifter: ชั่งน้ำหนัก payload จริงก่อนบินเสมอ และเผื่อ margin ของ TWR อย่างน้อย 2:1 เพื่อความปลอดภัย",
    bfVersion: "4.4",
    presetConfidence: 75,
    input: {
      frameSize: 450, motorKV: 380, batteryS: 6, propSize: 100, weight: 2600,
      style: "cinematic", propBlades: 2, motorCount: 6, payloadG: 800, escCurrentRatingA: 40,
    },
  },
  {
    id: "preset-heavylift-15in-industrial-001",
    name: "HeavyLift 15\" Industrial",
    description: "ค่า heavy lifter สำหรับเฟรมใหญ่ 15\"+ 12S งานอุตสาหกรรม/เกษตรที่ต้องแบกของหนัก",
    useCase: "โดรนพ่นยา, งานเกษตรขนาดใหญ่, ขนของหนักระยะสั้น",
    difficulty: "advanced",
    frameSizeLabel: "15inch (Industrial Hex/Octo)",
    tags: ["heavylift", "15inch", "12s", "industrial", "agriculture"],
    notes: "Heavy Lifter: ความร้อนสะสมที่มอเตอร์/ESC คือความเสี่ยงหลัก — เช็คอุณหภูมิถี่ๆ และเผื่อ ESC/มอเตอร์ headroom มากกว่าปกติ",
    bfVersion: "4.4",
    presetConfidence: 70,
    input: {
      frameSize: 650, motorKV: 170, batteryS: 12, propSize: 150, weight: 4800,
      style: "cinematic", propBlades: 2, motorCount: 8, payloadG: 2000, escCurrentRatingA: 60,
    },
  },
];

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function roundRateAxis(r: { rc_rate: number; rate: number; expo: number }) {
  return { rc_rate: round3(r.rc_rate), rate: round3(r.rate), expo: round3(r.expo) };
}

function buildPreset(seed: PresetSeed) {
  const result = calculateTuning(seed.input);

  // Drop the wizard's own header + "Generated <date>" lines (this preset is
  // a static, versioned entry — not a fresh per-request calculation) and
  // replace with a preset-specific header, keeping the rest identical.
  const cliCommands = [
    `# ${seed.name} — OBIXCORE Preset (${result.setupClass})`,
    ...result.cliCommands.slice(2),
  ];

  return {
    id: seed.id,
    name: seed.name,
    description: seed.description,
    setupClass: result.setupClass as SetupClass,
    style: seed.input.style,
    frameSizeLabel: seed.frameSizeLabel,
    propSizeIn: seed.input.propSize / 10,
    batteryS: seed.input.batteryS,
    weightG: result.totalWeightG,
    bfVersion: seed.bfVersion,
    difficulty: seed.difficulty,
    useCase: seed.useCase,
    confidence: seed.presetConfidence,
    tags: seed.tags,
    pid: result.pid,
    rates: {
      roll: roundRateAxis(result.rates.roll),
      pitch: roundRateAxis(result.rates.pitch),
      yaw: roundRateAxis(result.rates.yaw),
    },
    filters: {
      gyroLpf1Hz: result.filters.gyroLpf1Hz,
      gyroLpf2Hz: result.filters.gyroLpf2Hz,
      dTermLpf1Hz: result.filters.dTermLpf1Hz,
      rpmFilter: result.filters.rpmFilter,
      dynamicNotch: result.filters.dynamicNotch,
    },
    cliCommands,
    notes: seed.notes,
    // Kept so the recommender / detail view can show the exact reference
    // spec this preset's numbers were generated from.
    referenceSpec: seed.input,
  };
}

const presets = SEEDS.map(buildPreset);

console.log(JSON.stringify(presets, null, 2));
