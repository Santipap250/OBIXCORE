import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import CopyButton from "@/components/CopyButton";
import { SUPPORT_LINKS, SUPPORT_TIERS } from "@/lib/support";

const TITLE = "สนับสนุน OBIXCORE — ร่วมเป็นทีมภาคพื้น | OBIXCORE";
const DESCRIPTION =
  "OBIXCORE เป็นเครื่องมือจูนโดรน FPV ฟรีที่พัฒนาโดยนักบินคนเดียว การสนับสนุนของคุณช่วยเรื่องค่า server, พัฒนาฟีเจอร์ใหม่ และเพิ่มความแม่นยำของเครื่องมือ";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["สนับสนุน OBIXCORE", "donate FPV tool", "support open source drone tool", "buy me a coffee FPV"],
  alternates: { canonical: "/support" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/support",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "สนับสนุน OBIXCORE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.svg"],
  },
};

const buildHelps = [
  {
    title: "ค่า Server / Hosting",
    body: "OBIXCORE รันบน server จริงตลอด 24 ชม. ค่าใช้จ่ายนี้เกิดขึ้นทุกเดือนไม่ว่าจะมีคนสนับสนุนหรือไม่",
    accent: "green" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="7" rx="1.5" /><rect x="2" y="14" width="20" height="7" rx="1.5" />
        <line x1="6" y1="6.5" x2="6.01" y2="6.5" /><line x1="6" y1="17.5" x2="6.01" y2="17.5" />
      </svg>
    ),
  },
  {
    title: "พัฒนาฟีเจอร์ใหม่",
    body: "เครื่องมือใหม่ ๆ อย่าง 3D Build Visualizer และ Blackbox Reader ใช้เวลาพัฒนาเป็นสัปดาห์ การสนับสนุนช่วยให้มีเวลาทำต่อเนื่อง",
    accent: "blue" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: "ปรับปรุงความแม่นยำ",
    body: "การตรวจสอบสูตรคำนวณ thrust, current draw, และ flight time ให้แม่นขึ้นเรื่อย ๆ ต้องอาศัยข้อมูลจริงและเวลาทดสอบ",
    accent: "purple" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "เครื่องมือ FPV ใหม่ ๆ",
    body: "แผนต่อไปมีทั้ง Blackbox Reader, Drone Profile, และ Community Preset — ทั้งหมดจะยังฟรีเหมือนเดิม",
    accent: "amber" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L4 14h7l-1 8 10-14h-7l1-6z" />
      </svg>
    ),
  },
];

const accentText: Record<string, string> = {
  green: "text-green-DEFAULT",
  blue: "text-blue-DEFAULT",
  purple: "text-purple-DEFAULT",
  amber: "text-amber-DEFAULT",
};

const accentBg: Record<string, string> = {
  green: "bg-green-muted/70 border-green-DEFAULT/30",
  blue: "bg-blue-muted/70 border-blue-DEFAULT/30",
  purple: "bg-purple-muted/70 border-purple-DEFAULT/30",
  amber: "bg-amber-muted/70 border-amber-DEFAULT/30",
};

const tierAccent: Record<string, { border: string; badge: string; ring: string }> = {
  green: { border: "border-green-DEFAULT/25", badge: "bg-green-muted/70 text-green-DEFAULT", ring: "ring-green-DEFAULT/40" },
  blue: { border: "border-blue-DEFAULT/40", badge: "bg-blue-muted/70 text-blue-DEFAULT", ring: "ring-blue-DEFAULT/50" },
  purple: { border: "border-purple-DEFAULT/25", badge: "bg-purple-muted/70 text-purple-DEFAULT", ring: "ring-purple-DEFAULT/40" },
};

export default function SupportPage() {
  const hasCoffee = Boolean(SUPPORT_LINKS.buyMeACoffeeUrl);
  const hasPromptPay = Boolean(SUPPORT_LINKS.promptPayId || SUPPORT_LINKS.promptPayQrImage);

  return (
    <div className="page-shell py-6">
      {/* Hero */}
      <section className="hud-card overflow-hidden rounded-[1.75rem] p-5 md:p-8">
        <div className="absolute inset-x-0 top-0 h-1 color-strip" />
        <div className="absolute -right-14 top-6 h-40 w-40 rounded-full bg-purple-DEFAULT/12 blur-3xl" />
        <div className="absolute -left-14 bottom-6 h-44 w-44 rounded-full bg-green-DEFAULT/10 blur-3xl" />

        <div className="relative mx-auto max-w-2xl space-y-5 text-center">
          <span className="hud-chip mx-auto inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-green-DEFAULT shadow-[0_0_10px_rgba(0,232,122,0.6)]" />
            Ground Crew
          </span>

          <h1 className="font-orbitron text-2xl font-bold tracking-tight md:text-3xl">
            <span className="gradient-text">ร่วมเป็นทีมภาคพื้นให้ OBIXCORE</span>
          </h1>

          <p className="text-[15px] leading-relaxed text-text-muted">
            OBIXCORE พัฒนาโดยนักบิน FPV คนเดียว ให้เป็นเครื่องมือฟรีสำหรับชุมชน —
            ถ้าเครื่องมือนี้เคยช่วยประหยัดเวลาจูนโดรนของคุณ การสนับสนุนเล็ก ๆ
            ช่วยให้โปรเจกต์นี้ไปต่อได้ ไม่มีข้อผูกมัด ไม่มีฟีเจอร์ที่ถูกล็อกไว้หลังเงิน
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <a
              href="#ways-to-support"
              className="inline-flex items-center gap-2 rounded-2xl border border-green-DEFAULT/35 bg-gradient-to-r from-green-muted/30 to-blue-muted/20 px-5 py-3 font-orbitron text-sm font-bold tracking-widest text-text transition-all hover:border-green-DEFAULT active:scale-[0.99] glow-green"
            >
              ดูช่องทางสนับสนุน
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </a>
            <a
              href={`mailto:${SUPPORT_LINKS.contactEmail}`}
              className="inline-flex items-center gap-2 rounded-2xl border border-bg-border bg-bg-elevated/60 px-5 py-3 text-sm text-text-muted transition-all hover:border-cyan-DEFAULT/40 hover:text-cyan-DEFAULT active:scale-[0.99]"
            >
              ติดต่อ / Collaboration
            </a>
          </div>
        </div>
      </section>

      {/* Why support */}
      <section className="mt-6">
        <div className="section-title mb-3">
          <h2 className="font-orbitron text-xs font-bold uppercase tracking-[0.35em] text-text-muted">ทำไมต้องสนับสนุน</h2>
          <div className="section-title__line" />
        </div>
        <div className="hud-panel rounded-2xl p-5 md:p-6">
          <p className="text-[15px] leading-relaxed text-text-muted">
            เครื่องมือส่วนใหญ่ในวงการ FPV มักเป็นของแบรนด์ใหญ่หรือมีค่าสมาชิก
            OBIXCORE เริ่มจากความตั้งใจให้นักบินทุกคนเข้าถึงเครื่องมือจูนโดรนที่แม่นยำได้ฟรี
            ไม่ว่าจะเพิ่งเริ่มบินหรือบินมานาน — แต่การรัน server, การทดสอบสูตรคำนวณ,
            และเวลาที่ใช้พัฒนาแต่ละฟีเจอร์ล้วนมีต้นทุนจริงที่ผู้พัฒนาแบกรับอยู่คนเดียว
            การสนับสนุนของคุณไม่ว่าจะเล็กแค่ไหนก็มีความหมาย และไม่เคยเป็นเงื่อนไขในการใช้งานเครื่องมือใด ๆ บนเว็บนี้
          </p>
        </div>
      </section>

      {/* What it helps build */}
      <section className="mt-6">
        <div className="section-title mb-3">
          <h2 className="font-orbitron text-xs font-bold uppercase tracking-[0.35em] text-text-muted">งบสนับสนุนช่วยอะไรบ้าง</h2>
          <div className="section-title__line" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {buildHelps.map((item) => (
            <div key={item.title} className="hud-panel rounded-2xl p-4">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${accentBg[item.accent]} ${accentText[item.accent]}`}>
                {item.icon}
              </div>
              <div className="mt-3 font-orbitron text-sm font-semibold text-text">{item.title}</div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ways to support */}
      <section id="ways-to-support" className="mt-6 scroll-mt-24">
        <div className="section-title mb-3">
          <h2 className="font-orbitron text-xs font-bold uppercase tracking-[0.35em] text-text-muted">ช่องทางสนับสนุน</h2>
          <div className="section-title__line" />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {SUPPORT_TIERS.map((tier) => {
            const a = tierAccent[tier.accent];
            return (
              <div
                key={tier.id}
                className={`hud-card relative rounded-2xl border p-5 ${a.border} ${
                  tier.highlight ? `ring-1 ${a.ring}` : ""
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-DEFAULT px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-bg-DEFAULT">
                    แนะนำ
                  </span>
                )}
                <div className={`hud-chip inline-flex px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.22em] ${a.badge}`}>
                  {tier.nameTh}
                </div>
                <div className="mt-3 font-orbitron text-lg font-bold text-text">{tier.name}</div>
                <div className="mt-0.5 text-[12px] font-mono uppercase tracking-[0.2em] text-text-faint">{tier.price}</div>
                <p className="mt-3 text-[13px] leading-relaxed text-text-muted">{tier.description}</p>
                <ul className="mt-4 space-y-2">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-[13px] text-text-muted">
                      <svg className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${accentText[tier.accent]}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* One-time / direct channels */}
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="hud-panel rounded-2xl p-5">
            <div className="font-orbitron text-sm font-semibold text-text">Buy me a coffee</div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
              สนับสนุนครั้งเดียวแบบง่าย ๆ ผ่าน Buy Me a Coffee
            </p>
            {hasCoffee ? (
              <Link
                href={SUPPORT_LINKS.buyMeACoffeeUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-DEFAULT to-orange-DEFAULT px-4 py-2 text-sm font-semibold text-bg-DEFAULT transition-all hover:opacity-90 active:scale-[0.99]"
              >
                ☕ Buy me a coffee
              </Link>
            ) : (
              <div className="mt-4 text-[12px] text-text-faint">เร็ว ๆ นี้ — ระหว่างนี้ติดต่อผ่านอีเมลด้านล่างได้เลย</div>
            )}
          </div>

          <div className="hud-panel rounded-2xl p-5">
            <div className="font-orbitron text-sm font-semibold text-text">PromptPay</div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
              โอนตรงผ่าน PromptPay สำหรับผู้สนับสนุนในไทย
            </p>
            {hasPromptPay ? (
              <div className="mt-4 flex flex-col items-center gap-2 text-center">
                {SUPPORT_LINKS.promptPayQrImage && (
                  <a
                    href={SUPPORT_LINKS.promptPayQrImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="overflow-hidden rounded-xl border border-bg-border transition-all hover:border-purple-DEFAULT/40"
                    aria-label="เปิดรูป QR PromptPay ขนาดเต็มในแท็บใหม่"
                  >
                    <Image
                      src={SUPPORT_LINKS.promptPayQrImage}
                      alt={`PromptPay QR สำหรับโอนสนับสนุน OBIXCORE${
                        SUPPORT_LINKS.promptPayName ? ` — ${SUPPORT_LINKS.promptPayName}` : ""
                      }`}
                      width={200}
                      height={221}
                      className="h-auto w-[200px]"
                    />
                  </a>
                )}
                {SUPPORT_LINKS.promptPayName && (
                  <p className="text-[11px] font-mono text-text-faint">{SUPPORT_LINKS.promptPayName}</p>
                )}
                {SUPPORT_LINKS.promptPayId && (
                  <div className="flex items-center gap-2">
                    <code className="hud-chip rounded-lg px-3 py-1.5 font-mono text-sm text-text">{SUPPORT_LINKS.promptPayId}</code>
                    <CopyButton text={SUPPORT_LINKS.promptPayId} label="Copy" size="sm" />
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 text-[12px] text-text-faint">เร็ว ๆ นี้ — ระหว่างนี้ติดต่อผ่านอีเมลด้านล่างได้เลย</div>
            )}
          </div>

          <div className="hud-panel rounded-2xl p-5">
            <div className="font-orbitron text-sm font-semibold text-text">Contact / Collaboration</div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-text-muted">
              เป็นแบรนด์/ร้านค้า FPV อยากร่วมสนับสนุนหรือพูดคุยฟีเจอร์ ทักมาได้เลย
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={`mailto:${SUPPORT_LINKS.contactEmail}`}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-DEFAULT/40 px-4 py-2 text-sm text-cyan-DEFAULT transition-all hover:bg-cyan-muted/30 active:scale-[0.99]"
              >
                {SUPPORT_LINKS.contactEmail}
              </a>
              {SUPPORT_LINKS.facebookUrl && (
                <Link
                  href={SUPPORT_LINKS.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-DEFAULT/40 px-4 py-2 text-sm text-blue-DEFAULT transition-all hover:bg-blue-muted/30 active:scale-[0.99]"
                >
                  Facebook
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Thank you */}
      <section className="mt-6 mb-2">
        <div className="hud-card rounded-2xl p-5 text-center md:p-6">
          <div className="absolute inset-x-0 top-0 h-1 color-strip" />
          <p className="font-orbitron text-sm font-bold tracking-widest text-text">ขอบคุณที่บินมาด้วยกัน</p>
          <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-text-muted">
            ไม่ว่าคุณจะสนับสนุนหรือแค่เข้ามาใช้เครื่องมือฟรี ๆ ก็เป็นส่วนหนึ่งของชุมชน OBIXCORE แล้ว
            ขอบคุณทุกฟีดแบ็กและทุกแรงใจที่ทำให้โปรเจกต์นี้ยังบินต่อไปได้
          </p>
        </div>
      </section>
    </div>
  );
}
