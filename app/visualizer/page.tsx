import type { Metadata } from "next";
import VisualizerClient from "./VisualizerClient";

const TITLE = "3D Build Visualizer — ตรวจสอบความเข้ากันได้ของ Build โดรน FPV | OBIXCORE";
const DESCRIPTION =
  "ดูภาพ 3D แบบ interactive ของ build โดรน FPV พร้อมตรวจสอบความเข้ากันได้ของเฟรม ใบพัด มอเตอร์ และแบตเตอรี่ ก่อนซื้อจริง";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "FPV drone visualizer",
    "drone build compatibility checker",
    "3D drone build preview",
    "เช็ค compatibility โดรน FPV",
    "FPV frame prop motor compatibility",
    "drone parts compatibility",
  ],
  alternates: { canonical: "/visualizer" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/visualizer",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "OBIXCORE 3D Build Visualizer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.svg"],
  },
};

export default function VisualizerPage() {
  return <VisualizerClient />;
}
