import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/firebase-storage': {
        target: 'https://firebasestorage.googleapis.com',
        changeOrigin: true,
        secure: false, // Set to false if you're not using HTTPS in local
        rewrite: (path) => path.replace(/^\/firebase-storage/, ''),  // remove /firebase-storage from the proxy path
      },
    },
  },
});
