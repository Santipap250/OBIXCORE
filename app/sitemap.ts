import type { MetadataRoute } from "next";

// Set NEXT_PUBLIC_SITE_URL in your Render environment to your real domain —
// same variable used in app/layout.tsx for metadataBase / OG images.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/wizard", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/diagnose", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/problems", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/calculator", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/presets", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/visualizer", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/blackbox", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/profiles", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/support", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/changelog", priority: 0.4, changeFrequency: "weekly" as const },
  ];

  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
