import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const outDir = resolve(__dirname, 'docs');

export default defineConfig({
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        register: resolve(__dirname, './src/pages/register/index.html'),
        login: resolve(__dirname, './src/pages/login/index.html'),
        productlist: resolve(__dirname, './src/pages/productlist/index.html'),
      },
    },
  },
});
