/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-void': 'var(--color-deep-void)',
        'plasma': 'var(--color-plasma)',
        'ghost': 'var(--color-ghost)',
        'graphite': 'var(--color-graphite)',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        instrument: ['Instrument Serif', 'serif'],
        fira: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
