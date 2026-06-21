import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "OBIXCORE — FPV Tuning Platform",
  description: "เครื่องมือจูนโดรน FPV ครบครัน Tuning Wizard, Problem Solver, Calculator และ Preset Library",
  keywords: ["FPV", "drone", "betaflight", "tuning", "PID", "preset", "โดรน"],
  themeColor: "#0a0c10",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="relative isolate min-h-screen overflow-x-hidden bg-bg font-sarabun text-text antialiased">
        {/* Lighter HUD background */}
        <div className="pointer-events-none fixed inset-0 -z-30 bg-[radial-gradient(circle_at_top,_rgba(0,232,122,0.08),_transparent_28%),radial-gradient(circle_at_80%_18%,_rgba(0,170,255,0.06),_transparent_22%),linear-gradient(180deg,#07090d_0%,#0a0c10_50%,#07090d_100%)]" />
        <div className="pointer-events-none fixed inset-0 -z-20 bg-grid opacity-35" />

        <Nav />

        <main className="relative z-10 min-h-screen pb-24 md:pb-0 md:pt-24">
          {children}
        </main>
      </body>
    </html>
  );
}
