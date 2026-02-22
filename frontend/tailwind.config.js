/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fffbea",
          100: "#fff7cf",
          200: "#ffef9f",
          300: "#ffe66d",
          400: "#ffd633",
          500: "#ffc300",
          600: "#e6b000",
          700: "#cc9900",
          800: "#b38600",
          900: "#8a6600",
          950: "#5a4400",
        },
        navy: {
          50: "#f0f5fa",
          100: "#dfe9f5",
          200: "#bdd3ec",
          300: "#89aad8",
          400: "#5880c5",
          500: "#3860b5",
          600: "#294d99",
          700: "#1f3a7d",
          800: "#1a2d68",
          900: "#0d1a3d",
          950: "#050f1f",
        },
      },
    },
  },
  plugins: [],
};
