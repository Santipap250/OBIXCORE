// lib/utils.ts

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ─── Shared numeric helpers ───────────────────────────────
// Used by lib/wizard.ts and lib/estimation.ts so every calculator
// in the app clamps/rounds the same way.

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function round(value: number, decimals = 0): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

/** Guards a user-entered number against NaN/zero/negative before it's used
 * as a divisor or exponent base elsewhere in the calculation chain. */
export function safeNumber(value: number, fallback: number, min = 0.0001, max = Infinity): number {
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return clamp(value, min, max);
}

export function formatRange(low: number, high: number, decimals = 1): string {
  if (Math.abs(low - high) < 10 ** -decimals * 1.5) return low.toFixed(decimals);
  return `${low.toFixed(decimals)}–${high.toFixed(decimals)}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const success = document.execCommand("copy");
    document.body.removeChild(el);
    return success;
  }
}

export function formatNumber(n: number, decimals = 1): string {
  return n.toFixed(decimals);
}

export const FRAME_SIZE_LABELS: Record<string, string> = {
  "2inch": "2\"",
  "3inch": "3\"",
  "5inch": "5\"",
  "7inch": "7\"+",
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "text-green-DEFAULT border-green-DEFAULT bg-green-muted",
  intermediate: "text-amber-DEFAULT border-amber-DEFAULT bg-amber-muted",
  advanced: "text-red-DEFAULT border-red-DEFAULT bg-red-muted",
};

export const STYLE_COLORS: Record<string, string> = {
  race: "text-red-DEFAULT border-red-DEFAULT bg-red-muted",
  freestyle: "text-purple-DEFAULT border-purple-DEFAULT bg-purple-muted",
  cinematic: "text-blue-DEFAULT border-blue-DEFAULT bg-blue-muted",
  beginner: "text-green-DEFAULT border-green-DEFAULT bg-green-muted",
};

export const SEVERITY_COLORS: Record<string, string> = {
  low: "text-green-DEFAULT",
  medium: "text-amber-DEFAULT",
  high: "text-red-DEFAULT",
};

// ─── Unified status metadata ──────────────────────────────
// Single source of truth for label + color classes so Wizard,
// Calculator, Presets, and Problems all render the same badge for
// the same underlying value instead of each page re-deriving its own.

export interface StatusMeta {
  label: string;
  classes: string;
}

export const STYLE_META: Record<string, StatusMeta> = {
  race: { label: "Race", classes: "text-red-DEFAULT border-red-DEFAULT/40 bg-red-muted" },
  freestyle: { label: "Freestyle", classes: "text-purple-DEFAULT border-purple-DEFAULT/40 bg-purple-muted" },
  cinematic: { label: "Cinematic", classes: "text-blue-DEFAULT border-blue-DEFAULT/40 bg-blue-muted" },
  beginner: { label: "Beginner", classes: "text-green-DEFAULT border-green-DEFAULT/40 bg-green-muted" },
};

export const DIFFICULTY_META: Record<string, StatusMeta> = {
  beginner: { label: "มือใหม่", classes: "text-green-DEFAULT border-green-DEFAULT/40 bg-green-muted" },
  intermediate: { label: "กลาง", classes: "text-amber-DEFAULT border-amber-DEFAULT/40 bg-amber-muted" },
  advanced: { label: "ขั้นสูง", classes: "text-red-DEFAULT border-red-DEFAULT/40 bg-red-muted" },
};

export const SEVERITY_META: Record<string, StatusMeta> = {
  high: { label: "ด่วน", classes: "text-red-DEFAULT bg-red-muted border-red-DEFAULT/40" },
  medium: { label: "ปานกลาง", classes: "text-amber-DEFAULT bg-amber-muted border-amber-DEFAULT/40" },
  low: { label: "ต่ำ", classes: "text-green-DEFAULT bg-green-muted border-green-DEFAULT/40" },
};

/** Confidence band shown by the Tuning Wizard and any other scored result. */
export type ConfidenceLabel = "Low" | "Medium" | "High";

export const CONFIDENCE_META: Record<ConfidenceLabel, StatusMeta> = {
  High: { label: "High", classes: "text-green-DEFAULT border-green-DEFAULT/40 bg-green-muted" },
  Medium: { label: "Medium", classes: "text-amber-DEFAULT border-amber-DEFAULT/40 bg-amber-muted" },
  Low: { label: "Low", classes: "text-red-DEFAULT border-red-DEFAULT/40 bg-red-muted" },
};

export function confidenceLabel(score: number): ConfidenceLabel {
  if (score >= 80) return "High";
  if (score >= 60) return "Medium";
  return "Low";
}
