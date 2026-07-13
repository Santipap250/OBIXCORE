// lib/presetRecommender.ts — Preset Library recommendation engine
//
// Scores every Preset against a user's Wizard input/result and returns the
// closest matches with a 0–100 suitability score + short reasons. This is
// the ONLY place preset "closeness to a build" is computed, so the Wizard
// result page and the Preset Library page always agree on which preset is
// "closest" for a given build — no separate/parallel similarity formula.
//
// Deliberately does NOT re-derive PID/filter/rate numbers here — those come
// from calculateTuning() (via scripts/generate-presets.ts at data-authoring
// time). This file only measures spec closeness (class, style, prop,
// battery, weight) to rank existing presets.

import type { Preset, PresetMatch, WizardInput, WizardResult, SetupClass } from "@/types";
import { clamp } from "./utils";

const CLASS_LABEL_TH: Record<SetupClass, string> = {
  micro: "Micro / Tiny Whoop",
  cinewhoop: "Cinewhoop / Toothpick",
  freestyle: "Freestyle 5\"",
  racing: "Racing 5\"",
  longrange: "Long Range",
  heavylift: "Heavy Lifter",
};

const STYLE_LABEL_TH: Record<WizardInput["style"], string> = {
  race: "Race",
  freestyle: "Freestyle",
  cinematic: "Cinematic",
};

// Classes that share the same physical size bracket (5" freestyle vs
// racing gear) get partial credit instead of zero — a racing preset is
// still a much closer starting point for a 5" freestyle build than a
// heavy lifter preset would be.
const ADJACENT_CLASSES: Partial<Record<SetupClass, SetupClass[]>> = {
  freestyle: ["racing"],
  racing: ["freestyle"],
  longrange: ["heavylift"],
  heavylift: ["longrange"],
  cinewhoop: ["micro"],
  micro: ["cinewhoop"],
};

function classScore(presetClass: SetupClass, targetClass: SetupClass): number {
  if (presetClass === targetClass) return 40;
  if (ADJACENT_CLASSES[targetClass]?.includes(presetClass)) return 16;
  return 0;
}

function styleScore(presetStyle: WizardInput["style"], targetStyle: WizardInput["style"]): number {
  if (presetStyle === targetStyle) return 20;
  // cinematic <-> freestyle are closer to each other than either is to race
  const softPair = new Set([presetStyle, targetStyle]);
  if (softPair.has("cinematic") && softPair.has("freestyle")) return 8;
  return 0;
}

/** Closeness on a ratio scale (good for prop/battery/weight, which span a
 * wide multiplicative range across classes) — 1.0 = identical, → 0 as the
 * ratio grows past ~2x in either direction. */
function ratioCloseness(a: number, b: number): number {
  if (a <= 0 || b <= 0) return 0;
  const ratio = a > b ? a / b : b / a;
  return clamp(1 - (ratio - 1) / 1.2, 0, 1);
}

function specScore(preset: Preset, input: WizardInput): { score: number; propClose: boolean; battClose: boolean; weightClose: boolean } {
  const propInput = input.propSize / 10;
  const propC = ratioCloseness(preset.propSizeIn, propInput);
  const battC = ratioCloseness(preset.batteryS, input.batteryS);
  const weightC = ratioCloseness(preset.weightG, input.weight + (input.payloadG ?? 0));

  // Prop size is the strongest physical signal (same as the Wizard's own
  // classifier), battery next, weight last.
  const score = propC * 18 + battC * 12 + weightC * 10;
  return { score, propClose: propC > 0.75, battClose: battC > 0.85, weightClose: weightC > 0.6 };
}

export function scorePreset(preset: Preset, input: WizardInput, result: WizardResult): PresetMatch {
  const cScore = classScore(preset.setupClass, result.setupClass);
  const sScore = styleScore(preset.style, input.style);
  const { score: spScore, propClose, battClose, weightClose } = specScore(preset, input);

  const matchScore = Math.round(clamp(cScore + sScore + spScore, 0, 100));

  const reasons: string[] = [];
  if (preset.setupClass === result.setupClass) {
    reasons.push(`อยู่ในกลุ่มเดียวกัน: ${CLASS_LABEL_TH[preset.setupClass]}`);
  } else if (ADJACENT_CLASSES[result.setupClass]?.includes(preset.setupClass)) {
    reasons.push(`กลุ่มใกล้เคียงกัน: ${CLASS_LABEL_TH[preset.setupClass]} (build ของคุณคือ ${CLASS_LABEL_TH[result.setupClass]})`);
  }
  if (preset.style === input.style) {
    reasons.push(`สไตล์การบิน "${STYLE_LABEL_TH[preset.style]}" ตรงกัน`);
  }
  if (battClose) reasons.push(`แบต ${preset.batteryS}S ใกล้เคียงกับ build ของคุณ (${input.batteryS}S)`);
  if (propClose) reasons.push(`ขนาด prop ${preset.propSizeIn}" ใกล้เคียงกับ build ของคุณ (${(input.propSize / 10).toFixed(1)}")`);
  if (weightClose) reasons.push(`น้ำหนักรวมใกล้เคียงกัน (~${preset.weightG}g)`);
  if (reasons.length === 0) reasons.push("สเปกใกล้เคียงที่สุดเท่าที่มีในคลัง preset ตอนนี้");

  return { preset, matchScore, reasons };
}

/** Returns the top-N presets ranked by suitability for a given Wizard
 * input/result, best first. */
export function recommendPresets(
  input: WizardInput,
  result: WizardResult,
  presets: Preset[],
  topN = 3
): PresetMatch[] {
  return presets
    .map((p) => scorePreset(p, input, result))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, topN);
}
