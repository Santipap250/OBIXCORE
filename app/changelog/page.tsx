import type { Metadata } from "next";
import { CHANGELOG, type ChangeKind } from "@/lib/changelog";

const TITLE = "Changelog — ความเคลื่อนไหวของ OBIXCORE | OBIXCORE";
const DESCRIPTION = "อัปเดตฟีเจอร์ใหม่ การปรับปรุง และการแก้ไขทั้งหมดของ OBIXCORE เรียงตามเวอร์ชัน";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/changelog" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/changelog",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "OBIXCORE Changelog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.svg"],
  },
};

const kindStyle: Record<ChangeKind, { label: string; className: string }> = {
  new: { label: "ใหม่", className: "bg-green-muted/70 text-green-DEFAULT border-green-DEFAULT/30" },
  improved: { label: "ปรับปรุง", className: "bg-blue-muted/70 text-blue-DEFAULT border-blue-DEFAULT/30" },
  fixed: { label: "แก้ไข", className: "bg-amber-muted/70 text-amber-DEFAULT border-amber-DEFAULT/30" },
};

export default function ChangelogPage() {
  return (
    <div className="page-shell py-6">
      <section className="hud-card overflow-hidden rounded-[1.75rem] p-5 md:p-8">
        <div className="absolute inset-x-0 top-0 h-1 color-strip" />
        <span className="hud-chip inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-DEFAULT shadow-[0_0_10px_rgba(99,179,255,0.6)]" />
          Changelog
        </span>
        <h1 className="mt-3 font-orbitron text-2xl font-bold tracking-tight md:text-3xl">
          <span className="gradient-text">ความเคลื่อนไหวของ OBIXCORE</span>
        </h1>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-text-muted">
          ทุกฟีเจอร์ใหม่ การปรับปรุง และการแก้ไข เรียงตามเวอร์ชัน ล่าสุดอยู่บนสุด
        </p>
      </section>

      <section className="mt-6">
        <ol className="relative space-y-6 border-l border-bg-border pl-6 md:pl-8">
          {CHANGELOG.map((entry) => (
            <li key={entry.version} className="relative">
              <span className="absolute -left-[calc(1.5rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-green-DEFAULT shadow-[0_0_10px_rgba(0,232,122,0.6)] md:-left-[calc(2rem+5px)]" />

              <div className="hud-panel rounded-2xl p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="hud-chip px-2.5 py-1 font-mono text-xs font-bold tracking-wider text-text">{entry.version}</span>
                  <time dateTime={entry.date} className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-faint">
                    {entry.date}
                  </time>
                </div>

                <h2 className="mt-3 font-orbitron text-lg font-bold text-text">{entry.title}</h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">{entry.summary}</p>

                <ul className="mt-4 space-y-2.5">
                  {entry.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-text-muted">
                      <span
                        className={`mt-0.5 flex-shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${kindStyle[change.kind].className}`}
                      >
                        {kindStyle[change.kind].label}
                      </span>
                      <span>{change.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
