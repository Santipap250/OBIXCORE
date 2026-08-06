import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  reloadOnOnline: true,
  // Fallback shown for page navigations when offline AND the page wasn't
  // already cached (e.g. the very first visit to a route happened offline).
  fallbacks: {
    document: "/~offline",
  },
  // Defaults from the plugin already fit this project well: page
  // navigations use NetworkFirst (always tries live first, falls back to
  // cache only when offline), and our data/*.json files are bundled into
  // content-hashed JS chunks at build time rather than fetched at runtime
  // — so a new deploy always gets a new hash and never serves stale data
  // from an old cache. No custom runtimeCaching override needed.
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: deliberately NOT using `output: "export"` here.
  // This project is deployed on Render via `next start` (see package.json's
  // "start" script), which runs a real Next.js Node server — and `next
  // start` refuses to run at all against a static-export build ("next
  // start" does not work with "output: export" configuration).
  // Static export only applies if you switch to static hosting (Cloudflare
  // Pages / GitHub Pages) and never call `next start` in that deploy.
  images: {
    unoptimized: true,
  },
};

export default withPWA(nextConfig);
