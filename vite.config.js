// filepath: c:\Users\Costi\Documents\zeroOS\vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readdirSync } from 'fs';

// https://vite.dev/config/

// Dynamically create input entries for each app in the apps directory
const appsDir = resolve(__dirname, 'apps');
const appEntries = readdirSync(appsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .reduce((acc, dirent) => {
    acc[`apps/${dirent.name}/App`] = resolve(appsDir, dirent.name, 'App.jsx');
    return acc;
  }, {});

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // Main app entry (if you have one, e.g., src/main.jsx)
        main: resolve(__dirname, 'index.html'),
        // Spread the app entries
        ...appEntries,
      },
      output: {
        // Ensures that entry files are named consistently (e.g., App.js)
        // And placed in a directory structure reflecting the input key
        entryFileNames: `[name].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    },
    outDir: 'dist', // Default is 'dist', explicitly stating for clarity
  }
});