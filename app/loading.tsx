import OBIXLogo from "@/components/OBIXLogo";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-2xl bg-green-DEFAULT/20" />
        <span className="absolute inset-0 rounded-2xl border border-green-DEFAULT/30 animate-glow-pulse" />
        <OBIXLogo iconOnly size={64} className="relative" />
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-faint">
        Loading
      </p>
    </div>
  );
}
