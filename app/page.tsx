import ToolCard from "@/components/ToolCard";
import Link from "next/link";

const tools = [
  {
    href: "/wizard",
    title: "Tuning Wizard",
    titleTh: "ตั้งค่า PID อัตโนมัติ",
    description: "กรอกสเปกโดรน → ได้ค่า PID + Filter + Rates + CLI พร้อม copy",
    accentColor: "green" as const,
    badge: "แนะนำ",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
      </svg>
    ),
  },
  {
    href: "/problems",
    title: "Problem Solver",
    titleTh: "แก้ปัญหาโดรน",
    description: "เลือกอาการที่เจอ → ได้ขั้นตอนแก้ไขทีละ step พร้อม CLI command",
    accentColor: "amber" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    href: "/calculator",
    title: "Calculator",
    titleTh: "คำนวณ Thrust / Flight Time",
    description: "คำนวณ thrust-to-weight, flight time, และ current draw โดยประมาณ",
    accentColor: "blue" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/>
        <line x1="8" y1="14" x2="12" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/>
      </svg>
    ),
  },
  {
    href: "/presets",
    title: "Preset Library",
    titleTh: "คลัง Preset พร้อมใช้",
    description: "ค่า PID + Rates + Filters ที่ผ่านการทดสอบจริง กด copy แล้ววางใน CLI ได้เลย",
    accentColor: "purple" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
];

const quickStats = [
  { value: "4+", label: "Presets", color: "text-purple-DEFAULT" },
  { value: "5+", label: "Problems", color: "text-amber-DEFAULT" },
  { value: "3", label: "Calculators", color: "text-blue-DEFAULT" },
  { value: "FREE", label: "ฟรีทั้งหมด", color: "text-green-DEFAULT" },
];

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4">

      {/* ── Hero ─────────────────────────────────────── */}
      <div className="pt-8 pb-6 relative">
        {/* Glow behind title */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 h-24 bg-green-DEFAULT/5 rounded-full blur-3xl pointer-events-none" />

        {/* Logo mark */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg border border-green-DEFAULT/50 bg-green-muted flex items-center justify-center glow-green">
            <span className="font-orbitron font-black text-green-DEFAULT text-sm">OX</span>
          </div>
          <div>
            <h1 className="font-orbitron font-black text-xl tracking-widest text-text leading-none">
              OBIXCORE
            </h1>
            <p className="text-[11px] font-mono text-green-DEFAULT tracking-widest mt-0.5">
              FPV TUNING PLATFORM
            </p>
          </div>
        </div>

        <p className="text-text-muted font-sarabun text-[15px] leading-relaxed max-w-md">
          เครื่องมือจูนโดรน FPV ที่<span className="text-text">ใช้งานได้จริง</span> ไม่ใช่แค่บทความ —
          กรอกสเปค, เลือกอาการ, คำนวณ, copy ค่าไปใช้ได้เลย
        </p>

        {/* Quick stats */}
        <div className="flex gap-4 mt-5 flex-wrap">
          {quickStats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-1.5">
              <span className={`font-orbitron font-bold text-lg ${s.color}`}>{s.value}</span>
              <span className="text-xs text-text-muted font-sarabun">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick action CTA ──────────────────────────── */}
      <Link
        href="/wizard"
        className="flex items-center justify-between w-full p-4 rounded-xl bg-green-muted border border-green-DEFAULT/40 hover:border-green-DEFAULT hover:bg-green-muted/80 transition-all group mb-6 active:scale-99"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-DEFAULT flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0c10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-orbitron font-semibold text-green-DEFAULT">เริ่มจูนโดรนเดี๋ยวนี้</p>
            <p className="text-xs text-green-dim font-sarabun mt-0.5">กรอกสเปค → ได้ค่า PID พร้อมใช้ใน 30 วินาที</p>
          </div>
        </div>
        <svg className="w-5 h-5 text-green-DEFAULT group-hover:translate-x-1 transition-transform flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </Link>

      {/* ── Tools grid ────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest">เครื่องมือทั้งหมด</h2>
          <div className="flex-1 h-px bg-bg-border" />
        </div>
        <div className="flex flex-col gap-3">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </section>

      {/* ── Coming soon ───────────────────────────────── */}
      <section className="mt-6 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest">กำลังจะมา</h2>
          <div className="flex-1 h-px bg-bg-border" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Trick Library", icon: "🎯" },
            { label: "Parts Match", icon: "🔧" },
            { label: "Drone Profile", icon: "👤" },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-xl border border-bg-border bg-bg-surface text-center opacity-50"
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <p className="text-[11px] font-sarabun text-text-muted">{item.label}</p>
              <p className="text-[9px] font-mono text-text-faint mt-0.5">Phase 2</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer note ───────────────────────────────── */}
      <div className="py-6 text-center">
        <p className="text-[11px] font-mono text-text-faint">
          OBIXCORE v0.1.0 — Built for FPV Pilots
        </p>
        <p className="text-[11px] font-sarabun text-text-faint mt-1">
          ข้อมูลเป็นค่าเริ่มต้นแนะนำ ควร fine-tune ตามโดรนจริงของคุณ
        </p>
      </div>
    </div>
  );
}
