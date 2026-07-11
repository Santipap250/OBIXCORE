import type { Metadata } from "next";
import ProfilesClient from "./ProfilesClient";

const TITLE = "Drone Profiles — บันทึกสเปกโดรน FPV หลายลำ | OBIXCORE";
const DESCRIPTION =
  "บันทึกสเปกโดรน FPV แต่ละลำไว้ในเครื่อง แล้วโหลดเข้า Tuning Wizard หรือ 3D Build Visualizer ได้ทันทีโดยไม่ต้องกรอกใหม่ทุกครั้ง";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "drone profile manager",
    "บันทึกสเปกโดรน",
    "FPV drone spec manager",
    "จัดการโดรนหลายลำ",
    "drone build tracker",
  ],
  alternates: { canonical: "/profiles" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/profiles",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "OBIXCORE Drone Profiles" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.svg"],
  },
};

export default function ProfilesPage() {
  return <ProfilesClient />;
}
