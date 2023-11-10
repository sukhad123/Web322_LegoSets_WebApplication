/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/index.ejs',
 './views/about.ejs',
 './views/technic.ejs',
 './views/401.ejs',
 './views/sets.ejs',
'./views/partials/navbar.ejs',
],
themes: ["light", "dark", "cupcake"],
 
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
 
}

