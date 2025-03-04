import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  // Add asset handling configuration
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.svg', '**/*.webp'],
  build: {
    assetsInlineLimit: 10000, // 10kb - files smaller than this will be inlined as base64
    cssCodeSplit: true,
    sourcemap: false, // Disable sourcemaps in production for better performance
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
          icons: ['lucide-react']
        }
      }
    }
  },
  resolve: {
    alias: {
      path: 'path-browserify'
    }
  },
  define: {
    'process.env': {},
    'process.platform': JSON.stringify('browser'),
    'process.version': JSON.stringify(''),
  }
});
