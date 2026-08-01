"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OBIXLogo from "@/components/OBIXLogo";

/**
 * Line-style icon matching the reference mockup: thin uniform stroke,
 * neutral blue by default, tinted via currentColor when the tab is active
 * (color is applied by the wrapping element, not baked into an image).
 */
function NavIcon({ path, size = 26, active = false }: { path: React.ReactNode; size?: number; active?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 1.9 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      {path}
    </svg>
  );
}

const navItems = [
  {
    href: "/",
    label: "Home",
    labelTh: "หน้าหลัก",
    accent: "green" as const,
    icon: (active: boolean, size?: number) => (
      <NavIcon
        active={active}
        size={size}
        path={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>}
      />
    ),
  },
  {
    href: "/wizard",
    label: "Wizard",
    labelTh: "Wizard",
    accent: "green" as const,
    icon: (active: boolean, size?: number) => (
      <NavIcon
        active={active}
        size={size}
        path={<><path d="M4 18c1-6 4-11 8-15 4 4 7 9 8 15-2.5-1.5-5.3-2-8-2s-5.5.5-8 2Z"/><path d="M9 6l.6 1.6M14.4 7.6L15 6"/><circle cx="12" cy="4" r="1"/></>}
      />
    ),
  },
  {
    href: "/diagnose",
    label: "Diagnose",
    labelTh: "วิเคราะห์",
    accent: "red" as const,
    icon: (active: boolean, size?: number) => (
      <NavIcon
        active={active}
        size={size}
        path={<><circle cx="10.5" cy="10.5" r="6.5"/><path d="M6 10.5h2l1.2-2.5 1.6 4 1.2-1.5h2"/><line x1="15.2" y1="15.2" x2="20" y2="20"/></>}
      />
    ),
  },
  {
    href: "/problems",
    label: "Problems",
    labelTh: "แก้ปัญหา",
    accent: "amber" as const,
    icon: (active: boolean, size?: number) => (
      <NavIcon
        active={active}
        size={size}
        path={<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}
      />
    ),
  },
  {
    href: "/calculator",
    label: "Calc",
    labelTh: "คำนวณ",
    accent: "blue" as const,
    icon: (active: boolean, size?: number) => (
      <NavIcon
        active={active}
        size={size}
        path={<><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><circle cx="8" cy="11" r="0.9" fill="currentColor" stroke="none"/><circle cx="12" cy="11" r="0.9" fill="currentColor" stroke="none"/><circle cx="16" cy="11" r="0.9" fill="currentColor" stroke="none"/><circle cx="8" cy="15" r="0.9" fill="currentColor" stroke="none"/><circle cx="12" cy="15" r="0.9" fill="currentColor" stroke="none"/><circle cx="16" cy="15" r="0.9" fill="currentColor" stroke="none"/></>}
      />
    ),
  },
  {
    href: "/presets",
    label: "Presets",
    labelTh: "Preset",
    accent: "purple" as const,
    icon: (active: boolean, size?: number) => (
      <NavIcon
        active={active}
        size={size}
        path={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 12.5l1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3z"/></>}
      />
    ),
  },
  {
    href: "/visualizer",
    label: "3D View",
    labelTh: "3D View",
    accent: "cyan" as const,
    icon: (active: boolean, size?: number) => (
      <NavIcon
        active={active}
        size={size}
        path={<><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="M12 3v9M12 12l8-4.5M12 12l-8-4.5M12 12v9"/></>}
      />
    ),
  },
  {
    href: "/blackbox",
    label: "Blackbox",
    labelTh: "Blackbox",
    accent: "pink" as const,
    icon: (active: boolean, size?: number) => (
      <NavIcon
        active={active}
        size={size}
        path={<path d="M2 12h4l2-7 4 14 3-9 2 5h5"/>}
      />
    ),
  },
  {
    href: "/profiles",
    label: "Profiles",
    labelTh: "Profiles",
    accent: "blue" as const,
    icon: (active: boolean, size?: number) => (
      <NavIcon
        active={active}
        size={size}
        path={<><rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="10" height="4" rx="1"/></>}
      />
    ),
  },
  {
    href: "/tricks",
    label: "Tricks",
    labelTh: "ท่าบิน",
    accent: "orange" as const,
    icon: (active: boolean, size?: number) => (
      <NavIcon
        active={active}
        size={size}
        path={<><path d="M4 4c4 0 6 2 8 6 2-4 4-6 8-6"/><path d="M4 20c4 0 6-2 8-6 2 4 4 6 8 6"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></>}
      />
    ),
  },
  {
    href: "/compatibility",
    label: "Parts",
    labelTh: "ชิ้นส่วน",
    accent: "lime" as const,
    icon: (active: boolean, size?: number) => (
      <NavIcon
        active={active}
        size={size}
        path={<><path d="M14.7 6.3a3 3 0 0 0-4.24 4.24l-6.36 6.36a1.5 1.5 0 0 0 2.12 2.12l6.36-6.36a3 3 0 0 0 4.24-4.24l-2.12 2.12-2.12-2.12z"/></>}
      />
    ),
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
  orange: "bg-orange-muted/25",
  lime: "bg-lime-muted/25",
};

const ACCENT_BG_GLOW: Record<NavAccent, string> = {
  green: "bg-green-DEFAULT/15",
  red: "bg-red-DEFAULT/15",
  amber: "bg-amber-DEFAULT/15",
  blue: "bg-blue-DEFAULT/15",
  purple: "bg-purple-DEFAULT/15",
  cyan: "bg-cyan-DEFAULT/15",
  pink: "bg-pink-DEFAULT/15",
  orange: "bg-orange-DEFAULT/15",
  lime: "bg-lime-DEFAULT/15",
};

const ACCENT_RING: Record<NavAccent, string> = {
  green: "ring-green-DEFAULT/30",
  red: "ring-red-DEFAULT/30",
  amber: "ring-amber-DEFAULT/30",
  blue: "ring-blue-DEFAULT/30",
  purple: "ring-purple-DEFAULT/30",
  cyan: "ring-cyan-DEFAULT/30",
  pink: "ring-pink-DEFAULT/30",
  orange: "ring-orange-DEFAULT/30",
  lime: "ring-lime-DEFAULT/30",
};

const ACCENT_TEXT: Record<NavAccent, string> = {
  green: "text-green-DEFAULT",
  red: "text-red-DEFAULT",
  amber: "text-amber-DEFAULT",
  blue: "text-blue-DEFAULT",
  purple: "text-purple-DEFAULT",
  cyan: "text-cyan-DEFAULT",
  pink: "text-pink-DEFAULT",
  orange: "text-orange-DEFAULT",
  lime: "text-lime-DEFAULT",
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
                <span className={`relative transition-transform duration-200 ${active ? `scale-110 ${ACCENT_TEXT[item.accent]}` : "text-blue-DEFAULT/70 group-hover:scale-105 group-hover:text-blue-DEFAULT"}`}>
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

      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 hud-card px-2 py-2">
        <div className="flex items-stretch gap-1 overflow-x-auto">
          {[...navItems, {
            href: "/support",
            label: "Support",
            labelTh: "สนับสนุน",
            accent: "pink" as const,
            icon: (active: boolean, size?: number) => (
              <svg width={size ?? 30} height={size ?? 30} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            ),
          }].map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex w-[64px] flex-shrink-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[12px] transition-all"
              >
                <div className={`relative ${active ? ACCENT_TEXT[item.accent] : "text-blue-DEFAULT/70"}`}>
                  <span
                    className={`absolute inset-0 rounded-full blur-xl transition-opacity ${
                      active ? `opacity-100 animate-glow-pulse ${ACCENT_BG_GLOW[item.accent]}` : "opacity-0"
                    }`}
                  />
                  {item.icon(active, 30)}
                </div>
                <span className={`font-sarabun ${active ? ACCENT_TEXT[item.accent] : "text-text-muted"}`}>{item.labelTh}</span>
                {active && (
                  <span
                    className={`absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full ${
                      item.accent === "green" ? "bg-green-DEFAULT"
                      : item.accent === "red" ? "bg-red-DEFAULT"
                      : item.accent === "amber" ? "bg-amber-DEFAULT"
                      : item.accent === "blue" ? "bg-blue-DEFAULT"
                      : item.accent === "purple" ? "bg-purple-DEFAULT"
                      : item.accent === "cyan" ? "bg-cyan-DEFAULT"
                      : item.accent === "orange" ? "bg-orange-DEFAULT"
                      : item.accent === "lime" ? "bg-lime-DEFAULT"
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
