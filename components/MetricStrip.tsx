import type { ReactNode } from "react";

export interface Metric {
  value: string;
  label: string;
  color: string;
  icon: ReactNode;
}

/**
 * A row of small stat cards (e.g. module count, preset count). Every value
 * shown here must be a real, verifiable fact about the product — never a
 * usage/analytics number, since this project has no tracking backend to
 * back that up. See CHANGELOG.md / README before adding a new metric.
 */
export default function MetricStrip({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {metrics.map((m) => (
        <div key={m.label} className="hud-panel rounded-2xl p-3 text-center">
          <span className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center ${m.color}`}>{m.icon}</span>
          <div className={`font-orbitron text-xl font-bold ${m.color}`}>{m.value}</div>
          <div className="mt-1 text-[11px] text-text-muted">{m.label}</div>
        </div>
      ))}
    </div>
  );
}
