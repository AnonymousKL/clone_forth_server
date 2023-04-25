const defaultTheme = require('tailwindcss/defaultTheme')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          1: '#2A5CC5',
          2: '#190959',
          3: '#7F9DDC',
          4: '#4488C5',
        },
        gray: {
          1: '#5B5E65',
          2: '#BCBCBC',
          3: '#E3E7EE',
          4: '#DFE1E6',
          5: '#5E6C84',
        },
        green: {
          1: '#A1AF2F',
          2: '#5EB5A6',
        },
        red: {
          1: '#E03232',
        },
        orange: {
          1: '#FF7A00',
        }
      },
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
        // heading: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        5: '0.3125rem',
        10: '0.625rem',
        20: '1.25rem',
        25: '1.5625rem',
        30: '1.875rem',
      },
      boxShadow: {
        '4p': '0 4px 4px rgba(0, 0, 0, 0.25)',
      },
      spacing: {
        '10p': '10px',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
