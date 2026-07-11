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
    version: "v0.3.0",
    date: "2026-07-11",
    title: "เพิ่ม Drone Profiles",
    summary:
      "บันทึกสเปกโดรนของคุณได้หลายลำ แล้วโหลดเข้า Wizard หรือ Visualizer ได้ทันทีโดยไม่ต้องกรอกใหม่ทุกครั้ง",
    changes: [
      { kind: "new", text: "หน้า Drone Profiles — สร้าง แก้ไข ลบ สเปกโดรนแต่ละลำ เก็บไว้ในเครื่องของคุณ" },
      { kind: "new", text: "เริ่มสร้างโปรไฟล์แรกได้ง่ายจากเทมเพลต Race/Freestyle/Cinewhoop/Long-Range ที่มีให้เลย" },
      { kind: "new", text: "ปุ่ม \"ใช้ใน Wizard\" และ \"ใช้ใน Visualizer\" จากหน้า Profiles โหลดสเปกเข้าเครื่องมือนั้นทันที" },
    ],
  },
  {
    version: "v0.2.0",
    date: "2026-07-08",
    title: "เพิ่ม Blackbox / Step-Response Reader",
    summary:
      "เครื่องมือใหม่สำหรับวิเคราะห์การบินโดยไม่ต้องมี Blackbox log จริง — ตอบคำถามว่าโดรนคุณรู้สึกยังไง แล้วรับคำแนะนำ PID/filter ทันที",
    changes: [
      { kind: "new", text: "Blackbox / Step-Response Reader — ตอบคำถามเกี่ยวกับ overshoot, การสั่น, propwash, filter feel และอุณหภูมิมอเตอร์ แล้วรับการวิเคราะห์ทันที" },
      { kind: "new", text: "คำแนะนำ PID delta และ filter delta แยกตามอาการ พร้อมคำสั่ง Betaflight CLI ที่ใช้ค่าสัมพัทธ์ (ไม่เดาค่าตั้งต้นของคุณ)" },
      { kind: "new", text: "แจ้งเตือนแยกกรณีที่เป็นปัญหาฮาร์ดแวร์ (เช่น มอเตอร์ร้อนจัด) ที่ควรตรวจก่อนไปแก้ PID" },
    ],
  },
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
