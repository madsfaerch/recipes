import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://mads-recipes.netlify.app',
  integrations: [tailwind()],
});
