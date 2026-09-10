import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        teamA: {
          light: "#DBEAFE",
          DEFAULT: "#2563EB",
          dark: "#1E40AF",
          glow: "#60A5FA",
          border: "#93C5FD",
        },
        teamB: {
          light: "#FFEDD5",
          DEFAULT: "#EA580C",
          dark: "#C2410C",
          glow: "#FB923C",
          border: "#FDBA74",
        },
        eco: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          300: "#6EE7B7",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          900: "#064E3B",
        },
        bio: {
          light: "#A5F3FC",
          DEFAULT: "#06B6D4",
          dark: "#0891B2",
        },
        decay: {
          light: "#FEF3C7",
          DEFAULT: "#D97706",
          dark: "#78350F",
        }
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-delayed": "float 4s ease-in-out 2s infinite",
        pulseGlow: "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bubble: "bubble 2s ease-in infinite",
        shimmer: "shimmer 2.5s linear infinite",
        energy: "energy 1.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(3deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.05)" },
        },
        bubble: {
          "0%": { transform: "translateY(0) scale(0.6)", opacity: "0.8" },
          "50%": { transform: "translateY(-20px) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-45px) scale(0.3)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        energy: {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
