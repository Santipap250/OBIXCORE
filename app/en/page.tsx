import ToolCard from "@/components/ToolCard";
import Link from "next/link";
import MissionHero from "@/components/MissionHero";
import MetricStrip from "@/components/MetricStrip";
import SectionHeader from "@/components/SectionHeader";
import LanguageSwitch from "@/components/LanguageSwitch";
import { CHANGELOG } from "@/lib/changelog";
import type { Metadata } from "next";

const HOME_TITLE = "OBIXCORE — FPV Drone Tuning Platform | Betaflight PID, Preset, Calculator";
const HOME_DESCRIPTION =
  "A complete FPV drone tuning toolkit: Tuning Wizard auto-calculates Betaflight PID values, Problem Solver diagnoses flight issues, Calculator estimates thrust/flight time, Preset Library, and 3D Build Visualizer — all free.";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  keywords: [
    "FPV drone tuning",
    "Betaflight PID calculator",
    "drone tuning wizard",
    "FPV preset library",
    "drone build visualizer",
    "FPV drone setup guide",
  ],
  alternates: {
    canonical: "/en",
    languages: { "th-TH": "/", "en-US": "/en" },
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "/en",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "OBIXCORE FPV Tuning Platform" }],
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
    titleTh: "Auto PID Tuning",
    description: "Enter your drone specs → get PID + Filter + Rates + CLI, ready to copy",
    accentColor: "green" as const,
    badge: "Recommended",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18c1-6 4-11 8-15 4 4 7 9 8 15-2.5-1.5-5.3-2-8-2s-5.5.5-8 2Z"/><path d="M9 6l.6 1.6M14.4 7.6L15 6"/><circle cx="12" cy="4" r="1"/>
      </svg>
    ),
  },
  {
    href: "/diagnose",
    title: "ConfigDoctor",
    titleTh: "Diagnose Your Build",
    description: "Health/Safety/Efficiency/Performance/Reliability score with warnings, prioritized by severity",
    accentColor: "red" as const,
    badge: "NEW",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10.5" cy="10.5" r="6.5"/><path d="M6 10.5h2l1.2-2.5 1.6 4 1.2-1.5h2"/><line x1="15.2" y1="15.2" x2="20" y2="20"/>
      </svg>
    ),
  },
  {
    href: "/problems",
    title: "Problem Solver",
    titleTh: "Fix Flight Issues",
    description: "Pick the symptom you're seeing → get a step-by-step fix with CLI commands",
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
    titleTh: "Thrust / Flight Time",
    description: "Estimate thrust-to-weight ratio, flight time, and current draw",
    accentColor: "blue" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><circle cx="8" cy="11" r="0.9" fill="currentColor" stroke="none"/><circle cx="12" cy="11" r="0.9" fill="currentColor" stroke="none"/><circle cx="16" cy="11" r="0.9" fill="currentColor" stroke="none"/><circle cx="8" cy="15" r="0.9" fill="currentColor" stroke="none"/><circle cx="12" cy="15" r="0.9" fill="currentColor" stroke="none"/><circle cx="16" cy="15" r="0.9" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    href: "/presets",
    title: "Preset Library",
    titleTh: "Ready-to-Use Presets",
    description: "Field-tested PID + Rates + Filters — copy and paste straight into your CLI",
    accentColor: "purple" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 12.5l1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3z"/>
      </svg>
    ),
  },
  {
    href: "/visualizer",
    title: "3D Build Visualizer",
    titleTh: "See Your Build in 3D",
    description: "Interactive preview of your FPV drone with frame/prop/motor/battery compatibility checks",
    accentColor: "cyan" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="M12 3v9M12 12l8-4.5M12 12l-8-4.5M12 12v9"/>
      </svg>
    ),
  },
  {
    href: "/blackbox",
    title: "Blackbox / Step-Response",
    titleTh: "Analyze Without a Log File",
    description: "Answer a few questions about how your drone feels in the air, get PID/filter delta recommendations with CLI commands",
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
    titleTh: "Save Multiple Builds",
    description: "Save each drone's specs and load them into Wizard or Visualizer instantly, no re-entering data",
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
  {
    href: "/tricks",
    title: "Trick Library",
    titleTh: "Freestyle Trick Guide",
    description: "Tricks from beginner to advanced, with steps, tips, and common mistakes",
    accentColor: "orange" as const,
    badge: "NEW",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4c4 0 6 2 8 6 2-4 4-6 8-6"/><path d="M4 20c4 0 6-2 8-6 2 4 4 6 8 6"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    href: "/compatibility",
    title: "Parts Compatibility",
    titleTh: "Hardware Standards Reference",
    description: "Common mounting patterns, battery connectors, and VTX antenna connectors used in FPV",
    accentColor: "lime" as const,
    badge: "NEW",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a3 3 0 0 0-4.24 4.24l-6.36 6.36a1.5 1.5 0 0 0 2.12 2.12l6.36-6.36a3 3 0 0 0 4.24-4.24l-2.12 2.12-2.12-2.12z"/>
      </svg>
    ),
  },
];

const featurePills = [
  {
    label: "Tuned from",
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
    label: "Supports 6 classes",
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
    label: "Free to use",
    highlight: "No signup",
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
    value: String(tools.length),
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
    label: "Drone Classes",
    color: "text-blue-DEFAULT",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 3 7l9 5 9-5-9-5Z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/>
      </svg>
    ),
  },
  {
    value: "FREE",
    label: "100% Free",
    color: "text-green-DEFAULT",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
];

const flowSteps = [
  {
    step: "01",
    title: "Pick a Problem / Enter Specs",
    body: "Describe a symptom in Problem Solver, or enter your drone specs in Wizard",
    accent: "green" as const,
  },
  {
    step: "02",
    title: "Analyze",
    body: "The system classifies your drone class and estimates propLoad/inertia from real specs",
    accent: "blue" as const,
  },
  {
    step: "03",
    title: "Get Tuned Values with Reasoning",
    body: "PID / Filter / Rates with a confidence score and an explanation of why",
    accent: "purple" as const,
  },
  {
    step: "04",
    title: "Copy CLI and Fly",
    body: "Copy and paste straight into the Betaflight CLI — no manual unit conversion needed",
    accent: "pink" as const,
  },
];

const flowAccentClasses = {
  green: { dot: "bg-green-DEFAULT", text: "text-green-DEFAULT", border: "border-green-DEFAULT/25" },
  blue: { dot: "bg-blue-DEFAULT", text: "text-blue-DEFAULT", border: "border-blue-DEFAULT/25" },
  purple: { dot: "bg-purple-DEFAULT", text: "text-purple-DEFAULT", border: "border-purple-DEFAULT/25" },
  pink: { dot: "bg-pink-DEFAULT", text: "text-pink-DEFAULT", border: "border-pink-DEFAULT/25" },
};

export default function HomePageEn() {
  const latestVersion = CHANGELOG[0]?.version ?? "v0.0.0";

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex justify-end">
        <LanguageSwitch enHref="/en" />
      </div>

      <section className="hud-card overflow-hidden rounded-[1.75rem] p-5 md:p-6">
        <div className="absolute inset-x-0 top-0 h-1 color-strip" />
        <div className="absolute -right-12 top-8 h-40 w-40 rounded-full bg-blue-DEFAULT/10 blur-3xl" />
        <div className="absolute -left-14 bottom-6 h-44 w-44 rounded-full bg-pink-DEFAULT/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-green-DEFAULT/8 blur-3xl" />

        <MissionHero
          version={latestVersion}
          moduleCount={tools.length}
          featurePills={featurePills}
          headline="FPV Drone Tuning Built on Real Physics, Not Guesswork"
          subheadline="A practical FPV drone tuning toolkit — set up, diagnose, calculate, and copy ready-to-use values, all in one place"
          wizardLabel1="START TUNING"
          wizardLabel2="WIZARD"
          problemsPrompt="Having a flight issue?"
          problemsLabel="GO TO PROBLEM SOLVER"
        />

        <div className="relative mt-6">
          <MetricStrip metrics={quickStats} />
        </div>
      </section>

      <section className="mt-6">
        <SectionHeader title="How It Works" />
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
        <SectionHeader title="Core Modules" />
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
            <span className="text-[13px] text-text-muted">OBIXCORE is a free tool maintained by a solo pilot — you can support the project here</span>
          </div>
          <svg className="h-4 w-4 flex-shrink-0 text-text-faint transition-all group-hover:translate-x-1 group-hover:text-pink-DEFAULT" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
