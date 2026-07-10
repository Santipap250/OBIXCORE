// lib/blackbox.ts — Step-Response / Blackbox reader
//
// This is a rule-based expert system, not a real blackbox-log parser: the
// pilot answers a few questions about how the drone *feels* (step response,
// oscillation character, propwash, filter feel, motor heat) and the engine
// combines those observations into PID/filter delta suggestions.
//
// Deltas are expressed relative to the pilot's current values — same
// convention already used in data/problems.json ("set d_roll = [ค่าปัจจุบัน
// - 5]") — because we have no way to know their actual current PID/filter
// values, and printing a fabricated absolute number would be actively wrong.

import { clamp, confidenceLabel as toConfidenceLabel } from "./utils";

export type OvershootLevel = "none" | "slight" | "large";
export type OscillationType = "none" | "fast_tight" | "slow_wobble";
export type PropwashLevel = "none" | "mild" | "severe";
export type MotorHeat = "cool" | "warm" | "hot";
export type FilterFeel = "sharp" | "balanced" | "mushy";

export interface BlackboxObservations {
  style: "race" | "freestyle" | "cinematic";
  overshoot: OvershootLevel;
  oscillation: OscillationType;
  propwash: PropwashLevel;
  motorHeat: MotorHeat;
  filterFeel: FilterFeel;
  /** Prop-wash "bounce back" feeling right after a fast punch-out or dive. */
  bounceBack: boolean;
}

export interface AxisDelta {
  /** Percent change suggested, relative to the pilot's current gain. e.g. -8 means "ลดลงประมาณ 8%" */
  p: number;
  i: number;
  d: number;
}

export interface BlackboxFinding {
  severity: "info" | "warn" | "critical";
  text: string;
}

export interface BlackboxResult {
  summary: string;
  findings: BlackboxFinding[];
  pidDelta: {
    roll: AxisDelta;
    pitch: AxisDelta;
    yaw: AxisDelta;
  };
  filterDelta: {
    /** Hz change suggested relative to current gyro_lowpass_hz. */
    gyroLowpassHz: number;
    /** Hz change suggested relative to current dterm_lowpass_hz. */
    dtermLowpassHz: number;
    addNotch: boolean;
    notchNote: string | null;
  };
  cliCommands: string[];
  warnings: string[];
  tips: string[];
  confidence: number;
  confidenceLabel: "Low" | "Medium" | "High";
}

const emptyAxis = (): AxisDelta => ({ p: 0, i: 0, d: 0 });

function addAxis(a: AxisDelta, b: Partial<AxisDelta>): AxisDelta {
  return {
    p: a.p + (b.p ?? 0),
    i: a.i + (b.i ?? 0),
    d: a.d + (b.d ?? 0),
  };
}

export function analyzeStepResponse(obs: BlackboxObservations): BlackboxResult {
  const findings: BlackboxFinding[] = [];
  const warnings: string[] = [];
  const tips: string[] = [];

  let roll = emptyAxis();
  let pitch = emptyAxis();
  let yaw = emptyAxis();
  let gyroLowpassHz = 0;
  let dtermLowpassHz = 0;
  let addNotch = false;
  let notchNote: string | null = null;

  // Confidence starts high and drops when observations conflict or are all
  // "none" (nothing to diagnose, so the suggestion is generic/low-value).
  let confidenceScore = 90;
  const signalCount = [
    obs.overshoot !== "none",
    obs.oscillation !== "none",
    obs.propwash !== "none",
    obs.filterFeel !== "balanced",
    obs.bounceBack,
  ].filter(Boolean).length;
  if (signalCount === 0) confidenceScore = 40;

  // ---- Overshoot after step (stick punch) ----
  if (obs.overshoot === "large") {
    roll = addAxis(roll, { p: -8, d: 4 });
    pitch = addAxis(pitch, { p: -8, d: 4 });
    findings.push({
      severity: "warn",
      text: "Step response แกว่งเลยจุดหมายชัดเจน (overshoot) — มักมาจาก P สูงเกินไปเทียบกับ D ที่มีอยู่",
    });
  } else if (obs.overshoot === "slight") {
    roll = addAxis(roll, { p: -3, d: 2 });
    pitch = addAxis(pitch, { p: -3, d: 2 });
    findings.push({
      severity: "info",
      text: "มี overshoot เล็กน้อยหลัง step — ปรับแค่เล็กน้อยพอ ไม่ต้องแก้แรง",
    });
  }

  // ---- Oscillation character ----
  if (obs.oscillation === "fast_tight") {
    roll = addAxis(roll, { d: -8 });
    pitch = addAxis(pitch, { d: -8 });
    gyroLowpassHz -= 15;
    dtermLowpassHz -= 10;
    findings.push({
      severity: "warn",
      text: "สั่นความถี่สูงแบบแน่น ๆ (buzzy) — ส่วนใหญ่คือ D term รับ noise มากเกินไป หรือ filter คัตออฟสูงเกินไป",
    });
  } else if (obs.oscillation === "slow_wobble") {
    roll = addAxis(roll, { p: -6 });
    pitch = addAxis(pitch, { p: -6 });
    findings.push({
      severity: "warn",
      text: "โยกช้า ๆ ความถี่ต่ำ (slow wobble) — มักไม่ใช่ filter แต่เป็น P สูงไป หรือเฟรม/motor mount หลวมจนเกิด resonance ความถี่ต่ำ",
    });
    tips.push("ก่อนแก้ PID เพิ่ม ลองเช็กน็อตเฟรมและ motor mount ให้แน่นก่อน เพราะอาการนี้เลียนแบบ P สูงได้เป๊ะมาก");
  }

  // ---- Propwash ----
  if (obs.propwash === "mild") {
    roll = addAxis(roll, { d: 4 });
    pitch = addAxis(pitch, { d: 4 });
    findings.push({
      severity: "info",
      text: "มี propwash เล็กน้อยหลังบินเร็ว/ลงเร็ว — เพิ่ม D เล็กน้อยช่วยให้ dampen อากาศปั่นป่วนได้ดีขึ้น",
    });
  } else if (obs.propwash === "severe") {
    roll = addAxis(roll, { d: 8, i: 3 });
    pitch = addAxis(pitch, { d: 8, i: 3 });
    findings.push({
      severity: "critical",
      text: "Propwash หนักจนคุมยาก — นอกจาก D/I ให้เช็ก Anti Gravity gain และ Throttle PID Attenuation (TPA) ด้วย ปัญหานี้มักไม่ได้แก้ด้วย PID อย่างเดียว",
    });
    tips.push("ลองเปิด Blackbox log จริงถ้ามี แล้วดูช่วง throttle drop — ถ้า TPA เริ่มทำงานเร็วเกินไปจะยิ่งทำให้ propwash แย่ลง");
  }

  if (obs.bounceBack) {
    yaw = addAxis(yaw, {});
    pitch = addAxis(pitch, { d: 3 });
    roll = addAxis(roll, { d: 3 });
    findings.push({
      severity: "warn",
      text: "มีอาการ \"เด้งกลับ\" หลัง punch-out หรือดิ่งเร็ว — เข้าข่าย propwash/TPA เช่นกัน ควรแก้คู่กับ propwash ด้านบน",
    });
  }

  // ---- Filter feel ----
  if (obs.filterFeel === "sharp") {
    gyroLowpassHz -= 20;
    dtermLowpassHz -= 15;
    findings.push({
      severity: "warn",
      text: "รู้สึกไวจนสั่นมือ/มี noise เยอะ (sharp) — ลด cutoff ของ gyro/dterm filter ลงจะช่วยกรอง noise ได้มากขึ้น แลกกับ response ที่ช้าลงนิดหน่อย",
    });
    if (obs.style === "cinematic") {
      tips.push("สาย cinematic ปกติเน้นความนุ่มนวลอยู่แล้ว การลด cutoff รอบนี้น่าจะทำให้ฟุตเทจนิ่งขึ้นด้วย ไม่ใช่แค่แก้ noise");
    }
  } else if (obs.filterFeel === "mushy") {
    gyroLowpassHz += 20;
    dtermLowpassHz += 15;
    findings.push({
      severity: obs.style === "race" ? "warn" : "info",
      text: "รู้สึกหน่วง/มูฟช้า (mushy) — filter อาจแน่นเกินไปจนหน่วงเวลาตอบสนอง เพิ่ม cutoff ขึ้นจะได้ response ที่ไวขึ้น แลกกับ noise ที่มากขึ้นนิดหน่อย",
    });
    if (obs.style === "race") {
      tips.push("สาย race ไวต่อความหน่วงมากกว่าสไตล์อื่น ถ้าเพิ่ม cutoff แล้วยังรู้สึกช้าอยู่ ให้เพิ่มอีกทีละน้อยแทนการเพิ่มทีเดียวเยอะ");
    }
  }

  // ---- Motor heat (hardware, not a PID fix) ----
  if (obs.motorHeat === "hot") {
    findings.push({
      severity: "critical",
      text: "มอเตอร์ร้อนจัดหรือมีกลิ่นไหม้ — นี่คือปัญหาฮาร์ดแวร์ ไม่ใช่สิ่งที่แก้ด้วย PID/filter ได้ หยุดบินและตรวจก่อน",
    });
    warnings.push("มอเตอร์ร้อนจัด/มีกลิ่นไหม้ ให้หยุดบินทันทีแล้วตรวจ bearing มอเตอร์, ความสมดุลของใบพัด, การตั้งค่า ESC/motor timing, และค่า current limit ก่อนบินต่อ — อย่าพยายามแก้ด้วยการลด PID เพียงอย่างเดียว");
    confidenceScore -= 10;
  } else if (obs.motorHeat === "warm") {
    tips.push("มอเตอร์อุ่นกว่าปกตินิดหน่อยหลังบินยังพอเป็นเรื่องปกติ แต่ถ้าอุ่นขึ้นเรื่อย ๆ ทุกครั้งที่บิน ให้ลองเช็ก prop pitch/motor KV ให้เหมาะกับ build ก่อน");
  }

  // ---- Dynamic notch suggestion ----
  if (obs.oscillation === "fast_tight" && obs.propwash !== "none") {
    addNotch = true;
    notchNote = "สั่นความถี่สูงร่วมกับ propwash พร้อมกัน มักมีสัญญาณรบกวนหลายความถี่ปนกัน ลองเพิ่มจำนวน dynamic notch (dyn_notch_count) หรือขยายช่วงความถี่ (dyn_notch_min_hz / dyn_notch_max_hz) ให้ครอบคลุมมากขึ้น";
  }

  // Clamp everything to sane ranges so the tool never suggests something
  // wild even if every symptom happens to be selected at once.
  const clampAxis = (a: AxisDelta): AxisDelta => ({
    p: clamp(a.p, -20, 15),
    i: clamp(a.i, -15, 15),
    d: clamp(a.d, -20, 20),
  });
  roll = clampAxis(roll);
  pitch = clampAxis(pitch);
  yaw = clampAxis(yaw);
  gyroLowpassHz = clamp(gyroLowpassHz, -40, 40);
  dtermLowpassHz = clamp(dtermLowpassHz, -30, 30);

  if (signalCount === 0) {
    findings.push({
      severity: "info",
      text: "ไม่มีอาการผิดปกติที่ชัดเจนจากคำตอบที่เลือก — ถ้าบินแล้วรู้สึกดีอยู่แล้ว ไม่จำเป็นต้องแก้อะไรเพิ่ม",
    });
    tips.push("ถ้าอยากขยับ tuning ต่อจากจุดนี้ แนะนำให้เก็บ Blackbox log จริงมาอ่านค่า step response แทนการเดาจากความรู้สึกอย่างเดียว");
  }

  const fmt = (n: number) => (n > 0 ? `+${n}` : `${n}`);
  const cliCommands: string[] = [];
  const pushPidLines = (axis: "roll" | "pitch" | "yaw", d: AxisDelta) => {
    if (d.p !== 0) cliCommands.push(`set p_${axis} = [ค่าปัจจุบัน ${fmt(d.p)}%]`);
    if (d.i !== 0) cliCommands.push(`set i_${axis} = [ค่าปัจจุบัน ${fmt(d.i)}%]`);
    if (d.d !== 0) cliCommands.push(`set d_${axis} = [ค่าปัจจุบัน ${fmt(d.d)}%]`);
  };
  pushPidLines("roll", roll);
  pushPidLines("pitch", pitch);
  pushPidLines("yaw", yaw);
  if (gyroLowpassHz !== 0) cliCommands.push(`set gyro_lowpass_hz = [ค่าปัจจุบัน ${fmt(gyroLowpassHz)}]`);
  if (dtermLowpassHz !== 0) cliCommands.push(`set dterm_lowpass_hz = [ค่าปัจจุบัน ${fmt(dtermLowpassHz)}]`);
  if (addNotch) cliCommands.push(`set dyn_notch_count = [ค่าปัจจุบัน +1] (สูงสุด 5)`);
  if (cliCommands.length > 0) cliCommands.push("save");

  const summary =
    signalCount === 0
      ? "จากคำตอบที่เลือก ยังไม่พบสัญญาณที่ต้องปรับ tuning อย่างชัดเจน"
      : `พบ ${signalCount} สัญญาณที่น่าจะเชื่อมโยงกัน — ดูรายละเอียดและลำดับการแก้ด้านล่าง`;

  return {
    summary,
    findings,
    pidDelta: { roll, pitch, yaw },
    filterDelta: { gyroLowpassHz, dtermLowpassHz, addNotch, notchNote },
    cliCommands,
    warnings,
    tips,
    confidence: clamp(confidenceScore, 0, 100),
    confidenceLabel: toConfidenceLabel(clamp(confidenceScore, 0, 100)),
  };
}
