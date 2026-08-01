import type { Metadata } from "next";
import TricksClient from "./TricksClient";

const TITLE = "Trick Library — ท่าบิน Freestyle โดรน FPV | OBIXCORE";
const DESCRIPTION =
  "คลังท่าบิน freestyle โดรน FPV ตั้งแต่ระดับเริ่มต้นถึงขั้นสูง พร้อมขั้นตอน เคล็ดลับ และข้อผิดพลาดที่พบบ่อยของแต่ละท่า";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "FPV freestyle tricks",
    "ท่าบินโดรน FPV",
    "power loop โดรน",
    "split-s FPV",
    "FPV drone tricks tutorial",
    "freestyle drone flying",
  ],
  alternates: { canonical: "/tricks" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/tricks",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "OBIXCORE Trick Library" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

export default function TricksPage() {
  return <TricksClient />;
}
