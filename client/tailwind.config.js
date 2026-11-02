/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF8EE',
          100: '#F7F0D8',
          200: '#EEDDA9',
          300: '#E5C97A',
          400: '#DCB54B',
          500: '#D4AF37', // Brand Champagne Gold
          600: '#B8860B',
          700: '#8C6708',
          800: '#5F4606',
          900: '#322503',
        },
        navy: {
          800: '#131D31',
          850: '#0E1729',
          900: '#0A101D',
          950: '#060B14',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
