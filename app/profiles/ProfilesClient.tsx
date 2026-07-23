"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { FrameSize, FlightStyle } from "@/lib/droneSpec";
import { VISUAL_PRESETS, frameSizeToMm } from "@/lib/droneSpec";
import {
  listProfiles,
  saveProfile,
  deleteProfile,
  type DroneProfile,
} from "@/lib/droneProfile";

type FormState = Omit<DroneProfile, "id" | "createdAt" | "updatedAt">;

const EMPTY_FORM: FormState = {
  name: "",
  frameSize: "5inch",
  frameMm: 230,
  propIn: 5.1,
  propBlades: 3,
  motorKV: 2306,
  batteryS: 4,
  batteryMah: 1500,
  weightG: 450,
  style: "freestyle",
  escCurrentA: 45,
  notes: "",
};

const FRAME_OPTIONS: { value: FrameSize; label: string }[] = [
  { value: "2inch", label: '2"' },
  { value: "3inch", label: '3"' },
  { value: "5inch", label: '5"' },
  { value: "7inch", label: '7"' },
];

const STYLE_OPTIONS: { value: FlightStyle; label: string; labelTh: string }[] = [
  { value: "freestyle", label: "Freestyle", labelTh: "บินอิสระ" },
  { value: "race", label: "Race", labelTh: "แข่ง" },
  { value: "cinematic", label: "Cinematic", labelTh: "ถ่ายวิดีโอ" },
];

const BATTERY_OPTIONS = [2, 3, 4, 5, 6] as const;

function NumberField({
  label, value, min, max, step = 1, unit, onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number; unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-text-muted">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 rounded-lg border border-bg-border bg-bg-elevated px-3 py-2.5 text-sm font-mono text-text transition-colors focus:border-blue-DEFAULT/60 focus:bg-bg-surface focus:outline-none"
        />
        {unit && <span className="w-10 shrink-0 text-xs font-mono text-text-muted">{unit}</span>}
      </div>
    </div>
  );
}

function relativeTime(ts: number): string {
  const diffMs = Date.now() - ts;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "เมื่อสักครู่";
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} ชม.ที่แล้ว`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} วันที่แล้ว`;
  return new Date(ts).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });
}

export default function ProfilesClient() {
  const [profiles, setProfiles] = useState<DroneProfile[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [mode, setMode] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"updated" | "name">("updated");

  useEffect(() => {
    setProfiles(listProfiles());
    setHydrated(true);
    try {
      const testKey = "obixcore:storage-test";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
    } catch {
      setStorageOk(false);
    }
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const startCreate = (template?: FormState) => {
    setForm(template ?? { ...EMPTY_FORM });
    setEditingId(null);
    setMode("form");
  };

  const startEdit = (p: DroneProfile) => {
    const { id, createdAt, updatedAt, ...rest } = p;
    setForm(rest);
    setEditingId(id);
    setMode("form");
  };

  const handleSave = () => {
    const name = form.name.trim() || "โดรนไม่มีชื่อ";
    saveProfile({ ...form, name }, editingId ?? undefined);
    setProfiles(listProfiles());
    setMode("list");
  };

  const handleDelete = (id: string) => {
    deleteProfile(id);
    setProfiles(listProfiles());
    setDeleteConfirmId(null);
  };

  const handleDuplicate = (p: DroneProfile) => {
    const { id, createdAt, updatedAt, ...rest } = p;
    saveProfile({ ...rest, name: `${p.name} (สำเนา)` });
    setProfiles(listProfiles());
  };

  const visibleProfiles = profiles
    .filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => (sortBy === "name" ? a.name.localeCompare(b.name, "th") : b.updatedAt - a.updatedAt));

  const applyFrame = (fs: FrameSize) => {
    const mm = frameSizeToMm(fs);
    const propDefault: Record<FrameSize, number> = { "2inch": 2.5, "3inch": 3.0, "5inch": 5.1, "7inch": 7.0 };
    set("frameSize", fs);
    set("frameMm", mm);
    set("propIn", propDefault[fs]);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <span className="hud-chip inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-blue-DEFAULT">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-DEFAULT shadow-[0_0_10px_rgba(99,179,255,0.6)]" />
          Drone Profiles
        </span>
        <h1 className="mt-3 font-orbitron text-2xl font-bold tracking-tight">
          <span className="gradient-text">จัดการสเปกโดรนของคุณ</span>
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-text-muted">
          บันทึกสเปกโดรนแต่ละลำไว้ แล้วโหลดเข้า Wizard หรือ Visualizer ได้ทันทีโดยไม่ต้องกรอกใหม่ทุกครั้ง
        </p>
      </div>

      {!storageOk && (
        <div className="mb-4 rounded-xl border border-amber-DEFAULT/30 bg-amber-muted p-3">
          <p className="font-sarabun text-xs leading-relaxed text-amber-DEFAULT">
            เบราว์เซอร์นี้ปิดหรือไม่รองรับการจัดเก็บข้อมูลในเครื่อง (localStorage) — โปรไฟล์ที่สร้างจะหายไปเมื่อปิดแท็บ
            ลองปิด private/incognito mode แล้วรีเฟรชอีกครั้ง
          </p>
        </div>
      )}

      {mode === "list" && (
        <div className="space-y-4">
          <button
            onClick={() => startCreate()}
            className="w-full rounded-xl bg-blue-DEFAULT py-3.5 font-orbitron text-sm font-bold tracking-widest text-bg-DEFAULT transition-all hover:opacity-90 active:scale-[0.99]"
          >
            + เพิ่มโดรนลำใหม่
          </button>

          {!hydrated ? (
            <div className="py-10 text-center text-xs font-mono text-text-faint">กำลังโหลด…</div>
          ) : profiles.length === 0 ? (
            <div className="rounded-2xl border border-bg-border bg-bg-elevated p-6 text-center">
              <p className="font-sarabun text-sm text-text-muted">ยังไม่มีโปรไฟล์โดรนที่บันทึกไว้</p>
              <p className="mt-1 font-sarabun text-xs text-text-faint">เริ่มจากเทมเพลตด้านล่างก็ได้ ไม่ต้องกรอกเองทั้งหมด</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {VISUAL_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() =>
                      startCreate({
                        name: preset.name,
                        frameSize: preset.spec.frameSize,
                        frameMm: preset.spec.frameMm,
                        propIn: preset.spec.propIn,
                        propBlades: preset.spec.propBlades,
                        motorKV: preset.spec.motorKV,
                        batteryS: preset.spec.batteryS,
                        batteryMah: preset.spec.batteryMah,
                        weightG: preset.spec.weightG,
                        style: preset.spec.style,
                        escCurrentA: preset.spec.escCurrentA,
                        notes: "",
                      })
                    }
                    className="rounded-xl border border-bg-border bg-bg-surface p-3 text-left transition-all hover:border-blue-DEFAULT/40"
                  >
                    <div className="font-orbitron text-xs font-semibold text-text">{preset.name}</div>
                    <div className="mt-1 font-sarabun text-[11px] text-text-faint">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ค้นหาชื่อโดรน…"
                    className="w-full rounded-lg border border-bg-border bg-bg-elevated py-2 pl-9 pr-3 text-xs text-text transition-colors focus:border-blue-DEFAULT/60 focus:bg-bg-surface focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setSortBy((s) => (s === "updated" ? "name" : "updated"))}
                  className="flex-shrink-0 rounded-lg border border-bg-border bg-bg-elevated px-3 py-2 text-[11px] font-mono text-text-muted transition-all hover:text-text"
                  title="สลับการเรียงลำดับ"
                >
                  {sortBy === "updated" ? "↓ ล่าสุด" : "A-Z ชื่อ"}
                </button>
              </div>

              <p className="font-mono text-[11px] uppercase tracking-wider text-text-faint">
                {visibleProfiles.length === profiles.length
                  ? `ทั้งหมด ${profiles.length} ลำ`
                  : `พบ ${visibleProfiles.length} จาก ${profiles.length} ลำ`}
              </p>

              {visibleProfiles.length === 0 && (
                <div className="rounded-xl border border-bg-border bg-bg-elevated p-4 text-center">
                  <p className="font-sarabun text-xs text-text-faint">ไม่พบโดรนที่ชื่อตรงกับ &quot;{search}&quot;</p>
                </div>
              )}

              {visibleProfiles.map((p) => (
                <div key={p.id} className="hud-panel rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-orbitron text-sm font-semibold text-text">{p.name}</div>
                      <div className="mt-1 font-mono text-[11px] text-text-faint">
                        {p.frameSize} · {p.propIn}&quot; · {p.propBlades}ใบพัด · {p.motorKV}KV · {p.batteryS}S · {p.weightG}g
                      </div>
                      <div className="mt-1 font-sarabun text-[11px] text-text-faint">อัปเดต {relativeTime(p.updatedAt)}</div>
                    </div>
                    <span className="hud-chip flex-shrink-0 px-2 py-0.5 text-[10px] font-mono uppercase text-text-muted">{p.style}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/wizard?profile=${p.id}`}
                      className="rounded-lg border border-amber-DEFAULT/30 bg-amber-muted/50 px-3 py-1.5 text-[11px] font-mono text-amber-DEFAULT transition-all hover:bg-amber-muted active:scale-[0.99]"
                    >
                      ใช้ใน Wizard →
                    </Link>
                    <Link
                      href={`/visualizer?profile=${p.id}`}
                      className="rounded-lg border border-cyan-DEFAULT/30 bg-cyan-muted/50 px-3 py-1.5 text-[11px] font-mono text-cyan-DEFAULT transition-all hover:bg-cyan-muted active:scale-[0.99]"
                    >
                      ใช้ใน Visualizer →
                    </Link>
                    <button
                      onClick={() => startEdit(p)}
                      className="rounded-lg border border-bg-border bg-bg-elevated px-3 py-1.5 text-[11px] font-mono text-text-muted transition-all hover:text-text"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDuplicate(p)}
                      className="rounded-lg border border-bg-border bg-bg-elevated px-3 py-1.5 text-[11px] font-mono text-text-muted transition-all hover:text-text"
                      title="ทำสำเนาโปรไฟล์นี้"
                    >
                      ทำสำเนา
                    </button>
                    {deleteConfirmId === p.id ? (
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded-lg border border-red-DEFAULT/40 bg-red-muted px-3 py-1.5 text-[11px] font-mono text-red-DEFAULT"
                      >
                        ยืนยันลบ?
                      </button>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(p.id)}
                        onBlur={() => setDeleteConfirmId(null)}
                        className="rounded-lg border border-bg-border bg-bg-elevated px-3 py-1.5 text-[11px] font-mono text-text-faint transition-all hover:text-red-DEFAULT"
                      >
                        ลบ
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {mode === "form" && (
        <div className="space-y-5">
          <button
            onClick={() => setMode("list")}
            className="flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            กลับไปหน้ารายการ
          </button>

          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-text-muted">ชื่อโดรน</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="เช่น เครื่องแข่งตัวหลัก, ตัวซ้อม 3 นิ้ว"
              className="w-full rounded-lg border border-bg-border bg-bg-elevated px-3 py-2.5 text-sm text-text transition-colors focus:border-blue-DEFAULT/60 focus:bg-bg-surface focus:outline-none"
            />
            {form.name.trim() &&
              profiles.some((p) => p.id !== editingId && p.name.trim().toLowerCase() === form.name.trim().toLowerCase()) && (
                <p className="mt-1.5 font-sarabun text-[11px] text-amber-DEFAULT">
                  มีโดรนชื่อนี้อยู่แล้ว — บันทึกซ้ำได้ แต่ลองตั้งชื่อให้ต่างกันจะแยกง่ายกว่า
                </p>
              )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-text-muted">สไตล์การบิน</label>
            <div className="grid grid-cols-3 gap-2">
              {STYLE_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set("style", s.value)}
                  aria-pressed={form.style === s.value}
                  className={`rounded-xl border p-2.5 text-center transition-all ${
                    form.style === s.value
                      ? "border-blue-DEFAULT bg-blue-muted text-blue-DEFAULT"
                      : "border-bg-border bg-bg-elevated text-text-muted hover:border-blue-DEFAULT/30"
                  }`}
                >
                  <div className="font-orbitron text-[13px] font-semibold">{s.label}</div>
                  <div className="mt-0.5 text-[10px] font-sarabun opacity-80">{s.labelTh}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-text-muted">ขนาดเฟรม</label>
            <div className="grid grid-cols-4 gap-2">
              {FRAME_OPTIONS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => applyFrame(f.value)}
                  aria-pressed={form.frameSize === f.value}
                  className={`rounded-xl border py-2.5 text-center font-orbitron text-sm font-semibold transition-all ${
                    form.frameSize === f.value
                      ? "border-blue-DEFAULT bg-blue-muted text-blue-DEFAULT"
                      : "border-bg-border bg-bg-elevated text-text-muted hover:border-blue-DEFAULT/30"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Frame (มม.)" value={form.frameMm} min={65} max={360} step={5} unit="mm" onChange={(v) => set("frameMm", v)} />
            <NumberField label="Prop Size" value={form.propIn} min={2} max={9} step={0.1} unit='"' onChange={(v) => set("propIn", v)} />
            <NumberField label="Motor KV" value={form.motorKV} min={800} max={4000} step={50} unit="KV" onChange={(v) => set("motorKV", v)} />
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-text-muted">Battery</label>
              <div className="grid grid-cols-5 gap-1.5">
                {BATTERY_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set("batteryS", s)}
                    aria-pressed={form.batteryS === s}
                    className={`rounded-lg border py-2 text-center font-mono text-xs transition-all ${
                      form.batteryS === s
                        ? "border-blue-DEFAULT bg-blue-muted text-blue-DEFAULT"
                        : "border-bg-border bg-bg-elevated text-text-muted hover:border-blue-DEFAULT/30"
                    }`}
                  >
                    {s}S
                  </button>
                ))}
              </div>
            </div>
            <NumberField label="Battery mAh" value={form.batteryMah ?? 0} min={0} max={10000} step={50} unit="mAh" onChange={(v) => set("batteryMah", v)} />
            <NumberField label="Weight (AUW)" value={form.weightG} min={30} max={2000} step={10} unit="g" onChange={(v) => set("weightG", v)} />
            <NumberField label="ESC Current" value={form.escCurrentA ?? 0} min={0} max={120} step={5} unit="A" onChange={(v) => set("escCurrentA", v)} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-text-muted">โน้ต (ถ้ามี)</label>
            <textarea
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
              rows={2}
              placeholder="เช่น เปลี่ยน ESC ใหม่เมื่อเดือนก่อน, ยังไม่ได้ balance ใบพัด"
              className="w-full resize-none rounded-lg border border-bg-border bg-bg-elevated px-3 py-2.5 text-sm text-text transition-colors focus:border-blue-DEFAULT/60 focus:bg-bg-surface focus:outline-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full rounded-xl bg-blue-DEFAULT py-3.5 font-orbitron text-sm font-bold tracking-widest text-bg-DEFAULT transition-all hover:opacity-90 active:scale-[0.99]"
          >
            💾 บันทึกโปรไฟล์
          </button>
        </div>
      )}
    </div>
  );
}
