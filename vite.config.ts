import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@processes': path.resolve(__dirname, './src/processes'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@features': path.resolve(__dirname, './src/features'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  build: {
    // Включаем code splitting для оптимизации размера бандла
    rollupOptions: {
      output: {
        manualChunks: {
          // Выносим vendor библиотеки в отдельные чанки
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd'],
          'styled-vendor': ['styled-components'],
        },
      },
    },
    // Увеличиваем лимит для предупреждений (у нас большая библиотека antd)
    chunkSizeWarningLimit: 800,
    // Используем esbuild для минификации (быстрее чем terser)
    minify: 'esbuild',
  },
});
