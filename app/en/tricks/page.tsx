import type { Metadata } from "next";
import TricksClient from "@/app/tricks/TricksClient";

const TITLE = "Trick Library — FPV Freestyle Drone Tricks | OBIXCORE";
const DESCRIPTION =
  "A library of FPV freestyle tricks from beginner to advanced — Power Loop, Split-S, Barrel Roll, Wall Ride, and more, with steps, tips, and common mistakes for each.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "FPV freestyle tricks",
    "power loop tutorial",
    "split-s FPV drone",
    "FPV drone tricks tutorial",
    "freestyle drone flying",
  ],
  alternates: {
    canonical: "/en/tricks",
    languages: { "th-TH": "/tricks", "en-US": "/en/tricks" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/en/tricks",
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

export default function TricksPageEn() {
  return <TricksClient locale="en" />;
}
