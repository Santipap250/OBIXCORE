"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { calculateTuning } from "@/lib/wizard";
import { recommendPresets } from "@/lib/presetRecommender";
import PageHeader from "@/components/PageHeader";
import LanguageSwitch from "@/components/LanguageSwitch";
import presetsData from "@/data/presets.json";
import type { WizardInput, WizardResult, Preset } from "@/types";
import { CONFIDENCE_META } from "@/lib/utils";
import ValueDisplay from "@/components/ValueDisplay";
import CodeBlock from "@/components/CodeBlock";
import CopyButton from "@/components/CopyButton";
import { getProfile, profileToWizardInput } from "@/lib/droneProfile";
import { getWarningsEn, getTipsEn, getReasoningEn, getSummaryEn, getEstimatedFieldsEn, getCliCommandsEn } from "@/lib/i18n/wizardMessagesEn";

const presets = presetsData as unknown as Preset[];

const DEFAULT_INPUT: WizardInput = {
  frameSize: 220,
  motorKV: 2306,
  batteryS: 4,
  propSize: 51,
  weight: 320,
  style: "freestyle",
  propBlades: 3,
  motorCount: 4,
};

const STYLE_OPTIONS_TH = [
  { value: "freestyle", label: "Freestyle", labelTh: "บินอิสระ/ท่า", color: "purple" },
  { value: "race",      label: "Race",      labelTh: "แข่ง/เร็ว",    color: "red" },
  { value: "cinematic", label: "Cinematic", labelTh: "ถ่ายวิดีโอ",   color: "blue" },
] as const;

const STYLE_OPTIONS_EN = [
  { value: "freestyle", label: "Freestyle", labelTh: "Flips & flow", color: "purple" },
  { value: "race",      label: "Race",      labelTh: "Fast & direct", color: "red" },
  { value: "cinematic", label: "Cinematic", labelTh: "Smooth video",  color: "blue" },
] as const;

const BLADE_OPTIONS = [2, 3, 4, 5, 6] as const;

const SETUP_LABELS: Record<WizardResult["setupClass"], string> = {
  micro: "Micro / Tiny Whoop",
  cinewhoop: "Cinewhoop / Toothpick",
  freestyle: "Freestyle 5\"",
  racing: "Racing 5\"",
  longrange: "Long Range 7\"–9\"",
  heavylift: "Heavy Lifter 10\"+",
};

const MOTOR_COUNT_OPTIONS = [2, 3, 4, 6, 8] as const;

const STRINGS = {
  th: {
    badge: "Tuning Wizard",
    title: "ตั้งค่า PID อัตโนมัติ",
    subtitle: "กรอกสเปกโดรน → ได้ค่า PID / Filter / Rates พร้อม CLI command + ความมั่นใจของคำแนะนำ",
    profileLoaded: (name: string) => `โหลดสเปกจากโปรไฟล์ "${name}" แล้ว`,
    styleOptions: STYLE_OPTIONS_TH,
    styleLabel: "สไตล์การบิน",
    frameSublabel: "ขนาด frame (มม.)",
    motorSublabel: "KV rating ของมอเตอร์",
    batterySublabel: "จำนวน cell (1S–12S)",
    propSublabel: 'ขนาด prop (x10) — 12=1.2" ... 140=14"',
    weightLabel: "Weight (AUW)",
    weightSublabel: "น้ำหนักลำ+แบต+กล้อง (ไม่รวม payload ที่แขวนเพิ่ม)",
    bladesLabel: "จำนวนใบพัด",
    bladeSuffix: "-blade",
    motorCountLabel: "จำนวนมอเตอร์",
    advancedToggle: "ตัวเลือกเพิ่มเติม (Battery mAh / ESC / Payload)",
    batteryCapLabel: "Battery Cap.",
    batteryCapSublabel: "ความจุแบต (ไม่บังคับ)",
    escRatingLabel: "ESC Rating",
    escRatingSublabel: "กระแสสูงสุด ESC ต่อตัว (ไม่บังคับ)",
    payloadLabel: "Payload",
    payloadSublabel: "น้ำหนัก payload ที่แขวนเพิ่ม (ไม่บังคับ, สำหรับ Heavy Lifter)",
    advancedNote: "ใส่ Battery Capacity เพื่อประมาณเวลาบิน, ESC Rating เพื่อเช็ก headroom, และ Payload สำหรับโดรนที่แบกของ — เว้นว่างได้ถ้าไม่ทราบ ระบบจะใช้ค่าประมาณแทน",
    ctaButton: "⚡ คำนวณค่าจูน",
    ctaNote: "ค่าที่ได้เป็นจุดเริ่มต้น — ควร fine-tune ตามโดรนจริง",
    backButton: "แก้ไขข้อมูล",
    specLabel: "สเปก:",
    whyThisTuning: "Why this tuning",
    estimateFieldsLabel: "ค่าที่ใช้เป็นค่าประมาณ (Estimate)",
    recommendedPresets: "Preset ที่แนะนำ",
    matchLabel: "Match",
    viewPreset: "ดู preset นี้",
    estimatedPower: "Estimated Power",
    hoverCurrent: "Hover Current",
    avgFlightCurrent: "Avg Flight Current",
    flightTime: "Est. Flight Time",
    estimateNote: "* ประมาณการจากแรงขับที่ต้องใช้ลอยตัวจริง (น้ำหนัก/prop/แรงดัน) — ไม่ใช้ค่าตายตัว ใส่ Battery Capacity ในตัวเลือกเพิ่มเติมเพื่อดูเวลาบิน",
    pidValues: "PID Values",
    filters: "Filters",
    rpmFilterOn: "ON (ต้องการ Bidirectional DSHOT)",
    rates: "Rates (Actual)",
    cliTitle: "Betaflight CLI",
    copyAllNote: "copy ทั้งหมด วางใน CLI",
    tips: "Tips",
    recalcButton: "← คำนวณใหม่",
    setupLabels: SETUP_LABELS,
  },
  en: {
    badge: "Tuning Wizard",
    title: "Auto PID Tuning",
    subtitle: "Enter your drone specs → get PID / Filter / Rates with CLI commands + a confidence score",
    profileLoaded: (name: string) => `Loaded specs from profile "${name}"`,
    styleOptions: STYLE_OPTIONS_EN,
    styleLabel: "Flying Style",
    frameSublabel: "Frame size (mm)",
    motorSublabel: "Motor KV rating",
    batterySublabel: "Cell count (1S–12S)",
    propSublabel: 'Prop size (x10) — 12=1.2" ... 140=14"',
    weightLabel: "Weight (AUW)",
    weightSublabel: "All-up weight incl. battery/camera (not including any extra payload)",
    bladesLabel: "Prop Blade Count",
    bladeSuffix: "-blade",
    motorCountLabel: "Motor Count",
    advancedToggle: "Advanced options (Battery mAh / ESC / Payload)",
    batteryCapLabel: "Battery Cap.",
    batteryCapSublabel: "Battery capacity (optional)",
    escRatingLabel: "ESC Rating",
    escRatingSublabel: "Max current per ESC (optional)",
    payloadLabel: "Payload",
    payloadSublabel: "Extra payload weight (optional, for Heavy Lifter)",
    advancedNote: "Add Battery Capacity to estimate flight time, ESC Rating to check headroom, and Payload for a drone carrying cargo — leave blank if unknown, estimates will be used instead",
    ctaButton: "⚡ CALCULATE TUNING",
    ctaNote: "These values are a starting point — fine-tune against your real drone",
    backButton: "Edit Specs",
    specLabel: "Spec:",
    whyThisTuning: "Why this tuning",
    estimateFieldsLabel: "Values Used as Estimates",
    recommendedPresets: "Recommended Presets",
    matchLabel: "Match",
    viewPreset: "View this preset",
    estimatedPower: "Estimated Power",
    hoverCurrent: "Hover Current",
    avgFlightCurrent: "Avg Flight Current",
    flightTime: "Est. Flight Time",
    estimateNote: "* Estimated from the thrust needed for real hover (weight/prop/voltage) — not a fixed value. Add Battery Capacity in advanced options to see flight time.",
    pidValues: "PID Values",
    filters: "Filters",
    rpmFilterOn: "ON (requires Bidirectional DSHOT)",
    rates: "Rates (Actual)",
    cliTitle: "Betaflight CLI",
    copyAllNote: "copy all, paste into CLI",
    tips: "Tips",
    recalcButton: "← Recalculate",
    setupLabels: SETUP_LABELS,
  },
};

function InputField({
  label, sublabel, value, min, max, step = 1, unit, onChange,
}: {
  label: string; sublabel?: string; value: number; min: number; max: number; step?: number; unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs font-mono text-text-muted uppercase tracking-wider">{label}</label>
        {sublabel && <span className="text-[10px] text-text-faint font-sarabun">{sublabel}</span>}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 bg-bg-elevated border border-bg-border rounded-lg px-3 py-2.5 text-sm font-mono text-text focus:outline-none focus:border-green-DEFAULT/60 focus:bg-bg-surface transition-colors"
        />
        {unit && <span className="text-xs font-mono text-text-muted w-8 shrink-0">{unit}</span>}
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-2 h-1 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: "#00e87a" }}
      />
    </div>
  );
}

export default function WizardClient({ locale = "th" }: { locale?: "th" | "en" }) {
  const t = STRINGS[locale];
  const searchParams = useSearchParams();
  const [input, setInput] = useState<WizardInput>(DEFAULT_INPUT);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState<WizardResult | null>(null);
  const [step, setStep] = useState<"form" | "result">("form");
  const [loadedProfileName, setLoadedProfileName] = useState<string | null>(null);

  useEffect(() => {
    const profileId = searchParams.get("profile");
    if (!profileId) return;
    const profile = getProfile(profileId);
    if (!profile) return;
    setInput(profileToWizardInput(profile));
    setLoadedProfileName(profile.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (key: keyof WizardInput, value: number | string) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const handleCalculate = () => {
    const r = calculateTuning(input);
    setResult(r);
    setStep("result");
    setTimeout(() => {
      document.getElementById("result-top")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const presetMatches = useMemo(() => {
    if (!result) return [];
    return recommendPresets(input, result, presets, 2, locale);
  }, [input, result, locale]);

  // Locale-aware derived text — lib/wizard.ts's calculation is 100%
  // unchanged; only which *text* we read differs (see
  // lib/i18n/wizardMessagesEn.ts for how the English side is derived from
  // the same computed numbers instead of duplicating any math).
  const summaryText = result ? (locale === "en" ? getSummaryEn(result.setupClass) : result.summary) : "";
  const reasoningText = result ? (locale === "en" ? getReasoningEn(result, input) : result.reasoning) : [];
  const warningsText = result ? (locale === "en" ? getWarningsEn(result, input) : result.warnings) : [];
  const tipsText = result ? (locale === "en" ? getTipsEn(result, input) : result.tips) : [];
  const estimatedFieldsText = result ? (locale === "en" ? getEstimatedFieldsEn(result, input) : result.estimatedFields) : [];
  const cliCommandsText = result ? (locale === "en" ? getCliCommandsEn(result) : result.cliCommands) : [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-4 flex justify-end">
        <LanguageSwitch enHref="/en/wizard" />
      </div>

      {/* Header */}
      <PageHeader
        accent="green"
        badge={t.badge}
        title={t.title}
        subtitle={t.subtitle}
      />

      {step === "form" && (
        <div className="space-y-5 animate-fade-in">
          {loadedProfileName && (
            <div className="flex items-center gap-2 rounded-xl border border-blue-DEFAULT/25 bg-blue-muted/40 px-3 py-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-blue-DEFAULT">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="font-sarabun text-xs text-blue-DEFAULT">{t.profileLoaded(loadedProfileName)}</span>
            </div>
          )}
          {/* Style selector */}
          <div>
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">{t.styleLabel}</p>
            <div className="grid grid-cols-3 gap-2">
              {t.styleOptions.map((s) => (
                <button
                  key={s.value}
                  onClick={() => set("style", s.value)}
                  aria-pressed={input.style === s.value}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    input.style === s.value
                      ? s.value === "race"
                        ? "border-red-DEFAULT bg-red-muted text-red-DEFAULT"
                        : s.value === "cinematic"
                        ? "border-blue-DEFAULT bg-blue-muted text-blue-DEFAULT"
                        : "border-purple-DEFAULT bg-purple-muted text-purple-DEFAULT"
                      : "border-bg-border bg-bg-surface text-text-muted hover:border-bg-border hover:bg-bg-elevated"
                  }`}
                >
                  <p className="text-sm font-orbitron font-semibold">{s.label}</p>
                  <p className="text-[11px] font-sarabun mt-0.5 opacity-80">{s.labelTh}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-bg-border" />

          {/* Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Frame Size"
              sublabel={t.frameSublabel}
              value={input.frameSize}
              min={50} max={900} step={5} unit="mm"
              onChange={(v) => set("frameSize", v)}
            />
            <InputField
              label="Motor KV"
              sublabel={t.motorSublabel}
              value={input.motorKV}
              min={300} max={30000} step={50} unit="KV"
              onChange={(v) => set("motorKV", v)}
            />
            <InputField
              label="Battery"
              sublabel={t.batterySublabel}
              value={input.batteryS}
              min={1} max={12} step={1} unit="S"
              onChange={(v) => set("batteryS", v)}
            />
            <InputField
              label="Prop Size"
              sublabel={t.propSublabel}
              value={input.propSize}
              min={12} max={180} step={1} unit={'×0.1"'}
              onChange={(v) => set("propSize", v)}
            />
          </div>
          <InputField
            label={t.weightLabel}
            sublabel={t.weightSublabel}
            value={input.weight}
            min={20} max={20000} step={10} unit="g"
            onChange={(v) => set("weight", v)}
          />

          {/* Prop blades */}
          <div>
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">{t.bladesLabel}</p>
            <div className="grid grid-cols-3 gap-2">
              {BLADE_OPTIONS.map((b) => (
                <button
                  key={b}
                  onClick={() => set("propBlades", b)}
                  aria-pressed={input.propBlades === b}
                  className={`py-2.5 rounded-xl border text-sm font-mono transition-all ${
                    input.propBlades === b
                      ? "border-green-DEFAULT bg-green-muted text-green-DEFAULT font-semibold"
                      : "border-bg-border bg-bg-surface text-text-muted hover:bg-bg-elevated"
                  }`}
                >
                  {b}{t.bladeSuffix}
                </button>
              ))}
            </div>
          </div>

          {/* Motor count */}
          <div>
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">{t.motorCountLabel}</p>
            <div className="grid grid-cols-5 gap-2">
              {MOTOR_COUNT_OPTIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => set("motorCount", m)}
                  aria-pressed={(input.motorCount ?? 4) === m}
                  className={`py-2.5 rounded-xl border text-sm font-mono transition-all ${
                    (input.motorCount ?? 4) === m
                      ? "border-green-DEFAULT bg-green-muted text-green-DEFAULT font-semibold"
                      : "border-bg-border bg-bg-surface text-text-muted hover:bg-bg-elevated"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced toggle */}
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            aria-expanded={showAdvanced}
            className="flex items-center gap-2 text-xs font-mono text-text-muted hover:text-green-DEFAULT transition-colors"
          >
            <svg className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {t.advancedToggle}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-bg-elevated border border-bg-border animate-fade-in">
              <InputField
                label={t.batteryCapLabel}
                sublabel={t.batteryCapSublabel}
                value={input.batteryMah ?? 0}
                min={0} max={30000} step={50} unit="mAh"
                onChange={(v) => set("batteryMah", v || (undefined as unknown as number))}
              />
              <InputField
                label={t.escRatingLabel}
                sublabel={t.escRatingSublabel}
                value={input.escCurrentRatingA ?? 0}
                min={0} max={300} step={5} unit="A"
                onChange={(v) => set("escCurrentRatingA", v || (undefined as unknown as number))}
              />
              <InputField
                label={t.payloadLabel}
                sublabel={t.payloadSublabel}
                value={input.payloadG ?? 0}
                min={0} max={15000} step={50} unit="g"
                onChange={(v) => set("payloadG", v || (undefined as unknown as number))}
              />
              <p className="col-span-2 text-[10px] text-text-faint font-sarabun">
                {t.advancedNote}
              </p>
            </div>
          )}

          {/* Summary strip */}
          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-bg-elevated border border-bg-border">
            {[
              { label: "Frame", value: `${input.frameSize}mm` },
              { label: "Motor", value: `${input.motorKV}KV` },
              { label: "Battery", value: `${input.batteryS}S` },
              { label: "Prop", value: `${(input.propSize / 10).toFixed(1)}\"` },
              { label: "AUW", value: `${input.weight}g` },
              ...(input.payloadG ? [{ label: "Payload", value: `${input.payloadG}g` }] : []),
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-text-faint uppercase">{s.label}</span>
                <span className="text-xs font-mono text-green-DEFAULT font-semibold">{s.value}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleCalculate}
            className="w-full py-4 rounded-xl bg-green-DEFAULT text-bg-DEFAULT font-orbitron font-bold text-sm tracking-widest hover:bg-green-dim active:scale-[0.99] transition-all glow-green"
          >
            {t.ctaButton}
          </button>

          <p className="text-center text-[11px] text-text-faint font-sarabun">
            {t.ctaNote}
          </p>
        </div>
      )}

      {step === "result" && result && (
        <div className="space-y-6 animate-slide-up" id="result-top">
          {/* Back button */}
          <button
            onClick={() => setStep("form")}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            {t.backButton}
          </button>

          {/* Config badge */}
          <div className="p-3 rounded-xl bg-bg-elevated border border-bg-border flex flex-wrap gap-3 items-center">
            <span className="text-[10px] font-mono text-text-faint uppercase tracking-wider">{t.specLabel}</span>
            <span className="text-xs font-mono text-green-DEFAULT">
              {input.frameSize}mm · {input.motorKV}KV · {input.batteryS}S · {(input.propSize/10).toFixed(1)}" · {input.propBlades ?? 3}-blade ·{" "}
              {result.totalWeightG}g{input.payloadG ? ` (${input.weight}g + ${input.payloadG}g payload)` : ""}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
              input.style === "race" ? "bg-red-muted text-red-DEFAULT"
              : input.style === "cinematic" ? "bg-blue-muted text-blue-DEFAULT"
              : "bg-purple-muted text-purple-DEFAULT"
            }`}>{input.style}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-bg-border text-text-muted">
              {t.setupLabels[result.setupClass]}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${CONFIDENCE_META[result.confidenceLabel].classes}`}>
              Confidence: {result.confidenceLabel} ({result.confidence}%)
            </span>
          </div>

          <div className="p-3 rounded-xl border border-blue-DEFAULT/20 bg-blue-muted/15">
            <p className="text-[10px] font-mono text-blue-DEFAULT uppercase tracking-widest mb-1">{t.whyThisTuning}</p>
            <p className="text-xs font-sarabun text-text leading-relaxed mb-3">{summaryText}</p>
            <ul className="space-y-1.5">
              {reasoningText.map((r, i) => (
                <li key={i} className="flex gap-2 text-[11px] font-sarabun text-text-muted leading-relaxed">
                  <span className="text-blue-DEFAULT flex-shrink-0">→</span>
                  {r}
                </li>
              ))}
            </ul>
            {estimatedFieldsText.length > 0 && (
              <div className="mt-3 pt-3 border-t border-blue-DEFAULT/15">
                <p className="text-[10px] font-mono text-text-faint uppercase tracking-widest mb-1">{t.estimateFieldsLabel}</p>
                <ul className="space-y-1">
                  {estimatedFieldsText.map((f, i) => (
                    <li key={i} className="text-[11px] font-sarabun text-text-faint leading-relaxed">• {f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recommended presets */}
          {presetMatches.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest">{t.recommendedPresets}</h2>
                <div className="flex-1 h-px bg-bg-border" />
              </div>
              <div className="space-y-2">
                {presetMatches.map(({ preset, matchScore, reasons }) => (
                  <div key={preset.id} className="p-3 rounded-xl bg-purple-muted/15 border border-purple-DEFAULT/25">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <p className="font-orbitron font-semibold text-sm text-text">{preset.name}</p>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-purple-DEFAULT/40 bg-purple-muted text-purple-DEFAULT shrink-0">
                        {t.matchLabel} {matchScore}%
                      </span>
                    </div>
                    <ul className="space-y-1 mb-2.5">
                      {reasons.map((r, i) => (
                        <li key={i} className="flex gap-2 text-[11px] font-sarabun text-text-muted leading-relaxed">
                          <span className="text-purple-DEFAULT flex-shrink-0">→</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/presets?highlight=${preset.id}`}
                        className="flex-1 text-center text-xs font-mono py-2 rounded-lg border border-purple-DEFAULT/40 text-purple-DEFAULT hover:bg-purple-muted/40 transition-colors"
                      >
                        {t.viewPreset}
                      </Link>
                      <CopyButton text={preset.cliCommands.join("\n")} label="Copy CLI" size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Estimated current / flight time */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest">{t.estimatedPower}</h2>
              <div className="flex-1 h-px bg-bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ValueDisplay
                label={t.hoverCurrent}
                value={result.estimatedHoverCurrentA.typical.toFixed(1)}
                unit="A"
                color="blue"
                size="sm"
                range={{ low: result.estimatedHoverCurrentA.low, high: result.estimatedHoverCurrentA.high, decimals: 1 }}
              />
              <ValueDisplay
                label={t.avgFlightCurrent}
                value={result.estimatedFlightCurrentA.typical.toFixed(1)}
                unit="A"
                color="amber"
                size="sm"
                range={{ low: result.estimatedFlightCurrentA.low, high: result.estimatedFlightCurrentA.high, decimals: 1 }}
              />
            </div>
            {result.estimatedFlightTimeMin && (
              <div className="mt-2">
                <ValueDisplay
                  label={t.flightTime}
                  value={result.estimatedFlightTimeMin.typical.toFixed(1)}
                  unit="min"
                  color="green"
                  size="sm"
                  range={{ low: result.estimatedFlightTimeMin.low, high: result.estimatedFlightTimeMin.high, decimals: 1 }}
                />
              </div>
            )}
            <p className="text-[10px] text-text-faint font-sarabun mt-2">
              {t.estimateNote}
            </p>
          </section>

          {/* Warnings */}
          {warningsText.length > 0 && (
            <div className="space-y-2">
              {warningsText.map((w, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-amber-muted border border-amber-DEFAULT/30">
                  <span className="text-amber-DEFAULT text-sm mt-0.5 flex-shrink-0">⚠</span>
                  <p className="text-xs font-sarabun text-amber-DEFAULT leading-relaxed">{w}</p>
                </div>
              ))}
            </div>
          )}

          {/* PID Values */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest">{t.pidValues}</h2>
              <div className="flex-1 h-px bg-bg-border" />
            </div>
            <div className="space-y-3">
              {(["roll", "pitch", "yaw"] as const).map((axis) => {
                const pid = result.pid[axis];
                const color = axis === "roll" ? "green" : axis === "pitch" ? "cyan" : "amber";
                return (
                  <div key={axis} className="p-3 rounded-xl bg-bg-surface border border-bg-border">
                    <p className="text-[10px] font-mono text-text-faint uppercase tracking-widest mb-2">{axis}</p>
                    <div className="flex gap-2 flex-wrap">
                      <ValueDisplay label="P" value={pid.p} color={color} size="sm" />
                      <ValueDisplay label="I" value={pid.i} color={color} size="sm" />
                      <ValueDisplay label="D" value={pid.d} color={color} size="sm" />
                      {"f" in pid && <ValueDisplay label="F" value={(pid as any).f} color={color} size="sm" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Filters */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest">{t.filters}</h2>
              <div className="flex-1 h-px bg-bg-border" />
            </div>
            <div className="p-3 rounded-xl bg-bg-surface border border-bg-border">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Gyro LPF1", value: result.filters.gyroLpf1Hz, unit: "Hz", color: "blue" as const },
                  { label: "Gyro LPF2", value: result.filters.gyroLpf2Hz, unit: "Hz", color: "blue" as const },
                  { label: "D-Term LPF", value: result.filters.dTermLpf1Hz, unit: "Hz", color: "cyan" as const },
                  { label: "Dyn Notch", value: result.filters.dynamicNotch, color: "purple" as const },
                ].map((f) => (
                  <ValueDisplay key={f.label} label={f.label} value={f.value} unit={f.unit} color={f.color} size="sm" />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${result.filters.rpmFilter ? "bg-green-DEFAULT" : "bg-red-DEFAULT"}`} />
                <span className="text-xs font-mono text-text-muted">
                  RPM Filter: <span className={result.filters.rpmFilter ? "text-green-DEFAULT" : "text-red-DEFAULT"}>
                    {result.filters.rpmFilter ? t.rpmFilterOn : "OFF"}
                  </span>
                </span>
              </div>
            </div>
          </section>

          {/* Rates */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest">{t.rates}</h2>
              <div className="flex-1 h-px bg-bg-border" />
            </div>
            <div className="p-3 rounded-xl bg-bg-surface border border-bg-border space-y-2">
              {(["roll", "pitch", "yaw"] as const).map((axis) => {
                const r = result.rates[axis];
                return (
                  <div key={axis} className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-text-faint uppercase w-10">{axis}</span>
                    <div className="flex-1 flex gap-1 flex-wrap">
                      {[
                        { k: "RC Rate", v: r.rc_rate },
                        { k: "Rate", v: r.rate },
                        { k: "Expo", v: r.expo },
                      ].map((item) => (
                        <span key={item.k} className="text-[11px] font-mono bg-bg-elevated border border-bg-border rounded px-2 py-0.5 text-text">
                          <span className="text-text-faint">{item.k}: </span>
                          <span className="text-amber-DEFAULT">{item.v}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CLI Commands */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest">{t.cliTitle}</h2>
              <div className="flex-1 h-px bg-bg-border" />
              <span className="text-[10px] text-text-faint font-sarabun">{t.copyAllNote}</span>
            </div>
            <CodeBlock lines={cliCommandsText} title="betaflight_cli.txt" />
          </section>

          {/* Tips */}
          {tipsText.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest">{t.tips}</h2>
                <div className="flex-1 h-px bg-bg-border" />
              </div>
              <div className="space-y-2">
                {tipsText.map((tip, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-blue-muted border border-blue-DEFAULT/20">
                    <span className="text-blue-DEFAULT text-sm flex-shrink-0">💡</span>
                    <p className="text-xs font-sarabun text-blue-DEFAULT leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recalculate */}
          <button
            onClick={() => setStep("form")}
            className="w-full py-3 rounded-xl bg-bg-elevated border border-bg-border text-text-muted font-sarabun text-sm hover:bg-bg-surface transition-all"
          >
            {t.recalcButton}
          </button>
        </div>
      )}
    </div>
  );
}
