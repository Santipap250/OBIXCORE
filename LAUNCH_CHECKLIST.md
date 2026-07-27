# OBIXCORE — Launch Checklist

## ต้องทำก่อน deploy จริง (blocking)
- [x] รัน `npm install && npm run build` จริง — ยืนยันผ่านจากการ deploy สำเร็จ
      หลายรอบบน Vercel (obixcore.vercel.app) ตลอด session นี้ (sandbox ของ
      Claude เองรัน build เต็มไม่ได้เพราะ network whitelist บล็อก Google
      Fonts แต่ type-check ผ่านสะอาดทุกรอบ และ Vercel build จริงผ่านแล้ว)
- [x] ตั้ง environment variable `NEXT_PUBLIC_SITE_URL` บน Vercel เป็นโดเมนจริง
      แล้ว — ยืนยันแล้วว่า canonical/OG/Twitter meta ไม่ใช่ localhost อีกต่อไป
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
- [x] เปิดเว็บบนมือถือจอเล็กสุด (360-375px) — เจอและแก้บั๊กจริงหลายจุด:
      คะแนน 5 ช่องในหน้า ConfigDoctor ล้นจอ, ปุ่มเลือกแบตในหน้า Profiles
      บีบแคบเกินไป, CLI command บรรทัดยาวล้นกรอบ, การ์ดบางหน้าไม่กางเต็ม
      ความกว้าง — แก้ครบแล้วทุกจุดที่เจอ ควรเปิดเช็คซ้ำอีกรอบบนอุปกรณ์จริง
- [ ] รัน Lighthouse (Performance + Accessibility + SEO) บน build จริง 1 รอบ
      เก็บ baseline score ไว้เทียบรอบต่อไป

## ทำได้ทีหลัง (post-launch)
- [ ] พิจารณาใส่ analytics (privacy-friendly เช่น Plausible/Umami) เพื่อดูว่า
      หน้าไหนถูกใช้เยอะสุด ก่อนตัดสินใจพัฒนาฟีเจอร์ต่อไป
