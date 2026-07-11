import type { Metadata } from "next";
import PresetsClient from "./PresetsClient";

const TITLE = "Preset Library — คลัง PID และ Rates Betaflight พร้อมใช้ | OBIXCORE";
const DESCRIPTION =
  "คลัง preset การตั้งค่า PID, Rates และ Filter สำหรับโดรน FPV หลายสไตล์ ทั้ง Race, Freestyle และ Cinematic กด copy ไปวางใน Betaflight CLI ได้ทันที";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Betaflight preset",
    "FPV PID preset",
    "preset โดรน race",
    "preset โดรน freestyle",
    "Betaflight rates preset",
    "drone tuning preset library",
  ],
  alternates: { canonical: "/presets" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/presets",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "OBIXCORE Preset Library" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.svg"],
  },
};

export default function PresetsPage() {
  return <PresetsClient />;
}
