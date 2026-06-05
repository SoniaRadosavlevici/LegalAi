/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0A0B0E',
        'navy-800': '#0D0F14',
        'navy-700': '#13161C',
        'navy-600': '#1A1E27',
        'navy-500': '#252B38',
        bronze: '#A8874A',
        'bronze-light': '#C4A06A',
        'bronze-dark': '#8A6D3A',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.12em',
        wide2: '0.2em',
      },
    },
  },
  plugins: [],
}
