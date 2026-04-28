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
        background: "var(--background)",
        foreground: "var(--foreground)",
        clover: {
          50: "#ecfdf5",
          100: "#d1fae5",
          400: "var(--clover)",
          500: "var(--clover)",
          600: "#059669",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",
          900: "#064e3b",
        },
        green: {
          400: "#34d399",
          500: "#10b981",
        },
        red: {
          400: "#f87171",
          500: "#ef4444",
        },
        yellow: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
        gray: {
          300: "#cbd5e1",
          400: "var(--muted)",
          500: "var(--muted)",
        },
        card: "var(--card-bg)",
        cardBorder: "var(--card-border)",
        stellar: {
          amber: "#f59e0b",
          gold: "#fbbf24",
          dark: "#020617",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
