import ToolCard from "@/components/ToolCard";
import Link from "next/link";
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
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "OBIXCORE FPV Tuning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/og-image.jpg"],
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18c1-6 4-11 8-15 4 4 7 9 8 15-2.5-1.5-5.3-2-8-2s-5.5.5-8 2Z" />
        <path d="M9 6l.6 1.6M14.4 7.6L15 6" />
        <circle cx="12" cy="4" r="1" />
      </svg>
    ),
  },
  {
    href: "/diagnose",
    title: "ConfigDoctor",
    titleTh: "วิเคราะห์ปัญหา Build โดรน",
    description:
      "Health/Safety/Efficiency/Performance/Reliability Score พร้อม warning และคำแนะนำเรียงลำดับความสำคัญ",
    accentColor: "red" as const,
    badge: "NEW",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M6 10.5h2l1.2-2.5 1.6 4 1.2-1.5h2" />
        <line x1="15.2" y1="15.2" x2="20" y2="20" />
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <circle cx="8" cy="11" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="12" cy="11" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="16" cy="11" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="8" cy="15" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="12" cy="15" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="16" cy="15" r="0.9" fill="currentColor" stroke="none" />
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M12 12.5l1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3z" />
      </svg>
    ),
  },
  {
    href: "/visualizer",
    title: "3D Build Visualizer",
    titleTh: "ดู Build โดรน 3D",
    description:
      "Preview โดรน FPV แบบ interactive พร้อมตรวจ compatibility ของ frame/prop/motor/battery",
    accentColor: "cyan" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="M12 3v9M12 12l8-4.5M12 12l-8-4.5M12 12v9" />
      </svg>
    ),
  },
  {
    href: "/blackbox",
    title: "Blackbox / Step-Response",
    titleTh: "วิเคราะห์การบินแบบไม่ต้องมี Log",
    description:
      "ตอบคำถามว่าโดรนคุณรู้สึกยังไงตอนบิน แล้วรับคำแนะนำ PID/filter delta พร้อมคำสั่ง CLI",
    accentColor: "pink" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h4l2-7 4 14 3-9 2 5h5" />
      </svg>
    ),
  },
  {
    href: "/profiles",
    title: "Drone Profiles",
    titleTh: "บันทึกสเปกโดรนหลายลำ",
    description:
      "บันทึกสเปกโดรนแต่ละลำไว้ แล้วโหลดเข้า Wizard หรือ Visualizer ได้ทันทีโดยไม่ต้องกรอกใหม่",
    accentColor: "blue" as const,
    badge: "NEW",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="4" rx="1" />
        <rect x="3" y="10" width="18" height="4" rx="1" />
        <rect x="3" y="16" width="10" height="4" rx="1" />
      </svg>
    ),
  },
  {
    href: "/tricks",
    title: "Trick Library",
    titleTh: "คลังท่าบิน Freestyle",
    description: "ท่าบินตั้งแต่ระดับเริ่มต้นถึงขั้นสูง พร้อมขั้นตอน เคล็ดลับ และข้อผิดพลาดที่พบบ่อย",
    accentColor: "orange" as const,
    badge: "NEW",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4c4 0 6 2 8 6 2-4 4-6 8-6" />
        <path d="M4 20c4 0 6-2 8-6 2 4 4 6 8 6" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "/compatibility",
    title: "Parts Compatibility",
    titleTh: "เช็คมาตรฐานชิ้นส่วน",
    description: "อ้างอิง mounting pattern, ขั้วแบต, และขั้วเสา VTX ที่ใช้กันทั่วไปในวงการ FPV",
    accentColor: "lime" as const,
    badge: "NEW",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a3 3 0 0 0-4.24 4.24l-6.36 6.36a1.5 1.5 0 0 0 2.12 2.12l6.36-6.36a3 3 0 0 0 4.24-4.24l-2.12 2.12-2.12-2.12z" />
      </svg>
    ),
  },
];

const featurePills = [
  {
    label: "จูนจาก",
    highlight: "Physics",
    accent: "blue" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    label: "รองรับ 6 คลาส",
    highlight: "Micro → Heavy Lifter",
    accent: "cyan" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 3 7l9 5 9-5-9-5Z" />
        <path d="M3 12l9 5 9-5" />
        <path d="M3 17l9 5 9-5" />
      </svg>
    ),
  },
  {
    label: "Copy CLI",
    highlight: "Betaflight",
    accent: "purple" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    label: "ใช้งานฟรี",
    highlight: "ไม่ซับซ้อน",
    accent: "amber" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 11l3 3 7-7" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
];

const quickStats = [
  {
    value: "10",
    label: "Modules",
    color: "text-purple-DEFAULT",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    value: "13",
    label: "Presets",
    color: "text-amber-DEFAULT",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    value: "6",
    label: "คลาสโดรน",
    color: "text-blue-DEFAULT",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 3 7l9 5 9-5-9-5Z" />
        <path d="M3 12l9 5 9-5" />
        <path d="M3 17l9 5 9-5" />
      </svg>
    ),
  },
  {
    value: "FREE",
    label: "ฟรีทั้งหมด",
    color: "text-cyan-DEFAULT",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

const flowSteps = [
  {
    step: "01",
    title: "เลือกปัญหา / กรอกสเปก",
    body: "บอกอาการที่เจอใน Problem Solver หรือกรอกสเปกโดรนใน Wizard",
    accent: "blue" as const,
  },
  {
    step: "02",
    title: "วิเคราะห์",
    body: "ระบบจัดกลุ่มคลาสโดรนและประเมิน propLoad / inertia จากสเปกจริง",
    accent: "cyan" as const,
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

const featureAccent = {
  blue: { border: "border-blue-DEFAULT/18", text: "text-blue-DEFAULT", bg: "bg-blue-muted/10" },
  cyan: { border: "border-cyan-DEFAULT/18", text: "text-cyan-DEFAULT", bg: "bg-cyan-muted/10" },
  purple: { border: "border-purple-DEFAULT/18", text: "text-purple-DEFAULT", bg: "bg-purple-muted/10" },
  amber: { border: "border-amber-DEFAULT/18", text: "text-amber-DEFAULT", bg: "bg-amber-muted/10" },
};

const flowAccent = {
  blue: { dot: "bg-blue-DEFAULT", text: "text-blue-DEFAULT", border: "border-blue-DEFAULT/20" },
  cyan: { dot: "bg-cyan-DEFAULT", text: "text-cyan-DEFAULT", border: "border-cyan-DEFAULT/20" },
  purple: { dot: "bg-purple-DEFAULT", text: "text-purple-DEFAULT", border: "border-purple-DEFAULT/20" },
  pink: { dot: "bg-pink-DEFAULT", text: "text-pink-DEFAULT", border: "border-pink-DEFAULT/20" },
};

function StartWizardButton() {
  return (
    <Link
      href="/wizard"
      aria-label="Start Tuning Wizard"
      className="group relative block w-full"
    >
      <div className="absolute -inset-1 rounded-[34px] bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 opacity-75 blur-2xl transition duration-300 group-hover:opacity-100" />
      <div className="btn-neo-blue hero-sheen relative overflow-hidden rounded-[30px] px-4 py-4 sm:px-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.08),transparent_20%)]" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent opacity-80" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] border border-cyan-200/25 bg-cyan-400/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.18)]">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L4 14h7l-1 8 10-14h-7l1-6z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="font-orbitron text-[11px] font-bold uppercase tracking-[0.36em] text-cyan-200/80">
                START TUNING
              </div>
              <div className="font-orbitron text-[28px] font-black uppercase leading-[0.9] tracking-[0.18em] text-cyan-50 sm:text-[34px]">
                WIZARD
              </div>
            </div>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-cyan-200/25 bg-cyan-400/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.16)] transition-transform duration-300 group-hover:translate-x-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SecondaryAction({
  href,
  title,
  desc,
  accent,
  icon,
}: {
  href: string;
  title: string;
  desc: string;
  accent: "blue" | "cyan" | "purple";
  icon: React.ReactNode;
}) {
  const accentMap = {
    blue: "border-blue-DEFAULT/20 bg-blue-muted/10 hover:border-blue-DEFAULT/40 hover:bg-blue-muted/15",
    cyan: "border-cyan-DEFAULT/20 bg-cyan-muted/10 hover:border-cyan-DEFAULT/40 hover:bg-cyan-muted/15",
    purple: "border-purple-DEFAULT/20 bg-purple-muted/10 hover:border-purple-DEFAULT/40 hover:bg-purple-muted/15",
  } as const;

  const textMap = {
    blue: "text-blue-DEFAULT",
    cyan: "text-cyan-DEFAULT",
    purple: "text-purple-DEFAULT",
  } as const;

  return (
    <Link
      href={href}
      className={`group flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 transition-all active:scale-[0.99] ${accentMap[accent]}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/5 ${textMap[accent]} shadow-[0_0_14px_rgba(255,255,255,0.03)]`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className={`font-orbitron text-[12px] font-bold uppercase tracking-[0.28em] ${textMap[accent]}`}>
            {title}
          </div>
          <div className="mt-1 text-[12px] leading-relaxed text-text-muted">{desc}</div>
        </div>
      </div>
      <svg className={`h-4 w-4 shrink-0 ${textMap[accent]} transition-transform duration-300 group-hover:translate-x-1`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M13 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="page-shell max-w-6xl py-6 sm:py-8">
      <section className="hud-card relative overflow-hidden rounded-[2rem] p-5 md:p-7">
        <div className="absolute inset-x-0 top-0 h-1 color-strip" />
        <div className="pointer-events-none absolute -right-16 top-10 h-44 w-44 rounded-full bg-blue-DEFAULT/12 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-purple-DEFAULT/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.18] mix-blend-screen" />
        <div className="pointer-events-none absolute inset-0 hud-noise opacity-[0.08]" />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="hud-chip rounded-full border border-blue-DEFAULT/20 bg-blue-muted/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-blue-DEFAULT">
                FPV TOOLKIT
              </span>
              <span className="hud-chip rounded-full border border-cyan-DEFAULT/20 bg-cyan-muted/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-cyan-DEFAULT">
                BETAFIGHT READY
              </span>
              <span className="hud-chip rounded-full border border-purple-DEFAULT/20 bg-purple-muted/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-purple-DEFAULT">
                FREE WEB APP
              </span>
            </div>

            <div className="max-w-[560px]">
              <OBIXLogo maxWidth={520} className="hero-sheen" />
            </div>

            <div className="space-y-3">
              <h1 className="max-w-2xl font-orbitron text-3xl font-black uppercase leading-[1.02] tracking-[0.06em] text-text sm:text-4xl lg:text-5xl">
                <span className="gradient-text">Tune smart.</span>{" "}
                <span className="text-cyan-50">Fly harder.</span>
              </h1>
              <p className="max-w-2xl text-[15px] leading-relaxed text-text-muted sm:text-[16px]">
                เครื่องมือจูนโดรน FPV แบบครบวงจรที่ทำให้การตั้งค่า, วิเคราะห์, คำนวณ และคัดลอกค่าไปใช้ใน Betaflight เป็นเรื่องไวและเป็นระบบ
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <StartWizardButton />
              <SecondaryAction
                href="/diagnose"
                title="CONFIG DOCTOR"
                desc="วิเคราะห์ปัญหาและจัดลำดับสิ่งที่ควรแก้ก่อน"
                accent="purple"
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path d="M6 10.5h2l1.2-2.5 1.6 4 1.2-1.5h2" />
                  </svg>
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {featurePills.map((item) => {
                const a = featureAccent[item.accent];
                return (
                  <div key={item.label} className={`flex items-center gap-2.5 rounded-2xl border ${a.border} ${a.bg} px-3 py-2.5`}>
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
          </div>

          <div className="space-y-4">
            <div className="hud-panel rounded-[1.75rem] p-4 md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-orbitron text-[11px] font-bold uppercase tracking-[0.32em] text-cyan-DEFAULT">
                    Live Status
                  </div>
                  <div className="mt-2 text-[14px] leading-relaxed text-text-muted">
                    หน้าแรกถูกออกแบบให้เป็น dashboard สำหรับนักบิน FPV โดยเฉพาะ
                  </div>
                </div>
                <div className="rounded-full border border-cyan-DEFAULT/20 bg-cyan-muted/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-DEFAULT">
                  Online
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {quickStats.map((s) => (
                  <div key={s.label} className="hud-panel rounded-2xl p-3 text-center">
                    <span className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center ${s.color}`}>{s.icon}</span>
                    <div className={`font-orbitron text-xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="mt-1 text-[11px] text-text-muted">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="hud-panel rounded-[1.5rem] p-4">
                <div className="font-orbitron text-[11px] font-bold uppercase tracking-[0.28em] text-blue-DEFAULT">
                  Core Mission
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
                  ช่วยให้การจูนโดรนมีเหตุผล รองรับทั้งเริ่มต้นและสายจริงจัง โดยใช้ข้อมูลจากสเปกและอาการของโดรนเป็นตัวตั้ง
                </p>
              </div>
              <div className="hud-panel rounded-[1.5rem] p-4">
                <div className="font-orbitron text-[11px] font-bold uppercase tracking-[0.28em] text-purple-DEFAULT">
                  Mobile First
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
                  ใช้งานบนมือถือได้ง่าย ปุ่มกดชัด อ่านสบาย และสแกนข้อมูลเร็ว ไม่แน่นจอ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="section-title mb-3">
          <h2 className="font-orbitron text-xs font-bold uppercase tracking-[0.35em] text-text-muted">Fast Access</h2>
          <div className="section-title__line" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SecondaryAction
            href="/problems"
            title="PROBLEM SOLVER"
            desc="เลือกอาการแล้วรับขั้นตอนแก้ทีละสเต็ป"
            accent="amber"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
              </svg>
            }
          />
          <SecondaryAction
            href="/calculator"
            title="CALCULATOR"
            desc="คำนวณ thrust, flight time และ current draw"
            accent="blue"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
              </svg>
            }
          />
          <SecondaryAction
            href="/visualizer"
            title="3D VISUALIZER"
            desc="ตรวจ compatibility แบบมองเห็นภาพ"
            accent="cyan"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
              </svg>
            }
          />
        </div>
      </section>

      <section className="mt-6">
        <div className="section-title mb-3">
          <h2 className="font-orbitron text-xs font-bold uppercase tracking-[0.35em] text-text-muted">How It Works</h2>
          <div className="section-title__line" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {flowSteps.map((s, i) => {
            const a = flowAccent[s.accent];
            return (
              <div key={s.step} className={`hud-panel relative rounded-2xl border p-4 text-left ${a.border}`}>
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
                  <span className={`font-mono text-[11px] tracking-[0.3em] ${a.text}`}>STEP {s.step}</span>
                </div>
                <p className="mt-2 font-orbitron text-[13px] font-semibold text-text">{s.title}</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-text-muted">{s.body}</p>
                {i < flowSteps.length - 1 && (
                  <svg className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-text-faint lg:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M13 5l7 7-7 7" />
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

      <section className="mt-5">
        <Link
          href="/support"
          className="group flex items-center justify-between gap-3 rounded-2xl border border-cyan-DEFAULT/14 bg-bg-surface/60 px-4 py-3 text-left transition-all hover:border-cyan-DEFAULT/30 hover:bg-cyan-muted/10 active:scale-[0.99]"
        >
          <div className="flex items-center gap-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-DEFAULT">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="text-[13px] text-text-muted">OBIXCORE เป็นเครื่องมือฟรีที่ดูแลโดยนักบินคนเดียว — สนับสนุนโปรเจกต์นี้ได้ที่นี่</span>
          </div>
          <svg className="h-4 w-4 flex-shrink-0 text-text-faint transition-all group-hover:translate-x-1 group-hover:text-cyan-DEFAULT" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
