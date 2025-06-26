import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// This config is for building individual apps as libraries
// It expects APP_NAME and APP_PATH to be passed via --define or environment variables
// For example: vite build --config vite.lib.config.js --define process.env.APP_NAME=\"Calculator\" --define process.env.APP_PATH=\"apps/Calculator/App.jsx\"

export default defineConfig(({ mode }) => {
  const { APP_NAME, APP_ENTRY_SRC } = process.env;

  if (!APP_NAME || !APP_ENTRY_SRC) {
    throw new Error("APP_NAME and APP_ENTRY_SRC environment variables are required for library build.");
  }

  return {
    plugins: [react()],
    build: {
      // Output directory for these libraries, e.g., dist/app-libs/Calculator/
      // The main build will output to dist/
      outDir: resolve(__dirname, `dist/app-libs/${APP_NAME}`),
      lib: {
        entry: resolve(__dirname, APP_ENTRY_SRC), // e.g., apps/Calculator/App.jsx
        name: `${APP_NAME}App`, // Global variable name for UMD build (not strictly needed for ES)
        fileName: (format) => `${APP_NAME}.${format}.js`, // e.g., Calculator.es.js
        formats: ['es'], // We primarily need ES module format for dynamic import
      },
      rollupOptions: {
        // Externalize deps that shouldn't be bundled into the library
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime' // Or however it's typically named
          },
          assetFileNames: 'style.css',
        },
      },
      // To simplify, we'll empty the outDir for each app build.
      // The main build should run first or manage its own output not to conflict.
      emptyOutDir: true,
    },
    // Define to replace strings in code, useful for APP_NAME if needed inside the app code
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    }
  };
});
