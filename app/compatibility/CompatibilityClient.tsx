"use client";
import { useMemo, useState } from "react";
import compatData from "@/data/compatibility.json";
import type { CompatFact, PartCategory } from "@/types";
import Badge from "@/components/Badge";

const facts = compatData as CompatFact[];

const CATEGORIES: { value: PartCategory | "all"; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "motor", label: "มอเตอร์" },
  { value: "prop", label: "ใบพัด" },
  { value: "stack", label: "FC/ESC" },
  { value: "battery", label: "แบตเตอรี่" },
  { value: "vtx", label: "VTX" },
];

export default function CompatibilityClient() {
  const [category, setCategory] = useState<PartCategory | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return facts.filter((f) => {
      if (category !== "all" && f.category !== category) return false;
      if (!q) return true;
      const haystack = `${f.title} ${f.appliesTo} ${f.detail} ${f.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [category, query]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-5">
        <span className="hud-chip inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-lime-DEFAULT">
          <span className="h-1.5 w-1.5 rounded-full bg-lime-DEFAULT shadow-[0_0_10px_rgba(198,242,74,0.6)]" />
          Parts Compatibility
        </span>
        <h1 className="mt-3 font-orbitron text-2xl font-bold tracking-tight">
          <span className="gradient-text">เช็คมาตรฐานชิ้นส่วนโดรน</span>
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
          อ้างอิง mounting pattern, ขั้วแบต, และขั้วเสา VTX ที่ใช้กันทั่วไปในวงการ FPV
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mb-4 flex gap-2 rounded-xl border border-amber-DEFAULT/25 bg-amber-muted/10 p-3">
        <span className="mt-0.5 shrink-0 text-amber-DEFAULT">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </span>
        <p className="text-[12px] leading-relaxed text-text-muted">
          เป็นข้อมูลอ้างอิงตามมาตรฐานที่ใช้กันทั่วไป ผู้ผลิตบางรายอาจมีสเปกต่างจากนี้ — เช็คสเปกจริงจากหน้าสินค้าก่อนซื้อทุกครั้ง
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหา เช่น XT60, 30.5, motor mount..."
          className="w-full rounded-xl border border-bg-border bg-bg-surface py-2.5 pl-9 pr-3 text-sm text-text placeholder:text-text-faint focus:border-lime-DEFAULT/50 focus:outline-none"
        />
      </div>

      {/* Category filter */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            aria-pressed={category === c.value}
            className={`flex-shrink-0 rounded-xl border px-3 py-2 text-xs font-mono transition-all ${
              category === c.value
                ? "border-lime-DEFAULT bg-lime-muted text-lime-DEFAULT"
                : "border-bg-border bg-bg-surface text-text-muted hover:bg-bg-elevated"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p role="status" aria-live="polite" className="py-8 text-center text-sm font-sarabun text-text-faint">
            ไม่พบผลลัพธ์ที่ตรงกับคำค้นหา
          </p>
        )}
        {filtered.map((f) => (
          <div key={f.id} className="rounded-xl border border-bg-border bg-bg-surface p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 flex-1 break-words font-sarabun text-sm font-semibold text-text">{f.title}</p>
              <Badge variant="outline">{f.category}</Badge>
            </div>
            <p className="mt-1 break-words font-sarabun text-xs leading-relaxed text-lime-DEFAULT">{f.appliesTo}</p>
            <p className="mt-2 break-words font-sarabun text-xs leading-relaxed text-text-muted">{f.detail}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {f.recommendedClasses.map((c) => (
                <Badge key={c} variant="outline">{c}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
