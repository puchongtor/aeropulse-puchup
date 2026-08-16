import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AeroPulse design tokens — graphite/carbon base with an amber
        // "pulse" accent for energy/CTA, and a cool volt-cyan reserved for
        // telemetry/data readouts (aero stats, match scores).
        void: "#101214",
        carbon: {
          900: "#15181B",
          800: "#1B1E22",
          700: "#22262B",
        },
        bone: "#F4F2ED",
        titanium: "#9BA3AC",
        "pulse-amber": "#FF7A33",
        "volt-cyan": "#2FE6D0",
        clay: "#E0A458",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
