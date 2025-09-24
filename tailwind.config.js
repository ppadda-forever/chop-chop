/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        'chop-orange': '#f56326',
        'chop-cream': '#fcfaf7',
        'chop-brown': '#1c120d',
        'chop-light-brown': '#9c614a',
        'chop-dark-brown': '#1c0d0d',
        'chop-red': '#994d52',
        'chop-gray': '#5e758c',
        'chop-light-gray': '#f2e8e8',
        'chop-border': '#f5ebe8',
        'chop-border-light': '#f0f2f5',
      }
    },
  },
  plugins: [],
}
