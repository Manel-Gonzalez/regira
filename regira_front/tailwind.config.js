/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        rock: ['"Rock 3D"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
