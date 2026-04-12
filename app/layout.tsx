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
      <body className="bg-bg font-sarabun text-text min-h-screen">
        {/* Background grid pattern */}
        <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none" />

        {/* Top nav (desktop) / Bottom nav (mobile) */}
        <Nav />

        {/* Page content with padding for nav */}
        <main className="pb-20 md:pb-0 md:pt-16 min-h-screen relative">
          {children}
        </main>
      </body>
    </html>
  );
}
