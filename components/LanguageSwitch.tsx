"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * TH/EN toggle. English routes live under /en/* mirroring the Thai routes
 * at root (e.g. /wizard <-> /en/wizard). Pages that don't have an English
 * version yet simply don't render this — see each page.tsx's usage.
 */
export default function LanguageSwitch({ enHref }: { enHref: string }) {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith("/en");
  const thHref = pathname?.replace(/^\/en/, "") || "/";

  return (
    <div className="hud-chip inline-flex items-center gap-1 rounded-full p-1 text-[11px] font-mono">
      <Link
        href={thHref === "" ? "/" : thHref}
        className={`rounded-full px-2.5 py-1 transition-colors ${!isEnglish ? "bg-green-muted text-green-DEFAULT" : "text-text-faint hover:text-text-muted"}`}
      >
        TH
      </Link>
      <Link
        href={enHref}
        className={`rounded-full px-2.5 py-1 transition-colors ${isEnglish ? "bg-green-muted text-green-DEFAULT" : "text-text-faint hover:text-text-muted"}`}
      >
        EN
      </Link>
    </div>
  );
}
