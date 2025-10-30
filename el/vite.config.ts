import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

export default defineConfig({
  plugins: [
    vue(),
    electron({
      entry: 'electron/main.ts',
      preload: {
        input: 'electron/preload.ts',
      },
    }),
    renderer(),
  ],
  server: {
    port: 5180,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
  },
});