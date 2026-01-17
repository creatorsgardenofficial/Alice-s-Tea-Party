import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        alice: {
          blue: '#E3F2FD',
          dark: '#1A237E',
          pink: '#FCE4EC',
          purple: '#F3E5F5',
        },
        rabbit: {
          white: '#FFF8E1',
          red: '#FF5252',
        },
        hatter: {
          orange: '#FFF3E0',
          dark: '#E65100',
        },
      },
      fontFamily: {
        handwritten: ['"Kalam"', 'cursive'],
        retro: ['"Patrick Hand"', 'cursive'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
