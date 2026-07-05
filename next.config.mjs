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

export default nextConfig;
