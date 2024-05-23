import merge from 'lodash.merge';

let providerOptions = {
	IGN: {
		maxZoom: 21,
		opacity: 1,
	},
	MAPBOX: {
		maxZoom: 21,
		opacity: 1,
		zoomOffset: -1,
	},
	OPEN_STREET_MAP: {
		maxZoom: 21,
		opacity: 1,
	},
};

export function getProviderOptions(layer) {
	return providerOptions[layer] ?? {};
}

export function setProviderOptions(_providerOptions) {
	providerOptions = merge(providerOptions, _providerOptions);
}
