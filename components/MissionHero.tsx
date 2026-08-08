import Link from "next/link";
import OBIXLogo from "@/components/OBIXLogo";
import StatusCard from "@/components/StatusCard";
import type { ReactNode } from "react";

export interface FeaturePill {
  label: string;
  highlight: string;
  accent: "green" | "blue" | "purple" | "amber";
  icon: ReactNode;
}

const pillAccentClasses = {
  green: { border: "border-green-DEFAULT/25", text: "text-green-DEFAULT", bg: "bg-green-muted/10" },
  blue: { border: "border-blue-DEFAULT/25", text: "text-blue-DEFAULT", bg: "bg-blue-muted/10" },
  purple: { border: "border-purple-DEFAULT/25", text: "text-purple-DEFAULT", bg: "bg-purple-muted/10" },
  amber: { border: "border-amber-DEFAULT/25", text: "text-amber-DEFAULT", bg: "bg-amber-muted/10" },
};

/**
 * The Home dashboard's hero: brand lockup, headline, status readout,
 * feature pills, and the two primary calls to action (Wizard / Problem
 * Solver). Everything below this (metrics, flow steps, module grid) is
 * composed alongside it in app/page.tsx, not inside this component — this
 * only owns the "who we are / what to do first" part of the screen.
 */
export default function MissionHero({
  version,
  moduleCount,
  featurePills,
  headline = "จูนโดรน FPV จากฟิสิกส์จริง ไม่ใช่การเดา",
  subheadline = "เครื่องมือจูนโดรน FPV ที่ใช้งานได้จริง — ตั้งค่า, วิเคราะห์, คำนวณ และ copy ค่าพร้อมใช้ได้ในที่เดียว",
  wizardHref = "/wizard",
  wizardLabel1 = "START TUNING",
  wizardLabel2 = "WIZARD",
  problemsHref = "/problems",
  problemsPrompt = "เจอปัญหาการบินอยู่?",
  problemsLabel = "ไปที่ PROBLEM SOLVER",
}: {
  version: string;
  moduleCount: number;
  featurePills: FeaturePill[];
  headline?: string;
  subheadline?: string;
  wizardHref?: string;
  wizardLabel1?: string;
  wizardLabel2?: string;
  problemsHref?: string;
  problemsPrompt?: string;
  problemsLabel?: string;
}) {
  return (
    <div className="relative space-y-6 text-center">
      <div className="mx-auto w-full max-w-[640px]">
        <OBIXLogo maxWidth={640} className="mx-auto" />
      </div>

      <StatusCard version={version} moduleCount={moduleCount} />

      <h1 className="gradient-text font-orbitron mx-auto max-w-xl text-lg font-bold leading-snug md:text-2xl">
        {headline}
      </h1>

      <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-text-muted">
        {subheadline}
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
          href={wizardHref}
          className="shimmer-sweep group flex items-center justify-between rounded-2xl border border-green-DEFAULT bg-gradient-to-r from-green-DEFAULT via-[#8ef0c8] to-cyan-DEFAULT px-4 py-4 text-left shadow-[0_2px_4px_rgba(0,0,0,0.3),0_0_28px_rgba(70,240,184,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.35),0_0_40px_rgba(70,240,184,0.5)] active:translate-y-0 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-DEFAULT text-green-DEFAULT">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L4 14h7l-1 8 10-14h-7l1-6z"/>
              </svg>
            </div>
            <div>
              <div className="font-orbitron text-sm font-bold uppercase tracking-wide text-bg-DEFAULT">
                {wizardLabel1}
              </div>
              <div className="font-orbitron text-sm font-bold uppercase tracking-wide text-bg-DEFAULT">
                {wizardLabel2}
              </div>
            </div>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-bg-DEFAULT text-bg-DEFAULT transition-transform group-hover:translate-x-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </span>
        </Link>

        <Link
          href={problemsHref}
          className="shimmer-sweep group flex items-center justify-between rounded-2xl border border-purple-DEFAULT/30 bg-purple-muted/10 px-4 py-3.5 text-left shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-DEFAULT/60 hover:shadow-[0_6px_16px_rgba(0,0,0,0.25),0_0_20px_rgba(180,145,255,0.15)] active:translate-y-0 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-DEFAULT/40 text-purple-DEFAULT">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </span>
            <div className="text-[13px]">
              <div className="text-text-muted">{problemsPrompt}</div>
              <div className="font-orbitron text-[13px] font-bold text-purple-DEFAULT">{problemsLabel}</div>
            </div>
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-purple-DEFAULT/40 text-purple-DEFAULT transition-transform group-hover:translate-x-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
