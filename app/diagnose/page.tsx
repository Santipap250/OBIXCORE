import type { Metadata } from "next";
import DiagnoseClient from "./DiagnoseClient";

const TITLE = "ConfigDoctor — วิเคราะห์ปัญหา Build โดรน FPV แบบละเอียด | OBIXCORE";
const DESCRIPTION =
  "วิเคราะห์ build โดรน FPV ครบทุกคลาส (Tiny Whoop ถึง Heavy Lifter) ได้ Health/Safety/Efficiency/Performance/Reliability Score พร้อม warning ระดับความรุนแรง คำแนะนำเรียงลำดับความสำคัญ และ CLI ที่พร้อม copy";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "ConfigDoctor",
    "drone diagnosis",
    "วิเคราะห์โดรน FPV",
    "Betaflight health check",
    "FPV motor load",
    "FPV ESC headroom",
    "drone build diagnostic tool",
  ],
  alternates: { canonical: "/diagnose" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/diagnose",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "OBIXCORE ConfigDoctor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.svg"],
  },
};

export default function DiagnosePage() {
  return <DiagnoseClient />;
}
