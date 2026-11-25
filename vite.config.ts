import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// Images are imported as ES modules (see src/data/storyScript.ts), so Vite
// fingerprints and bundles them; no extra copy of src/assets is needed.
export default defineConfig({
  // Relative asset URLs so the build works from any sub-path,
  // e.g. GitHub Pages at https://<user>.github.io/<repo>/
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    // Set DISABLE_HMR=true to turn off HMR and file watching (e.g. in hosted editors).
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
