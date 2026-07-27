import ToolCard from "@/components/ToolCard";
import Link from "next/link";
import Image from "next/image";
import OBIXLogo from "@/components/OBIXLogo";
import type { Metadata } from "next";

const HOME_TITLE = "OBIXCORE — FPV Drone Tuning Platform | Betaflight PID, Preset, Calculator";
const HOME_DESCRIPTION =
  "เครื่องมือจูนโดรน FPV ครบวงจร: Tuning Wizard คำนวณค่า PID Betaflight อัตโนมัติ, Problem Solver แก้ปัญหาการบิน, Calculator คำนวณ thrust/flight time, Preset Library และ 3D Build Visualizer — ใช้งานฟรีทั้งหมด";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  keywords: [
    "FPV drone tuning",
    "Betaflight PID calculator",
    "drone tuning wizard",
    "FPV preset library",
    "drone build visualizer",
    "โดรน FPV",
    "จูนโดรน",
    "ตั้งค่า PID Betaflight",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "/",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "OBIXCORE FPV Tuning Platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/og-image.svg"],
  },
};

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
    href: "/diagnose",
    title: "ConfigDoctor",
    titleTh: "วิเคราะห์ปัญหา Build โดรน",
    description: "Health/Safety/Efficiency/Performance/Reliability Score พร้อม warning และคำแนะนำเรียงลำดับความสำคัญ",
    accentColor: "red" as const,
    badge: "NEW",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>
        <path d="M3.5 8.5h4l1.5-3 2 6 1.5-3h4"/>
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
  {
    href: "/visualizer",
    title: "3D Build Visualizer",
    titleTh: "ดู Build โดรน 3D",
    description: "Preview โดรน FPV แบบ interactive พร้อมตรวจ compatibility ของ frame/prop/motor/battery",
    accentColor: "cyan" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2"/><circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/>
        <circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/>
        <line x1="6" y1="4" x2="10" y2="4"/><line x1="14" y1="4" x2="18" y2="4"/>
        <line x1="6" y1="20" x2="10" y2="20"/><line x1="14" y1="20" x2="18" y2="20"/>
        <line x1="4" y1="6" x2="4" y2="10"/><line x1="4" y1="14" x2="4" y2="18"/>
        <line x1="20" y1="6" x2="20" y2="10"/><line x1="20" y1="14" x2="20" y2="18"/>
      </svg>
    ),
  },
  {
    href: "/blackbox",
    title: "Blackbox / Step-Response",
    titleTh: "วิเคราะห์การบินแบบไม่ต้องมี Log",
    description: "ตอบคำถามว่าโดรนคุณรู้สึกยังไงตอนบิน แล้วรับคำแนะนำ PID/filter delta พร้อมคำสั่ง CLI",
    accentColor: "pink" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h4l2-7 4 14 3-9 2 5h5" />
      </svg>
    ),
  },
  {
    href: "/profiles",
    title: "Drone Profiles",
    titleTh: "บันทึกสเปกโดรนหลายลำ",
    description: "บันทึกสเปกโดรนแต่ละลำไว้ แล้วโหลดเข้า Wizard หรือ Visualizer ได้ทันทีโดยไม่ต้องกรอกใหม่",
    accentColor: "blue" as const,
    badge: "NEW",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="4" rx="1" />
        <rect x="3" y="10" width="18" height="4" rx="1" />
        <rect x="3" y="16" width="10" height="4" rx="1" />
      </svg>
    ),
  },
];

const featurePills = [
  {
    label: "จูนจาก",
    highlight: "Physics",
    accent: "green" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"/>
        <ellipse cx="12" cy="12" rx="10" ry="4.5"/>
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)"/>
      </svg>
    ),
  },
  {
    label: "รองรับ 6 คลาส",
    highlight: "Micro → Heavy Lifter",
    accent: "blue" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 3 7l9 5 9-5-9-5Z"/>
        <path d="M3 12l9 5 9-5"/>
        <path d="M3 17l9 5 9-5"/>
      </svg>
    ),
  },
  {
    label: "Copy CLI",
    highlight: "Betaflight",
    accent: "purple" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5"/>
        <line x1="12" y1="19" x2="20" y2="19"/>
      </svg>
    ),
  },
  {
    label: "ใช้งานฟรี",
    highlight: "ไม่ซับซ้อน",
    accent: "amber" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 11l3 3 7-7"/>
        <circle cx="12" cy="12" r="10"/>
      </svg>
    ),
  },
];

const quickStats = [
  {
    value: "8",
    label: "Modules",
    color: "text-purple-DEFAULT",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    value: "13",
    label: "Presets",
    color: "text-amber-DEFAULT",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
  },
  {
    value: "6",
    label: "คลาสโดรน",
    color: "text-blue-DEFAULT",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 3 7l9 5 9-5-9-5Z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/>
      </svg>
    ),
  },
  {
    value: "FREE",
    label: "ฟรีทั้งหมด",
    color: "text-green-DEFAULT",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
];

const pillAccentClasses = {
  green: { border: "border-green-DEFAULT/25", text: "text-green-DEFAULT", bg: "bg-green-muted/10" },
  blue: { border: "border-blue-DEFAULT/25", text: "text-blue-DEFAULT", bg: "bg-blue-muted/10" },
  purple: { border: "border-purple-DEFAULT/25", text: "text-purple-DEFAULT", bg: "bg-purple-muted/10" },
  amber: { border: "border-amber-DEFAULT/25", text: "text-amber-DEFAULT", bg: "bg-amber-muted/10" },
};

const flowSteps = [
  {
    step: "01",
    title: "เลือกปัญหา / กรอกสเปก",
    body: "บอกอาการที่เจอใน Problem Solver หรือกรอกสเปกโดรนใน Wizard",
    accent: "green" as const,
  },
  {
    step: "02",
    title: "วิเคราะห์",
    body: "ระบบจัดกลุ่มคลาสโดรนและประเมิน propLoad/inertia จากสเปกจริง",
    accent: "blue" as const,
  },
  {
    step: "03",
    title: "ได้ค่าจูนพร้อมเหตุผล",
    body: "PID / Filter / Rates พร้อม confidence score และคำอธิบายว่าทำไมถึงได้ค่านี้",
    accent: "purple" as const,
  },
  {
    step: "04",
    title: "Copy CLI ไปใช้",
    body: "กด copy แล้ววางใน Betaflight CLI ได้เลย ไม่ต้องแปลงหน่วยเอง",
    accent: "pink" as const,
  },
];

const flowAccentClasses = {
  green: { dot: "bg-green-DEFAULT", text: "text-green-DEFAULT", border: "border-green-DEFAULT/25" },
  blue: { dot: "bg-blue-DEFAULT", text: "text-blue-DEFAULT", border: "border-blue-DEFAULT/25" },
  purple: { dot: "bg-purple-DEFAULT", text: "text-purple-DEFAULT", border: "border-purple-DEFAULT/25" },
  pink: { dot: "bg-pink-DEFAULT", text: "text-pink-DEFAULT", border: "border-pink-DEFAULT/25" },
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <section className="hud-card overflow-hidden rounded-[1.75rem] p-5 md:p-6">
        <div className="absolute inset-x-0 top-0 h-1 color-strip" />
        <div className="absolute -right-12 top-8 h-40 w-40 rounded-full bg-blue-DEFAULT/10 blur-3xl" />
        <div className="absolute -left-14 bottom-6 h-44 w-44 rounded-full bg-pink-DEFAULT/10 blur-3xl" />

        <div className="relative space-y-6 text-center">
          <div className="mx-auto w-full max-w-[640px]">
            <OBIXLogo maxWidth={640} className="mx-auto" />
          </div>

          <h1 className="gradient-text font-orbitron mx-auto max-w-xl text-lg font-bold leading-snug md:text-2xl">
            จูนโดรน FPV จากฟิสิกส์จริง ไม่ใช่การเดา
          </h1>

          <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-text-muted">
            เครื่องมือจูนโดรน FPV ที่ใช้งานได้จริง — ตั้งค่า, วิเคราะห์, คำนวณ และ copy ค่าพร้อมใช้ได้ในที่เดียว
          </p>

          <div className="grid grid-cols-2 gap-2">
            {featurePills.map((item) => {
              const a = pillAccentClasses[item.accent];
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-2.5 rounded-xl border ${a.border} ${a.bg} px-3 py-2.5 text-left`}
                >
                  <span className={a.text}>{item.icon}</span>
                  <span className="text-[11px] leading-tight text-text-muted">
                    {item.label}
                    <br />
                    <span className={`font-semibold ${a.text}`}>{item.highlight}</span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mx-auto max-w-3xl space-y-2">
            <Link
              href="/wizard"
              className="group relative block overflow-hidden rounded-2xl border border-green-DEFAULT/35 transition-all hover:border-green-DEFAULT hover:shadow-[0_0_18px_rgba(0,232,122,0.14)] active:scale-[0.99]"
            >
              <div className="relative h-52 w-full sm:h-60">
                <Image
                  src="/images/drone-hero.jpg"
                  alt="โดรน FPV ที่จูนด้วย OBIXCORE"
                  fill
                  sizes="(max-width: 640px) 100vw, 672px"
                  className="object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-DEFAULT via-bg-DEFAULT/55 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-DEFAULT/70 via-transparent to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                <div>
                  <div className="font-orbitron text-[11px] font-bold uppercase tracking-[0.3em] text-green-DEFAULT">
                    START TUNING
                  </div>
                  <div className="gradient-text font-orbitron text-2xl font-bold leading-none">
                    OBIXCORE
                  </div>
                  <div className="mt-1 font-orbitron text-base font-bold text-text">
                    WIZARD
                  </div>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green-DEFAULT/50 bg-bg-DEFAULT/60 text-green-DEFAULT backdrop-blur transition-transform group-hover:translate-x-1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </Link>

            <Link
              href="/problems"
              className="group flex items-center justify-between rounded-2xl border border-purple-DEFAULT/30 bg-purple-muted/10 px-4 py-3.5 text-left transition-all hover:border-purple-DEFAULT/60 active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-DEFAULT/40 text-purple-DEFAULT">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </span>
                <div className="text-[13px]">
                  <div className="text-text-muted">เจอปัญหาการบินอยู่?</div>
                  <div className="font-orbitron text-[13px] font-bold text-purple-DEFAULT">ไปที่ PROBLEM SOLVER</div>
                </div>
              </div>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-purple-DEFAULT/40 text-purple-DEFAULT transition-transform group-hover:translate-x-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickStats.map((s) => (
              <div key={s.label} className="hud-panel rounded-2xl p-3 text-center">
                <span className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center ${s.color}`}>{s.icon}</span>
                <div className={`font-orbitron text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="mt-1 text-[11px] text-text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="section-title mb-3">
          <h2 className="font-orbitron text-xs font-bold uppercase tracking-[0.35em] text-text-muted">How It Works</h2>
          <div className="section-title__line" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {flowSteps.map((s, i) => {
            const a = flowAccentClasses[s.accent];
            return (
              <div key={s.step} className={`hud-panel relative w-full rounded-2xl border p-4 text-left ${a.border}`}>
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
                  <span className={`font-mono text-[11px] tracking-[0.3em] ${a.text}`}>STEP {s.step}</span>
                </div>
                <p className="mt-2 font-orbitron text-[13px] font-semibold text-text">{s.title}</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-text-muted">{s.body}</p>
                {i < flowSteps.length - 1 && (
                  <svg className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-text-faint lg:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7"/>
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <div className="section-title mb-3">
          <h2 className="font-orbitron text-xs font-bold uppercase tracking-[0.35em] text-text-muted">Core Modules</h2>
          <div className="section-title__line" />
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </section>

      <section className="mt-4">
        <Link
          href="/support"
          className="group flex items-center justify-between gap-3 rounded-2xl border border-bg-border bg-bg-surface/60 px-4 py-3 text-left transition-all hover:border-pink-DEFAULT/40 hover:bg-pink-muted/10 active:scale-[0.99]"
        >
          <div className="flex items-center gap-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-DEFAULT">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="text-[13px] text-text-muted">OBIXCORE เป็นเครื่องมือฟรีที่ดูแลโดยนักบินคนเดียว — สนับสนุนโปรเจกต์นี้ได้ที่นี่</span>
          </div>
          <svg className="h-4 w-4 flex-shrink-0 text-text-faint transition-all group-hover:translate-x-1 group-hover:text-pink-DEFAULT" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
