import type { Metadata } from "next";
import ProblemsClient from "./ProblemsClient";

const TITLE = "Problem Solver — แก้ปัญหาการบินโดรน FPV | OBIXCORE";
const DESCRIPTION =
  "เลือกอาการที่เจอระหว่างบินโดรน FPV แล้วดูสาเหตุที่เป็นไปได้ พร้อมขั้นตอนแก้ไขและคำสั่ง Betaflight CLI ทีละสาเหตุ";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "แก้ปัญหาโดรน FPV",
    "Betaflight troubleshooting",
    "drone oscillation fix",
    "FPV prop wash fix",
    "แก้ปัญหา PID โดรน",
    "drone flying issues",
  ],
  alternates: { canonical: "/problems" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/problems",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "OBIXCORE Problem Solver" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.svg"],
  },
};

export default function ProblemsPage() {
  return <ProblemsClient />;
}
