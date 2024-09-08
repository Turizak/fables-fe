/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
        fontFamily: {
          sans: ['EB Garamond', 'ui-serif', 'system-ui'],
        },
        fontSize: {
          base: '18px',
        },
      },
    },
  plugins: [],
}

