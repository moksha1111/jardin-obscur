/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        burgundy: {
          50: "#C49A6C",
          100: "#C49A6C",
          200: "#C49A6C",
          300: "#C49A6C",
          400: "#C49A6C",
          500: "rgb(212 184 133 / var(--tw-text-opacity, 1))",
          600: "rgb(212 184 133 / var(--tw-text-opacity, 1))",
          700: "rgb(212 184 133 / var(--tw-text-opacity, 1))",
          800: "#C49A6C",
          900: "#2B2217",
          1000: "#2A0808",
        },
        cream: {
          50: "#FBF7F0",
          100: "#F5EDE0",
          200: "#EFE5D3",
          300: "#E5D6BC",
        },
        gold: {
          400: "#D4B885",
          500: "#C9A76D",
          600: "#B8925A",
        },
      },
    },
  },
  plugins: [],
};
