/**
 * ค่าคงที่สำหรับหน้า /support ทั้งหมดอยู่ในไฟล์เดียว
 * แก้ลิงก์/ข้อมูลจริงตรงนี้ที่เดียว ไม่ต้องไปหาแก้ใน page.tsx
 *
 * สถานะปัจจุบัน:
 * - PromptPay: ใส่ QR จริงแล้ว (public/support-qr.jpg) + ชื่อผู้รับแล้ว
 * - Facebook: ใส่ลิงก์จริงแล้ว
 *
 * ยังต้องใส่ก่อน deploy จริง (ถ้าต้องการ):
 * - buyMeACoffeeUrl: ลิงก์ Buy Me a Coffee / Ko-fi ถ้ามี
 * - contactEmail: อีเมลจริงสำหรับติดต่อ/collab (ตอนนี้เป็น placeholder)
 * - discordUrl / githubUrl: ใส่ถ้ามี ไม่มีก็ปล่อย null ได้ การ์ดจะไม่แสดง
 */

export interface SupportLinkConfig {
  buyMeACoffeeUrl: string | null;
  promptPayId: string | null;
  promptPayQrImage: string | null;
  promptPayName: string | null;
  contactEmail: string;
  discordUrl: string | null;
  githubUrl: string | null;
  facebookUrl: string | null;
}

export const SUPPORT_LINKS: SupportLinkConfig = {
  buyMeACoffeeUrl: null, // เช่น "https://www.buymeacoffee.com/yourname"
  promptPayId: null, // ไม่จำเป็นต้องใส่ถ้ามีรูป QR อยู่แล้ว (ใช้แสดงเป็น fallback ข้อความ)
  promptPayQrImage: "/support-qr.jpg",
  promptPayName: "นาย สันติภาพ สงฆรักษ์",
  contactEmail: "hello@obixcore.app", // เปลี่ยนเป็นอีเมลจริงถ้ามี
  discordUrl: null,
  githubUrl: null,
  facebookUrl: "https://www.facebook.com/santipab.songkarak",
};

export interface SupportTier {
  id: string;
  name: string;
  nameTh: string;
  price: string;
  description: string;
  perks: string[];
  accent: "green" | "blue" | "purple";
  highlight?: boolean;
}

export const SUPPORT_TIERS: SupportTier[] = [
  {
    id: "spotter",
    name: "Spotter",
    nameTh: "ผู้ช่วยมอง",
    price: "ตามใจ",
    description: "สนับสนุนครั้งเดียว เหมือนซื้อกาแฟให้นักบินพักสายตาก่อนบินรอบต่อไป",
    perks: ["ชื่อขึ้นหน้า Thank you (ถ้าต้องการ)", "ความรู้สึกดีที่ได้ช่วยโปรเจกต์โอเพนทูล"],
    accent: "green",
  },
  {
    id: "ground-crew",
    name: "Ground Crew",
    nameTh: "ทีมภาคพื้น",
    price: "รายเดือน",
    description: "สนับสนุนต่อเนื่อง ช่วยให้มีงบดูแล server และเวลาพัฒนาฟีเจอร์ใหม่สม่ำเสมอ",
    perks: ["ชื่อขึ้นหน้า Thank you แบบถาวร", "แจ้งความคืบหน้า feature ใหม่ก่อนใคร", "มีสิทธิ์เสนอ preset/ปัญหาที่อยากให้เพิ่ม"],
    accent: "blue",
    highlight: true,
  },
  {
    id: "flight-sponsor",
    name: "Flight Sponsor",
    nameTh: "ผู้สนับสนุนหลัก",
    price: "ติดต่อ",
    description: "สำหรับร้านค้า/แบรนด์ FPV ที่อยากสนับสนุนเครื่องมือที่ชุมชนใช้จริง",
    perks: ["โลโก้/ลิงก์ในหน้า Support", "พูดคุยฟีเจอร์ที่ตรงกับกลุ่มลูกค้าคุณ", "ติดต่อตรงผู้พัฒนา"],
    accent: "purple",
  },
];
