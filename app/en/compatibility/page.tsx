import type { Metadata } from "next";
import CompatibilityClient from "@/app/compatibility/CompatibilityClient";

const TITLE = "Parts Compatibility — FPV Drone Hardware Standards | OBIXCORE";
const DESCRIPTION =
  "Reference for mounting patterns, battery connectors, and VTX antenna connectors commonly used in FPV — check whether the parts you're about to buy fit your build.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "FPV parts compatibility",
    "drone motor mount pattern",
    "XT60 XT30 XT90",
    "FC ESC stack mounting",
    "FPV drone parts guide",
  ],
  alternates: {
    canonical: "/en/compatibility",
    languages: { "th-TH": "/compatibility", "en-US": "/en/compatibility" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/en/compatibility",
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

export default function CompatibilityPageEn() {
  return <CompatibilityClient locale="en" />;
}
