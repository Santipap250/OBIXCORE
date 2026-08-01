"use client";
import { useMemo, useState } from "react";
import tricksData from "@/data/tricks.json";
import type { Trick } from "@/types";
import Badge from "@/components/Badge";
import { TRICK_DIFFICULTY_COLORS } from "@/lib/utils";

const tricks = tricksData as Trick[];

const DIFFICULTIES = [
  { value: "all", label: "ทั้งหมด" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
] as const;

const CATEGORY_LABEL_TH: Record<string, string> = {
  aerial: "ท่ากลางอากาศ",
  proximity: "ท่าเลียบพื้น/สิ่งกีดขวาง",
  dive: "ท่าดิ่ง",
  combo: "ท่าผสม",
};

export default function TricksClient() {
  const [difficulty, setDifficulty] = useState<string>("all");
  const [selected, setSelected] = useState<Trick | null>(null);

  const filtered = useMemo(
    () => (difficulty === "all" ? tricks : tricks.filter((t) => t.difficulty === difficulty)),
    [difficulty]
  );

  const selectTrick = (t: Trick) => {
    setSelected(t);
    setTimeout(() => document.getElementById("trick-detail")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const findTrick = (id: string) => tricks.find((t) => t.id === id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-5">
        <span className="hud-chip inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-orange-DEFAULT">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-DEFAULT shadow-[0_0_10px_rgba(255,150,80,0.6)]" />
          Trick Library
        </span>
        <h1 className="mt-3 font-orbitron text-2xl font-bold tracking-tight">
          <span className="gradient-text">คลังท่าบิน Freestyle</span>
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
          ตั้งแต่ท่าเริ่มต้นถึงขั้นสูง พร้อมขั้นตอน เคล็ดลับ และข้อผิดพลาดที่พบบ่อยของแต่ละท่า
        </p>
      </div>

      {/* Safety note */}
      <div className="mb-4 flex gap-2 rounded-xl border border-amber-DEFAULT/25 bg-amber-muted/10 p-3">
        <span className="mt-0.5 shrink-0 text-amber-DEFAULT">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </span>
        <p className="text-[12px] leading-relaxed text-text-muted">
          ฝึกในที่โล่ง ห่างจากคนและสิ่งกีดขวาง เริ่มจากระยะ/ความสูงที่ปลอดภัยกว่าที่คิดว่าจำเป็นเสมอ โดยเฉพาะท่าที่ยังไม่เคยฝึกมาก่อน
        </p>
      </div>

      {/* Difficulty filter */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DIFFICULTIES.map((d) => (
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
            ไม่พบท่าในระดับนี้
          </p>
        )}
        {filtered.map((t, i) => {
          const isSelected = selected?.id === t.id;
          return (
            <button
              key={t.id}
              onClick={() => selectTrick(t)}
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
                  <p className="break-words font-sarabun text-sm font-medium leading-snug text-text">{t.name}</p>
                  <p className="mt-0.5 break-words font-sarabun text-xs leading-relaxed text-text-muted">{t.nameTh}</p>
                </div>
                <span className={`hud-chip flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${TRICK_DIFFICULTY_COLORS[t.difficulty]}`}>
                  {t.difficulty}
                </span>
              </div>
              <p className="mt-2 break-words font-sarabun text-xs leading-relaxed text-text-muted/90">{t.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline">{CATEGORY_LABEL_TH[t.category]}</Badge>
                <span className="text-[10px] font-mono text-text-faint">{t.recommendedClasses.length} คลาสที่เหมาะ</span>
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
              aria-label="ปิดรายละเอียดท่า"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Steps */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-mono uppercase tracking-wider text-text-muted">ขั้นตอนโดยสังเขป</p>
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
            <p className="mb-2 text-xs font-mono uppercase tracking-wider text-green-DEFAULT">เคล็ดลับ</p>
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
            <p className="mb-2 text-xs font-mono uppercase tracking-wider text-red-DEFAULT">ข้อผิดพลาดที่พบบ่อย</p>
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
              <p className="mb-2 text-xs font-mono uppercase tracking-wider text-text-muted">ควรคล่องท่านี้ก่อน</p>
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
            <p className="mb-2 text-xs font-mono uppercase tracking-wider text-text-muted">เหมาะกับคลาสโดรน</p>
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
