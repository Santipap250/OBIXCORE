"use client";
import { useState } from "react";
import { analyzeStepResponse } from "@/lib/blackbox";
import type { BlackboxObservations, BlackboxResult, BlackboxFinding } from "@/lib/blackbox";
import { CONFIDENCE_META } from "@/lib/utils";
import CodeBlock from "@/components/CodeBlock";

const DEFAULT_INPUT: BlackboxObservations = {
  style: "freestyle",
  overshoot: "none",
  oscillation: "none",
  propwash: "none",
  motorHeat: "cool",
  filterFeel: "balanced",
  bounceBack: false,
};

const STYLE_OPTIONS = [
  { value: "freestyle", label: "Freestyle", labelTh: "บินอิสระ/ท่า" },
  { value: "race", label: "Race", labelTh: "แข่ง/เร็ว" },
  { value: "cinematic", label: "Cinematic", labelTh: "ถ่ายวิดีโอ" },
] as const;

const OVERSHOOT_OPTIONS = [
  { value: "none", label: "ไม่มี", labelTh: "หยุดนิ่งพอดีหลัง step" },
  { value: "slight", label: "เล็กน้อย", labelTh: "แกว่งเลยนิดหน่อย" },
  { value: "large", label: "ชัดเจน", labelTh: "แกว่งเลยเห็นชัด" },
] as const;

const OSCILLATION_OPTIONS = [
  { value: "none", label: "ไม่มี", labelTh: "นิ่งดี" },
  { value: "fast_tight", label: "ถี่/แน่น", labelTh: "สั่นเร็ว ๆ (buzzy)" },
  { value: "slow_wobble", label: "ช้า/โยก", labelTh: "โยกช้า ๆ (wobble)" },
] as const;

const PROPWASH_OPTIONS = [
  { value: "none", label: "ไม่มี", labelTh: "" },
  { value: "mild", label: "เล็กน้อย", labelTh: "" },
  { value: "severe", label: "หนัก", labelTh: "" },
] as const;

const FILTER_FEEL_OPTIONS = [
  { value: "sharp", label: "ไวจัด", labelTh: "มี noise/สั่นมือ" },
  { value: "balanced", label: "กำลังดี", labelTh: "" },
  { value: "mushy", label: "หน่วง", labelTh: "มูฟช้า/นุ่มไป" },
] as const;

const MOTOR_HEAT_OPTIONS = [
  { value: "cool", label: "ปกติ", labelTh: "" },
  { value: "warm", label: "อุ่น", labelTh: "" },
  { value: "hot", label: "ร้อนจัด", labelTh: "หรือมีกลิ่นไหม้" },
] as const;

const severityStyle: Record<BlackboxFinding["severity"], { box: string; icon: string }> = {
  critical: { box: "bg-red-muted border-red-DEFAULT/30 text-red-DEFAULT", icon: "⛔" },
  warn: { box: "bg-amber-muted border-amber-DEFAULT/30 text-amber-DEFAULT", icon: "⚠" },
  info: { box: "bg-blue-muted border-blue-DEFAULT/20 text-blue-DEFAULT", icon: "ℹ" },
};

function OptionGrid<T extends string>({
  label,
  options,
  value,
  onChange,
  columns = 3,
}: {
  label: string;
  options: readonly { value: T; label: string; labelTh: string }[];
  value: T;
  onChange: (v: T) => void;
  columns?: 2 | 3;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-text-muted">{label}</label>
      <div className={`grid gap-2 ${columns === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={`rounded-xl border p-2.5 text-center transition-all ${
              value === opt.value
                ? "border-pink-DEFAULT bg-pink-muted text-pink-DEFAULT"
                : "border-bg-border bg-bg-elevated text-text-muted hover:border-pink-DEFAULT/30"
            }`}
          >
            <div className="font-orbitron text-[13px] font-semibold">{opt.label}</div>
            {opt.labelTh && <div className="mt-0.5 text-[10px] font-sarabun opacity-80">{opt.labelTh}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function BlackboxClient() {
  const [input, setInput] = useState<BlackboxObservations>(DEFAULT_INPUT);
  const [result, setResult] = useState<BlackboxResult | null>(null);
  const [step, setStep] = useState<"form" | "result">("form");

  const set = <K extends keyof BlackboxObservations>(key: K, value: BlackboxObservations[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const handleAnalyze = () => {
    const r = analyzeStepResponse(input);
    setResult(r);
    setStep("result");
    setTimeout(() => {
      document.getElementById("blackbox-result-top")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <span className="hud-chip inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-pink-DEFAULT">
          <span className="h-1.5 w-1.5 rounded-full bg-pink-DEFAULT shadow-[0_0_10px_rgba(255,95,183,0.6)]" />
          Blackbox / Step-Response
        </span>
        <h1 className="mt-3 font-orbitron text-2xl font-bold tracking-tight">
          <span className="gradient-text">Step-Response Reader</span>
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
          ไม่มี Blackbox log ก็วิเคราะห์ได้ — ตอบคำถามว่าโดรนคุณ &quot;รู้สึก&quot; ยังไงตอนบิน
          แล้วรับคำแนะนำ PID/filter delta พร้อมคำสั่ง CLI
        </p>
      </div>

      {step === "form" && (
        <div className="space-y-5">
          <OptionGrid label="สไตล์การบิน" options={STYLE_OPTIONS} value={input.style} onChange={(v) => set("style", v)} />
          <OptionGrid label="Overshoot หลัง step (กระตุกคันบังคับแรง ๆ)" options={OVERSHOOT_OPTIONS} value={input.overshoot} onChange={(v) => set("overshoot", v)} />
          <OptionGrid label="ลักษณะการสั่น" options={OSCILLATION_OPTIONS} value={input.oscillation} onChange={(v) => set("oscillation", v)} />
          <OptionGrid label="Propwash หลังบินเร็ว/ลงเร็ว" options={PROPWASH_OPTIONS} value={input.propwash} onChange={(v) => set("propwash", v)} />
          <OptionGrid label="ความรู้สึกตอนบิน (filter feel)" options={FILTER_FEEL_OPTIONS} value={input.filterFeel} onChange={(v) => set("filterFeel", v)} />
          <OptionGrid label="อุณหภูมิมอเตอร์หลังบิน" options={MOTOR_HEAT_OPTIONS} value={input.motorHeat} onChange={(v) => set("motorHeat", v)} />

          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-text-muted">
              มีอาการ &quot;เด้งกลับ&quot; หลัง punch-out หรือดิ่งเร็วไหม
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: false, label: "ไม่มี" },
                { v: true, label: "มี" },
              ].map((opt) => (
                <button
                  key={String(opt.v)}
                  type="button"
                  onClick={() => set("bounceBack", opt.v)}
                  aria-pressed={input.bounceBack === opt.v}
                  className={`rounded-xl border p-2.5 text-center font-orbitron text-[13px] font-semibold transition-all ${
                    input.bounceBack === opt.v
                      ? "border-pink-DEFAULT bg-pink-muted text-pink-DEFAULT"
                      : "border-bg-border bg-bg-elevated text-text-muted hover:border-pink-DEFAULT/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            className="w-full rounded-xl bg-pink-DEFAULT py-4 font-orbitron text-sm font-bold tracking-widest text-bg-DEFAULT transition-all hover:opacity-90 active:scale-[0.99]"
          >
            🔍 วิเคราะห์ Step Response
          </button>

          <p className="text-center text-[11px] font-sarabun text-text-faint">
            เครื่องมือนี้เป็น rule-based ตอบจากความรู้สึกของนักบิน ไม่ใช่การอ่าน Blackbox log จริง
          </p>
        </div>
      )}

      {step === "result" && result && (
        <div id="blackbox-result-top" className="animate-slide-up space-y-6">
          <button
            onClick={() => setStep("form")}
            className="flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            แก้ไขคำตอบ
          </button>

          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-bg-border bg-bg-elevated p-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-faint">อาการ:</span>
            <span className="text-xs font-mono text-pink-DEFAULT">
              {input.style} · overshoot:{input.overshoot} · osc:{input.oscillation} · propwash:{input.propwash}
            </span>
            <span className={`rounded border px-2 py-0.5 font-mono text-[10px] ${CONFIDENCE_META[result.confidenceLabel].classes}`}>
              Confidence: {result.confidenceLabel} ({result.confidence}%)
            </span>
          </div>

          <div className="rounded-xl border border-pink-DEFAULT/20 bg-pink-muted/15 p-3">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-pink-DEFAULT">Summary</p>
            <p className="font-sarabun text-xs leading-relaxed text-text">{result.summary}</p>
          </div>

          {/* Findings */}
          {result.findings.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted">Findings</h2>
                <div className="h-px flex-1 bg-bg-border" />
              </div>
              <div className="space-y-2">
                {result.findings.map((f, i) => (
                  <div key={i} className={`flex gap-3 rounded-xl border p-3 ${severityStyle[f.severity].box}`}>
                    <span className="mt-0.5 flex-shrink-0 text-sm">{severityStyle[f.severity].icon}</span>
                    <p className="font-sarabun text-xs leading-relaxed">{f.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hardware warnings (critical, e.g. motor heat) */}
          {result.warnings.length > 0 && (
            <div className="space-y-2">
              {result.warnings.map((w, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-red-DEFAULT/30 bg-red-muted p-3">
                  <span className="mt-0.5 flex-shrink-0 text-sm text-red-DEFAULT">⛔</span>
                  <p className="font-sarabun text-xs leading-relaxed text-red-DEFAULT">{w}</p>
                </div>
              ))}
            </div>
          )}

          {/* PID delta */}
          <section>
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted">PID Delta (% จากค่าปัจจุบัน)</h2>
              <div className="h-px flex-1 bg-bg-border" />
            </div>
            <div className="space-y-3">
              {(["roll", "pitch", "yaw"] as const).map((axis) => {
                const d = result.pidDelta[axis];
                const fmt = (n: number) => (n === 0 ? "0" : n > 0 ? `+${n}%` : `${n}%`);
                return (
                  <div key={axis} className="rounded-xl border border-bg-border bg-bg-surface p-3">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-text-faint">{axis}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-lg border border-bg-border bg-bg-elevated px-3 py-1.5 font-mono text-xs text-text">
                        P <span className="text-pink-DEFAULT">{fmt(d.p)}</span>
                      </span>
                      <span className="rounded-lg border border-bg-border bg-bg-elevated px-3 py-1.5 font-mono text-xs text-text">
                        I <span className="text-pink-DEFAULT">{fmt(d.i)}</span>
                      </span>
                      <span className="rounded-lg border border-bg-border bg-bg-elevated px-3 py-1.5 font-mono text-xs text-text">
                        D <span className="text-pink-DEFAULT">{fmt(d.d)}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Filter delta */}
          <section>
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted">Filter Delta</h2>
              <div className="h-px flex-1 bg-bg-border" />
            </div>
            <div className="rounded-xl border border-bg-border bg-bg-surface p-3">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg border border-bg-border bg-bg-elevated px-3 py-1.5 font-mono text-xs text-text">
                  Gyro LPF{" "}
                  <span className="text-pink-DEFAULT">
                    {result.filterDelta.gyroLowpassHz === 0 ? "ไม่ต้องแก้" : `${result.filterDelta.gyroLowpassHz > 0 ? "+" : ""}${result.filterDelta.gyroLowpassHz} Hz`}
                  </span>
                </span>
                <span className="rounded-lg border border-bg-border bg-bg-elevated px-3 py-1.5 font-mono text-xs text-text">
                  D-Term LPF{" "}
                  <span className="text-pink-DEFAULT">
                    {result.filterDelta.dtermLowpassHz === 0 ? "ไม่ต้องแก้" : `${result.filterDelta.dtermLowpassHz > 0 ? "+" : ""}${result.filterDelta.dtermLowpassHz} Hz`}
                  </span>
                </span>
              </div>
              {result.filterDelta.addNotch && result.filterDelta.notchNote && (
                <p className="mt-3 font-sarabun text-[12px] leading-relaxed text-text-muted">
                  <span className="text-purple-DEFAULT">Dynamic Notch:</span> {result.filterDelta.notchNote}
                </p>
              )}
            </div>
          </section>

          {/* CLI */}
          {result.cliCommands.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted">Betaflight CLI</h2>
                <div className="h-px flex-1 bg-bg-border" />
                <span className="text-[10px] font-sarabun text-text-faint">แทน [ค่าปัจจุบัน] ด้วยเลขจริงจากโดรนคุณ</span>
              </div>
              <CodeBlock lines={result.cliCommands} title="blackbox_suggestions.txt" />
            </section>
          )}

          {/* Tips */}
          {result.tips.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted">Tips</h2>
                <div className="h-px flex-1 bg-bg-border" />
              </div>
              <div className="space-y-2">
                {result.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 rounded-xl border border-blue-DEFAULT/20 bg-blue-muted p-3">
                    <span className="flex-shrink-0 text-sm text-blue-DEFAULT">💡</span>
                    <p className="font-sarabun text-xs leading-relaxed text-blue-DEFAULT">{tip}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <button
            onClick={() => setStep("form")}
            className="w-full rounded-xl border border-bg-border bg-bg-elevated py-3 font-sarabun text-sm text-text-muted transition-all hover:bg-bg-surface"
          >
            ← วิเคราะห์ใหม่
          </button>
        </div>
      )}
    </div>
  );
}
