// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import astnShikiTheme from './src/styles/shiki-theme.json' with { type: 'json' };

import node from '@astrojs/node';

import { loadEnv } from 'payload/node';

loadEnv();

const payloadUrl =
  process.env.PAYLOAD_URL ??
  process.env.NEXT_PUBLIC_SERVER_URL ??
  'http://localhost:3000';
const payloadUrlParsed = new URL(payloadUrl);

// https://astro.build/config
export default defineConfig({
  site: 'https://test.astn.io',
  integrations: [svelte()],
  image: {
    layout: 'constrained',
    remotePatterns: [
      {
        protocol: /** @type {'http' | 'https'} */ (
          payloadUrlParsed.protocol.replace(':', '')
        ),
        hostname: payloadUrlParsed.hostname,
        ...(payloadUrlParsed.port ? { port: payloadUrlParsed.port } : {}),
      },
    ],
  },

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