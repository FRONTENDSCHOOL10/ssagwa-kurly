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
<<<<<<< HEAD
        footer: resolve(root, 'components/footer/footer.html'),
=======
        footer: resolve(root, 'components/footer/footer.html'), 
>>>>>>> e061cdf346852cb50b208c968567f2c1b9d01933
      },
    },
  },
});
