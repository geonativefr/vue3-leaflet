import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'vue3-leaflet',
      fileName: (format) => `vue3-leaflet.${format}.js`,
    },
    rollupOptions: {
      // createEndpoints sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        '@vueuse/core',
        'vue',
        'leaflet',
        'leaflet.smooth_marker_bouncing',
        'leaflet.gridlayer.googlemutant/dist/Leaflet.GoogleMutant.js',
        'leaflet-pegman',
        //'leaflet.locatecontrol',
        //'leaflet-arrowheads',
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          leaflet: 'L',
        },
      },
    },
  },
});

