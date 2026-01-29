import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://mads-recipes.netlify.app',
  integrations: [tailwind(), react()],
});