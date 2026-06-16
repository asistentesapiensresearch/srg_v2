import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/wp-proxy': {
        target: 'https://www.srg.com.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wp-proxy/, '') // Le quita el wp-proxy al llegar a SRG
      }
    }
  }
});
