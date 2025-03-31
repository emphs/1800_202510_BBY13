import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.', // Root where all HTML files live
  publicDir: 'public', // Static assets from public/
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        readmore: resolve(__dirname, 'readmore.html'),
        webapp: resolve(__dirname, 'webapp.html'),
        widget: resolve(__dirname, 'widget.html'),
      },
    },
  },
  base: '/', // Matches Firebase root
});