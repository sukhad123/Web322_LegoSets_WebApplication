/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/about.html'],
  theme: {
    extend: {},
  },
 
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
 
}

