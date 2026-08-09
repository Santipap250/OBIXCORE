"use client";
import PageHeader from "@/components/PageHeader";
import LanguageSwitch from "@/components/LanguageSwitch";
import { useMemo, useState } from "react";
import compatDataTh from "@/data/compatibility.json";
import compatDataEn from "@/data/compatibility.en.json";
import type { CompatFact, PartCategory } from "@/types";
import Badge from "@/components/Badge";

const CATEGORIES_TH: { value: PartCategory | "all"; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "motor", label: "มอเตอร์" },
  { value: "prop", label: "ใบพัด" },
  { value: "stack", label: "FC/ESC" },
  { value: "battery", label: "แบตเตอรี่" },
  { value: "vtx", label: "VTX" },
];

const CATEGORIES_EN: { value: PartCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "motor", label: "Motor" },
  { value: "prop", label: "Prop" },
  { value: "stack", label: "FC/ESC" },
  { value: "battery", label: "Battery" },
  { value: "vtx", label: "VTX" },
];

const STRINGS = {
  th: {
    badge: "Parts Compatibility",
    title: "เช็คมาตรฐานชิ้นส่วนโดรน",
    subtitle: "อ้างอิง mounting pattern, ขั้วแบต, และขั้วเสา VTX ที่ใช้กันทั่วไปในวงการ FPV",
    disclaimer: "เป็นข้อมูลอ้างอิงตามมาตรฐานที่ใช้กันทั่วไป ผู้ผลิตบางรายอาจมีสเปกต่างจากนี้ — เช็คสเปกจริงจากหน้าสินค้าก่อนซื้อทุกครั้ง",
    searchPlaceholder: "ค้นหา เช่น XT60, 30.5, motor mount...",
    noResults: "ไม่พบผลลัพธ์ที่ตรงกับคำค้นหา",
    categories: CATEGORIES_TH,
  },
  en: {
    badge: "Parts Compatibility",
    title: "Check Hardware Standards",
    subtitle: "Reference for mounting patterns, battery connectors, and VTX antenna connectors commonly used in FPV",
    disclaimer: "This is reference info based on commonly-used standards. Some manufacturers may spec things differently — always check the actual product page before buying.",
    searchPlaceholder: "Search e.g. XT60, 30.5, motor mount...",
    noResults: "No results match your search",
    categories: CATEGORIES_EN,
  },
};

export default function CompatibilityClient({ locale = "th" }: { locale?: "th" | "en" }) {
  const t = STRINGS[locale];
  const facts = (locale === "en" ? compatDataEn : compatDataTh) as CompatFact[];
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
  }, [category, query, facts]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex justify-end">
        <LanguageSwitch enHref="/en/compatibility" />
      </div>

      {/* Header */}
      <PageHeader
        accent="lime"
        badge={t.badge}
        title={t.title}
        subtitle={t.subtitle}
      />

      {/* Disclaimer */}
      <div className="mb-4 flex gap-2 rounded-xl border border-amber-DEFAULT/25 bg-amber-muted/10 p-3">
        <span className="mt-0.5 shrink-0 text-amber-DEFAULT">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </span>
        <p className="text-[12px] leading-relaxed text-text-muted">
          {t.disclaimer}
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
          placeholder={t.searchPlaceholder}
          className="w-full rounded-xl border border-bg-border bg-bg-surface py-2.5 pl-9 pr-3 text-sm text-text placeholder:text-text-faint focus:border-lime-DEFAULT/50 focus:outline-none"
        />
      </div>

      {/* Category filter */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {t.categories.map((c) => (
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
            {t.noResults}
          </p>
        )}
        {filtered.map((f, i) => (
          <div
            key={f.id}
            className="animate-slide-up rounded-xl border border-bg-border bg-bg-surface p-4"
            style={{ animationDelay: `${Math.min(i, 10) * 40}ms`, animationFillMode: "backwards" }}
          >
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
