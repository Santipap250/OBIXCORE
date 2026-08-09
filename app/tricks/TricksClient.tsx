"use client";
import PageHeader from "@/components/PageHeader";
import LanguageSwitch from "@/components/LanguageSwitch";
import { useMemo, useState } from "react";
import tricksDataTh from "@/data/tricks.json";
import tricksDataEn from "@/data/tricks.en.json";
import type { Trick } from "@/types";
import Badge from "@/components/Badge";
import { TRICK_DIFFICULTY_COLORS } from "@/lib/utils";

const CATEGORY_LABEL_TH: Record<string, string> = {
  aerial: "ท่ากลางอากาศ",
  proximity: "ท่าเลียบพื้น/สิ่งกีดขวาง",
  dive: "ท่าดิ่ง",
  combo: "ท่าผสม",
};

const CATEGORY_LABEL_EN: Record<string, string> = {
  aerial: "Aerial",
  proximity: "Proximity/Obstacle",
  dive: "Dive",
  combo: "Combo",
};

const STRINGS = {
  th: {
    badge: "Trick Library",
    title: "คลังท่าบิน Freestyle",
    subtitle: "ตั้งแต่ท่าเริ่มต้นถึงขั้นสูง พร้อมขั้นตอน เคล็ดลับ และข้อผิดพลาดที่พบบ่อยของแต่ละท่า",
    safetyNote: "ฝึกในที่โล่ง ห่างจากคนและสิ่งกีดขวาง เริ่มจากระยะ/ความสูงที่ปลอดภัยกว่าที่คิดว่าจำเป็นเสมอ โดยเฉพาะท่าที่ยังไม่เคยฝึกมาก่อน",
    difficulties: [
      { value: "all", label: "ทั้งหมด" },
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
      { value: "expert", label: "Expert" },
    ],
    noResults: "ไม่พบท่าในระดับนี้",
    suitedClasses: (n: number) => `${n} คลาสที่เหมาะ`,
    closeDetail: "ปิดรายละเอียดท่า",
    stepsLabel: "ขั้นตอนโดยสังเขป",
    tipsLabel: "เคล็ดลับ",
    mistakesLabel: "ข้อผิดพลาดที่พบบ่อย",
    prereqLabel: "ควรคล่องท่านี้ก่อน",
    classesLabel: "เหมาะกับคลาสโดรน",
    categoryLabels: CATEGORY_LABEL_TH,
  },
  en: {
    badge: "Trick Library",
    title: "Freestyle Trick Library",
    subtitle: "From beginner to advanced, with steps, tips, and common mistakes for each trick",
    safetyNote: "Practice in open space, away from people and obstacles. Always start with more distance/altitude than you think you need — especially for a trick you haven't practiced before.",
    difficulties: [
      { value: "all", label: "All" },
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
      { value: "expert", label: "Expert" },
    ],
    noResults: "No tricks found at this level",
    suitedClasses: (n: number) => `${n} suited class${n === 1 ? "" : "es"}`,
    closeDetail: "Close trick detail",
    stepsLabel: "Rough Steps",
    tipsLabel: "Tips",
    mistakesLabel: "Common Mistakes",
    prereqLabel: "Get comfortable with first",
    classesLabel: "Suited Drone Classes",
    categoryLabels: CATEGORY_LABEL_EN,
  },
};

export default function TricksClient({ locale = "th" }: { locale?: "th" | "en" }) {
  const t = STRINGS[locale];
  const tricks = (locale === "en" ? tricksDataEn : tricksDataTh) as Trick[];
  const [difficulty, setDifficulty] = useState<string>("all");
  const [selected, setSelected] = useState<Trick | null>(null);

  const filtered = useMemo(
    () => (difficulty === "all" ? tricks : tricks.filter((tr) => tr.difficulty === difficulty)),
    [difficulty, tricks]
  );

  const selectTrick = (tr: Trick) => {
    setSelected(tr);
    setTimeout(() => document.getElementById("trick-detail")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const findTrick = (id: string) => tricks.find((tr) => tr.id === id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex justify-end">
        <LanguageSwitch enHref="/en/tricks" />
      </div>

      {/* Header */}
      <PageHeader
        accent="orange"
        badge={t.badge}
        title={t.title}
        subtitle={t.subtitle}
      />

      {/* Safety note */}
      <div className="mb-4 flex gap-2 rounded-xl border border-amber-DEFAULT/25 bg-amber-muted/10 p-3">
        <span className="mt-0.5 shrink-0 text-amber-DEFAULT">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </span>
        <p className="text-[12px] leading-relaxed text-text-muted">
          {t.safetyNote}
        </p>
      </div>

      {/* Difficulty filter */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {t.difficulties.map((d) => (
          <button
            key={d.value}
            onClick={() => setDifficulty(d.value)}
            aria-pressed={difficulty === d.value}
            className={`flex-shrink-0 rounded-xl border px-3 py-2 text-xs font-mono transition-all ${
              difficulty === d.value
                ? "border-orange-DEFAULT bg-orange-muted text-orange-DEFAULT"
                : "border-bg-border bg-bg-surface text-text-muted hover:bg-bg-elevated"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Trick list */}
      <div className="mb-6 space-y-2">
        {filtered.length === 0 && (
          <p role="status" aria-live="polite" className="py-8 text-center text-sm font-sarabun text-text-faint">
            {t.noResults}
          </p>
        )}
        {filtered.map((tr, i) => {
          const isSelected = selected?.id === tr.id;
          return (
            <button
              key={tr.id}
              onClick={() => selectTrick(tr)}
              aria-pressed={isSelected}
              className={`animate-slide-up w-full rounded-xl border p-4 text-left transition-all active:scale-[0.99] ${
                isSelected
                  ? "border-orange-DEFAULT/60 bg-orange-muted/20"
                  : "border-bg-border bg-bg-surface hover:bg-bg-elevated"
              }`}
              style={{ animationDelay: `${Math.min(i, 10) * 40}ms`, animationFillMode: "backwards" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="break-words font-sarabun text-sm font-medium leading-snug text-text">{tr.name}</p>
                  <p className="mt-0.5 break-words font-sarabun text-xs leading-relaxed text-text-muted">{tr.nameTh}</p>
                </div>
                <span className={`hud-chip flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${TRICK_DIFFICULTY_COLORS[tr.difficulty]}`}>
                  {tr.difficulty}
                </span>
              </div>
              <p className="mt-2 break-words font-sarabun text-xs leading-relaxed text-text-muted/90">{tr.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline">{t.categoryLabels[tr.category]}</Badge>
                <span className="text-[10px] font-mono text-text-faint">{t.suitedClasses(tr.recommendedClasses.length)}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="animate-slide-up" id="trick-detail">
          <div className="mb-5 h-px bg-bg-border" />

          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="break-words font-orbitron text-base font-bold leading-snug text-text">{selected.name}</h2>
                <span className={`hud-chip rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${TRICK_DIFFICULTY_COLORS[selected.difficulty]}`}>
                  {selected.difficulty}
                </span>
              </div>
              <p className="mt-1 break-words font-sarabun text-xs leading-relaxed text-text-muted">{selected.description}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="flex-shrink-0 rounded-lg p-1.5 text-text-faint transition-all hover:bg-bg-elevated hover:text-text-muted"
              aria-label={t.closeDetail}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Steps */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-mono uppercase tracking-wider text-text-muted">{t.stepsLabel}</p>
            <ol className="space-y-2">
              {selected.steps.map((step, i) => (
                <li key={i} className="flex gap-3 rounded-xl border border-bg-border bg-bg-surface p-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-orange-DEFAULT/40 bg-orange-muted/30 font-orbitron text-[11px] font-bold text-orange-DEFAULT">
                    {i + 1}
                  </span>
                  <p className="break-words font-sarabun text-xs leading-relaxed text-text">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          <div className="mb-4 rounded-xl border border-green-DEFAULT/20 bg-green-muted/10 p-4">
            <p className="mb-2 text-xs font-mono uppercase tracking-wider text-green-DEFAULT">{t.tipsLabel}</p>
            <ul className="space-y-1.5">
              {selected.tips.map((tip, i) => (
                <li key={i} className="flex gap-2 font-sarabun text-xs leading-relaxed text-text">
                  <span className="flex-shrink-0 text-green-DEFAULT">→</span>
                  <span className="break-words">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common mistakes */}
          <div className="mb-4 rounded-xl border border-red-DEFAULT/20 bg-red-muted/10 p-4">
            <p className="mb-2 text-xs font-mono uppercase tracking-wider text-red-DEFAULT">{t.mistakesLabel}</p>
            <ul className="space-y-1.5">
              {selected.commonMistakes.map((m, i) => (
                <li key={i} className="flex gap-2 font-sarabun text-xs leading-relaxed text-text">
                  <span className="flex-shrink-0 text-red-DEFAULT">✕</span>
                  <span className="break-words">{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prerequisites */}
          {selected.prerequisiteTrickIds.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-mono uppercase tracking-wider text-text-muted">{t.prereqLabel}</p>
              <div className="flex flex-wrap gap-2">
                {selected.prerequisiteTrickIds.map((id) => {
                  const pre = findTrick(id);
                  if (!pre) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => selectTrick(pre)}
                      className="hud-chip rounded-full border border-bg-border px-3 py-1 text-[11px] font-sarabun text-text-muted transition-all hover:border-orange-DEFAULT/40 hover:text-orange-DEFAULT"
                    >
                      {pre.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommended classes */}
          <div className="mb-2">
            <p className="mb-2 text-xs font-mono uppercase tracking-wider text-text-muted">{t.classesLabel}</p>
            <div className="flex flex-wrap gap-1.5">
              {selected.recommendedClasses.map((c) => (
                <Badge key={c} variant="outline">{c}</Badge>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {selected.tags.map((tag) => (
              <Badge key={tag} variant="outline">#{tag}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
