/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          light: '#828F66',
          DEFAULT: '#68734F',
          dark: '#3F4933',
          deep: '#2D3524',
        },
        sand: {
          light: '#F6F1E9',
          DEFAULT: '#EDE4D3',
          dark: '#DACDB7',
          border: '#D8CBB6',
        },
        cream: {
          DEFAULT: '#FFFDF5',
          subtle: '#FAF7EC',
          soft: '#F5F1E2',
        },
        terracotta: {
          DEFAULT: '#B9674B',
          dark: '#9F5238',
          light: '#CC7B60',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(63, 73, 51, 0.05)',
        'card': '0 4px 20px -2px rgba(63, 73, 51, 0.07)',
        'card-hover': '0 10px 30px -4px rgba(63, 73, 51, 0.12)',
        'modal': '0 20px 40px -10px rgba(63, 73, 51, 0.25)',
      },
    },
  },
  plugins: [],
}
