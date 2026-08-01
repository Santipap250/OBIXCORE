import ToolCard from "@/components/ToolCard";
import Link from "next/link";
import OBIXLogo from "@/components/OBIXLogo";
import type { Metadata } from "next";

const HOME_TITLE =
  "OBIXCORE — FPV Drone Tuning Platform | Betaflight PID, Preset, Calculator";
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
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a3 3 0 0 0-4.24 4.24l-6.36 6.36a1.5 1.5 0 0 0 2.12 2.12l6.36-6.36a3 3 0 0 0 4.24-4.24l-2.12 2.12-2.12-2.12z" />
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
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
    accent: "blue" as const,
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2 3 7l9 5 9-5-9-5Z" />
        <path d="M3 12l9 5 9-5" />
        <path d="M3 17l9 5 9-5" />
      </svg>
    ),
  },
  {
    value: "FREE",
    label: "ฟรีทั้งหมด",
    color: "text-green-DEFAULT",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

const pillAccentClasses = {
  green: {
    border: "border-green-DEFAULT/25",
    text: "text-green-DEFAULT",
    bg: "bg-green-muted/10",
    glow: "shadow-[0_0_24px_rgba(0,232,122,0.10)]",
  },
  blue: {
    border: "border-blue-DEFAULT/25",
    text: "text-blue-DEFAULT",
    bg: "bg-blue-muted/10",
    glow: "shadow-[0_0_24px_rgba(56,189,248,0.10)]",
  },
  purple: {
    border: "border-purple-DEFAULT/25",
    text: "text-purple-DEFAULT",
    bg: "bg-purple-muted/10",
    glow: "shadow-[0_0_24px_rgba(168,85,247,0.10)]",
  },
  amber: {
    border: "border-amber-DEFAULT/25",
    text: "text-amber-DEFAULT",
    bg: "bg-amber-muted/10",
    glow: "shadow-[0_0_24px_rgba(245,158,11,0.10)]",
  },
} as const;

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
    body: "ระบบจัดกลุ่มคลาสโดรนและประเมิน propLoad / inertia จากสเปกจริง",
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
  green: {
    dot: "bg-green-DEFAULT",
    text: "text-green-DEFAULT",
    border: "border-green-DEFAULT/25",
  },
  blue: {
    dot: "bg-blue-DEFAULT",
    text: "text-blue-DEFAULT",
    border: "border-blue-DEFAULT/25",
  },
  purple: {
    dot: "bg-purple-DEFAULT",
    text: "text-purple-DEFAULT",
    border: "border-purple-DEFAULT/25",
  },
  pink: {
    dot: "bg-pink-DEFAULT",
    text: "text-pink-DEFAULT",
    border: "border-pink-DEFAULT/25",
  },
} as const;

function StartTuningWizardButton() {
  return (
    <Link
      href="/wizard"
      aria-label="Start Tuning Wizard"
      className="group relative block w-full"
    >
      <div className="absolute -inset-1 rounded-[34px] bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 opacity-75 blur-xl transition duration-300 group-hover:opacity-100 group-hover:blur-2xl" />
      <div className="relative overflow-hidden rounded-[30px] border border-cyan-300/30 bg-[linear-gradient(135deg,rgba(8,18,35,0.98),rgba(9,27,52,0.98),rgba(8,18,35,0.98))] px-4 py-4 shadow-[0_0_30px_rgba(34,211,238,0.18)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_42px_rgba(56,189,248,0.32)] sm:px-5">
        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.08)_45%,transparent_70%)] bg-[length:240%_100%] button-shine" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-300/0 via-cyan-300/75 to-cyan-300/0 opacity-80" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] border border-cyan-300/30 bg-gradient-to-br from-cyan-400/20 to-blue-500/10 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.18)]">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-cyan-200/30 bg-cyan-400/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.16)] transition-transform duration-300 group-hover:translate-x-1">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SupportBanner() {
  return (
    <Link
      href="/support"
      className="group flex items-center justify-between gap-3 rounded-2xl border border-bg-border bg-bg-surface/60 px-4 py-3 text-left transition-all hover:border-pink-DEFAULT/40 hover:bg-pink-muted/10 active:scale-[0.99]"
    >
      <div className="flex items-center gap-2.5">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-pink-DEFAULT"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span className="text-[13px] text-text-muted">
          OBIXCORE เป็นเครื่องมือฟรีที่ดูแลโดยนักบินคนเดียว — สนับสนุนโปรเจกต์นี้ได้ที่นี่
        </span>
      </div>
      <svg
        className="h-4 w-4 flex-shrink-0 text-text-faint transition-all group-hover:translate-x-1 group-hover:text-pink-DEFAULT"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="relative mx-auto min-h-screen max-w-7xl overflow-hidden px-4 pb-8 pt-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.10),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none absolute inset-0 scanline-overlay opacity-40" />

      <div className="relative space-y-6">
        <header className="rounded-[30px] border border-bg-border bg-bg-surface/60 px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.26)] backdrop-blur-xl sm:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" aria-label="OBIXCORE home" className="block max-w-[220px]">
                <OBIXLogo maxWidth={220} />
              </Link>

              <div className="lg:hidden">
                <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-cyan-200">
                  FPV TOOLKIT
                </span>
              </div>
            </div>

            <nav className="flex flex-wrap gap-2 lg:justify-end">
              {[
                { href: "/wizard", label: "Wizard" },
                { href: "/diagnose", label: "Diagnose" },
                { href: "/presets", label: "Presets" },
                { href: "/visualizer", label: "Visualizer" },
                { href: "/support", label: "Support" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-bg-border bg-bg-DEFAULT/50 px-3.5 py-2 text-[12px] font-medium text-text-muted transition-all hover:border-cyan-300/40 hover:bg-cyan-muted/10 hover:text-cyan-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[36px] border border-bg-border bg-[linear-gradient(180deg,rgba(6,11,20,0.92),rgba(6,13,24,0.96))] px-5 py-6 shadow-[0_30px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:px-6 lg:px-8 lg:py-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(34,211,238,0),rgba(34,211,238,0.95),rgba(59,130,246,0.95),rgba(168,85,247,0.95),rgba(34,211,238,0))]" />
          <div className="absolute -right-12 top-4 h-44 w-44 rounded-full bg-cyan-400/15 blur-3xl floating-glow" />
          <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl floating-glow-slow" />
          <div className="absolute right-10 top-10 h-28 w-28 rounded-full border border-cyan-300/10" />
          <div className="absolute right-14 top-14 h-20 w-20 rounded-full border border-cyan-300/10" />

          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-cyan-200">
                  FPV DRONE TUNING PLATFORM
                </span>
                <span className="rounded-full border border-purple-300/20 bg-purple-muted/10 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-purple-200">
                  BETAFLIGHT READY
                </span>
              </div>

              <div className="mx-auto max-w-[620px] lg:mx-0">
                <OBIXLogo maxWidth={620} className="mx-auto lg:mx-0" />
              </div>

              <div className="space-y-3">
                <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-tight text-text sm:text-4xl lg:text-5xl">
                  หน้าแรกที่ดู{" "}
                  <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                    ล้ำ
                  </span>{" "}
                  แต่ใช้งานจริงได้ทุกวัน
                </h1>
                <p className="max-w-2xl text-[15px] leading-relaxed text-text-muted sm:text-[16px]">
                  OBIXCORE รวมเครื่องมือวิเคราะห์ จูน และบันทึกสเปกโดรนไว้ในที่เดียว
                  ออกแบบมาเพื่อให้นักบิน FPV เปิดมาแล้วใช้งานได้ทันที ทั้งบนมือถือและเดสก์ท็อป
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <StartTuningWizardButton />
                <Link
                  href="/diagnose"
                  className="group relative overflow-hidden rounded-[30px] border border-bg-border bg-bg-surface/70 px-4 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-300/40 hover:bg-purple-muted/10"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.06)_45%,transparent_70%)] bg-[length:240%_100%] button-shine-slower" />
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-300/25 bg-purple-muted/15 text-purple-200">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="10.5" cy="10.5" r="6.5" />
                          <path d="M6 10.5h2l1.2-2.5 1.6 4 1.2-1.5h2" />
                          <line x1="15.2" y1="15.2" x2="20" y2="20" />
                        </svg>
                      </span>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-purple-200/80">
                          QUICK CHECK
                        </div>
                        <div className="font-orbitron text-sm font-semibold text-text">
                          Diagnose Build
                        </div>
                      </div>
                    </div>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-purple-100"
                    >
                      <path d="M5 12h14" />
                      <path d="M13 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {featurePills.map((item) => {
                  const a = pillAccentClasses[item.accent];
                  return (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2.5 rounded-2xl border ${a.border} ${a.bg} ${a.glow} px-3 py-3 text-left backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5`}
                    >
                      <span className={a.text}>{item.icon}</span>
                      <span className="min-w-0 text-[11px] leading-tight text-text-muted">
                        {item.label}
                        <br />
                        <span className={`font-semibold ${a.text}`}>{item.highlight}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
              <div className="absolute -inset-2 rounded-[34px] bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-purple-500/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[34px] border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(8,14,26,0.95),rgba(5,10,20,0.98))] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
                <div className="absolute inset-0 grid-bg opacity-35" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

                <div className="relative space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-200/75">
                        SYSTEM DASHBOARD
                      </div>
                      <div className="mt-1 font-orbitron text-lg font-bold text-text">
                        Ready for flight
                      </div>
                    </div>
                    <div className="rounded-full border border-green-400/25 bg-green-muted/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-green-200">
                      LIVE
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-bg-border bg-bg-surface/60 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.28em] text-text-faint">
                          Recommended path
                        </p>
                        <p className="mt-1 font-orbitron text-base font-bold text-text">
                          Wizard → Diagnose → Presets
                        </p>
                      </div>
                      <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-3 text-cyan-200">
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
                          <path d="M12 12l8-4.5M12 12l-8-4.5" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {quickStats.map((s) => (
                        <div key={s.label} className="rounded-2xl border border-bg-border bg-bg-DEFAULT/70 p-3">
                          <span className={`flex items-center justify-between ${s.color}`}>
                            <span className="text-text-faint">{s.icon}</span>
                            <span className="font-orbitron text-lg font-bold">{s.value}</span>
                          </span>
                          <div className="mt-2 text-[11px] text-text-muted">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        title: "Filter",
                        value: "Smart",
                        color: "text-cyan-200",
                      },
                      {
                        title: "PID",
                        value: "Recommended",
                        color: "text-purple-200",
                      },
                      {
                        title: "CLI",
                        value: "Copy ready",
                        color: "text-green-200",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-bg-border bg-bg-surface/55 px-4 py-3"
                      >
                        <div className="text-[10px] uppercase tracking-[0.28em] text-text-faint">{item.title}</div>
                        <div className={`mt-1 font-orbitron text-sm font-bold ${item.color}`}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-text-faint">
                How it works
              </p>
              <h2 className="mt-1 font-orbitron text-sm font-bold text-text sm:text-base">
                เส้นทางใช้งานที่สั้น และไม่ซับซ้อน
              </h2>
            </div>
            <span className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-cyan-200">
              MOBILE FIRST
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
            {flowSteps.map((s, i) => {
              const a = flowAccentClasses[s.accent];
              return (
                <div
                  key={s.step}
                  className={`relative overflow-hidden rounded-[28px] border ${a.border} bg-bg-surface/70 p-4 shadow-[0_16px_36px_rgba(0,0,0,0.18)] backdrop-blur-md`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.04),transparent_35%)]" />
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${a.dot}`} />
                      <span className={`font-mono text-[11px] tracking-[0.34em] ${a.text}`}>STEP {s.step}</span>
                    </div>
                    <p className="mt-3 font-orbitron text-[14px] font-bold text-text">{s.title}</p>
                    <p className="mt-2 text-[12px] leading-relaxed text-text-muted">{s.body}</p>
                    {i < flowSteps.length - 1 && (
                      <svg
                        className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-text-faint lg:block"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="M13 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-text-faint">
                Core modules
              </p>
              <h2 className="mt-1 font-orbitron text-sm font-bold text-text sm:text-base">
                ฟังก์ชันหลักของ OBIXCORE
              </h2>
            </div>
            <span className="rounded-full border border-green-300/15 bg-green-muted/10 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-green-200">
              READY
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {tools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </section>

        <section className="pt-1">
          <SupportBanner />
        </section>
      </div>

      <style jsx global>{`
        .grid-bg {
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent 95%);
        }

        .scanline-overlay {
          background-image:
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.02) 0%,
              rgba(255, 255, 255, 0.01) 2%,
              transparent 3%,
              transparent 6%,
              rgba(255, 255, 255, 0.01) 7%,
              transparent 8%
            );
          background-size: 100% 8px;
          mix-blend-mode: screen;
        }

        @keyframes shine {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -50% 0;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-10px) translateX(6px);
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-6px) translateX(-5px);
          }
        }

        .button-shine {
          animation: shine 4.8s linear infinite;
        }

        .button-shine-slower {
          animation: shine 7s linear infinite;
        }

        .floating-glow {
          animation: float 9s ease-in-out infinite;
        }

        .floating-glow-slow {
          animation: floatSlow 12s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
