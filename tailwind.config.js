/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/index.html'],
  theme: {
    extend: {},
  },
 
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
 
}

