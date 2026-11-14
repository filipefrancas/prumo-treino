import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// base './' + rotas por hash: o app funciona em qualquer subpasta (GitHub Pages, arquivo local servido etc.).
export default defineConfig({
  base: './',
  plugins: [
    preact(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['icons/*.png', 'icons/*.svg', 'favicon.svg'],
      manifest: {
        id: './',
        name: 'Prumo Treino',
        short_name: 'Treino',
        description: 'Corrida, musculação e mobilidade do Filipe. Funciona sem internet.',
        lang: 'pt-BR',
        dir: 'ltr',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0d1015',
        theme_color: '#0d1015',
        categories: ['health', 'fitness', 'sports'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Treino de hoje', short_name: 'Hoje', url: './#/hoje' },
          { name: 'Musculação', short_name: 'Musculação', url: './#/musculacao' },
          { name: 'Alongar', short_name: 'Alongar', url: './#/mobilidade' },
        ],
      },
      workbox: {
        // jpg, jpeg e webp: as fotos dos exercícios (src/assets/fotos) precisam estar no cache para o app funcionar offline
        globPatterns: ['**/*.{js,css,html,woff2,png,jpg,jpeg,webp,svg,webmanifest,json}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
});
