/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matrix: {
          DEFAULT: '#00FF41',
          dark: '#003B00',
          glow: '#008F11',
        },
        cyber: {
          cyan: '#00F3FF',
          pink: '#FF00E5',
        }
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'matrix-glow': 'matrix-glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'matrix-glow': {
          'from': { 'text-shadow': '0 0 5px #00FF41, 0 0 10px #00FF41' },
          'to': { 'text-shadow': '0 0 20px #00FF41, 0 0 30px #00FF41' },
        }
      }
    },
  },
  plugins: [],
}

