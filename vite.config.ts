import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

/**
 * bigscreen-board · lib 构建
 * 产物: dist/index.js(ESM) + dist/index.cjs(CJS) + dist/style.css + 字体资源
 * vue / echarts / echarts-liquidfill 作为 peerDependencies 外部化, 由宿主应用提供。
 */
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'BigscreenBoard',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['vue', 'echarts', 'echarts-liquidfill'],
    },
    cssCodeSplit: false,
  },
});
