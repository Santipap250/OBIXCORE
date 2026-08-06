import Link from "next/link";
import OBIXLogo from "@/components/OBIXLogo";

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <OBIXLogo iconOnly size={64} className="mb-6 opacity-90" />

      <span className="hud-chip inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-amber-DEFAULT">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-DEFAULT shadow-[0_0_10px_rgba(255,209,102,0.6)]" />
        Offline
      </span>

      <h1 className="mt-4 font-orbitron text-3xl font-bold tracking-tight">
        <span className="gradient-text">ตอนนี้ไม่มีอินเทอร์เน็ต</span>
      </h1>
      <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-text-muted">
        หน้านี้ยังไม่เคยถูกเปิดตอนออนไลน์ เลยยังไม่มีในเครื่อง — หน้าที่เคยเปิดแล้วยังใช้งานได้ตามปกติแม้เน็ตหลุด
      </p>

      <Link
        href="/"
        className="group mt-8 flex items-center justify-center gap-2 rounded-xl border border-green-DEFAULT/40 bg-green-muted/15 px-5 py-3 font-orbitron text-sm font-bold text-green-DEFAULT transition-all hover:border-green-DEFAULT hover:shadow-[0_0_18px_rgba(70,240,184,0.18)] active:scale-[0.98]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        กลับหน้าหลัก
      </Link>
    </div>
  );
}
