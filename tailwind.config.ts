import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        reoboto: ["Poppins", "sans-serif"],
      },
      fontWeight: {
        thin: "100",
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        black: "900",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
export default config;