import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeFigures from './src/plugins/rehype-figures.mjs';

export default defineConfig({
  site: 'https://andrii-maksymenko.com',
  markdown: {
    processor: unified({ rehypePlugins: [rehypeFigures] }),   // framed, numbered figures in case studies
  },
  vite: {
    build: {
      // Never inline a script or a small asset: the Content-Security-Policy in vercel.json
      // allows scripts only from this site ('self'), so an inline script would be blocked.
      assetsInlineLimit: 0,
    },
  },
});
