// types/index.ts — OBIXCORE Data Models

export interface Preset {
  id: string;
  name: string;
  description: string;
  type: "race" | "freestyle" | "cinematic" | "beginner";
  frameSize: "2inch" | "3inch" | "5inch" | "7inch";
  batteryS: 2 | 3 | 4 | 5 | 6;
  bfVersion: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  pid: {
    roll: { p: number; i: number; d: number; f: number };
    pitch: { p: number; i: number; d: number; f: number };
    yaw: { p: number; i: number; d: number };
  };
  rates: {
    type: "actual" | "betaflight" | "kiss";
    roll: { rc_rate: number; rate: number; expo: number };
    pitch: { rc_rate: number; rate: number; expo: number };
    yaw: { rc_rate: number; rate: number; expo: number };
  };
  filters: {
    gyroLpf1Hz: number;
    gyroLpf2Hz: number;
    dTermLpf1Hz: number;
    rpmFilter: boolean;
    dynamicNotch: "OFF" | "LOW" | "MEDIUM" | "HIGH";
  };
  cliCommands: string[];
  notes: string;
}

export interface Problem {
  id: string;
  symptom: string;
  category: "flight" | "video" | "power" | "mechanical";
  severity: "low" | "medium" | "high";
  description: string;
  causes: string[];
  steps: ProblemStep[];
  relatedPresetIds: string[];
  tags: string[];
}

export interface ProblemStep {
  order: number;
  title: string;
  description: string;
  action?: string;
  warning?: string;
}

export interface WizardInput {
  frameSize: number; // mm diagonal
  motorKV: number;
  batteryS: number;
  propSize: number; // e.g. 51 = 5.1 inch
  weight: number; // grams AUW (airframe + battery + camera) — does NOT include payload, see payloadG
  style: "race" | "freestyle" | "cinematic";
  // Advanced/optional — improve accuracy of current/flight-time estimate and
  // enable the ESC headroom check. Safe defaults are used when omitted (and
  // called out as estimates in the result's reasoning/tips).
  propBlades?: 2 | 3 | 4 | 5 | 6;
  batteryMah?: number;
  escCurrentRatingA?: number;
  motorCount?: number;
  /** Extra suspended/delivery payload in grams, on top of `weight`. Mainly
   * relevant for Heavy Lifter class builds carrying cargo, gimbals, etc. */
  payloadG?: number;
}

export interface EstimateRange {
  low: number;
  typical: number;
  high: number;
}

export interface WizardResult {
  pid: {
    roll: { p: number; i: number; d: number; f: number };
    pitch: { p: number; i: number; d: number; f: number };
    yaw: { p: number; i: number; d: number };
  };
  filters: {
    gyroLpf1Hz: number;
    gyroLpf2Hz: number;
    dTermLpf1Hz: number;
    rpmFilter: boolean;
    dynamicNotch: string;
    dTermLpfType: string;
  };
  rates: {
    roll: { rc_rate: number; rate: number; expo: number };
    pitch: { rc_rate: number; rate: number; expo: number };
    yaw: { rc_rate: number; rate: number; expo: number };
  };
  cliCommands: string[];
  warnings: string[];
  tips: string[];
  /** Short bullets explaining *why* these specific numbers were chosen. */
  reasoning: string[];
  confidence: number;
  confidenceLabel: "Low" | "Medium" | "High";
  /**
   * Detected drone class, driven primarily by prop size (per OBIXCORE's
   * class spec):
   *  - micro:      Tiny Whoop / Micro     · 1.2"–2"   · 1S–2S
   *  - cinewhoop:  Cinewhoop / Toothpick  · 2.5"–3.5" · 3S–4S (up to 6S)
   *  - freestyle:  Freestyle 5"           · 4S–6S
   *  - racing:     Racing 5"              · 4S–6S
   *  - longrange:  Long Range             · 7"–9"     · 6S
   *  - heavylift:  Heavy Lifter           · 10"+      · 6S–12S
   */
  setupClass: "micro" | "cinewhoop" | "freestyle" | "racing" | "longrange" | "heavylift";
  summary: string;
  estimatedHoverCurrentA: EstimateRange;
  estimatedFlightCurrentA: EstimateRange;
  /** Only populated when batteryMah was provided. */
  estimatedFlightTimeMin: EstimateRange | null;
  escWarning: string | null;
  /** Total flying weight used in physics calcs = weight + payloadG. */
  totalWeightG: number;
  /** Which optional inputs were missing and filled with a reasonable estimate. */
  estimatedFields: string[];
}

export interface CalculatorResult {
  estimatedThrust: number; // grams per motor
  thrustToWeight: number;
  estimatedFlightTime: EstimateRange; // minutes
  estimatedCurrentDraw: EstimateRange; // amps
  batteryRating: "sufficient" | "marginal" | "insufficient";
  warnings: string[];
}
