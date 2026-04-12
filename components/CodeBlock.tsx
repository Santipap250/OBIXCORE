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
    <div className="rounded-xl border border-bg-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-bg-elevated border-b border-bg-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-muted border border-red-DEFAULT/30" />
          <div className="w-3 h-3 rounded-full bg-amber-muted border border-amber-DEFAULT/30" />
          <div className="w-3 h-3 rounded-full bg-green-muted border border-green-DEFAULT/30" />
          {title && (
            <span className="ml-2 text-xs font-mono text-text-muted">{title}</span>
          )}
        </div>
        <CopyButton text={text} label="Copy All" size="sm" />
      </div>

      {/* Code */}
      <div
        className="overflow-y-auto bg-bg-surface"
        style={{ maxHeight }}
      >
        <pre className="p-4 text-xs leading-relaxed">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="select-none text-text-faint w-6 shrink-0 text-right mr-4 font-mono">
                {i + 1}
              </span>
              <span
                className={
                  line.startsWith("#")
                    ? "text-text-faint"
                    : line.startsWith("set ")
                    ? "text-green-DEFAULT"
                    : line === "save"
                    ? "text-amber-DEFAULT font-semibold"
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
