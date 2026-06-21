"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Home",
    labelTh: "หน้าหลัก",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: "/wizard",
    label: "Wizard",
    labelTh: "Wizard",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
      </svg>
    ),
  },
  {
    href: "/problems",
    label: "Problems",
    labelTh: "แก้ปัญหา",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    href: "/calculator",
    label: "Calc",
    labelTh: "คำนวณ",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <line x1="8" y1="6" x2="16" y2="6"/>
        <line x1="8" y1="10" x2="16" y2="10"/>
        <line x1="8" y1="14" x2="12" y2="14"/>
        <line x1="8" y1="18" x2="10" y2="18"/>
      </svg>
    ),
  },
  {
    href: "/presets",
    label: "Presets",
    labelTh: "Preset",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:flex fixed top-4 left-1/2 z-50 w-[min(1120px,calc(100%-1.5rem))] -translate-x-1/2 items-center justify-between rounded-2xl border border-bg-border/80 bg-bg-surface/92 px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.22)] backdrop-blur-[4px]">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-green-DEFAULT/60 bg-green-muted/40 transition-all group-hover:border-green-DEFAULT group-hover:shadow-[0_0_16px_rgba(0,232,122,0.16)]">
            <div className="absolute inset-0 rounded-xl bg-green-DEFAULT/10 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="relative text-xs font-orbitron font-black text-green-DEFAULT">OX</span>
          </div>
          <div>
            <span className="block font-orbitron text-base font-bold tracking-[0.35em] text-text transition-colors group-hover:text-green-DEFAULT">
              OBIXCORE
            </span>
            <span className="block text-[10px] font-mono tracking-[0.28em] text-text-faint">
              FPV TUNING PLATFORM
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1 rounded-full border border-bg-border/80 bg-bg-surface/90 p-1">
          {navItems.slice(1).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-green-muted/80 text-green-DEFAULT shadow-[0_0_24px_rgba(0,232,122,0.14)]"
                    : "text-text-muted hover:bg-bg-elevated/80 hover:text-text"
                }`}
              >
                <span className={`transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-105"}`}>
                  {item.icon(active)}
                </span>
                <span className="font-mono text-[13px] tracking-wide">{item.label}</span>
                {active && <span className="absolute inset-0 rounded-full ring-1 ring-green-DEFAULT/30" />}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 rounded-full border border-bg-border/80 bg-bg-surface/90 px-3 py-2 shadow-[0_10px_24px_rgba(0,0,0,0.18)] text-[11px] font-mono tracking-[0.22em] text-text-faint">
          <span className="h-2 w-2 rounded-full bg-green-DEFAULT shadow-[0_0_16px_rgba(0,232,122,0.55)] animate-pulse-green" />
          v0.1.0
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 rounded-2xl border border-bg-border/80 bg-bg-surface/92 px-2 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.22)] backdrop-blur-[4px]">
        <div className="flex items-stretch justify-around gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] transition-all ${
                  active ? "text-green-DEFAULT" : "text-text-muted"
                }`}
              >
                <div className={`relative transition-transform ${active ? "scale-110" : ""}`}>
                  <span className={`absolute inset-0 rounded-full blur-xl transition-opacity ${active ? "bg-green-DEFAULT/14 opacity-100" : "opacity-0"}`} />
                  {item.icon(active)}
                </div>
                <span className="font-sarabun">{item.labelTh}</span>
                {active && <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-green-DEFAULT" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
