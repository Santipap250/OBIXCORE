/**
 * Compact "mission control" status readout for the hero. Deliberately
 * limited to facts that are true by construction (module count derived
 * from the actual tools list, version from the changelog) — never a
 * usage/uptime metric, since this project has no backend to measure that.
 */
export default function StatusCard({
  version,
  moduleCount,
}: {
  version: string;
  moduleCount: number;
}) {
  const items = [
    { label: `Build ${version}`, dot: "bg-green-DEFAULT" },
    { label: `${moduleCount} Modules Online`, dot: "bg-blue-DEFAULT" },
    { label: "Free & Open", dot: "bg-purple-DEFAULT" },
  ];

  return (
    <div className="hud-chip mx-auto flex w-fit flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {i > 0 && <span className="h-0.5 w-0.5 rounded-full bg-text-faint" aria-hidden="true" />}
          <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} aria-hidden="true" />
          {item.label}
        </span>
      ))}
    </div>
  );
}
