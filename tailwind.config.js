/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out forwards',
         'spin-once': 'spin 1s linear forwards',
        'hide-spinner': 'hide-spinner 1s linear 3s forwards',
        'show-text': 'show-text 0s ease-in 1s forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
         'hide-spinner': {
          '0%': { opacity: 1, display: 'block' },
          '100%': { opacity: 0, display: 'hidden' },
        },
        'show-text': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}

