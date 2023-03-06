/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./src/**/*.{svelte,js,ts,sass,scss,pug,html}`],
  darkMode: ['class', '[data-theme="dark"'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
