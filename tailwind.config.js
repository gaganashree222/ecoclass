/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f9f5',
          100: '#e1f2e8',
          200: '#c5e5d3',
          300: '#99d2b4',
          400: '#67b790',
          500: '#3f9a71',
          600: '#2d7d59',
          700: '#256448',
          800: '#1f503b',
          900: '#1a4232',
          950: '#0e261d',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e4',
          200: '#c7d0c9',
          500: '#688270',
          800: '#2d3b32',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
