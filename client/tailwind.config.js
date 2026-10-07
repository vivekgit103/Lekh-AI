/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          main: '#070A0F',
          secondary: '#0D1117',
          card: '#111722',
          elevated: '#151C29',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-hover': 'rgba(91, 140, 255, 0.3)',
        },
        text: {
          primary: '#F5F7FA',
          secondary: '#9BA6B5',
          muted: '#657182',
        },
        accent: {
          blue: '#5B8CFF',
          violet: '#7C5CFF',
          teal: '#25D9B5',
          cyan: '#38BDF8',
        },
        status: {
          danger: '#FF5C6C',
          warning: '#FFB84D',
          success: '#25D9B5',
          info: '#5B8CFF',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'card': '16px',
        'card-lg': '20px',
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(91, 140, 255, 0.3)',
        'glow-violet': '0 0 25px -5px rgba(124, 92, 255, 0.3)',
        'glow-teal': '0 0 25px -5px rgba(37, 217, 181, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
