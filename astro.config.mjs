import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://mads-recipes.netlify.app',
  output: 'static',
  adapter: netlify({ imageCDN: true }),
  image: {
    domains: ['assets.bonappetit.com'],
  },
  integrations: [tailwind(), react()],
});