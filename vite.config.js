import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), cssInjectedByJsPlugin()],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.js'),
			name: 'vue3-leaflet',
			fileName: (format) => `vue3-leaflet.${format}.js`,
		},
		rollupOptions: {
			// createEndpoints sure to externalize deps that shouldn't be bundled
			// into your library
			external: ['@vueuse/core', 'vue'],
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
