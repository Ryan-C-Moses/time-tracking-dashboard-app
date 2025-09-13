import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    hmr: { clientPort: 5173 },
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://ttd-backend:3000', // 👈 service name, not localhost
        changeOrigin: true,
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
    },
  },
});
