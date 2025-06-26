// filepath: c:\Users\Costi\Documents\zeroOS\vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
// readdirSync is no longer needed here as app entries are not processed by this config

// https://vite.dev/config/

// This is the main application shell config.
// Individual apps are built separately using vite.lib.config.js

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // Main app entry, Vite will find src/main.jsx through index.html
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Standard output settings for the main app
        entryFileNames: `assets/[name]-[hash].js`, // typical output for vite
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
        // manualChunks can be defined here for vendor separation for the main app if desired
        // For example:
        // manualChunks(id) {
        //   if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
        //     return 'vendor-react-main';
        //   }
        //   if (id.includes('node_modules')) {
        //     return 'vendor-main';
        //   }
        // }
      }
    },
    outDir: 'dist', // Main application shell goes into dist/
    emptyOutDir: true, // Clean dist before main build (app builds will go to dist/app-libs/*)
  }
});