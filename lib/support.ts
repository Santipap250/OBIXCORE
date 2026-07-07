/**
 * ค่าคงที่สำหรับหน้า /support ทั้งหมดอยู่ในไฟล์เดียว
 * แก้ลิงก์/ข้อมูลจริงตรงนี้ที่เดียว ไม่ต้องไปหาแก้ใน page.tsx
 *
 * TODO ก่อน deploy จริง — ต้องใส่ค่าจริงแทน placeholder ด้านล่าง:
 * - buyMeACoffeeUrl: ลิงก์ Buy Me a Coffee / Ko-fi ของคุณ
 * - promptPayId: เบอร์/เลขบัตร PromptPay (ใช้แสดงเป็นข้อความ ไม่ใช่ QR จริง
 *   จนกว่าจะใส่ไฟล์ QR ที่ /public/support-qr.png)
 * - contactEmail: อีเมลสำหรับติดต่อ/collab
 * - discordUrl / githubUrl: ใส่ถ้ามี ไม่มีก็ปล่อย null ได้ การ์ดจะไม่แสดง
 */

export interface SupportLinkConfig {
  buyMeACoffeeUrl: string | null;
  promptPayId: string | null;
  promptPayQrImage: string | null;
  contactEmail: string;
  discordUrl: string | null;
  githubUrl: string | null;
}

export const SUPPORT_LINKS: SupportLinkConfig = {
  buyMeACoffeeUrl: null, // เช่น "https://www.buymeacoffee.com/yourname"
  promptPayId: "004999117205996", // เช่น "099-xxx-xxxx"
  promptPayQrImage: "/support-qr.png",// เช่น "/support-qr.png" — วางไฟล์ไว้ที่ public/ ก่อนใส่ path นี้
  contactEmail: "santipap350z@gmail.com", // เปลี่ยนเป็นอีเมลจริง
  discordUrl: null,
  githubUrl: null,
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
