import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://bob-the-assistant.github.io',
  base: '/recipes',
  integrations: [tailwind()],
});
