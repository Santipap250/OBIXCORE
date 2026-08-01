"use client";
import { useEffect, useRef, useState } from "react";
import { copyToClipboard } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

export default function CopyButton({
  text,
  label = "Copy",
  size = "md",
  variant = "outline",
  className = "",
}: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    setStatus(success ? "copied" : "error");

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => setStatus("idle"), 1800);
  };

  const sizeClasses = {
    sm: "px-2.5 py-1 text-[11px] gap-1.5",
    md: "px-3.5 py-2 text-sm gap-2",
    lg: "px-4.5 py-2.5 text-base gap-2.5",
  };

  const variantClasses = {
    default: "btn-neo-blue text-cyan-50 font-semibold hover:-translate-y-0.5",
    outline: "border border-cyan-DEFAULT/28 text-cyan-DEFAULT bg-bg-surface/60 hover:bg-cyan-DEFAULT/10 hover:border-cyan-DEFAULT/45",
    ghost: "text-text-muted hover:text-cyan-DEFAULT hover:bg-cyan-DEFAULT/10",
  };

  const statusConfig = {
    idle: {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      ),
      text: label,
      classes: variantClasses[variant],
    },
    copied: {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      text: "Copied!",
      classes: "border border-cyan-DEFAULT/35 bg-cyan-muted/50 text-cyan-DEFAULT shadow-[0_0_24px_rgba(34,211,238,0.18)]",
    },
    error: {
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      text: "Failed",
      classes: "border border-red-DEFAULT/35 bg-red-muted/50 text-red-DEFAULT",
    },
  };

  const current = statusConfig[status];

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`
        hud-chip inline-flex items-center rounded-lg font-mono transition-all select-none
        active:scale-95
        ${sizeClasses[size]}
        ${current.classes}
        ${className}
      `}
    >
      {current.icon}
      <span>{current.text}</span>
    </button>
  );
}
