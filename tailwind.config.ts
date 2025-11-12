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
        'kanyini': {
          'primary': '#597242',
          'secondary': '#3f3f44',
          'accent': '#597242',
        },
      },
    },
  },
  plugins: [],
};
export default config;

