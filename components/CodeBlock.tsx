"use client";
import CopyButton from "./CopyButton";

interface CodeBlockProps {
  lines: string[];
  title?: string;
  maxHeight?: string;
}

export default function CodeBlock({ lines, title, maxHeight = "320px" }: CodeBlockProps) {
  const text = lines.join("\n");

  return (
    <div className="hud-card overflow-hidden rounded-[1.5rem] border border-white/8">
      <div className="flex items-center justify-between border-b border-white/8 bg-bg-surface/70 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-DEFAULT/70 border border-red-DEFAULT/35" />
          <div className="h-3 w-3 rounded-full bg-amber-DEFAULT/70 border border-amber-DEFAULT/35" />
          <div className="h-3 w-3 rounded-full bg-cyan-DEFAULT/70 border border-cyan-DEFAULT/35" />
          {title && (
            <span className="ml-2 text-xs font-mono text-text-muted">{title}</span>
          )}
        </div>
        <CopyButton text={text} label="Copy All" size="sm" variant="default" />
      </div>

      <div className="overflow-x-auto overflow-y-auto bg-bg-surface/90" style={{ maxHeight }}>
        <pre className="w-max min-w-full p-4 text-xs leading-relaxed">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="mr-4 w-6 shrink-0 select-none text-right font-mono text-text-faint">
                {i + 1}
              </span>
              <span
                className={
                  line.startsWith("#")
                    ? "text-text-faint"
                    : line.startsWith("set ")
                    ? "text-cyan-DEFAULT"
                    : line === "save"
                    ? "font-semibold text-amber-DEFAULT"
                    : "text-text"
                }
              >
                {line}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
