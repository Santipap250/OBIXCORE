"use client";
import { useMemo, useState } from "react";
import {
  estimateHoverCurrentA,
  estimateAverageFlightCurrentA,
  estimateFlightTimeMinutes,
  estimateLoadedRpm,
  twrRating,
  type FlightStyle,
} from "@/lib/estimation";
import { safeNumber } from "@/lib/utils";
import ValueDisplay from "@/components/ValueDisplay";

type CalcMode = "flighttime" | "twr" | "props";

const MODES: { value: CalcMode; label: string; labelTh: string; color: string }[] = [
  { value: "flighttime", label: "Flight Time", labelTh: "เวลาบิน",        color: "blue" },
  { value: "twr",        label: "Thrust/Weight", labelTh: "อัตราแรงขับ",  color: "green" },
  { value: "props",      label: "Prop Matcher", labelTh: "จับคู่ Prop",   color: "cyan" },
];

const STYLE_OPTIONS: { value: FlightStyle; label: string; labelTh: string }[] = [
  { value: "freestyle", label: "Freestyle", labelTh: "บินอิสระ" },
  { value: "race", label: "Race", labelTh: "แข่ง" },
  { value: "cinematic", label: "Cinematic", labelTh: "ถ่ายวิดีโอ" },
];

const BLADE_OPTIONS = [2, 3, 4] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <p className="text-xs font-mono text-text-muted uppercase tracking-widest">{children}</p>
      <div className="flex-1 h-px bg-bg-border" />
    </div>
  );
}

function NumberInput({ label, sublabel, value, min, max, step = 1, unit, onChange }: {
  label: string; sublabel?: string; value: number; min: number; max: number; step?: number; unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <p className="text-xs font-mono text-text-muted uppercase tracking-wider">{label}</p>
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
          className="flex-1 bg-bg-elevated border border-bg-border rounded-lg px-3 py-2.5 text-sm font-mono text-text focus:outline-none focus:border-blue-DEFAULT/60 transition-colors"
        />
        {unit && <span className="text-xs font-mono text-text-muted w-12 shrink-0">{unit}</span>}
      </div>
    </div>
  );
}

function StyleToggle({ value, onChange }: { value: FlightStyle; onChange: (v: FlightStyle) => void }) {
  return (
    <div>
      <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1.5">สไตล์การบิน</p>
      <div className="grid grid-cols-3 gap-1.5">
        {STYLE_OPTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => onChange(s.value)}
            aria-pressed={value === s.value}
            className={`py-2 rounded-lg text-[11px] font-mono border transition-all ${
              value === s.value
                ? "border-blue-DEFAULT/60 bg-blue-muted text-blue-DEFAULT font-semibold"
                : "border-bg-border text-text-muted hover:bg-bg-elevated"
            }`}
          >
            {s.labelTh}
          </button>
        ))}
      </div>
    </div>
  );
}

function BladeToggle({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1.5">จำนวนใบพัด</p>
      <div className="grid grid-cols-3 gap-1.5">
        {BLADE_OPTIONS.map((b) => (
          <button
            key={b}
            onClick={() => onChange(b)}
            aria-pressed={value === b}
            className={`py-2 rounded-lg text-[11px] font-mono border transition-all ${
              value === b
                ? "border-blue-DEFAULT/60 bg-blue-muted text-blue-DEFAULT font-semibold"
                : "border-bg-border text-text-muted hover:bg-bg-elevated"
            }`}
          >
            {b}-blade
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Flight Time Calculator ───────────────────────────────
// Current/flight-time math now comes from lib/estimation.ts — the exact
// same physics the Tuning Wizard uses — so the two tools never disagree.
function FlightTimeCalc() {
  const [batteryMah, setBatteryMah] = useState(1500);
  const [batteryS, setBatteryS] = useState(4);
  const [motorKV, setMotorKV] = useState(2306);
  const [motorCount, setMotorCount] = useState(4);
  const [propSize, setPropSize] = useState(51);
  const [propBlades, setPropBlades] = useState(3);
  const [weight, setWeight] = useState(420);
  const [style, setStyle] = useState<FlightStyle>("freestyle");

  const estimate = useMemo(() => {
    const hoverA = estimateHoverCurrentA({
      weightG: weight,
      motorCount,
      propDiameterIn: propSize / 10,
      bladeCount: propBlades,
      motorKV,
      batteryS,
    });
    const avgA = estimateAverageFlightCurrentA(hoverA, style);
    const flightMin = estimateFlightTimeMinutes(batteryMah, avgA);
    const wh = (batteryMah / 1000) * (batteryS * 3.7);
    return { hoverA, avgA, flightMin, wh };
  }, [batteryMah, batteryS, motorKV, motorCount, propSize, propBlades, weight, style]);

  const ratingColor: "green" | "amber" | "red" =
    estimate.flightMin.typical >= 5 ? "green" : estimate.flightMin.typical >= 3 ? "amber" : "red";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <NumberInput label="Battery" sublabel="ความจุ" value={batteryMah} min={300} max={6000} step={50} unit="mAh" onChange={setBatteryMah} />
        <NumberInput label="Cells" sublabel="จำนวน Cell" value={batteryS} min={2} max={6} step={1} unit="S" onChange={setBatteryS} />
        <NumberInput label="Motor KV" sublabel="KV rating" value={motorKV} min={1000} max={4000} step={50} unit="KV" onChange={setMotorKV} />
        <NumberInput label="Motors" sublabel="จำนวนมอเตอร์" value={motorCount} min={1} max={8} step={1} unit="pcs" onChange={setMotorCount} />
        <NumberInput label="Prop Size" sublabel="ขนาด (x10)" value={propSize} min={20} max={75} step={1} unit={'×0.1"'} onChange={setPropSize} />
        <NumberInput label="Weight (AUW)" sublabel="รวม payload" value={weight} min={20} max={2500} step={10} unit="g" onChange={setWeight} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StyleToggle value={style} onChange={setStyle} />
        <BladeToggle value={propBlades} onChange={setPropBlades} />
      </div>

      <SectionLabel>ผลลัพธ์โดยประมาณ</SectionLabel>

      <div className="grid grid-cols-3 gap-2">
        <ValueDisplay
          label="Flight"
          value={estimate.flightMin.typical.toFixed(1)}
          unit="min"
          color={ratingColor}
          size="md"
          range={{ low: estimate.flightMin.low, high: estimate.flightMin.high, decimals: 1 }}
        />
        <ValueDisplay
          label="Avg Current"
          value={estimate.avgA.typical.toFixed(1)}
          unit="A"
          color="blue"
          size="md"
          range={{ low: estimate.avgA.low, high: estimate.avgA.high, decimals: 1 }}
        />
        <ValueDisplay label="Wh" value={estimate.wh.toFixed(1)} unit="Wh" color="cyan" size="md" />
      </div>

      <div className="p-3 rounded-xl bg-bg-elevated border border-bg-border">
        <div className="flex justify-between text-xs font-mono mb-2">
          <span className="text-text-faint">เวลาบินโดยประมาณ (ตัวเลขกลางของช่วง)</span>
          <span className={`font-semibold ${ratingColor === "green" ? "text-green-DEFAULT" : ratingColor === "amber" ? "text-amber-DEFAULT" : "text-red-DEFAULT"}`}>
            {estimate.flightMin.typical >= 5 ? "✓ ดี" : estimate.flightMin.typical >= 3 ? "~ พอใช้" : "✗ สั้น"}
          </span>
        </div>
        <div className="h-2 bg-bg-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${ratingColor === "green" ? "bg-green-DEFAULT" : ratingColor === "amber" ? "bg-amber-DEFAULT" : "bg-red-DEFAULT"}`}
            style={{ width: `${Math.min(100, (estimate.flightMin.typical / 10) * 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-text-faint font-sarabun mt-2">
          * ประมาณการจากแรงขับที่ต้องใช้ลอยตัว (น้ำหนัก/prop/แรงดัน) คูณตัวคูณ throttle ตามสไตล์การบิน — กระแสและเวลาบินจริงต่างกันได้ตามมอเตอร์/ESC/อุณหภูมิ ใช้ช่วงตัวเลขด้านล่างค่าหลักเป็นกรอบคร่าวๆ
        </p>
      </div>
    </div>
  );
}

// ─── Thrust-to-Weight Calculator ────────────────────────
// Input-driven (you supply measured/datasheet thrust), so this one was
// already accurate by construction — only hardened against AUW = 0 and
// switched to the shared twrRating() label used by the Wizard too.
function TWRCalc() {
  const [thrustPerMotor, setThrustPerMotor] = useState(850);
  const [motorCount, setMotorCount] = useState(4);
  const [auw, setAuw] = useState(320);

  const safeAuw = safeNumber(auw, 1, 1);
  const totalThrust = thrustPerMotor * motorCount;
  const twr = totalThrust / safeAuw;
  const rating = twrRating(twr);
  const twrColor: "green" | "amber" | "red" = rating.color;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <NumberInput label="Thrust/Motor" sublabel="แรงขับต่อมอเตอร์" value={thrustPerMotor} min={100} max={3000} step={50} unit="g" onChange={setThrustPerMotor} />
        <NumberInput label="Motors" sublabel="จำนวนมอเตอร์" value={motorCount} min={1} max={8} step={1} unit="pcs" onChange={setMotorCount} />
      </div>
      <NumberInput label="AUW" sublabel="น้ำหนักรวมพร้อมแบต" value={auw} min={50} max={2000} step={10} unit="g" onChange={setAuw} />

      <SectionLabel>ผลลัพธ์</SectionLabel>

      <div className="grid grid-cols-3 gap-2">
        <ValueDisplay label="Total" value={totalThrust} unit="g" color="green" size="md" />
        <ValueDisplay label="TWR" value={twr.toFixed(1)} unit="×" color={twrColor} size="md" />
        <ValueDisplay label="AUW" value={auw} unit="g" color="cyan" size="md" />
      </div>

      <div className="p-4 rounded-xl border border-bg-border bg-bg-elevated text-center">
        <p className={`text-lg font-orbitron font-bold ${twrColor === "green" ? "text-green-DEFAULT" : twrColor === "amber" ? "text-amber-DEFAULT" : "text-red-DEFAULT"}`}>
          {rating.label}
        </p>
        <p className="text-xs text-text-muted font-sarabun mt-1">
          Thrust-to-Weight Ratio = {twr.toFixed(2)}:1
        </p>
      </div>

      <div className="p-3 rounded-xl bg-bg-surface border border-bg-border">
        <p className="text-[10px] font-mono text-text-faint uppercase tracking-wider mb-2">อ้างอิง TWR</p>
        {[
          { range: "2:1 – 4:1", label: "บินเบา / Cinematic", color: "text-blue-DEFAULT" },
          { range: "4:1 – 7:1", label: "Freestyle ทั่วไป",  color: "text-purple-DEFAULT" },
          { range: "7:1 – 10:1", label: "Freestyle / Race",  color: "text-amber-DEFAULT" },
          { range: "10:1+", label: "Race / Aggressive",      color: "text-green-DEFAULT" },
        ].map((row) => (
          <div key={row.range} className="flex items-center justify-between py-1 border-b border-bg-border/50 last:border-0">
            <span className={`text-xs font-mono ${row.color}`}>{row.range}</span>
            <span className="text-xs font-sarabun text-text-muted">{row.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Prop Matcher ─────────────────────────────────────────
// Now weight-aware: every suggestion gets an estimated hover current from
// the same shared physics engine, instead of an opaque "propPowerBias"
// heuristic that ignored AUW entirely.
type PropRec = { size: number; blades: number; pitchNote: string; notes: string };

function PropMatcherCalc() {
  const [frameSize, setFrameSize] = useState(220);
  const [motorKV, setMotorKV] = useState(2306);
  const [batteryS, setBatteryS] = useState(4);
  const [weight, setWeight] = useState(420);

  const { unloadedRpm, loadedRpm } = useMemo(() => estimateLoadedRpm(motorKV, batteryS), [motorKV, batteryS]);
  const voltage = safeNumber(batteryS, 4) * 3.7;
  const propPowerBias = (safeNumber(motorKV, 2306) / 2306) * (safeNumber(batteryS, 4) / 4);

  const suggestions: PropRec[] = useMemo(() => {
    if (frameSize <= 100) {
      return [
        { size: 2.5, blades: 2, pitchNote: "เบา", notes: "ประหยัดพลังงาน" },
        { size: 3.0, blades: 3, pitchNote: propPowerBias > 1 ? "มีแรงดี" : "บาลานซ์ดี", notes: propPowerBias > 1 ? "พอมีแรง แต่ควรเช็กอุณหภูมิ" : "บาลานซ์ดีสำหรับเฟรมเล็ก" },
      ];
    }
    if (frameSize <= 160) {
      return [
        { size: 3.0, blades: propPowerBias > 1.05 ? 3 : 2, pitchNote: "มาตรฐาน", notes: "มาตรฐาน 3 inch" },
        { size: 3.5, blades: 2, pitchNote: "เร่งดี", notes: propPowerBias > 1 ? "เร่งดีขึ้น แต่กินไฟมากขึ้น" : "flight time ดีขึ้น" },
      ];
    }
    if (frameSize <= 240) {
      if (batteryS <= 4) {
        return [
          { size: 5.1, blades: 3, pitchNote: propPowerBias > 1.1 ? "low pitch" : "pitch กลาง", notes: "freestyle ยอดนิยม" },
          { size: 5.1, blades: 2, pitchNote: "2-blade", notes: "flight time ดีกว่า" },
          { size: 4.8, blades: 3, pitchNote: "เบา", notes: "เบาและคุมกระแสดี" },
        ];
      }
      return [
        { size: 5.1, blades: propPowerBias > 1.15 ? 2 : 3, pitchNote: propPowerBias > 1.15 ? "low pitch" : "pitch กลาง", notes: "6S มาตรฐาน" },
        { size: 4.5, blades: 3, pitchNote: "เบา", notes: "ลด current draw" },
      ];
    }
    return [
      { size: 7.0, blades: 2, pitchNote: "ประหยัด", notes: "ประหยัดและนิ่งกว่า" },
      { size: 6.5, blades: 3, pitchNote: "แรง", notes: propPowerBias > 1.1 ? "แรงขึ้น แต่กินไฟมากขึ้น" : "efficiency สูงกว่า" },
    ];
  }, [frameSize, batteryS, propPowerBias]);

  const enriched = useMemo(
    () =>
      suggestions.map((s) => {
        const hoverA = estimateHoverCurrentA({
          weightG: weight,
          motorCount: 4,
          propDiameterIn: s.size,
          bladeCount: s.blades,
          motorKV,
          batteryS,
        });
        return { ...s, hoverA };
      }),
    [suggestions, weight, motorKV, batteryS]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <NumberInput label="Frame Size" sublabel="มม." value={frameSize} min={65} max={360} step={5} unit="mm" onChange={setFrameSize} />
        <NumberInput label="Motor KV" sublabel="KV rating" value={motorKV} min={1000} max={4000} step={50} unit="KV" onChange={setMotorKV} />
        <NumberInput label="Battery" sublabel="จำนวน Cell" value={batteryS} min={2} max={6} step={1} unit="S" onChange={setBatteryS} />
        <NumberInput label="Weight (AUW)" sublabel="รวม payload" value={weight} min={20} max={2500} step={10} unit="g" onChange={setWeight} />
      </div>

      <SectionLabel>Props แนะนำ</SectionLabel>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <ValueDisplay label="Loaded RPM" value={Math.round(loadedRpm / 1000) + "k"} color="green" />
        <ValueDisplay label="Voltage" value={voltage.toFixed(1)} unit="V" color="amber" />
      </div>
      <p className="text-[10px] text-text-faint font-sarabun -mt-2">
        * Loaded RPM ประมาณจาก KV×V หลังลดด้วยโหลดจริง (no-load RPM ≈ {Math.round(unloadedRpm / 1000)}k — RPM จริงขณะบินจะต่ำกว่านี้เสมอ)
      </p>

      <div className="space-y-2">
        {enriched.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border ${i === 0 ? "border-green-DEFAULT/30 bg-green-muted/10" : "border-bg-border bg-bg-surface"}`}>
            <div className="flex-shrink-0 w-8 h-8 rounded-lg border border-bg-border bg-bg-elevated flex items-center justify-center">
              <span className="text-xs font-mono text-text-muted">{i + 1}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-orbitron font-semibold text-text">
                {s.size.toFixed(1)}" {s.blades}-blade
              </p>
              <p className="text-[11px] font-sarabun text-text-muted mt-0.5">{s.notes} · {s.pitchNote}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] font-mono text-text-faint uppercase">Est. hover</p>
              <p className="text-xs font-mono text-blue-DEFAULT">~{s.hoverA.typical.toFixed(1)}A</p>
            </div>
            {i === 0 && <span className="text-[10px] font-mono text-green-DEFAULT bg-green-muted px-2 py-0.5 rounded border border-green-DEFAULT/30">แนะนำ</span>}
          </div>
        ))}
      </div>

      <p className="text-[11px] text-text-faint font-sarabun text-center">
        * คำแนะนำโดยประมาณ ขึ้นอยู่กับสไตล์การบินและ motor ที่ใช้จริง — กระแสประมาณจากน้ำหนัก (AUW) ที่กรอกไว้ด้านบน
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function CalculatorClient() {
  const [mode, setMode] = useState<CalcMode>("flighttime");

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-5">
        <span className="hud-chip inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-blue-DEFAULT">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-DEFAULT shadow-[0_0_10px_rgba(99,179,255,0.6)]" />
          Calculator
        </span>
        <h1 className="mt-3 font-orbitron text-2xl font-bold tracking-tight">
          <span className="gradient-text">คำนวณ Thrust / Flight Time</span>
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
          คำนวณ flight time, thrust/weight, และ prop matching
        </p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1.5 mb-6 p-1 bg-bg-elevated rounded-xl border border-bg-border">
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            aria-pressed={mode === m.value}
            className={`flex-1 py-2.5 px-1 rounded-lg text-xs transition-all ${
              mode === m.value
                ? "bg-blue-muted border border-blue-DEFAULT/40 text-blue-DEFAULT font-semibold"
                : "text-text-muted hover:text-text font-mono"
            }`}
          >
            <span className="block font-orbitron text-[11px]">{m.label}</span>
            <span className="block font-sarabun text-[10px] mt-0.5 opacity-70">{m.labelTh}</span>
          </button>
        ))}
      </div>

      {/* Calculator content */}
      <div className="animate-fade-in">
        {mode === "flighttime" && <FlightTimeCalc />}
        {mode === "twr"        && <TWRCalc />}
        {mode === "props"      && <PropMatcherCalc />}
      </div>
    </div>
  );
}
