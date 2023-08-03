import { whenever } from '@vueuse/core';
import { inject, nextTick } from 'vue';
import { renderless } from '../utils/utils.js';

export default renderless({
	props: {
		locale: {
			type: String,
			default: 'en',
		},
		onlyOneShape: {
			type: Boolean,
			default: false,
		},
		position: {
			type: String,
			default: 'topright',
		},
		drawControls: {
			type: Boolean,
			default: true,
		},
		editControls: {
			type: Boolean,
			default: false,
		},
		drawPolygon: {
			type: Boolean,
			default: false,
		},
		drawCircle: {
			type: Boolean,
			default: false,
		},
		drawPolyline: {
			type: Boolean,
			default: false,
		},
		drawRectangle: {
			type: Boolean,
			default: false,
		},
		drawMarker: {
			type: Boolean,
			default: false,
		},
		drawCircleMarker: {
			type: Boolean,
			default: false,
		},
		drawText: {
			type: Boolean,
			default: false,
		},
		version: {
			type: String,
			default: undefined,
		},
	},
	emits: ['drawstart', 'drawend', 'cancel'],
	async setup(props, { emit }) {
		const map = inject('map');
		const init = (map) => {
			map.pm.addControls({ ...props });
			map.pm.enableGlobalEditMode();
			map.pm.enableGlobalRemovalMode();
			map.pm.setLang(props.locale);

			const layers = L.featureGroup();
			layers.last = function () {
				return this.getLayers()[this.getLayers().length - 1];
			};

			if (props.onlyOneShape) {
				// add the new drawn layer to a group, so it can be cleared, if another feature is drawn
				map.on('pm:create', (e) => e.layer.addTo(layers));
				map.on('pm:drawstart', () => {
					// delete all drawn layers.
					layers.eachLayer((layer) => layer.removeFrom(map));
					layers.clearLayers(); // clear the group
				});
			}

			map.on('pm:drawstart', () => emit('drawstart'));
			map.on('pm:drawend', async (e) => {
				await nextTick();
				const layer = layers.last();
				if (undefined === layer) {
					emit('cancel');
					return;
				}
				if (layers.last() instanceof L.CircleMarker) {
					emit('drawend', {
						shape: e.shape,
						center: layer.getLatLng(),
						radius: layer.getRadius(),
					});
				} else {
					emit('drawend', {
						shape: e.shape,
						bounds: layer.getLatLngs(),
					});
				}
			});
		};
		whenever(map, init, { immediate: true });
	},
});
