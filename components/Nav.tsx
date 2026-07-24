"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OBIXLogo from "@/components/OBIXLogo";

/**
 * Renders the icon artwork at full color (keeps the cyan glow look from the
 * source art). Active/inactive state is shown via opacity + scale on the
 * wrapping element, since the color itself is now baked into the image.
 */
function IconImg({ src, size = 30, active = true }: { src: string; size?: number; active?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 transition-opacity"
      style={{
        width: size,
        height: size,
        opacity: active ? 1 : 0.7,
        backgroundImage: `url(${src})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    />
  );
}

const navItems = [
  {
    href: "/",
    label: "Home",
    labelTh: "หน้าหลัก",
    accent: "green" as const,
    icon: (active: boolean, size?: number) => <IconImg src="/icons/home.png" active={active} size={size} />,
  },
  {
    href: "/wizard",
    label: "Wizard",
    labelTh: "Wizard",
    accent: "green" as const,
    icon: (active: boolean, size?: number) => <IconImg src="/icons/wizard.png" active={active} size={size} />,
  },
  {
    href: "/diagnose",
    label: "Diagnose",
    labelTh: "วิเคราะห์",
    accent: "red" as const,
    icon: (active: boolean, size?: number) => <IconImg src="/icons/diagnose.png" active={active} size={size} />,
  },
  {
    href: "/problems",
    label: "Problems",
    labelTh: "แก้ปัญหา",
    accent: "amber" as const,
    icon: (active: boolean, size?: number) => <IconImg src="/icons/problems.png" active={active} size={size} />,
  },
  {
    href: "/calculator",
    label: "Calc",
    labelTh: "คำนวณ",
    accent: "blue" as const,
    icon: (active: boolean, size?: number) => <IconImg src="/icons/calculator.png" active={active} size={size} />,
  },
  {
    href: "/presets",
    label: "Presets",
    labelTh: "Preset",
    accent: "purple" as const,
    icon: (active: boolean, size?: number) => <IconImg src="/icons/presets.png" active={active} size={size} />,
  },
  {
    href: "/visualizer",
    label: "3D View",
    labelTh: "3D View",
    accent: "cyan" as const,
    icon: (active: boolean, size?: number) => <IconImg src="/icons/3d-view.png" active={active} size={size} />,
  },
  {
    href: "/blackbox",
    label: "Blackbox",
    labelTh: "Blackbox",
    accent: "pink" as const,
    icon: (active: boolean, size?: number) => <IconImg src="/icons/blackbox.png" active={active} size={size} />,
  },
  {
    href: "/profiles",
    label: "Profiles",
    labelTh: "Profiles",
    accent: "blue" as const,
    icon: (active: boolean, size?: number) => <IconImg src="/icons/profiles.png" active={active} size={size} />,
  },
] as const;

type NavAccent = (typeof navItems)[number]["accent"];

const ACCENT_BG_SOFT: Record<NavAccent, string> = {
  green: "bg-green-muted/25",
  red: "bg-red-muted/25",
  amber: "bg-amber-muted/25",
  blue: "bg-blue-muted/25",
  purple: "bg-purple-muted/25",
  cyan: "bg-cyan-muted/25",
  pink: "bg-pink-muted/25",
};

const ACCENT_BG_GLOW: Record<NavAccent, string> = {
  green: "bg-green-DEFAULT/15",
  red: "bg-red-DEFAULT/15",
  amber: "bg-amber-DEFAULT/15",
  blue: "bg-blue-DEFAULT/15",
  purple: "bg-purple-DEFAULT/15",
  cyan: "bg-cyan-DEFAULT/15",
  pink: "bg-pink-DEFAULT/15",
};

const ACCENT_RING: Record<NavAccent, string> = {
  green: "ring-green-DEFAULT/30",
  red: "ring-red-DEFAULT/30",
  amber: "ring-amber-DEFAULT/30",
  blue: "ring-blue-DEFAULT/30",
  purple: "ring-purple-DEFAULT/30",
  cyan: "ring-cyan-DEFAULT/30",
  pink: "ring-pink-DEFAULT/30",
};

const ACCENT_TEXT: Record<NavAccent, string> = {
  green: "text-green-DEFAULT",
  red: "text-red-DEFAULT",
  amber: "text-amber-DEFAULT",
  blue: "text-blue-DEFAULT",
  purple: "text-purple-DEFAULT",
  cyan: "text-cyan-DEFAULT",
  pink: "text-pink-DEFAULT",
};

export default function Nav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden md:flex fixed top-4 left-1/2 z-50 w-[min(1120px,calc(100%-1.5rem))] -translate-x-1/2 items-center justify-between rounded-2xl hud-card px-4 py-3">
        <Link href="/" className="group flex items-center gap-0">
          <OBIXLogo height={38} className="transition-opacity group-hover:opacity-90" />
        </Link>

        <div className="flex items-center gap-1 rounded-full border border-bg-border/80 bg-bg-surface/70 p-1">
          {navItems.slice(1).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? `bg-bg-elevated text-text ring-1 ring-inset ${ACCENT_RING[item.accent]}`
                    : "text-text-muted hover:bg-bg-elevated/80 hover:text-text"
                }`}
              >
                <span
                  className={`absolute inset-0 rounded-full opacity-0 transition-opacity ${
                    active ? "opacity-100" : "group-hover:opacity-100"
                  } ${ACCENT_BG_SOFT[item.accent]}`}
                />
                <span className={`relative transition-transform duration-200 ${active ? `scale-110 ${ACCENT_TEXT[item.accent]}` : "group-hover:scale-105"}`}>
                  {item.icon(active, 24)}
                </span>
                <span className="relative font-mono text-[13px] tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <Link
          href="/support"
          className="group relative hidden md:inline-flex items-center gap-1.5 rounded-full border border-pink-DEFAULT/30 bg-pink-muted/25 px-3 py-2 text-[12px] font-mono tracking-wide text-pink-DEFAULT transition-all hover:border-pink-DEFAULT/60 hover:bg-pink-muted/40"
          aria-label="สนับสนุน OBIXCORE"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="hidden lg:inline">Support</span>
        </Link>

        <Link
          href="/changelog"
          className="hud-chip flex items-center gap-2 px-3 py-2 text-[12px] font-mono tracking-[0.22em] text-text-faint transition-colors hover:text-text"
          aria-label="ดู changelog เวอร์ชัน v0.4.0"
        >
          <span className="h-2 w-2 rounded-full bg-green-DEFAULT shadow-[0_0_16px_rgba(0,232,122,0.55)] animate-pulse-green" />
          v0.4.0
        </Link>
      </nav>

      {/* Floating Support button — mobile only (matches the bottom-tab
          breakpoint). At md+ the desktop nav above already has a Support
          pill, so this is hidden there to avoid overlapping it. */}
      <Link
        href="/support"
        className="md:hidden fixed top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full hud-chip border-pink-DEFAULT/30 text-pink-DEFAULT shadow-[0_0_16px_rgba(255,95,183,0.18)] active:scale-95 transition-all"
        aria-label="สนับสนุน OBIXCORE"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </Link>

      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 hud-card px-2 py-2">
        <div className="flex items-stretch gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex w-[64px] flex-shrink-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[12px] transition-all ${
                  active ? ACCENT_TEXT[item.accent] : "text-text-muted"
                }`}
              >
                <div className="relative">
                  <span
                    className={`absolute inset-0 rounded-full blur-xl transition-opacity ${
                      active ? `opacity-100 animate-glow-pulse ${ACCENT_BG_GLOW[item.accent]}` : "opacity-0"
                    }`}
                  />
                  {item.icon(active, 30)}
                </div>
                <span className="font-sarabun">{item.labelTh}</span>
                {active && (
                  <span
                    className={`absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full ${
                      item.accent === "green" ? "bg-green-DEFAULT"
                      : item.accent === "red" ? "bg-red-DEFAULT"
                      : item.accent === "amber" ? "bg-amber-DEFAULT"
                      : item.accent === "blue" ? "bg-blue-DEFAULT"
                      : item.accent === "purple" ? "bg-purple-DEFAULT"
                      : item.accent === "cyan" ? "bg-cyan-DEFAULT"
                      : "bg-pink-DEFAULT"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
