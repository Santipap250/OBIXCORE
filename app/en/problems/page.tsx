import type { Metadata } from "next";
import ProblemsClient from "@/app/problems/ProblemsClient";

const TITLE = "Problem Solver — Fix FPV Drone Flight Issues | OBIXCORE";
const DESCRIPTION =
  "Pick the symptom you're seeing while flying your FPV drone, see the likely causes, and get step-by-step fixes with Betaflight CLI commands for each one.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "FPV drone troubleshooting",
    "Betaflight troubleshooting",
    "drone oscillation fix",
    "FPV propwash fix",
    "drone PID issues",
    "FPV flying issues",
  ],
  alternates: {
    canonical: "/en/problems",
    languages: { "th-TH": "/problems", "en-US": "/en/problems" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/en/problems",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "OBIXCORE Problem Solver" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

export default function ProblemsPageEn() {
  return <ProblemsClient locale="en" />;
}
