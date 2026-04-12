# OBIXCORE — FPV Tuning Platform

> เครื่องมือจูนโดรน FPV ครบครัน: Tuning Wizard, Problem Solver, Calculator, Preset Library

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone หรือ unzip โปรเจกต์
cd obixcore

# 2. ติดตั้ง dependencies
npm install

# 3. รัน dev server
npm run dev

# เปิด http://localhost:3000
```

**Prerequisites:** Node.js 18+ / npm 9+

---

## 🌐 Deploy ฟรี (Cloudflare Pages)

### วิธีที่ 1: GitHub + Cloudflare Pages (แนะนำ)

```bash
# 1. สร้าง GitHub repo ใหม่
# 2. Push code ขึ้น GitHub
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USER/obixcore.git
git push -u origin main

# 3. ไปที่ https://pages.cloudflare.com/
# 4. Connect GitHub repo
# 5. Build settings:
#    Framework: Next.js
#    Build command: npm run build
#    Output directory: out
# 6. Deploy → ได้ URL ฟรี เช่น obixcore.pages.dev
```

### วิธีที่ 2: GitHub Pages

```bash
# ติดตั้ง gh-pages
npm install --save-dev gh-pages

# เพิ่มใน package.json scripts:
# "deploy": "next build && touch out/.nojekyll && gh-pages -d out -t true"

npm run deploy
```

### วิธีที่ 3: Vercel (ง่ายที่สุด)

```bash
npm install -g vercel
vercel
# ตอบ y ทุกคำถาม → ได้ URL ทันที
```

---

## 📝 Content Workflow

### เพิ่ม Preset ใหม่

แก้ไขไฟล์ `data/presets.json` — เพิ่ม object ใหม่ตาม template นี้:

```json
{
  "id": "preset-5inch-freestyle-002",     // ← ต้อง unique
  "name": "ชื่อ preset",
  "description": "คำอธิบาย",
  "type": "freestyle",                    // race | freestyle | cinematic | beginner
  "frameSize": "5inch",                   // 2inch | 3inch | 5inch | 7inch
  "batteryS": 4,                          // 2-6
  "bfVersion": "4.4",
  "difficulty": "intermediate",          // beginner | intermediate | advanced
  "tags": ["5inch", "4s", "freestyle"],
  "pid": {
    "roll":  { "p": 47, "i": 52, "d": 32, "f": 120 },
    "pitch": { "p": 48, "i": 52, "d": 32, "f": 120 },
    "yaw":   { "p": 35, "i": 90, "d": 0 }
  },
  "rates": {
    "type": "actual",
    "roll":  { "rc_rate": 1.0, "rate": 0.70, "expo": 0.10 },
    "pitch": { "rc_rate": 1.0, "rate": 0.70, "expo": 0.10 },
    "yaw":   { "rc_rate": 1.0, "rate": 0.50, "expo": 0.10 }
  },
  "filters": {
    "gyroLpf1Hz": 200,
    "gyroLpf2Hz": 200,
    "dTermLpf1Hz": 100,
    "rpmFilter": true,
    "dynamicNotch": "MEDIUM"
  },
  "cliCommands": [
    "# ชื่อ preset — OBIXCORE",
    "set p_roll = 47",
    "... ← ใส่ CLI commands ทั้งหมด",
    "save"
  ],
  "notes": "หมายเหตุพิเศษ (optional)"
}
```

commit + push → Cloudflare Pages build และ deploy อัตโนมัติ ~1 นาที

---

### เพิ่มปัญหาใหม่

แก้ไขไฟล์ `data/problems.json` — เพิ่ม object ตาม template:

```json
{
  "id": "prob-ชื่อ-unique",
  "symptom": "อาการที่เจอ (ภาษาไทย)",
  "category": "flight",              // flight | video | power | mechanical
  "severity": "medium",              // low | medium | high
  "description": "คำอธิบายเพิ่มเติม",
  "causes": [
    "สาเหตุ 1",
    "สาเหตุ 2"
  ],
  "steps": [
    {
      "order": 1,
      "title": "ชื่อขั้นตอน",
      "description": "รายละเอียด",
      "action": "set p_roll = 40\nsave",    // optional: CLI command
      "warning": "คำเตือน"                   // optional
    }
  ],
  "relatedPresetIds": [],
  "tags": ["tag1", "tag2"]
}
```

---

### แก้ Tuning Wizard Logic

แก้ไขไฟล์ `lib/wizard.ts`:

- ปรับ base PID ตาม frame size → ฟังก์ชัน `calculateTuning()` บรรทัด ~10
- ปรับ style multipliers → ฟังก์ชันเดิม บรรทัด ~35
- ปรับ filter recommendations → บรรทัด ~60

---

### เพิ่ม Calculator ใหม่

1. สร้าง component ใหม่ใน `app/calculator/page.tsx`
2. เพิ่ม mode ใน `MODES` array
3. เพิ่ม case ใน render section

---

## 🗂 Folder Reference

```
obixcore/
├── app/              ← Pages (Next.js App Router)
│   ├── page.tsx      ← Home
│   ├── wizard/       ← Tuning Wizard
│   ├── problems/     ← Problem Solver
│   ├── calculator/   ← Calculator
│   └── presets/      ← Preset Library
├── components/       ← Shared UI components
├── data/             ← ← แก้ไขที่นี่เพื่ออัปเดตเนื้อหา
│   ├── presets.json  ← เพิ่ม/แก้ preset
│   └── problems.json ← เพิ่ม/แก้ปัญหา
├── lib/
│   ├── wizard.ts     ← Tuning calculation logic
│   └── utils.ts      ← Helpers
└── types/index.ts    ← TypeScript interfaces
```

---

## 🔮 Phase 2 Roadmap

| Feature | Priority | ต้องการ |
|---|---|---|
| Trick Library | High | JSON data + new page |
| Parts Compatibility | High | JSON data + search |
| User Drone Profile | Medium | Supabase auth |
| Community Presets | Medium | Supabase + moderation |
| Search ทั่วทั้งเว็บ | Low | Client-side search |
| PWA / Install | Low | next-pwa |

---

## ⚠️ Disclaimer

ค่าทั้งหมดเป็นจุดเริ่มต้นโดยประมาณ ควร fine-tune ตามโดรนจริงและทดสอบในพื้นที่ปลอดภัยเสมอ
