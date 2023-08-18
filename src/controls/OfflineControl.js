import { inject } from 'vue';
import { Control, DomUtil } from 'leaflet';
import { renderless } from '../utils/utils.js';
import { importLeaflet } from '../utils/leaflet-loader.js';
import TileLayerOffline from '../layers/Offline.js';
import { whenever } from '@vueuse/core';
import DownloadIcon from '../assets/download.svg';

class OfflineControl extends Control {
	onProgress = null;
	onGetName = null;
	onMaxSize = null;
	onError = null;

	constructor(options) {
		super(options);
		this.onProgress = options.onProgress;
		this.onGetName = options.onGetName;
		this.onMaxSize = options.onMaxSize;
		this.onError = options.onError;
	}

	onAdd(map) {
		const image = document.createElement('img');
		image.src = DownloadIcon;
		image.style = 'width: 16px; height: 16px';
		const button = document.createElement('a');
		button.href = '#';
		button.role = 'button';
		button.title = 'Download';
		button.style = 'display: none; justify-content: center; align-items: center;';
		button.append(image);
		const container = DomUtil.create('div', 'savetiles leaflet-bar');
		container.append(button);

		const checkMapHasOfflineLayer = () => {
			let hasOfflineLayer = false;
			map.eachLayer((layer) => {
				hasOfflineLayer = hasOfflineLayer || layer instanceof TileLayerOffline;
			});
			button.style.display = hasOfflineLayer ? 'flex' : 'none';
		};

		map.addEventListener('layeradd', checkMapHasOfflineLayer);
		button.addEventListener('click', async () => {
			if (!checkMapSizeToSave(map)) {
				if (this.onMaxSize) {
					this.onMaxSize();
				} else {
					console.error('Map size too big to save');
				}
				return;
			}

			let name = this.onGetName ? await this.onGetName() : crypto.randomUUID();

			if (!name) return;

			map.eachLayer(async (layer) => {
				if (layer instanceof TileLayerOffline) {
					try {
						await layer.saveTiles(name, (nb, total) => {
							if (this.onProgress) {
								this.onProgress(nb, total);
							} else {
								console.log(Math.floor((nb / total) * 100, '%'));
							}
						});
					} catch (error) {
						if (this.onError) {
							this.onError(error);
						} else {
							console.error(error);
						}
					}
				}
			});
		});

		checkMapHasOfflineLayer();
		return container;
	}
}

export default renderless({
	props: {
		getName: Function,
	},
	emits: ['progress', 'maxSize', 'error'],

	async setup(props, context) {
		const $map = inject('map');

		await importLeaflet(inject('leaflet.version'));

		const map = await new Promise((resolve) => {
			whenever($map, (map) => resolve(map), { immediate: true });
		});

		L.control.offline = (opts) => {
			opts;
		};

		new OfflineControl({
			position: 'bottomright',
			onMaxSize: () => context.emit('maxSize'),
			onProgress: (nb, total) => context.emit('progress', { nb, total }),
			onGetName: props.getName,
			onError: (error) => context.emit('error', error),
		}).addTo(map);
	},
});

function checkMapSizeToSave(map) {
	const latlngBounds = map.getBounds();
	const size =
		Math.abs(latlngBounds._northEast.lat - latlngBounds._southWest.lat) *
		Math.abs(latlngBounds._southWest.lng - latlngBounds._northEast.lng);
	return size <= 0.01;
}
