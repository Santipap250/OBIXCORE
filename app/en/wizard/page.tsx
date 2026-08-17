import type { Metadata } from "next";
import { Suspense } from "react";
import WizardClient from "@/app/wizard/WizardClient";

const TITLE = "Tuning Wizard — Auto Betaflight PID Tuning | OBIXCORE";
const DESCRIPTION =
  "Enter your FPV drone specs and get auto-calculated PID, Filter, Rates, and Betaflight CLI commands — ready to copy and paste in.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Betaflight tuning wizard",
    "FPV PID calculator",
    "drone PID tuning",
    "Betaflight CLI generator",
    "drone tuning wizard",
    "PID filter rates calculator",
  ],
  alternates: {
    canonical: "/en/wizard",
    languages: { "th-TH": "/wizard", "en-US": "/en/wizard" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/en/wizard",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "OBIXCORE Tuning Wizard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

export default function WizardPageEn() {
  return (
    <Suspense fallback={null}>
      <WizardClient locale="en" />
    </Suspense>
  );
}
