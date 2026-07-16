import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        warmwhite: "#FAF9F6",
        paper: "#F5F4F1",
        ink: "#111827",
        deepblue: "#0B1E3D",
        electric: "#2563EB",
        cyan: "#22D3EE",
        line: "#E7E5E1",
        muted: "#6B7280",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["'Merriweather'", "serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(11,30,61,0.06)",
        card: "0 4px 20px rgba(11,30,61,0.05)",
        glow: "0 0 0 1px rgba(37,99,235,0.08), 0 10px 30px rgba(37,99,235,0.12)",
      },
      backgroundImage: {
        glass: "linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.3))",
      },
      transitionDuration: { 250: "250ms" },
    },
  },
  plugins: [],
};
export default config;
