import type { Metadata } from "next";
import CalculatorClient from "./CalculatorClient";

const TITLE = "Thrust & Flight Time Calculator — คำนวณสเปกโดรน FPV | OBIXCORE";
const DESCRIPTION =
  "คำนวณ thrust-to-weight ratio, กระแสไฟที่ใช้ (current draw) และเวลาบินโดยประมาณของโดรน FPV จากสเปกมอเตอร์ ใบพัด และแบตเตอรี่";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "FPV thrust to weight calculator",
    "drone flight time calculator",
    "คำนวณ thrust โดรน",
    "คำนวณเวลาบินโดรน",
    "drone current draw calculator",
    "FPV battery calculator",
  ],
  alternates: { canonical: "/calculator" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/calculator",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "OBIXCORE Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.svg"],
  },
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
