import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://andrii-maksymenko.com',
  vite: {
    build: {
      // Never inline a script or a small asset: the Content-Security-Policy in vercel.json
      // allows scripts only from this site ('self'), so an inline script would be blocked.
      assetsInlineLimit: 0,
    },
  },
});
