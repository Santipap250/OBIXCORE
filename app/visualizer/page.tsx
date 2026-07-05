"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { DroneSpec, FrameSize, CompatibilityLevel } from "@/lib/droneSpec";
import {
  computeCompatibility,
  VISUAL_PRESETS,
  frameSizeToMm,
  compatColor,
  compatLabel,
  frameMmToSize,
} from "@/lib/droneSpec";
import {
  estimateHoverCurrentA,
  estimateAverageFlightCurrentA,
  estimateFlightTimeMinutes,
  estimatePeakCurrentA,
  twrRating,
  estimateLoadedRpm,
} from "@/lib/estimation";

// Dynamic import for DroneView (heavy SVG canvas)
const DroneView = dynamic(() => import("@/components/DroneView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[280px] items-center justify-center rounded-2xl bg-bg-elevated">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-DEFAULT/20 border-t-cyan-DEFAULT" />
        <span className="text-xs font-mono text-text-faint">กำลังโหลด 3D Viewer…</span>
      </div>
    </div>
  ),
});

// ── Default spec (5" freestyle) ────────────────────────────
const DEFAULT_SPEC: DroneSpec = {
  frameSize: "5inch",
  frameMm: 230,
  propIn: 5.1,
  propBlades: 3,
  motorKV: 2306,
  batteryS: 4,
  batteryMah: 1500,
  weightG: 450,
  style: "freestyle",
  escCurrentA: 45,
};

// ── Small shared components ────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <p className="text-xs font-mono text-text-muted uppercase tracking-widest shrink-0">{children}</p>
      <div className="flex-1 h-px bg-bg-border" />
    </div>
  );
}

function CompatBadge({ level }: { level: CompatibilityLevel }) {
  const color = compatColor(level);
  const label = compatLabel(level);
  const bgAlpha = level === "perfect" ? "20" : level === "incompatible" ? "25" : "18";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.2em]"
      style={{ color, borderColor: color + "50", backgroundColor: color + bgAlpha }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function NumberInput({
  label, value, min, max, step = 1, unit, onChange,
}: {
  label: string; value: number; min: number; max: number;
  step?: number; unit?: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{label}</p>
        {unit && <span className="text-[10px] font-mono text-text-faint">{unit}</span>}
      </div>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-bg-elevated border border-bg-border rounded-lg px-3 py-2 text-sm font-mono text-text focus:outline-none focus:border-cyan-DEFAULT/60 transition-colors"
      />
    </div>
  );
}

function StatBox({
  label, value, unit, color = "#46f0b8", sub,
}: {
  label: string; value: string; unit?: string; color?: string; sub?: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border px-3 py-3 text-center"
      style={{ borderColor: color + "35", backgroundColor: color + "12" }}
    >
      <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-text-muted mb-1">{label}</span>
      <div className="flex items-baseline gap-0.5">
        <span className="text-xl font-orbitron font-bold" style={{ color }}>{value}</span>
        {unit && <span className="text-xs font-mono opacity-70" style={{ color }}>{unit}</span>}
      </div>
      {sub && <span className="mt-0.5 text-[9px] font-mono text-text-faint">{sub}</span>}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────
export default function VisualizerPage() {
  const [spec, setSpec] = useState<DroneSpec>(DEFAULT_SPEC);
  const [activePreset, setActivePreset] = useState<string | null>("freestyle-5in");
  const [reducedMotion, setReducedMotion] = useState(false);

  const compatibility = useMemo(() => computeCompatibility(spec), [spec]);

  // Physics estimates
  const physics = useMemo(() => {
    const hover = estimateHoverCurrentA({
      weightG: spec.weightG,
      motorCount: 4,
      propDiameterIn: spec.propIn,
      bladeCount: spec.propBlades,
      motorKV: spec.motorKV,
      batteryS: spec.batteryS,
    });
    const flight = estimateAverageFlightCurrentA(hover, spec.style);
    const flightTime = spec.batteryMah
      ? estimateFlightTimeMinutes(spec.batteryMah, flight)
      : null;

    // TWR estimate for the visualizer badge. `hover`/`flight` above are
    // already whole-aircraft figures (estimateHoverCurrentA sums all
    // motors internally) — an earlier version of this calc multiplied
    // hover.high by 4 again assuming it was per-motor, which quietly
    // inflated the implied electrical power 4x. Fixed by reusing
    // estimatePeakCurrentA (the same full-throttle/punch estimate the
    // Wizard uses for its ESC headroom check) so this stays a real
    // whole-aircraft power figure, then converting to thrust with a
    // community-reported g/W efficiency (≈4.5–8 g/W for typical FPV
    // motor+prop combos; 5.5 is the center of that band).
    const voltage = spec.batteryS * 3.7;
    const loadedRpm = estimateLoadedRpm(spec.motorKV, spec.batteryS).loadedRpm;
    const peakCurrentA = estimatePeakCurrentA(flight, spec.style);
    const peakPowerW = peakCurrentA * voltage;
    const thrustG = peakPowerW * 5.5;
    const twr = thrustG / spec.weightG;
    const twrMeta = twrRating(twr);

    return { hover, flight, flightTime, twr: Math.min(twr, 18), twrMeta };
  }, [spec]);

  function updateSpec(patch: Partial<DroneSpec>) {
    setSpec(prev => {
      const next = { ...prev, ...patch };
      // Keep frameMm in sync with frameSize
      if (patch.frameSize) next.frameMm = frameSizeToMm(patch.frameSize);
      return next;
    });
    setActivePreset(null);
  }

  function loadPreset(presetId: string) {
    const p = VISUAL_PRESETS.find(vp => vp.id === presetId);
    if (!p) return;
    setSpec(p.spec);
    setActivePreset(presetId);
  }

  const compatC = compatColor(compatibility.overall);

  return (
    <div className="page-shell py-6">
      {/* ── Header ── */}
      <div className="hud-card rounded-[1.75rem] p-5 mb-4 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 color-strip" />
        <div className="absolute -right-12 top-8 h-36 w-36 rounded-full bg-purple-DEFAULT/8 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-purple-DEFAULT/40 bg-purple-muted/40">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b491ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="2" /><circle cx="4" cy="4" r="2" /><circle cx="20" cy="4" r="2" />
                  <circle cx="4" cy="20" r="2" /><circle cx="20" cy="20" r="2" />
                  <line x1="6" y1="4" x2="10" y2="4" /><line x1="14" y1="4" x2="18" y2="4" />
                  <line x1="6" y1="20" x2="10" y2="20" /><line x1="14" y1="20" x2="18" y2="20" />
                  <line x1="4" y1="6" x2="4" y2="10" /><line x1="4" y1="14" x2="4" y2="18" />
                  <line x1="20" y1="6" x2="20" y2="10" /><line x1="20" y1="14" x2="20" y2="18" />
                </svg>
              </span>
              <h1 className="font-orbitron text-lg font-bold tracking-[0.3em] text-text">
                BUILD VISUALIZER
              </h1>
            </div>
            <p className="text-sm text-text-muted">
              ตรวจสอบ compatibility และ preview โดรน FPV ของคุณแบบ interactive
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setReducedMotion(r => !r)}
              className={`hud-chip px-3 py-1.5 text-[10px] font-mono tracking-[0.2em] transition-colors ${
                reducedMotion ? "text-amber-DEFAULT border-amber-DEFAULT/40 bg-amber-muted/30" : "text-text-muted"
              }`}
            >
              {reducedMotion ? "MOTION OFF" : "MOTION ON"}
            </button>
            <CompatBadge level={compatibility.overall} />
          </div>
        </div>
      </div>

      {/* ── Preset row ── */}
      <div className="mb-4">
        <SectionLabel>Preset Templates</SectionLabel>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {VISUAL_PRESETS.map(p => (
            <button
              key={p.id}
              onClick={() => loadPreset(p.id)}
              className={`group rounded-2xl border p-3 text-left transition-all ${
                activePreset === p.id
                  ? "border-opacity-60 bg-opacity-15"
                  : "border-bg-border bg-bg-surface hover:border-opacity-40 hover:bg-bg-elevated"
              }`}
              style={
                activePreset === p.id
                  ? { borderColor: p.accentColor + "80", backgroundColor: p.accentColor + "18" }
                  : {}
              }
            >
              <div
                className="mb-1.5 text-[10px] font-mono uppercase tracking-[0.22em] font-bold"
                style={{ color: activePreset === p.id ? p.accentColor : undefined }}
              >
                {p.name}
              </div>
              <div className="text-[10px] text-text-faint leading-relaxed line-clamp-2">{p.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main layout: Viewer + Controls ── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">

        {/* Left: 3D Preview + Stats */}
        <div className="flex flex-col gap-4">

          {/* Drone Viewer */}
          <div className="hud-card rounded-[1.75rem] p-4 overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none rounded-[1.75rem]"
              style={{ boxShadow: `inset 0 0 60px ${compatC}08` }}
            />

            <div className="relative">
              <DroneView
                spec={spec}
                overallLevel={compatibility.overall}
                reducedMotion={reducedMotion}
              />
            </div>

            {/* Visual tags */}
            <div className="mt-3 flex flex-wrap gap-2 border-t border-bg-border pt-3">
              {compatibility.visualTags.map((tag, i) => (
                <span key={i} className="hud-chip px-2.5 py-1 text-[10px] font-mono tracking-[0.18em] text-text-muted">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Compatibility Score */}
          <div className="hud-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
                Compatibility Score
              </span>
              <CompatBadge level={compatibility.overall} />
            </div>

            {/* Score bar */}
            <div className="h-2 rounded-full bg-bg-elevated overflow-hidden mb-3">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${compatibility.score}%`,
                  background: `linear-gradient(90deg, ${compatC}80, ${compatC})`,
                  boxShadow: `0 0 10px ${compatC}50`,
                }}
              />
            </div>

            {/* Check rows */}
            <div className="space-y-2">
              {compatibility.checks.map((check, i) => {
                const c = compatColor(check.level);
                return (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl border border-bg-border bg-bg-elevated/50 px-3 py-2">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: c }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">{check.label}</span>
                        <span className="text-[9px] font-mono uppercase tracking-wider shrink-0" style={{ color: c }}>
                          {compatLabel(check.level)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-text-faint leading-relaxed font-sarabun">{check.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Physics Stats */}
          <div className="hud-card rounded-2xl p-4">
            <SectionLabel>Physics Estimates</SectionLabel>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatBox
                label="Hover A"
                value={physics.hover.typical.toFixed(1)}
                unit="A"
                color="#46f0b8"
                sub={`${physics.hover.low.toFixed(1)}–${physics.hover.high.toFixed(1)}A`}
              />
              <StatBox
                label="Avg Flight A"
                value={physics.flight.typical.toFixed(1)}
                unit="A"
                color="#63b3ff"
                sub={`${physics.flight.low.toFixed(1)}–${physics.flight.high.toFixed(1)}A`}
              />
              <StatBox
                label="TWR"
                value={physics.twr.toFixed(1)}
                unit="×"
                color={physics.twrMeta.color === "green" ? "#46f0b8" : physics.twrMeta.color === "amber" ? "#ffd166" : "#ff6b8a"}
                sub={physics.twrMeta.label}
              />
              <StatBox
                label="Flight Time"
                value={physics.flightTime ? physics.flightTime.typical.toFixed(1) : "—"}
                unit={physics.flightTime ? "min" : ""}
                color="#b491ff"
                sub={
                  physics.flightTime
                    ? `${physics.flightTime.low.toFixed(1)}–${physics.flightTime.high.toFixed(1)} min`
                    : "กรอก mAh"
                }
              />
            </div>
            <p className="mt-3 text-[10px] font-mono text-text-faint">
              * ค่าที่แสดงเป็นการประมาณการ ± ขึ้นอยู่กับมอเตอร์จริง, อุณหภูมิ และสไตล์การบิน
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex flex-col gap-4">
          <div className="hud-card rounded-[1.75rem] p-5">

            <SectionLabel>Frame &amp; Props</SectionLabel>
            <div className="space-y-4">
              {/* Frame size selector */}
              <div>
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1.5">Frame Size</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["2inch", "3inch", "5inch", "7inch"] as FrameSize[]).map(fs => (
                    <button
                      key={fs}
                      onClick={() => updateSpec({ frameSize: fs })}
                      className={`rounded-xl border py-2 text-[10px] font-mono uppercase tracking-wider transition-all ${
                        spec.frameSize === fs
                          ? "border-cyan-DEFAULT/60 bg-green-muted/25 text-cyan-DEFAULT"
                          : "border-bg-border bg-bg-elevated text-text-muted hover:border-cyan-DEFAULT/30"
                      }`}
                    >
                      {fs.replace("inch", "\"")}
                    </button>
                  ))}
                </div>
              </div>

              <NumberInput
                label="Prop Size (inch)"
                value={spec.propIn}
                min={1.5}
                max={9}
                step={0.1}
                unit="in"
                onChange={v => updateSpec({ propIn: v })}
              />

              {/* Prop blades */}
              <div>
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1.5">Prop Blades</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {([2, 3, 4] as const).map(b => (
                    <button
                      key={b}
                      onClick={() => updateSpec({ propBlades: b })}
                      className={`rounded-xl border py-2 text-[10px] font-mono transition-all ${
                        spec.propBlades === b
                          ? "border-cyan-DEFAULT/60 bg-cyan-muted/25 text-cyan-DEFAULT"
                          : "border-bg-border bg-bg-elevated text-text-muted hover:border-cyan-DEFAULT/30"
                      }`}
                    >
                      {b}-blade
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <SectionLabel>Motor &amp; Power</SectionLabel>
            <div className="space-y-4">
              <NumberInput
                label="Motor KV"
                value={spec.motorKV}
                min={200}
                max={6000}
                step={50}
                unit="KV"
                onChange={v => updateSpec({ motorKV: v })}
              />

              {/* Battery S */}
              <div>
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1.5">Battery S-Count</p>
                <div className="grid grid-cols-5 gap-1">
                  {([2, 3, 4, 5, 6] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => updateSpec({ batteryS: s })}
                      className={`rounded-xl border py-2 text-[10px] font-mono transition-all ${
                        spec.batteryS === s
                          ? "border-amber-DEFAULT/60 bg-amber-muted/30 text-amber-DEFAULT"
                          : "border-bg-border bg-bg-elevated text-text-muted hover:border-amber-DEFAULT/30"
                      }`}
                    >
                      {s}S
                    </button>
                  ))}
                </div>
              </div>

              <NumberInput
                label="Battery mAh (optional)"
                value={spec.batteryMah ?? 0}
                min={0}
                max={10000}
                step={100}
                unit="mAh"
                onChange={v => updateSpec({ batteryMah: v > 0 ? v : undefined })}
              />

              <NumberInput
                label="ESC Current Rating"
                value={spec.escCurrentA ?? 0}
                min={0}
                max={120}
                step={5}
                unit="A"
                onChange={v => updateSpec({ escCurrentA: v > 0 ? v : undefined })}
              />
            </div>

            <SectionLabel>Build &amp; Style</SectionLabel>
            <div className="space-y-4">
              {/* Style selector */}
              <div>
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1.5">Flight Style</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["race", "freestyle", "cinematic"] as const).map(s => {
                    const colors = {
                      race: { active: "border-red-DEFAULT/60 bg-red-muted/25 text-red-DEFAULT", hover: "hover:border-red-DEFAULT/30" },
                      freestyle: { active: "border-purple-DEFAULT/60 bg-purple-muted/25 text-purple-DEFAULT", hover: "hover:border-purple-DEFAULT/30" },
                      cinematic: { active: "border-blue-DEFAULT/60 bg-blue-muted/25 text-blue-DEFAULT", hover: "hover:border-blue-DEFAULT/30" },
                    }[s];
                    return (
                      <button
                        key={s}
                        onClick={() => updateSpec({ style: s })}
                        className={`rounded-xl border py-2 text-[10px] font-mono capitalize transition-all ${
                          spec.style === s
                            ? colors.active
                            : `border-bg-border bg-bg-elevated text-text-muted ${colors.hover}`
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <NumberInput
                label="Total Weight (AUW)"
                value={spec.weightG}
                min={50}
                max={2000}
                step={10}
                unit="g"
                onChange={v => updateSpec({ weightG: v })}
              />
            </div>

            {/* Reset */}
            <div className="mt-5 border-t border-bg-border pt-4">
              <button
                onClick={() => { setSpec(DEFAULT_SPEC); setActivePreset("freestyle-5in"); }}
                className="w-full rounded-xl border border-bg-border bg-bg-elevated py-2.5 text-[11px] font-mono uppercase tracking-widest text-text-muted transition-all hover:border-cyan-DEFAULT/30 hover:text-cyan-DEFAULT active:scale-[0.98]"
              >
                Reset to Default
              </button>
            </div>
          </div>

          {/* Quick tips panel */}
          <div className="hud-panel rounded-2xl p-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-text-faint mb-2">
              Build Tips
            </p>
            <div className="space-y-2 text-[11px] font-sarabun text-text-muted leading-relaxed">
              {compatibility.checks.filter(c => c.level !== "perfect").length === 0 ? (
                <p className="text-cyan-DEFAULT/80">✓ Build นี้ดูสมบูรณ์ ทุก component เข้ากันได้ดี</p>
              ) : (
                compatibility.checks
                  .filter(c => c.level !== "perfect")
                  .map((c, i) => (
                    <p key={i}>
                      <span style={{ color: compatColor(c.level) }}>▸ {c.label}:</span>{" "}
                      {c.note}
                    </p>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
