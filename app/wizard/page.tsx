import type { Metadata } from "next";
import { Suspense } from "react";
import WizardClient from "./WizardClient";

const TITLE = "Tuning Wizard — ตั้งค่า PID Betaflight อัตโนมัติ | OBIXCORE";
const DESCRIPTION =
  "กรอกสเปกโดรน FPV แล้วรับค่า PID, Filter, Rates และคำสั่ง CLI สำหรับ Betaflight อัตโนมัติ พร้อม copy ไปวางใช้งานได้ทันที";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Betaflight tuning wizard",
    "FPV PID calculator",
    "ตั้งค่า PID โดรน",
    "Betaflight CLI",
    "drone tuning wizard",
    "PID filter rates",
  ],
  alternates: { canonical: "/wizard" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/wizard",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "OBIXCORE Tuning Wizard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.svg"],
  },
};

export default function WizardPage() {
  return (
    <Suspense fallback={null}>
      <WizardClient />
    </Suspense>
  );
}
