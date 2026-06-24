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
  weight: number; // grams AUW — include camera/payload, this is total flying weight
  style: "race" | "freestyle" | "cinematic";
  // Advanced/optional — improve accuracy of current/flight-time estimate and
  // enable the ESC headroom check. Safe defaults are used when omitted.
  propBlades?: 2 | 3 | 4 | 5 | 6;
  batteryMah?: number;
  escCurrentRatingA?: number;
  motorCount?: number;
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
  setupClass: "micro" | "small" | "mid" | "standard" | "long-range";
  summary: string;
  estimatedHoverCurrentA: EstimateRange;
  estimatedFlightCurrentA: EstimateRange;
  /** Only populated when batteryMah was provided. */
  estimatedFlightTimeMin: EstimateRange | null;
  escWarning: string | null;
}

export interface CalculatorResult {
  estimatedThrust: number; // grams per motor
  thrustToWeight: number;
  estimatedFlightTime: EstimateRange; // minutes
  estimatedCurrentDraw: EstimateRange; // amps
  batteryRating: "sufficient" | "marginal" | "insufficient";
  warnings: string[];
}
