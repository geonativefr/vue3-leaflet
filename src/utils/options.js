import merge from 'lodash.merge';

let providerOptions = {
	IGN: {
		maxZoom: 19,
	},
	MAPBOX: {
		maxZoom: 19,
		zoomOffset: -1,
	},
	OPEN_STREET_MAP: {
		maxZoom: 19,
	},
};

export function getProviderOptions(layer) {
	return providerOptions[layer];
}

export function setProviderOptions(_providerOptions) {
	providerOptions = merge(providerOptions, _providerOptions);
}
