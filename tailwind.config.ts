import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        council: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.06)",
        elevate:
          "0 4px 6px -1px rgb(15 23 42 / 0.06), 0 12px 24px -8px rgb(15 23 42 / 0.12)",
        sidebar:
          "4px 0 24px -4px rgb(0 0 0 / 0.25), inset -1px 0 0 rgb(255 255 255 / 0.06)",
      },
      backgroundImage: {
        "gradient-sidebar":
          "linear-gradient(165deg, rgb(15 23 42) 0%, rgb(15 23 42) 45%, rgb(2 6 23) 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
