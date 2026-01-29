/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        cream: '#faf8f5',
        warm: '#f5ebe0',
        spice: '#c4743a',
        herb: '#5a7247',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
