// lib/i18n/wizardMessagesEn.ts
//
// English equivalent of the warnings/tips/reasoning/estimatedFields text
// generated inline in lib/wizard.ts's calculateTuning(). This file does
// NOT recompute any PID/filter/rate/physics numbers — it only re-derives
// which advisory messages should show, using the exact same boolean
// conditions as the Thai version, reading from WizardResult.debug (see
// types/index.ts) instead of duplicating the calculation.
//
// Keep this in sync with lib/wizard.ts by eye when either changes — the
// conditions here are written to mirror that file line-for-line so a
// diff between the two is easy to review.
import type { WizardInput, WizardResult } from "@/types";
import { confidenceLabel as toConfidenceLabel } from "@/lib/utils";

const CLASS_LABEL_EN: Record<WizardResult["setupClass"], string> = {
  micro: "Micro / Tiny Whoop",
  cinewhoop: "Cinewhoop / Toothpick",
  freestyle: "Freestyle 5\"",
  racing: "Racing 5\"",
  longrange: "Long Range 7\"–9\"",
  heavylift: "Heavy Lifter 10\"+",
};

const SUMMARY_EN: Record<WizardResult["setupClass"], string> = {
  micro: "Suited to Tiny Whoop / Micro 1S–2S — prioritizes soft, stable handling that's safe for small motors",
  cinewhoop: "Suited to Cinewhoop/Toothpick with ducted props — balances stability, smoothness, and power efficiency",
  freestyle: "Suited to typical 5\" freestyle — a solid starting point for flips/rolls and free flying",
  racing: "Suited to 5\" racing — prioritizes fast, direct response with minimal damping",
  longrange: "Suited to 7\"–9\" long range — prioritizes efficiency, stability, and throttle smoothness",
  heavylift: "Suited to 10\"+ heavy lifters carrying payload — tuned to protect the motors/ESC over raw agility",
};

const EXPECTED_FRAME_RANGE_MM: Record<WizardResult["setupClass"], [number, number]> = {
  micro: [55, 130],
  cinewhoop: [110, 190],
  freestyle: [200, 260],
  racing: [200, 260],
  longrange: [260, 400],
  heavylift: [380, 900],
};

export function getSummaryEn(setupClass: WizardResult["setupClass"]): string {
  return SUMMARY_EN[setupClass];
}

export function getEstimatedFieldsEn(result: WizardResult, input: WizardInput): string[] {
  const fields: string[] = [];
  const { debug } = result;
  if (debug.bladesEstimated) fields.push("Prop blade count (assumed 3-blade)");
  if (debug.motorCountEstimated) {
    fields.push(`Motor count (assumed ${debug.motorCount} motors for ${CLASS_LABEL_EN[result.setupClass]})`);
  }
  if (!input.batteryMah) fields.push("Battery capacity (not provided — estimated flight time not shown)");
  if (!input.escCurrentRatingA) fields.push("ESC current rating (not provided — headroom check skipped)");
  return fields;
}

export function getWarningsEn(result: WizardResult, input: WizardInput): string[] {
  const warnings: string[] = [];
  const { debug, setupClass, propLoad, inertia, totalWeightG } = result;
  const [frLo, frHi] = EXPECTED_FRAME_RANGE_MM[setupClass];
  const propDiameter = debug.propDiameterIn;

  if (debug.frameSizeMm < frLo * 0.85 || debug.frameSizeMm > frHi * 1.15) {
    warnings.push(
      `Frame ${debug.frameSizeMm}mm looks inconsistent with a ${propDiameter.toFixed(1)}" prop (${CLASS_LABEL_EN[setupClass]} usually runs ~${frLo}–${frHi}mm frames) — double check you entered the right class`
    );
  }
  if (setupClass === "micro" && debug.batteryS > 2) {
    warnings.push("Micro/Tiny Whoop typically runs 1S–2S — a higher voltage battery may be too much for a small frame");
  }
  if (setupClass !== "micro" && setupClass !== "heavylift" && debug.motorKV > 2600 && debug.batteryS >= 5) {
    warnings.push("High KV + 5S/6S can heat motors quickly — check temperature after your first flight");
  }
  if (propLoad > 1.28) {
    warnings.push("This prop/KV/cell/blade-count combination loads higher than this class's reference — consider a lower-pitch prop or check motor temperature");
  }
  if (totalWeightG > debug.nominalWeightG * 1.25) {
    warnings.push(`Total weight (including payload) is above typical for ${CLASS_LABEL_EN[setupClass]} — treat these values as a starting point only`);
  }
  if (setupClass === "micro" && totalWeightG > 60) {
    warnings.push("An overweight micro frame will respond more sluggishly and oscillate more easily than normal");
  }
  if (debug.style === "race" && totalWeightG > 500) {
    warnings.push("Race style on a very heavy drone loses agility and can push D higher than actually necessary");
  }
  if (setupClass === "heavylift") {
    warnings.push("Heavy Lifter: heat buildup at the motors/ESC is the main risk — check temperature frequently and leave more ESC/motor headroom than usual");
    if (debug.payloadG > 0) {
      warnings.push(`A ${debug.payloadG}g payload adds load directly to every motor — hover-test with the real payload before a full mission flight`);
    }
    if (!input.escCurrentRatingA) {
      warnings.push("No ESC current rating provided — for Heavy Lifter this should be entered to check thermal/headroom, since ESC burnout risk is higher on this class");
    }
  }
  if (setupClass === "longrange" && propLoad > 1.15) {
    warnings.push("Higher-than-normal prop load for long range will reduce flight time and increase heat buildup over a long flight");
  }
  if (result.escWarning) {
    warnings.push(result.escWarning);
  }
  void inertia; // (kept for parity with the Thai generator's local scope; not directly referenced further here)
  return warnings;
}

export function getTipsEn(result: WizardResult, input: WizardInput): string[] {
  const tips: string[] = [];
  const { setupClass } = result;

  tips.push("Start flying with these values, then check motor temp, propwash, and oscillation one at a time");
  tips.push("If the drone shakes after a throttle drop, try iterm_relax = RP and lower D by 2-5 at a time");
  tips.push("If the drone feels sluggish but stable, nudge P up a little before touching D");
  if (setupClass === "freestyle") {
    tips.push("For a heavier stick feel in freestyle, increasing F or RC rate slightly is usually clearer than other changes");
  }
  if (setupClass === "racing") {
    tips.push("Racing prioritizes direct stick response — if it feels too smoothed-out, lower expo before touching rate");
  }
  if (input.style === "cinematic") {
    tips.push("Cinematic favors smooth and stable — lowering D too much can cause a wobble when stopping a rotation");
  }
  if (setupClass === "cinewhoop") {
    tips.push("Cinewhoop: the prop guard disturbs airflow — if you see unusual oscillation, try setting dynamic notch to MEDIUM/HIGH first");
  }
  if (setupClass === "micro") {
    tips.push("Micro/Whoop: for tight indoor spaces, lower rc_rate/rate further for easier control, especially for beginners");
  }
  if (setupClass === "longrange") {
    tips.push("Long Range: holding a steady cruise speed saves noticeably more battery than frequent throttle changes");
  }
  if (setupClass === "heavylift") {
    tips.push("Heavy Lifter: always weigh the real payload before flying, and keep at least a 2:1 thrust-to-weight safety margin");
  }
  if (input.batteryMah) {
    tips.push("Real flight time can vary ±15–20% from the estimate depending on battery condition, temperature, and throttle habits");
  }
  const estimatedFields = getEstimatedFieldsEn(result, input);
  if (estimatedFields.length > 0) {
    tips.push("Some values used here are estimates because they weren't provided — see the Setup Summary for details to improve accuracy");
  }
  return tips;
}

export function getReasoningEn(result: WizardResult, input: WizardInput): string[] {
  const { debug, setupClass, propLoad, inertia, totalWeightG } = result;
  const propDiameter = debug.propDiameterIn;

  const reasoning: string[] = [
    `${propDiameter.toFixed(1)}" prop (${debug.propBlades}-blade${debug.bladesEstimated ? ", estimated" : ""}) + "${debug.style}" style → classified as "${CLASS_LABEL_EN[setupClass]}", using that class's PID/Filter/Rates baseline as the starting point`,
    `Prop load ${propLoad.toFixed(2)}× reference (${debug.motorKV}KV, ${debug.batteryS}S, ${debug.motorCount}${debug.motorCountEstimated ? " (estimated)" : ""} motors) → scales P/D by ${debug.loadBias.toFixed(2)}× and damping (D) by ${debug.dampingBias.toFixed(2)}×`,
    debug.payloadG > 0
      ? `Airframe ${input.weight}g + payload ${debug.payloadG}g = ${totalWeightG}g total vs. this class's reference ${debug.nominalWeightG}g → inertia ${inertia.toFixed(2)}× → adjusts I/grip by ${debug.gripBias.toFixed(2)}×`
      : `Weight ${input.weight}g vs. this class's reference ${debug.nominalWeightG}g → inertia ${inertia.toFixed(2)}× → adjusts I/grip by ${debug.gripBias.toFixed(2)}×`,
    `"${debug.style}" style → adjusts P/D gain (${debug.styleGainP.toFixed(2)}/${debug.styleGainD.toFixed(2)}×) and rate/expo to match this flying style`,
  ];
  const estimatedFields = getEstimatedFieldsEn(result, input);
  if (estimatedFields.length > 0) {
    reasoning.push(`Estimated values used for: ${estimatedFields.join(", ")}`);
  }
  return reasoning;
}

/** Rebuilds the CLI command comment header in English (the `set`/`save`
 * lines themselves are locale-independent Betaflight syntax and are
 * reused as-is from the Thai result — only the leading `#` comments and
 * the date format change). */
export function getCliCommandsEn(result: WizardResult): string[] {
  const { debug, setupClass, confidence } = result;
  const commandLines = result.cliCommands.filter((line) => !line.startsWith("#"));
  const header = [
    `# OBIXCORE Tuning Wizard — ${debug.style.toUpperCase()} ${CLASS_LABEL_EN[setupClass]} (${debug.frameSizeMm}mm)`,
    `# Generated ${new Date().toLocaleDateString("en-US")}`,
    `# Setup class: ${setupClass} · Confidence: ${confidence}% (${toConfidenceLabel(confidence)})`,
    `# Est. hover current: ~${result.estimatedHoverCurrentA.typical}A · Est. avg flight current: ~${result.estimatedFlightCurrentA.typical}A`,
    `#`,
    `# ── PID ─────────────────────────────────────`,
  ];
  // Re-insert the same section-divider comments at the same relative
  // positions as lib/wizard.ts, translated.
  const out: string[] = [...header];
  let inserted = 0;
  for (const line of commandLines) {
    if (line.startsWith("set gyro_lowpass_hz") && inserted === 0) {
      out.push("#", "# ── Filters ─────────────────────────────────");
      inserted = 1;
    }
    if (line.startsWith("set roll_rc_rate") && inserted === 1) {
      out.push("#", "# ── Rates ────────────────────────────────────");
      inserted = 2;
    }
    out.push(line);
  }
  return out;
}
