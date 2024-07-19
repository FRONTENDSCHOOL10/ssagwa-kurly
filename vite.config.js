import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import imageminSvgo from 'imagemin-svgo';
import imageminWebp from 'imagemin-webp';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngQuant from 'imagemin-pngquant';
import imageminGifSicle from 'imagemin-gifsicle';
import viteImagemin from 'vite-plugin-imagemin';
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
        product: resolve(__dirname, './src/pages/product/index.html'),
        productlist: resolve(__dirname, './src/pages/productlist/index.html'),
        cart: resolve(__dirname, './src/pages/cart/index.html'),
      },
      plugins: [
        visualizer({
          // open: true,
          gzipSize: true,
          brotliSize: true,
        }),
        viteImagemin({
          plugins: {
            jpg: imageminMozjpeg(),
            png: imageminPngQuant(),
            gif: imageminGifSicle(),
            svg: imageminSvgo(),
            webp: imageminWebp(),
          },
          //makeWebp 프로퍼티는 WebP 이미지를 생성하기 위한 설정을 제공합니다.
          makeWebp: {
            plugins: {
              jpg: imageminWebp(),
              png: imageminWebp(),
            },
          },
        }),
      ],
      output: {
        manualChunks: {
          swiperBundle: ['swiper'],
        },
      },
    },
  },
  plugins: [
    viteCompression({
      // 압축 알고리즘 지정, 기본적으로는 'gzip'을 사용
      algorithm: 'gzip',
      // 압축된 파일의 확장자를 '.gz'로 설정
      ext: '.gz',
    }),
  ],
});
