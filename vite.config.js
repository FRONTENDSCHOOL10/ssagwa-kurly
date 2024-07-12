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
      },
    },
  },
});
