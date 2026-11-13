/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        adey: {
          50: '#FFFDF5',
          100: '#FEF9E7',
          200: '#FDEEC4',
          300: '#FCDF97',
          400: '#F8C858',
          500: '#EAB308', // Radiant Adey Gold
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
          950: '#422206',
        },
        terracotta: {
          DEFAULT: '#C86446',
          light: '#E07A5F',
          dark: '#9E442B'
        },
        obsidian: {
          DEFAULT: '#141414',
          light: '#222222',
          lighter: '#333333'
        },
        sand: {
          50: '#FDFCF9',
          100: '#FAF8F5',
          200: '#F3EFEA',
          300: '#E8E2D8',
          400: '#D5CBBB',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Ethiopic"', 'sans-serif'],
        amharic: ['"Noto Sans Ethiopic"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.35s ease-out forwards',
        'slide-left': 'slideLeft 0.35s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
