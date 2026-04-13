// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import astnShikiTheme from './src/styles/shiki-theme.json' with { type: 'json' };

// https://astro.build/config
export default defineConfig({
  site: 'https://astn.io',
  integrations: [svelte()],
  image: { layout: 'constrained' },
  markdown: {
    shikiConfig: {
      theme: astnShikiTheme,
      wrap: false,
    },
  },
});
