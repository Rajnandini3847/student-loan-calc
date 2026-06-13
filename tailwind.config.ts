import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        paper: "#FBF8F1",      // background
        ink: "#171717",        // text
        muted: "#6E6A60",      // secondary text
        line: "#E6DFD0",       // borders
        accent: "#1E5F3F",     // primary (deep green)
        accent2: "#C46A4B",    // warm accent (terracotta)
        butter: "#F0CB69",
        sky: "#9BBED9",
      },
    },
  },
  plugins: [],
};
export default config;
