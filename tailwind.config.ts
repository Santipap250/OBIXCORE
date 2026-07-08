import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#050814",
          surface: "#0d1320",
          elevated: "#121a2c",
          border: "#273759",
        },
        green: {
          DEFAULT: "#46f0b8",
          dim: "#12b886",
          muted: "#0b4338",
        },
        amber: {
          DEFAULT: "#ffd166",
          dim: "#cc9500",
          muted: "#3d2d00",
        },
        blue: {
          DEFAULT: "#63b3ff",
          dim: "#3d8ee8",
          muted: "#10345a",
        },
        cyan: {
          DEFAULT: "#7de6ff",
          dim: "#29b6d8",
          muted: "#073947",
        },
        purple: {
          DEFAULT: "#b491ff",
          dim: "#8a63ff",
          muted: "#261548",
        },
        red: {
          DEFAULT: "#ff6b8a",
          dim: "#f04667",
          muted: "#461322",
        },
        orange: {
          DEFAULT: "#ff9f6b",
          dim: "#ea7a45",
          muted: "#4a250f",
        },
        pink: {
          DEFAULT: "#ff5fb7",
          dim: "#d74bb7",
          muted: "#44133a",
        },
        text: {
          DEFAULT: "#edf4ff",
          muted: "#94a5bc",
          faint: "#74859c",
        },
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
        sarabun: ["var(--font-sarabun)", "sans-serif"],
      },
      animation: {
        "pulse-green": "pulseGreen 2s ease-in-out infinite",
        scan: "scan 3s linear infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "float-slow": "floatSlow 9s ease-in-out infinite",
        "float-slower": "floatSlower 14s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        pulseGreen: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(70,240,184,0)" },
          "50%": { boxShadow: "0 0 0 6px rgba(70,240,184,0.15)" },
        },
        scan: {
          "0%": { backgroundPosition: "0 -100%" },
          "100%": { backgroundPosition: "0 100%" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.75" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(0, -14px, 0) scale(1.03)" },
        },
        floatSlower: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(0, 12px, 0) scale(0.98)" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(70,240,184,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(70,240,184,0.03) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};

export default config;
