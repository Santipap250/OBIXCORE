import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

const siteUrl = "https://obixcore.onrender.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OBIXCORE — Dark Neon FPV Platform",
    template: "%s | OBIXCORE",
  },
  description:
    "OBIXCORE คือแพลตฟอร์ม FPV ดาร์กนีออนสำหรับ tuning, problem solving, calculator และ preset library ที่ช่วยให้ตั้งค่าโดรนได้ง่ายและเร็วขึ้น",
  applicationName: "OBIXCORE",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "OBIXCORE",
    "FPV",
    "drone",
    "Betaflight",
    "PID tuning",
    "FPV calculator",
    "preset library",
    "drone troubleshooting",
    "HUD",
    "dark neon",
  ],
  authors: [{ name: "OBIXCORE" }],
  creator: "OBIXCORE",
  publisher: "OBIXCORE",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "OBIXCORE",
    title: "OBIXCORE — Dark Neon FPV Platform",
    description:
      "FPV tuning, problem solving, calculator และ preset library ในธีม Dark Neon HUD พร้อมใช้งานบนมือถือและ desktop",
    locale: "th_TH",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "OBIXCORE Dark Neon FPV Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OBIXCORE — Dark Neon FPV Platform",
    description:
      "FPV tuning, problem solving, calculator และ preset library ในธีม Dark Neon HUD",
    images: ["/og-image.svg"],
  },
  themeColor: "#0a0c10",
  icons: { icon: "/favicon.svg" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "OBIXCORE",
  url: siteUrl,
  description:
    "แพลตฟอร์ม FPV Dark Neon HUD สำหรับ tuning, calculator, problem solver และ preset library",
  inLanguage: "th-TH",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/problems?query={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="dark">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="theme-color" content="#0a0c10" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-bg text-text min-h-screen relative overflow-x-hidden antialiased">
        <div className="fixed inset-0 pointer-events-none opacity-90">
          <div className="absolute inset-0 bg-grid" />
          <div className="absolute inset-0 hud-grid opacity-[0.24]" />
          <div className="absolute inset-0 scanline-overlay mix-blend-screen" />
          <div className="absolute inset-0 hud-noise" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,232,122,0.16),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(0,170,255,0.14),transparent_22%),radial-gradient(circle_at_16%_84%,rgba(176,96,255,0.11),transparent_20%),radial-gradient(circle_at_70%_78%,rgba(255,187,0,0.08),transparent_18%)]" />
          <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-green-DEFAULT/10 blur-3xl float-slow" />
          <div className="absolute top-28 -left-16 h-72 w-72 rounded-full bg-blue-DEFAULT/10 blur-3xl float-med" />
          <div className="absolute bottom-12 right-0 h-80 w-80 rounded-full bg-purple-DEFAULT/10 blur-3xl float-slower" />
          <div className="absolute left-1/3 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-amber-DEFAULT/8 blur-3xl float-med" />
        </div>

        <Nav />
        <main className="pb-20 md:pb-0 md:pt-16 min-h-screen relative">
          {children}
        </main>
      </body>
    </html>
  );
}
