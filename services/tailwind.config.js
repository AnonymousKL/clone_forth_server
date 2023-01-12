const defaultTheme = require('tailwindcss/defaultTheme')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          1: '#2A5CC5',
        },
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
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
