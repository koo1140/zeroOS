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
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react/jsx-runtime')) {
            return 'vendor-react'; // Create a stable chunk name for React + ReactDOM + JSX runtime
          }
        }
      }
    },
    manifest: true, // Generate manifest.json
    outDir: 'dist',
    emptyOutDir: true,
  }
});