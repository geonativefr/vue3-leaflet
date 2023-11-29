import { whenever } from '@vueuse/core';
import { inject } from 'vue';
import { importGoogleMapsApi } from '../utils/gmaps-api-loader.js';
import { importLeaflet } from '../utils/leaflet-loader.js';
import { importLeafletPegman } from '../utils/leaflet-pegman-loader.js';
import { renderless } from '../utils/utils.js';

export default renderless({
	emits: ['openstreetview', 'closestreetview'],
	props: {
		position: {
			type: String,
			default: 'bottomright',
		},
		theme: {
			type: String,
			default: 'leaflet-pegman-v3-small',
		},
		version: {
			type: String,
			default: undefined,
		},
	},
	async setup(props, { emit }) {
		const map = inject('map');

		await importGoogleMapsApi();

		await importLeaflet();
		await importLeafletPegman(props.version);

		const mount = async (map) => {
			const control = new L.Control.Pegman({
				position: props.position,
				theme: props.theme,
			});
			control.addTo(map);

			const observer = new MutationObserver((mutationList) => {
				for (const mutation of mutationList) {
					if (mutation.type === 'childList') {
						for (const node of mutation.addedNodes) {
							if (node.classList?.contains('pegman-marker')) {
								emit('openstreetview');
							}
						}
						for (const node of mutation.removedNodes) {
							if (node.classList?.contains('pegman-marker')) {
								emit('closestreetview');
							}
						}
					}
				}
			});
			observer.observe(map._container, { childList: true, subtree: true });
		};
		whenever(map, mount, { immediate: true });
	},
});
