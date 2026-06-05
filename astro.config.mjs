import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hermens.com.au',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // Matches the dark code block aesthetic
      theme: 'one-dark-pro',
      wrap: false,
    },
  },
});
