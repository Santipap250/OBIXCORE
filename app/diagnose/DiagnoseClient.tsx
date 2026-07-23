"use client";
import { useState } from "react";
import { diagnose, type DiagnosisInput, type DiagnosisResult, type CurrentTune, type DiagnosisMetric, type MetricStatus } from "@/lib/diagnosis";
import { DIAGNOSIS_SEVERITY_META } from "@/lib/utils";
import ValueDisplay from "@/components/ValueDisplay";
import CodeBlock from "@/components/CodeBlock";
import CopyButton from "@/components/CopyButton";

const DEFAULT_INPUT: DiagnosisInput = {
  frameSize: 220,
  motorKV: 2306,
  batteryS: 4,
  propSize: 51,
  weight: 320,
  style: "freestyle",
  propBlades: 3,
  motorCount: 4,
};

const STYLE_OPTIONS = [
  { value: "freestyle", label: "Freestyle", labelTh: "บินอิสระ/ท่า" },
  { value: "race", label: "Race", labelTh: "แข่ง/เร็ว" },
  { value: "cinematic", label: "Cinematic", labelTh: "ถ่ายวิดีโอ" },
] as const;

const NOTCH_OPTIONS = ["OFF", "LOW", "MEDIUM", "HIGH"] as const;

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
          type="number" inputMode="decimal" value={value} min={min} max={max} step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 bg-bg-elevated border border-bg-border rounded-lg px-3 py-2.5 text-sm font-mono text-text focus:outline-none focus:border-red-DEFAULT/60 focus:bg-bg-surface transition-colors"
        />
        {unit && <span className="text-xs font-mono text-text-muted w-10 shrink-0">{unit}</span>}
      </div>
    </div>
  );
}

function TextField({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1.5 block">{label}</label>
      <input
        type="text" value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg-elevated border border-bg-border rounded-lg px-3 py-2.5 text-sm font-mono text-text placeholder:text-text-faint focus:outline-none focus:border-red-DEFAULT/60 focus:bg-bg-surface transition-colors"
      />
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest">{title}</h2>
      <div className="flex-1 h-px bg-bg-border" />
    </div>
  );
}

const metricStatusColor: Record<MetricStatus, string> = {
  good: "text-green-DEFAULT",
  watch: "text-amber-DEFAULT",
  bad: "text-red-DEFAULT",
  info: "text-cyan-DEFAULT",
};

function MetricRow({ m }: { m: DiagnosisMetric }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-bg-border last:border-0">
      <div>
        <p className="text-xs font-sarabun text-text-muted">{m.label}</p>
        {m.note && <p className="text-[10px] font-sarabun text-text-faint mt-0.5">{m.note}</p>}
      </div>
      <span className={`text-xs font-mono font-semibold text-right ${metricStatusColor[m.status]}`}>{m.value}</span>
    </div>
  );
}

function scoreColor(v: number): "green" | "amber" | "red" {
  return v >= 80 ? "green" : v >= 60 ? "amber" : "red";
}

export default function DiagnoseClient() {
  const [input, setInput] = useState<DiagnosisInput>(DEFAULT_INPUT);
  const [showOptional, setShowOptional] = useState(false);
  const [showCurrentTune, setShowCurrentTune] = useState(false);
  const [currentTune, setCurrentTune] = useState<CurrentTune>({});
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [step, setStep] = useState<"form" | "result">("form");

  const set = <K extends keyof DiagnosisInput>(key: K, value: DiagnosisInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const handleDiagnose = () => {
    const hasTune = showCurrentTune && (currentTune.pidRollPitch || currentTune.gyroLpf1Hz || currentTune.dTermLpf1Hz || currentTune.ratesRollPitch);
    const r = diagnose({ ...input, currentTune: hasTune ? currentTune : undefined });
    setResult(r);
    setStep("result");
    setTimeout(() => document.getElementById("diag-result-top")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <span className="hud-chip inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-red-DEFAULT">
          <span className="h-1.5 w-1.5 rounded-full bg-red-DEFAULT shadow-[0_0_10px_rgba(255,107,138,0.6)]" />
          ConfigDoctor
        </span>
        <h1 className="mt-3 font-orbitron text-2xl font-bold tracking-tight">
          <span className="gradient-text">วิเคราะห์ปัญหา Build โดรน</span>
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
          วิเคราะห์ build โดรนแบบละเอียด — Health/Safety/Efficiency/Performance/Reliability Score พร้อม warning และคำแนะนำเรียงลำดับความสำคัญ
        </p>
      </div>

      {step === "form" && (
        <div className="space-y-5 animate-fade-in">
          {/* Style selector */}
          <div>
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">สไตล์การบิน</p>
            <div className="grid grid-cols-3 gap-2">
              {STYLE_OPTIONS.map((s) => (
                <button key={s.value} onClick={() => set("style", s.value)} aria-pressed={input.style === s.value}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    input.style === s.value ? "border-red-DEFAULT bg-red-muted text-red-DEFAULT" : "border-bg-border bg-bg-surface text-text-muted hover:bg-bg-elevated"
                  }`}>
                  <p className="text-sm font-orbitron font-semibold">{s.label}</p>
                  <p className="text-[11px] font-sarabun mt-0.5 opacity-80">{s.labelTh}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-bg-border" />

          {/* Core spec */}
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Frame Size" sublabel="มม." value={input.frameSize} min={50} max={900} step={5} unit="mm" onChange={(v) => set("frameSize", v)} />
            <InputField label="Motor KV" value={input.motorKV} min={100} max={30000} step={50} unit="KV" onChange={(v) => set("motorKV", v)} />
            <InputField label="Battery" value={input.batteryS} min={1} max={16} step={1} unit="S" onChange={(v) => set("batteryS", v)} />
            <InputField label="Prop Size" sublabel="×10 นิ้ว" value={input.propSize} min={10} max={200} step={1} unit="in×10" onChange={(v) => set("propSize", v)} />
            <InputField label="Weight (AUW)" value={input.weight} min={10} max={20000} step={5} unit="g" onChange={(v) => set("weight", v)} />
            <InputField label="Prop Blades" value={input.propBlades ?? 3} min={2} max={6} step={1} unit="blades" onChange={(v) => set("propBlades", v as 2|3|4|5|6)} />
            <InputField label="Motor Count" value={input.motorCount ?? 4} min={1} max={8} step={1} unit="pcs" onChange={(v) => set("motorCount", v)} />
          </div>

          {/* Optional fields */}
          <button onClick={() => setShowOptional((v) => !v)} className="w-full text-left flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-bg-border">
            <span className="text-xs font-mono text-text-muted uppercase tracking-wider">ข้อมูลเสริม (แนะนำให้กรอก)</span>
            <svg className={`w-4 h-4 text-text-faint transition-transform ${showOptional ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {showOptional && (
            <div className="space-y-4 p-4 rounded-xl bg-bg-surface border border-bg-border animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Battery mAh" value={input.batteryMah ?? 0} min={0} max={30000} step={50} unit="mAh" onChange={(v) => set("batteryMah", v || undefined)} />
                <InputField label="ESC Rating" value={input.escCurrentRatingA ?? 0} min={0} max={300} step={1} unit="A" onChange={(v) => set("escCurrentRatingA", v || undefined)} />
                <InputField label="Payload" value={input.payloadG ?? 0} min={0} max={20000} step={10} unit="g" onChange={(v) => set("payloadG", v || undefined)} />
                <InputField label="Thrust/Motor" sublabel="ถ้ารู้" value={input.thrustPerMotorG ?? 0} min={0} max={5000} step={10} unit="g" onChange={(v) => set("thrustPerMotorG", v || undefined)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <TextField label="Flight Controller" value={input.fcName ?? ""} placeholder="เช่น Speedybee F405 V4" onChange={(v) => set("fcName", v || undefined)} />
                <TextField label="ESC" value={input.escName ?? ""} placeholder="เช่น 45A 4-in-1" onChange={(v) => set("escName", v || undefined)} />
              </div>
            </div>
          )}

          {/* Current tune */}
          <button onClick={() => setShowCurrentTune((v) => !v)} className="w-full text-left flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-bg-border">
            <div>
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">ค่าที่ใช้อยู่ตอนนี้ (ถ้ามี)</span>
              <p className="text-[10px] font-sarabun text-text-faint mt-0.5">กรอกเพื่อเทียบกับค่าที่แนะนำ — ไม่กรอกก็วิเคราะห์ได้ปกติ</p>
            </div>
            <svg className={`w-4 h-4 text-text-faint transition-transform flex-shrink-0 ${showCurrentTune ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {showCurrentTune && (
            <div className="space-y-4 p-4 rounded-xl bg-bg-surface border border-bg-border animate-fade-in">
              <p className="text-[10px] font-mono text-text-faint uppercase tracking-widest">PID (Roll/Pitch ร่วมกัน)</p>
              <div className="grid grid-cols-4 gap-2">
                {(["p", "i", "d", "f"] as const).map((k) => (
                  <InputField key={k} label={k.toUpperCase()} value={currentTune.pidRollPitch?.[k] ?? 0} min={0} max={300} step={1}
                    onChange={(v) => setCurrentTune((prev) => ({ ...prev, pidRollPitch: { p: 0, i: 0, d: 0, f: 0, ...prev.pidRollPitch, [k]: v } }))} />
                ))}
              </div>
              <p className="text-[10px] font-mono text-text-faint uppercase tracking-widest">PID (Yaw)</p>
              <div className="grid grid-cols-3 gap-2">
                {(["p", "i", "d"] as const).map((k) => (
                  <InputField key={k} label={k.toUpperCase()} value={currentTune.pidYaw?.[k] ?? 0} min={0} max={300} step={1}
                    onChange={(v) => setCurrentTune((prev) => ({ ...prev, pidYaw: { p: 0, i: 0, d: 0, ...prev.pidYaw, [k]: v } }))} />
                ))}
              </div>
              <p className="text-[10px] font-mono text-text-faint uppercase tracking-widest">Filters</p>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Gyro LPF1" value={currentTune.gyroLpf1Hz ?? 0} min={0} max={400} step={5} unit="Hz" onChange={(v) => setCurrentTune((p) => ({ ...p, gyroLpf1Hz: v || undefined }))} />
                <InputField label="D-term LPF" value={currentTune.dTermLpf1Hz ?? 0} min={0} max={300} step={5} unit="Hz" onChange={(v) => setCurrentTune((p) => ({ ...p, dTermLpf1Hz: v || undefined }))} />
              </div>
              <div>
                <p className="text-[10px] font-mono text-text-faint uppercase tracking-widest mb-2">Dynamic Notch</p>
                <div className="flex gap-1.5 flex-wrap">
                  {NOTCH_OPTIONS.map((n) => (
                    <button key={n} onClick={() => setCurrentTune((p) => ({ ...p, dynamicNotch: n }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border ${currentTune.dynamicNotch === n ? "border-red-DEFAULT bg-red-muted text-red-DEFAULT" : "border-bg-border text-text-muted"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[10px] font-mono text-text-faint uppercase tracking-widest">Rates (Roll/Pitch ร่วมกัน)</p>
              <div className="grid grid-cols-3 gap-2">
                <InputField label="RC Rate" value={currentTune.ratesRollPitch?.rc_rate ?? 0} min={0} max={3} step={0.01}
                  onChange={(v) => setCurrentTune((prev) => ({ ...prev, ratesRollPitch: { rc_rate: v, rate: prev.ratesRollPitch?.rate ?? 0, expo: prev.ratesRollPitch?.expo ?? 0 } }))} />
                <InputField label="Rate" value={currentTune.ratesRollPitch?.rate ?? 0} min={0} max={3} step={0.01}
                  onChange={(v) => setCurrentTune((prev) => ({ ...prev, ratesRollPitch: { rc_rate: prev.ratesRollPitch?.rc_rate ?? 0, rate: v, expo: prev.ratesRollPitch?.expo ?? 0 } }))} />
                <InputField label="Expo" value={currentTune.ratesRollPitch?.expo ?? 0} min={0} max={1} step={0.01}
                  onChange={(v) => setCurrentTune((prev) => ({ ...prev, ratesRollPitch: { rc_rate: prev.ratesRollPitch?.rc_rate ?? 0, rate: prev.ratesRollPitch?.rate ?? 0, expo: v } }))} />
              </div>
            </div>
          )}

          <button onClick={handleDiagnose} className="w-full py-3.5 rounded-xl bg-red-DEFAULT text-bg-DEFAULT font-orbitron font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.99] transition-all">
            วิเคราะห์ Build (Diagnose)
          </button>
        </div>
      )}

      {step === "result" && result && (
        <div id="diag-result-top" className="space-y-8 animate-fade-in">
          {/* Summary */}
          <section>
            <SectionHeader title="Summary" />
            <div className="p-4 rounded-xl bg-red-muted/10 border border-red-DEFAULT/20">
              <p className="font-orbitron font-semibold text-sm text-text mb-1">{result.setupClassLabel}</p>
              <p className="text-xs font-sarabun text-text-muted leading-relaxed">{result.summary}</p>
            </div>
            <div className="grid grid-cols-5 gap-2 mt-3">
              <ValueDisplay label="Health" value={result.scores.health} color={scoreColor(result.scores.health)} size="sm" />
              <ValueDisplay label="Safety" value={result.scores.safety} color={scoreColor(result.scores.safety)} size="sm" />
              <ValueDisplay label="Effic." value={result.scores.efficiency} color={scoreColor(result.scores.efficiency)} size="sm" />
              <ValueDisplay label="Perf." value={result.scores.performance} color={scoreColor(result.scores.performance)} size="sm" />
              <ValueDisplay label="Reliab." value={result.scores.reliability} color={scoreColor(result.scores.reliability)} size="sm" />
            </div>
          </section>

          {/* Warnings */}
          <section>
            <SectionHeader title={`Warnings (${result.warnings.length})`} />
            {result.warnings.length === 0 ? (
              <p className="text-xs font-sarabun text-text-muted p-3 rounded-xl bg-green-muted/20 border border-green-DEFAULT/25">ไม่พบปัญหาที่น่ากังวลจาก build นี้</p>
            ) : (
              <div className="space-y-2">
                {result.warnings.map((w) => {
                  const sev = DIAGNOSIS_SEVERITY_META[w.severity];
                  return (
                    <div key={w.id} className="p-3 rounded-xl bg-bg-surface border border-bg-border">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-orbitron font-semibold text-text">{w.title}</p>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${sev.classes}`}>{sev.label}</span>
                      </div>
                      <p className="text-[10px] font-mono text-text-faint uppercase tracking-wider mb-1.5">{w.category}</p>
                      <p className="text-xs font-sarabun text-text-muted leading-relaxed mb-1.5">{w.description}</p>
                      <p className="text-xs font-sarabun text-cyan-DEFAULT leading-relaxed">&#8594; {w.recommendation}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Recommendations */}
          <section>
            <SectionHeader title="Recommendations" />
            <div className="space-y-2">
              {result.recommendations.map((r) => (
                <div key={r.priority} className="p-3 rounded-xl bg-purple-muted/10 border border-purple-DEFAULT/25">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-purple-DEFAULT/40 bg-purple-muted text-purple-DEFAULT">Priority {r.priority}</span>
                    <p className="text-sm font-orbitron font-semibold text-text">{r.title}</p>
                  </div>
                  <p className="text-xs font-sarabun text-text-muted leading-relaxed mb-1">{r.reason}</p>
                  <p className="text-xs font-sarabun text-cyan-DEFAULT leading-relaxed">&#8594; {r.action}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Power System */}
          <section>
            <SectionHeader title="Power System" />
            <div className="p-4 rounded-xl bg-bg-surface border border-bg-border">
              {result.powerSystem.map((m, i) => <MetricRow key={i} m={m} />)}
            </div>
          </section>

          {/* Flight Characteristics */}
          <section>
            <SectionHeader title="Flight Characteristics" />
            <div className="p-4 rounded-xl bg-bg-surface border border-bg-border">
              {result.flightCharacteristics.map((m, i) => <MetricRow key={i} m={m} />)}
            </div>
          </section>

          {/* Mechanical Compatibility */}
          <section>
            <SectionHeader title="Mechanical Compatibility" />
            <div className="p-4 rounded-xl bg-bg-surface border border-bg-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-sarabun text-text-muted">Overall</span>
                <span className="text-xs font-mono font-semibold" style={{ color: result.mechanicalCompatibility.checks[0]?.color }}>
                  {result.mechanicalCompatibility.overallLabel} ({result.mechanicalCompatibility.score}/100)
                </span>
              </div>
              {result.mechanicalCompatibility.checks.map((c, i) => (
                <div key={i} className="py-2 border-t border-bg-border first:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-sarabun text-text-muted">{c.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border" style={{ color: c.color, borderColor: c.color }}>{c.levelLabel}</span>
                  </div>
                  <p className="text-[11px] font-sarabun text-text-faint leading-relaxed">{c.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* PID Analysis */}
          <section>
            <SectionHeader title="PID Analysis" />
            <div className="p-4 rounded-xl bg-bg-surface border border-bg-border">
              {result.pidAnalysis.metrics.map((m, i) => <MetricRow key={i} m={m} />)}
            </div>
          </section>

          {/* Filter Analysis */}
          <section>
            <SectionHeader title="Filter Analysis" />
            <div className="p-4 rounded-xl bg-bg-surface border border-bg-border">
              {result.filterAnalysis.metrics.map((m, i) => <MetricRow key={i} m={m} />)}
            </div>
          </section>

          {/* Rates Analysis */}
          <section>
            <SectionHeader title="Rates Analysis" />
            <div className="p-4 rounded-xl bg-bg-surface border border-bg-border">
              {result.ratesAnalysis.metrics.map((m, i) => <MetricRow key={i} m={m} />)}
            </div>
          </section>

          {/* CLI Suggestions */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest">CLI Suggestions</h2>
              <CopyButton text={result.cliSuggestions.join("\n")} label="Copy CLI" size="sm" />
            </div>
            <CodeBlock lines={result.cliSuggestions} title="configdoctor.txt" maxHeight="320px" />
          </section>

          <button onClick={() => setStep("form")} className="w-full py-3 rounded-xl border border-bg-border text-text-muted font-mono text-sm hover:bg-bg-elevated transition-colors">
            ← วิเคราะห์ build อื่น
          </button>
        </div>
      )}
    </div>
  );
}
