import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'docs');
const publicDir = resolve(__dirname, 'public');

export default defineConfig({
  root,
  publicDir,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        footer: resolve(root, 'components/footer/footer.html'), 
      },
    },
  },
});
