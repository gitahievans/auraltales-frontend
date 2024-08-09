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
        primary: "#152D09",
        secondary: "#1F8505",
        tertiary: "#21440F",
        base: "#FFFFFF",
        textPrimary: "#FFFFFF",
        textSecondary: "#A9A9AA",
        color: "#1CFAC4",
      },
      fontFamily: {
        'main': ['Josefin Sans', 'sans-serif'],
        'secondary': ['Poppins', 'sans-serif'],
      },
      screens: {
        'xxxs': '320px',
        'xxs': '360px',
        'xs': '400px',
        'sm': '640px',   // Small screens and up
        'md': '768px',   // Medium screens and up
        'lg': '1024px',  // Large screens and up
        'xl': '1280px',  // Extra large screens and up
        '2xl': '1536px', // 2XL screens and up
      },
    },
  },
  plugins: [],
};

export default config;
