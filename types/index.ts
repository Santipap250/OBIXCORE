// types/index.ts — OBIXCORE Data Models

/**
 * Drone setup class — this is the SAME 6-class model the Tuning Wizard
 * classifies builds into (see lib/wizard.ts `classifyDrone`). Presets are
 * tagged with this instead of a separate "preset-only" category so the
 * Preset Library and the Wizard always speak the same language and the
 * recommender (lib/presetRecommender.ts) can compare them directly:
 *   micro      Tiny Whoop / Micro     1.2"–2"    1S–2S
 *   cinewhoop  Cinewhoop / Toothpick  2.5"–3.5"  3S–4S (up to 6S)
 *   freestyle  Freestyle 5"           4S–6S
 *   racing     Racing 5"              4S–6S
 *   longrange  Long Range             7"–9"      6S
 *   heavylift  Heavy Lifter           10"+       6S–12S
 */
export type SetupClass = "micro" | "cinewhoop" | "freestyle" | "racing" | "longrange" | "heavylift";

export interface Preset {
  id: string;
  name: string;
  description: string;
  /** Drone class — same enum/logic the Wizard uses (see SetupClass above). */
  setupClass: SetupClass;
  /** Flying style — same enum as WizardInput["style"], kept separate from
   * setupClass since e.g. both "freestyle" and "racing" classes fly 5" gear. */
  style: "race" | "freestyle" | "cinematic";
  /** Human-readable frame size/build description, e.g. `5inch (6S Race)`. */
  frameSizeLabel: string;
  /** Representative prop diameter in inches for this preset's reference build. */
  propSizeIn: number;
  batteryS: number;
  /** Total flying weight (AUW + payload) of the reference build, grams. */
  weightG: number;
  bfVersion: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  /** Short "best for" description shown on the preset card. */
  useCase: string;
  /** Baseline reliability/testing confidence (0-100) for this preset entry
   * itself — how well-established this exact spec/style combo is. This is
   * distinct from the per-build match/suitability score the recommender
   * computes against a user's actual Wizard input. */
  confidence: number;
  tags: string[];
  pid: {
    roll: { p: number; i: number; d: number; f: number };
    pitch: { p: number; i: number; d: number; f: number };
    yaw: { p: number; i: number; d: number };
  };
  rates: {
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
  /** The exact WizardInput this preset's PID/filters/rates were generated
   * from via calculateTuning() — kept so the recommender can score a user's
   * build against the reference build's real spec, not just labels. */
  referenceSpec: WizardInput;
}

/** A preset scored against a specific WizardInput/WizardResult by
 * lib/presetRecommender.ts. */
export interface PresetMatch {
  preset: Preset;
  /** 0–100 similarity/suitability score for this specific user build. */
  matchScore: number;
  /** Short bullets explaining why this preset was suggested. */
  reasons: string[];
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
  setupClass: SetupClass;
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
  /** Prop/KV/battery/blade load vs. the class's nominal reference build
   * (clamped 0.6–1.6×). Exposed so other engines (ConfigDoctor) can reuse
   * the exact same load number the Wizard tuned PID/filters against. */
  propLoad: number;
  /** Total weight vs. the class's nominal reference weight (clamped
   * 0.5–2.4×). Same rationale as propLoad above. */
  inertia: number;
}

export interface CalculatorResult {
  estimatedThrust: number; // grams per motor
  thrustToWeight: number;
  estimatedFlightTime: EstimateRange; // minutes
  estimatedCurrentDraw: EstimateRange; // amps
  batteryRating: "sufficient" | "marginal" | "insufficient";
  warnings: string[];
}
