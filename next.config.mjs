/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — required for Cloudflare Pages / GitHub Pages deploy.
  // Without this, `next build` produces a server build in `.next/` instead
  // of the static `out/` folder the README's deploy steps expect, so the
  // documented "Output directory: out" setting would fail with nothing to
  // serve.
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
