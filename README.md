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

**Prerequisites:** Node.js 20.18.1 (ดู `.node-version`) / npm 9+

---

## 🌐 Deploy (Render)

โปรเจกต์นี้ deploy เป็น **server-rendered app บน Render** (ไม่ใช่ static export) — `next.config.mjs` ไม่มี `output: "export"` และ `package.json` ตั้ง `start` script เป็น `next start -H 0.0.0.0 -p ${PORT:-3000}` ไว้รองรับ Render โดยเฉพาะแล้ว

```bash
# 1. Push code ขึ้น GitHub
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USER/obixcore.git
git push -u origin main

# 2. ไปที่ https://dashboard.render.com/ → New → Web Service
# 3. Connect GitHub repo
# 4. ตั้งค่า:
#    Environment: Node
#    Build Command: npm install && npm run build
#    Start Command: npm start
#    Node Version: 20.18.1 (Render จะอ่านจาก .node-version ให้อัตโนมัติ)
# 5. Create Web Service → Render build + deploy ให้อัตโนมัติทุกครั้งที่ push
```

**หมายเหตุ:** ห้ามเผลอใส่ `output: "export"` กลับเข้าไปใน `next.config.mjs` — เคยเป็นบั๊กที่ทำให้ deploy พังมาแล้วครั้งหนึ่ง เพราะ static export ไม่รองรับ server-side features ที่โปรเจกต์นี้ใช้

---

## 📝 Content Workflow

### เพิ่ม Preset ใหม่

**วิธีที่แนะนำ:** แก้ `scripts/generate-presets.ts` — เพิ่ม seed ใหม่ใน `SEEDS[]` (แค่ `WizardInput` + เมทาดาต้า) แล้วรัน `npx tsx scripts/generate-presets.ts` เพื่อ regenerate `data/presets.json` ทั้งไฟล์ผ่าน `calculateTuning()` ตัวเดียวกับที่ Wizard ใช้ — การันตีว่า PID/filter/rates ของ preset ตรงกับที่ Wizard แนะนำสำหรับสเปกเดียวกันเป๊ะ ไม่มีสูตรคำนวณคู่ขนานที่อาจเพี้ยนไปจากกัน

**ถ้าจะแก้ `data/presets.json` ตรงๆ** ให้ยึด schema จริงตาม `types/index.ts` (`Preset` interface) — **ไม่ใช่** `type`/`frameSize` แบบ string เหมือนเวอร์ชันเก่า:

```json
{
  "id": "preset-5inch-freestyle-002",      // ← ต้อง unique
  "name": "ชื่อ preset",
  "description": "คำอธิบาย",
  "setupClass": "freestyle",               // micro | cinewhoop | freestyle | racing | longrange | heavylift
  "style": "freestyle",                    // race | freestyle | cinematic
  "frameSizeLabel": "5inch (4S Freestyle)", // ป้ายกำกับที่แสดงผล ไม่ใช่ค่าที่ใช้คำนวณ
  "propSizeIn": 5.1,
  "batteryS": 4,
  "weightG": 420,
  "bfVersion": "4.4",
  "difficulty": "intermediate",            // beginner | intermediate | advanced
  "useCase": "สั้นๆ ว่าเหมาะกับใคร/สถานการณ์ไหน",
  "confidence": 85,                        // 0-100, ความน่าเชื่อถือของ preset entry นี้เอง
  "tags": ["5inch", "4s", "freestyle"],
  "pid": {
    "roll":  { "p": 47, "i": 52, "d": 32, "f": 120 },
    "pitch": { "p": 48, "i": 52, "d": 32, "f": 120 },
    "yaw":   { "p": 35, "i": 90, "d": 0 }
  },
  "rates": {
    "roll":  { "rc_rate": 1.0, "rate": 0.70, "expo": 0.10 },
    "pitch": { "rc_rate": 1.0, "rate": 0.70, "expo": 0.10 },
    "yaw":   { "rc_rate": 1.0, "rate": 0.50, "expo": 0.10 }
  },
  "filters": {
    "gyroLpf1Hz": 200,
    "gyroLpf2Hz": 200,
    "dTermLpf1Hz": 100,
    "rpmFilter": true,
    "dynamicNotch": "MEDIUM"              // OFF | LOW | MEDIUM | HIGH
  },
  "cliCommands": [
    "# ชื่อ preset — OBIXCORE",
    "set p_roll = 47",
    "... ← ใส่ CLI commands ทั้งหมด",
    "save"
  ],
  "notes": "หมายเหตุพิเศษ",
  "referenceSpec": {                       // WizardInput เต็มของ build อ้างอิง — ใช้โดย presetRecommender
    "frameSize": 210, "motorKV": 2306, "batteryS": 4, "propSize": 51,
    "weight": 420, "style": "freestyle", "propBlades": 3, "motorCount": 4
  }
}
```

`setupClass` คือ enum เดียวกับที่ `lib/wizard.ts` ใช้จัดกลุ่ม (6 กลุ่ม: micro, cinewhoop, freestyle, racing, longrange, heavylift — ครอบคลุม 5 หมวดหลักของสเปก โดย freestyle/racing แยกกันเพราะ style ของ 5" ต่างกันชัด). `referenceSpec` ต้องตรงกับตัวเลขที่เหลือ เพราะ `lib/presetRecommender.ts` ใช้ค่านี้เทียบกับ build ของผู้ใช้จริง

commit + push → Render build และ deploy อัตโนมัติ (ปกติไม่กี่นาที ขึ้นกับ plan)

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

- `BASE_BY_CLASS` — baseline PID/filter/rates ต่อ 1 ใน 6 setupClass
- `classifyDrone()` — เกณฑ์แบ่งกลุ่มตามขนาด prop (+ style สำหรับแยก freestyle/racing)
- `calculateTuning()` — ฟังก์ชันหลัก รวม propLoad/inertia/style bias เข้ากับ baseline แล้วคืน `WizardResult`
- ฟิสิกส์กระแส/เวลาบิน (hover current, flight time, ESC headroom) อยู่แยกใน `lib/estimation.ts` ไม่ใช่ไฟล์นี้ — ทั้ง Wizard และ Calculator import จากที่เดียวกันเพื่อให้ตัวเลขตรงกัน

---

### เพิ่ม/แก้ Calculator, Diagnose, Blackbox, Profiles

หน้าเหล่านี้ตาม pattern เดียวกัน: `app/<tool>/page.tsx` (server component, ทำ metadata) + `app/<tool>/<Tool>Client.tsx` (UI/state จริง) โดย logic คำนวณอยู่ใน `lib/` แยกไฟล์ (เช่น `lib/estimation.ts` สำหรับ Calculator, `lib/diagnosis.ts` สำหรับ Diagnose/ConfigDoctor, `lib/blackbox.ts` สำหรับ Blackbox Reader)

---

## 🗂 Folder Reference

```
obixcore/
├── app/                ← Pages (Next.js App Router)
│   ├── page.tsx        ← Home
│   ├── wizard/         ← Tuning Wizard (6 setupClass, PID/filter/rates)
│   ├── diagnose/        ← ConfigDoctor (diagnosis engine)
│   ├── problems/       ← Problem Solver
│   ├── calculator/     ← Calculator (thrust/flight time/current)
│   ├── presets/        ← Preset Library (+ recommender)
│   ├── visualizer/     ← 3D Build Visualizer
│   ├── blackbox/       ← Blackbox / Step-Response Reader
│   ├── profiles/       ← Drone Profiles (CRUD, localStorage)
│   ├── support/        ← Support/donate page
│   ├── changelog/      ← Changelog page
│   ├── sitemap.ts / robots.ts
│   └── layout.tsx      ← Fonts, metadata, Nav
├── components/         ← Shared UI components
├── data/                ← แก้ไขที่นี่เพื่ออัปเดตเนื้อหา
│   ├── presets.json    ← generated by scripts/generate-presets.ts
│   └── problems.json   ← เพิ่ม/แก้ปัญหาโดยตรง
├── scripts/
│   └── generate-presets.ts  ← regenerate presets.json ผ่าน calculateTuning()
├── lib/
│   ├── wizard.ts             ← Tuning calculation logic (6 setupClass)
│   ├── diagnosis.ts          ← ConfigDoctor diagnosis engine
│   ├── estimation.ts         ← Shared current draw / flight time physics
│   ├── blackbox.ts           ← Blackbox/step-response analysis
│   ├── presetRecommender.ts  ← Scores presets against a Wizard build
│   ├── droneProfile.ts       ← Drone Profiles storage (localStorage)
│   ├── droneSpec.ts          ← Shared spec helpers
│   ├── changelog.ts          ← Changelog data/helpers
│   ├── support.ts            ← /support page config (links, tiers)
│   └── utils.ts              ← Shared helpers (labels, clamp, round, confidence)
└── types/index.ts      ← TypeScript interfaces (Preset, WizardInput/Result, etc.)
```

---

## 🔮 Phase 2 Roadmap

> Drone Profiles (localStorage), Blackbox/Step-Response Reader, และ 3D Build Visualizer ที่เคยอยู่ในลิสต์นี้ **ทำเสร็จแล้ว** (ดูใน `app/profiles`, `app/blackbox`, `app/visualizer`)

| Feature | Priority | ต้องการ |
|---|---|---|
| Trick Library | High | JSON data + new page |
| Parts Compatibility | High | JSON data + search |
| Community Presets | Medium | Supabase + moderation (ตอนนี้ preset เป็น local JSON ทั้งหมด) |
| Search ทั่วทั้งเว็บ | Low | Client-side search |
| PWA / Install | Low | next-pwa |

---

## ⚠️ Disclaimer

ค่าทั้งหมดเป็นจุดเริ่มต้นโดยประมาณ ควร fine-tune ตามโดรนจริงและทดสอบในพื้นที่ปลอดภัยเสมอ
