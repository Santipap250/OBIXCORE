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
  { value: "4", label: "Presets", color: "text-purple-DEFAULT" },
  { value: "5", label: "Problems", color: "text-amber-DEFAULT" },
  { value: "3", label: "Calculators", color: "text-blue-DEFAULT" },
  { value: "FREE", label: "ฟรีทั้งหมด", color: "text-green-DEFAULT" },
];

const highlights = [
  "Aurora color system",
  "Glass HUD modules",
  "Fast copy-ready outputs",
];

export default function HomePage() {
  return (
    <div className="page-shell py-6">
      <section className="hud-card overflow-hidden rounded-[1.75rem] p-5 md:p-6">
        <div className="absolute inset-x-0 top-0 h-1 color-strip" />
        <div className="absolute -right-12 top-8 h-40 w-40 rounded-full bg-blue-DEFAULT/10 blur-3xl" />
        <div className="absolute -left-14 bottom-6 h-44 w-44 rounded-full bg-pink-DEFAULT/10 blur-3xl" />

        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-green-DEFAULT/40 bg-green-muted/60 shadow-[0_0_30px_rgba(0,232,122,0.15)]">
              <span className="font-orbitron text-sm font-black tracking-[0.2em] text-green-DEFAULT">OX</span>
            </div>
            <div>
              <h1 className="font-orbitron text-2xl font-black tracking-[0.35em] text-text">
                OBIXCORE
              </h1>
              <p className="mt-1 text-[11px] font-mono tracking-[0.3em] text-green-DEFAULT">
                FPV TUNING PLATFORM
              </p>
            </div>
          </div>

          <p className="max-w-2xl text-[15px] leading-relaxed text-text-muted">
            เครื่องมือจูนโดรน FPV ที่ใช้งานได้จริง — ตั้งค่า, วิเคราะห์, คำนวณ และ copy ค่าพร้อมใช้ได้ในที่เดียว
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {highlights.map((item) => (
              <span key={item} className="hud-chip px-3 py-1 text-[10px] font-mono tracking-[0.22em] text-text-muted">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickStats.map((s) => (
              <div key={s.label} className="hud-panel rounded-2xl p-3 text-center">
                <div className={`font-orbitron text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="mt-1 text-[11px] text-text-muted">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/wizard"
              className="group flex items-center justify-between rounded-2xl border border-green-DEFAULT/35 bg-gradient-to-r from-green-muted/25 via-bg-surface/75 to-blue-muted/15 px-4 py-4 transition-all hover:border-green-DEFAULT hover:shadow-[0_0_28px_rgba(0,232,122,0.12)] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-green-DEFAULT to-cyan-DEFAULT text-bg-DEFAULT shadow-[0_0_24px_rgba(0,232,122,0.25)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L4 14h7l-1 8 10-14h-7l1-6z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-orbitron text-sm font-bold tracking-[0.28em] text-text">
                    START WIZARD
                  </div>
                  <div className="mt-1 text-sm text-text-muted">
                    เปิดหน้า Tuning Wizard เพื่อเริ่มคำนวณค่า PID / Filter / Rates
                  </div>
                </div>
              </div>
              <svg className="h-5 w-5 text-green-DEFAULT transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="hud-panel rounded-2xl p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-text-faint">System</div>
          <div className="mt-2 flex items-center gap-2 text-sm text-text">
            <span className="h-2.5 w-2.5 rounded-full bg-green-DEFAULT shadow-[0_0_18px_rgba(0,232,122,0.5)] animate-pulse-green" />
            Online & ready
          </div>
        </div>
        <div className="hud-panel rounded-2xl p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-text-faint">Theme</div>
          <div className="mt-2 text-sm text-text">Aurora Color Mode</div>
        </div>
        <div className="hud-panel rounded-2xl p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-text-faint">Mode</div>
          <div className="mt-2 text-sm text-text">Mobile + Desktop</div>
        </div>
      </section>

      <section className="mt-6">
        <div className="section-title mb-3">
          <h2 className="font-orbitron text-xs font-bold uppercase tracking-[0.35em] text-text-muted">Core Modules</h2>
          <div className="section-title__line" />
        </div>
        <div className="grid gap-3">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
