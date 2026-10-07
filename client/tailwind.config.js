/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F1EBDD',
          dark: '#E8E0D2',
        },
        navy: {
          DEFAULT: '#101B2D',
          light: '#1B2C47',
        },
        accent: {
          blue: '#3158A8',
        },
        editorial: {
          muted: '#70716D',
          line: '#D5CEC1',
          white: '#FAF8F2',
        },
        status: {
          red: '#8B2626',
          amber: '#9A6B2F',
          green: '#2D6A4F',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'Menlo', 'monospace'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      maxWidth: {
        'editorial': '1440px',
      }
    },
  },
  plugins: [],
}
