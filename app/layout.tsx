import type { Metadata } from "next";
import { JetBrains_Mono, Orbitron, Sarabun } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

const sarabun = Sarabun({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OBIXCORE — FPV Tuning Platform",
  description: "เครื่องมือจูนโดรน FPV ครบครัน Tuning Wizard, Problem Solver, Calculator และ Preset Library",
  keywords: ["FPV", "drone", "betaflight", "tuning", "PID", "preset", "โดรน"],
  themeColor: "#07090d",
  openGraph: {
    title: "OBIXCORE — FPV Tuning Platform",
    description: "เครื่องมือจูนโดรน FPV ครบครัน Tuning Wizard, Problem Solver, Calculator และ Preset Library",
    images: ["/obixcore-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/obixcore-logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`dark ${orbitron.variable} ${jetbrainsMono.variable} ${sarabun.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/obixcore-logo.png" sizes="any" />
      </head>
      <body className="relative isolate min-h-screen overflow-x-hidden bg-bg font-sarabun text-text antialiased">
        <div className="pointer-events-none fixed inset-0 -z-30 bg-[radial-gradient(circle_at_top_left,_rgba(0,232,122,0.18),_transparent_28%),radial-gradient(circle_at_82%_16%,_rgba(0,170,255,0.14),_transparent_22%),radial-gradient(circle_at_16%_78%,_rgba(176,96,255,0.16),_transparent_24%),radial-gradient(circle_at_78%_82%,_rgba(255,187,0,0.10),_transparent_20%),linear-gradient(180deg,#07090d_0%,#0a0c10_44%,#07090d_100%)]" />
        <div className="pointer-events-none fixed inset-0 -z-20 bg-grid opacity-35" />
        <div className="pointer-events-none fixed inset-0 -z-10 hud-noise" />
        <div className="pointer-events-none fixed inset-0 -z-10 scanline-overlay" />

        <div className="pointer-events-none fixed -top-28 -left-24 h-72 w-72 rounded-full bg-green-DEFAULT/15 blur-3xl animate-float-slow" />
        <div className="pointer-events-none fixed top-20 -right-24 h-80 w-80 rounded-full bg-blue-DEFAULT/12 blur-3xl animate-float-slower" />
        <div className="pointer-events-none fixed bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-DEFAULT/10 blur-3xl animate-float-slow" />

        <Nav />

        <main className="relative z-10 min-h-screen pb-24 md:pb-0 md:pt-24">
          {children}
        </main>
      </body>
    </html>
  );
}
