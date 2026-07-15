# OBIXCORE — Launch Checklist

## ต้องทำก่อน deploy จริง (blocking)
- [ ] รัน `npm install && npm run build` จริงบนเครื่อง/Render อย่างน้อย 1 ครั้ง
      ให้ผ่านแบบไม่มี error (static analysis ที่ทำมาทั้งหมดยังไม่ใช่ตัวแทน
      TypeScript compiler ตัวจริง 100%)
- [ ] ตั้ง environment variable `NEXT_PUBLIC_SITE_URL` บน Render ให้เป็น
      โดเมนจริง (ใช้ทั้งใน `app/layout.tsx` สำหรับ `metadataBase`/OG image
      และใน `app/sitemap.ts`, `app/robots.ts`)
- [ ] เติมค่าจริงใน `lib/support.ts`: `buyMeACoffeeUrl` ยังเป็น placeholder
      (PromptPay QR, ชื่อผู้รับ, อีเมลติดต่อ, Facebook ใส่ค่าจริงแล้ว)
- [ ] เช็คว่า `/public/og-image.svg` เป็นภาพที่อยากใช้จริงตอนแชร์ลิงก์บน
      social (ตอนนี้ทุกหน้าอ้างอิงไฟล์เดียวกัน)

## แนะนำให้ทำ (ไม่ blocking)
- [ ] ทดสอบแชร์ลิงก์จริงผ่าน Facebook/Twitter/LINE debugger tool เพื่อดู
      OG preview จริง (บาง platform cache preview เก่าไว้ ต้อง force
      refresh cache)
- [ ] ทดสอบ narrator จริง (VoiceOver/TalkBack) ผ่านหน้า Problems/Presets/
      Wizard อย่างน้อย 1 รอบ เพื่อยืนยันว่า aria-pressed/aria-live ที่เพิ่ม
      เข้าไปฟังแล้วเข้าใจ
- [ ] เปิดเว็บบนมือถือจอเล็กสุดที่มี (iPhone SE / 360px width) เช็คว่าไม่มี
      horizontal scroll โดยเฉพาะหน้า Wizard/Visualizer ที่มี grid หลายคอลัมน์
- [ ] รัน Lighthouse (Performance + Accessibility + SEO) บน build จริง 1 รอบ
      เก็บ baseline score ไว้เทียบรอบต่อไป

## ทำได้ทีหลัง (post-launch)
- [ ] พิจารณาใส่ analytics (privacy-friendly เช่น Plausible/Umami) เพื่อดูว่า
      หน้าไหนถูกใช้เยอะสุด ก่อนตัดสินใจพัฒนาฟีเจอร์ต่อไป
