import type { Metadata } from "next";
import CompatibilityClient from "./CompatibilityClient";

const TITLE = "Parts Compatibility — เช็คมาตรฐานชิ้นส่วนโดรน FPV | OBIXCORE";
const DESCRIPTION =
  "อ้างอิงมาตรฐาน mounting pattern, ขั้วแบต, และขั้วเสา VTX ของชิ้นส่วนโดรน FPV — เช็คว่าชิ้นส่วนที่จะซื้อเข้ากันได้กับ build ของคุณไหม";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "FPV parts compatibility",
    "motor mount pattern โดรน",
    "XT60 XT30 XT90",
    "FC ESC stack mounting",
    "FPV drone parts guide",
  ],
  alternates: {
    canonical: "/compatibility",
    languages: { "th-TH": "/compatibility", "en-US": "/en/compatibility" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/compatibility",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "OBIXCORE Parts Compatibility" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

export default function CompatibilityPage() {
  return <CompatibilityClient />;
}
