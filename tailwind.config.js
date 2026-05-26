/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        syne: ["Syne", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
      },
      colors: {
        purple: "#5b4bff",
        "purple-light": "#eeedfe",
        "purple-dark": "#3730a3",
      },
      animation: {
        "fade-in": "fadeIn 1s ease-in-out forwards",
        "spin-once": "spin 1s linear 10 forwards",
        "hide-spinner": "hide-spinner 1s linear 3s forwards",
        "show-text": "show-text 0s ease-in 10s forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "hide-spinner": {
          "0%": { opacity: 1, display: "block" },
          "100%": { opacity: 0, display: "hidden" },
        },
        "show-text": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
