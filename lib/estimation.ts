// lib/estimation.ts — Shared physics & confidence engine
//
// Every "how much current / how long will it fly / how loaded is this prop"
// number in OBIXCORE is computed here ONCE, then reused by both the Tuning
// Wizard and the Calculator. That's deliberate: the old code had two
// completely separate, made-up current-draw formulas (one of which ignored
// aircraft weight entirely), which could give different answers for the
// same drone depending on which page you used. This file fixes that.
//
// Where a number can't be derived exactly (real thrust depends on the exact
// motor/prop combo, which we don't have a datasheet for), we say so by
// returning a {low, typical, high} range instead of a single fake-precise
// value, and we keep every magic constant documented with where it comes
// from (momentum theory, or a community-observed range) rather than
// inventing unexplained multipliers.

import { clamp, round, safeNumber } from "./utils";

export interface Range {
  low: number;
  typical: number;
  high: number;
}

export type FlightStyle = "race" | "freestyle" | "cinematic";

const AIR_DENSITY_KG_M3 = 1.225; // sea-level, 15°C
const GRAVITY = 9.81;
const IN_TO_M = 0.0254;

function range(low: number, typical: number, high: number): Range {
  return { low, typical, high };
}

function scaleRange(r: Range, factor: number): Range {
  return { low: r.low * factor, typical: r.typical * factor, high: r.high * factor };
}

// ─── Geometry ──────────────────────────────────────────────

/** Propeller disc area in m², from diameter in inches. */
export function propDiscAreaM2(propDiameterIn: number): number {
  const d = safeNumber(propDiameterIn, 5.1, 1, 15);
  const radiusM = (d * IN_TO_M) / 2;
  return Math.PI * radiusM * radiusM;
}

/**
 * Loaded motor RPM estimate. KV × voltage gives *unloaded* RPM (no prop
 * attached, no current flowing into useful work). Under an actual prop load
 * a brushless motor settles at roughly 75–85% of unloaded RPM because the
 * back-EMF curve flattens out as current is drawn — this is standard motor
 * theory, not a guess specific to this app. We use the middle of that band.
 */
export function estimateLoadedRpm(motorKV: number, batteryS: number): { unloadedRpm: number; loadedRpm: number } {
  const kv = safeNumber(motorKV, 2306, 300, 6000);
  const s = safeNumber(batteryS, 4, 1, 8);
  const voltage = s * 3.7; // nominal per-cell voltage
  const unloadedRpm = kv * voltage;
  const LOADED_FACTOR = 0.8; // mid-point of the typical 0.75–0.85 loaded/unloaded band
  return { unloadedRpm, loadedRpm: unloadedRpm * LOADED_FACTOR };
}

// ─── Hover power & current (momentum theory + calibrated efficiency) ──────

/**
 * Ideal induced power to hover, per motor, from propeller momentum theory:
 *   P_ideal = T^1.5 / sqrt(2 · ρ · A)
 * This is the textbook minimum power a perfectly efficient rotor needs to
 * generate thrust T. Real FPV motor+prop+ESC systems need several times
 * this much electrical power because of blade profile drag, motor copper/
 * iron losses, and ESC switching losses — that gap is handled by
 * systemEfficiencyRange() below, not by fudging this formula.
 */
export function idealHoverPowerPerMotorW(weightG: number, motorCount: number, propDiameterIn: number): number {
  const w = safeNumber(weightG, 350, 20, 5000);
  const motors = safeNumber(motorCount, 4, 1, 8);
  const thrustPerMotorN = (w / 1000) * GRAVITY / motors;
  const area = propDiscAreaM2(propDiameterIn);
  return Math.pow(thrustPerMotorN, 1.5) / Math.sqrt(2 * AIR_DENSITY_KG_M3 * area);
}

/**
 * Each additional blade beyond 2 adds drag/disc-loading for a given diameter
 * (more swept area interacting with already-disturbed air), which the
 * FPV community consistently reports as higher current draw for similar
 * thrust. We model it as a mild efficiency penalty rather than a thrust
 * change, since blade count mainly affects how much power it costs to
 * produce a given thrust, not the thrust itself.
 */
function bladeEfficiencyFactor(bladeCount: number): number {
  const blades = safeNumber(bladeCount, 3, 2, 6);
  // 2-blade ≈ reference efficiency, +~7% current draw per extra blade
  return 1 + (blades - 2) * 0.07;
}

/**
 * Overall electrical-to-thrust system efficiency, expressed as the fraction
 * of ideal induced power that the *real* hover electrical power represents
 * (idealPower / realElectricalPower). Calibrated so that a typical 5"/4S
 * freestyle quad (≈450g, 4 motors, 5.1" prop) lands in the commonly
 * reported 8–14A hover-current range. Bigger props (lower disc loading) and
 * more efficient voltage matching push this up; small high-disc-loading
 * setups push it down. Returned as a range because real efficiency varies
 * with motor/prop quality, which this tool has no way to know.
 */
export function systemEfficiencyRange(propDiameterIn: number, bladeCount: number, motorKV: number, batteryS: number): Range {
  const d = safeNumber(propDiameterIn, 5.1, 1, 15);
  // Bigger prop = lower disc loading = closer to ideal. Reference: 5.1" → ~0.16
  const sizeFactor = clamp(0.16 * Math.pow(d / 5.1, 0.55), 0.08, 0.34);
  const blade = bladeEfficiencyFactor(bladeCount);
  // KV/voltage matching: motors run most efficiently nearest their designed
  // KV-for-cell-count; far off-spec combos (e.g. very high KV on 6S) lose a
  // little efficiency to excess electrical frequency / heat.
  const kv = safeNumber(motorKV, 2306, 300, 6000);
  const s = safeNumber(batteryS, 4, 1, 8);
  const kvVoltageMismatch = Math.abs(kv * s - 2306 * 4) / (2306 * 4);
  const matchFactor = clamp(1 - kvVoltageMismatch * 0.18, 0.82, 1.0);

  const typical = clamp((sizeFactor * matchFactor) / blade, 0.05, 0.32);
  return range(typical * 0.8, typical, typical * 1.2);
}

export interface HoverCurrentInput {
  weightG: number;
  motorCount: number;
  propDiameterIn: number;
  bladeCount: number;
  motorKV: number;
  batteryS: number;
}

/** Estimated per-pack hover current (amps), as a {low, typical, high} range. */
export function estimateHoverCurrentA(input: HoverCurrentInput): Range {
  const idealW = idealHoverPowerPerMotorW(input.weightG, input.motorCount, input.propDiameterIn);
  const eff = systemEfficiencyRange(input.propDiameterIn, input.bladeCount, input.motorKV, input.batteryS);
  const motors = safeNumber(input.motorCount, 4, 1, 8);
  const voltage = safeNumber(input.batteryS, 4, 1, 8) * 3.7;

  const electricalWTypical = idealW / eff.typical;
  const electricalWLow = idealW / eff.high; // higher efficiency → lower power needed
  const electricalWHigh = idealW / eff.low;

  const perPackA = (w: number) => (w * motors) / voltage;
  return range(round(perPackA(electricalWLow), 2), round(perPackA(electricalWTypical), 2), round(perPackA(electricalWHigh), 2));
}

// ─── Style → average flight current ───────────────────────

/**
 * Flying style changes *average* throttle position, not just hover. Race
 * and aggressive freestyle spend much more time well above hover throttle
 * (punch-outs, full-throttle dives) than cinematic/cruising flight. These
 * multipliers are a commonly cited community rule of thumb, not a precise
 * measurement — shown as a range for that reason.
 */
const STYLE_THROTTLE_MULTIPLIER: Record<FlightStyle, Range> = {
  cinematic: range(1.1, 1.25, 1.5),
  freestyle: range(1.4, 1.7, 2.1),
  race: range(1.8, 2.2, 2.8),
};

export function estimateAverageFlightCurrentA(hoverCurrent: Range, style: FlightStyle): Range {
  const mult = STYLE_THROTTLE_MULTIPLIER[style] ?? STYLE_THROTTLE_MULTIPLIER.freestyle;
  return range(
    round(hoverCurrent.low * mult.low, 2),
    round(hoverCurrent.typical * mult.typical, 2),
    round(hoverCurrent.high * mult.high, 2)
  );
}

/** Rough peak/punch-out current, used only for an ESC headroom sanity check. */
export function estimatePeakCurrentA(averageFlightCurrent: Range, style: FlightStyle): number {
  const peakFactor = style === "race" ? 2.0 : style === "freestyle" ? 1.7 : 1.4;
  return round(averageFlightCurrent.high * peakFactor, 1);
}

// ─── Flight time ───────────────────────────────────────────

/**
 * Usable capacity fraction: LiPo packs shouldn't be drained to 0%, and at
 * very high discharge rates relative to capacity (high C-rate) internal
 * resistance causes voltage to sag into the low-voltage cutoff sooner,
 * effectively shrinking usable capacity further. Base 78% reflects a
 * common safe-landing margin (~3.5–3.6V/cell); the C-rate penalty is capped
 * so it can't run away for unrealistic inputs.
 */
function usableCapacityFraction(batteryMah: number, currentA: number): number {
  const mah = safeNumber(batteryMah, 1300, 100, 30000);
  const cRate = (currentA * 1000) / mah;
  const cRatePenalty = clamp((cRate - 15) * 0.004, 0, 0.12);
  return clamp(0.78 - cRatePenalty, 0.6, 0.82);
}

export function estimateFlightTimeMinutes(batteryMah: number, averageCurrentA: Range): Range {
  const mah = safeNumber(batteryMah, 1300, 100, 30000);
  const capacityAh = mah / 1000;

  const minutesFor = (currentA: number) => {
    const usable = usableCapacityFraction(mah, currentA);
    const current = safeNumber(currentA, 5, 0.3, 300);
    return (capacityAh * usable) / current * 60;
  };

  // Higher current → shorter flight, so low-current maps to high-time and vice versa.
  return range(round(minutesFor(averageCurrentA.high), 1), round(minutesFor(averageCurrentA.typical), 1), round(minutesFor(averageCurrentA.low), 1));
}

// ─── ESC headroom ───────────────────────────────────────────

export function escHeadroomWarning(escCurrentRatingA: number | undefined, averageFlightCurrent: Range, style: FlightStyle): string | null {
  if (!escCurrentRatingA || escCurrentRatingA <= 0) return null;
  const peak = estimatePeakCurrentA(averageFlightCurrent, style);
  if (escCurrentRatingA < peak) {
    return `ESC ${escCurrentRatingA}A อาจต่ำกว่าที่ต้องการ — ประมาณการกระแสช่วง full-throttle/punch อยู่ที่ ~${peak}A ต่อตัว ควรเผื่อ ESC ที่รับกระแสได้สูงกว่านี้`;
  }
  if (escCurrentRatingA < peak * 1.15) {
    return `ESC ${escCurrentRatingA}A พอใช้ได้แต่ค่อนข้างชิด (ประมาณการ peak ~${peak}A) — เผื่อ headroom เพิ่มถ้าบินหนักหรืออากาศร้อน`;
  }
  return null;
}

// ─── TWR labeling (shared by Wizard + Calculator) ──────────

export function twrRating(twr: number): { label: string; color: "green" | "amber" | "red" } {
  if (twr >= 10) return { label: "⚡ Race-ready", color: "green" };
  if (twr >= 7) return { label: "✓ Freestyle", color: "green" };
  if (twr >= 4) return { label: "~ OK", color: "amber" };
  return { label: "✗ น้ำหนักมากเกิน", color: "red" };
}

// ─── Confidence scoring helpers ────────────────────────────

/** 0 inside [idealLow, idealHigh], scaling up to maxPenalty the farther outside it goes. */
export function deviationPenalty(value: number, idealLow: number, idealHigh: number, maxPenalty: number): number {
  if (value >= idealLow && value <= idealHigh) return 0;
  const span = Math.max(idealHigh - idealLow, 0.0001);
  const distance = value < idealLow ? idealLow - value : value - idealHigh;
  return clamp((distance / span) * maxPenalty, 0, maxPenalty);
}
