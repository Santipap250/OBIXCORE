import type { Metadata } from "next";
import BlackboxClient from "./BlackboxClient";

const TITLE = "Blackbox / Step-Response Reader — วิเคราะห์การบินโดรน FPV | OBIXCORE";
const DESCRIPTION =
  "ไม่มี Blackbox log ก็วิเคราะห์ step response ได้ ตอบคำถามว่าโดรน FPV คุณรู้สึกยังไงตอนบิน แล้วรับคำแนะนำ PID/filter delta พร้อมคำสั่ง Betaflight CLI";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "blackbox log analysis",
    "step response drone",
    "Betaflight step response",
    "วิเคราะห์ blackbox โดรน",
    "PID delta calculator",
    "drone oscillation diagnosis",
  ],
  alternates: { canonical: "/blackbox" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/blackbox",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "OBIXCORE Blackbox / Step-Response Reader" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.svg"],
  },
};

export default function BlackboxPage() {
  return <BlackboxClient />;
}
