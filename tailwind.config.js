/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'background-light': '#ffffff',
        'background-dark': '#1f2937',
        'text-light': '#1f2937',
        'text-dark': '#f3f4f6',
      },
    },
  },
};
