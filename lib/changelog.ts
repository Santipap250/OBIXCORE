/**
 * ข้อมูลสำหรับหน้า /changelog (public-facing)
 * เพิ่ม release ใหม่โดยเพิ่ม object เข้าไปที่ต้นอาร์เรย์ (ใหม่สุดอยู่บนสุด)
 * เขียนเป็นภาษาที่ผู้ใช้ทั่วไปอ่านเข้าใจ ไม่ใช่ dev changelog แบบ CHANGELOG.md
 */

export type ChangeKind = "new" | "improved" | "fixed";

export interface ChangelogEntry {
  version: string;
  date: string; // ISO date, e.g. "2026-07-08"
  title: string;
  summary: string;
  changes: { kind: ChangeKind; text: string }[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "v0.1.0",
    date: "2026-07-08",
    title: "เปิดตัว OBIXCORE",
    summary:
      "เวอร์ชันแรกที่เปิดให้ใช้งานจริง รวมเครื่องมือจูนโดรน FPV ครบชุด พร้อมหน้าเว็บที่ปรับให้ใช้งานลื่นทั้งมือถือและเดสก์ท็อป",
    changes: [
      { kind: "new", text: "Tuning Wizard — กรอกสเปกโดรนแล้วรับค่า PID, Filter, Rates และคำสั่ง Betaflight CLI อัตโนมัติ" },
      { kind: "new", text: "Problem Solver — เลือกอาการที่เจอตอนบิน ดูสาเหตุที่เป็นไปได้พร้อมวิธีแก้ทีละสาเหตุ" },
      { kind: "new", text: "Calculator — คำนวณ thrust-to-weight, กระแสไฟ, และเวลาบินโดยประมาณ" },
      { kind: "new", text: "Preset Library — คลัง PID/Rates พร้อมใช้สำหรับ Race, Freestyle, Cinematic" },
      { kind: "new", text: "3D Build Visualizer — ดูภาพ 3D ของ build พร้อมเช็คความเข้ากันได้ของชิ้นส่วน" },
      { kind: "new", text: "หน้า Support — ช่องทางสนับสนุนโปรเจกต์ (PromptPay, Buy Me a Coffee, ติดต่อ/collab)" },
      { kind: "improved", text: "ปรับ contrast ของตัวอักษรขนาดเล็กทั้งเว็บให้อ่านง่ายขึ้นตามมาตรฐาน accessibility" },
      { kind: "improved", text: "เพิ่มการรองรับ screen reader (ปุ่มเลือก, filter, accordion) ให้ใช้งานได้ครบสำหรับผู้ใช้ที่พึ่ง assistive technology" },
      { kind: "improved", text: "ปรับ SEO ทุกหน้า พร้อม sitemap และ Open Graph สำหรับแชร์ลิงก์" },
    ],
  },
];
