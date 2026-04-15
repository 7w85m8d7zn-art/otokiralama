import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",
        soft: "#F1F5F9",
        footer: "#1A202C",
        whatsapp: "#25D366"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
