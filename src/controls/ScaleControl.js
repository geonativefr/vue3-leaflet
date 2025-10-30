import { whenever } from '@vueuse/core';
import { inject } from 'vue';
import L from 'leaflet';
import { clean, renderless } from '../utils/utils.js';

export default renderless({
	props: {
		position: {
			type: String,
			default: undefined,
		},
		maxWidth: {
			type: Number,
			default: undefined,
		},
		imperial: {
			type: Boolean,
			default: undefined,
		},
		metric: {
			type: Boolean,
			default: undefined,
		},
	},
	async setup(props) {
		const map = inject('map');
		const control = L.control.scale(clean({ ...props }));

		whenever(map, (map) => map.addControl(control), { immediate: true });
	},
});
