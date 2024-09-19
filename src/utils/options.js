import merge from 'lodash.merge';
import { DefaultOptions } from '../constants.js';

let providerOptions = {
	IGN: {
		maxZoom: DefaultOptions.MAX_ZOOM,
		opacity: DefaultOptions.OPACITY,
	},
	MAPBOX: {
		maxZoom: DefaultOptions.MAX_ZOOM,
		opacity: DefaultOptions.OPACITY,
		zoomOffset: -1,
	},
	OPEN_STREET_MAP: {
		maxZoom: DefaultOptions.MAX_ZOOM,
		opacity: DefaultOptions.OPACITY,
	},
};

export function getProviderOptions(layer) {
	return providerOptions[layer] ?? {};
}

export function setProviderOptions(_providerOptions) {
	providerOptions = merge(providerOptions, _providerOptions);
}
