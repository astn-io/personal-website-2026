// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import astnShikiTheme from './src/styles/shiki-theme.json' with { type: 'json' };

import node from '@astrojs/node';

import { loadEnv } from 'payload/node';

loadEnv();

// https://astro.build/config
export default defineConfig({
  site: 'https://test.astn.io',
  integrations: [svelte()],
  image: { layout: 'constrained' },

  markdown: {
    shikiConfig: {
      theme: /** @type {import('shiki').ThemeRegistration} */ (
        /** @type {unknown} */ (astnShikiTheme)
      ),
      wrap: false,
    },
  },

  adapter: node({
    mode: 'standalone',
  }),
});