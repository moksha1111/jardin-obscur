/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        burgundy: {
          50: '#fbf2f2',
          100: '#f5dcdc',
          200: '#e9baba',
          300: '#d88c8c',
          400: '#c15d5d',
          500: '#9e3c3c',
          600: '#7A1E1E',
          700: '#5C1515',
          800: '#3D0E0E',
          900: '#2A0808',
        },
        cream: {
          50: '#FBF7F0',
          100: '#F5EDE0',
          200: '#EFE5D3',
          300: '#E5D6BC',
        },
        gold: {
          400: '#D4B885',
          500: '#C9A76D',
          600: '#B8925A',
        },
      },
    },
  },
  plugins: [],
}
