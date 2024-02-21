import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'FlyBarrage',
      formats: ['es', 'iife'],
    },
    copyPublicDir: false,
  },
  plugins: [
    vue(),
    dts({
      include: ['./lib'],
      rollupTypes: true
    }),
  ],
})
