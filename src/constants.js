import merge from 'lodash.merge';

export const Layers = {
	GOOGLE_MAPS: 'GOOGLE_MAPS',
	IGN: 'IGN',
	MAPBOX: 'MAPBOX',
	OPEN_STREET_MAP: 'OPEN_STREET_MAP',
};

export const MapTypes = {
	ROADMAP: 'roadmap',
	SATELLITE: 'satellite',
	TERRAIN: 'terrain',
	HYBRID: 'hybrid',
	CADASTRAL: 'cadastral',
};

export const LayerNames = {
	GOOGLE_MAPS: 'Google Maps',
	IGN: 'IGN',
	MAPBOX: 'Mapbox',
	OPEN_STREET_MAP: 'OpenStreetMap',
};

export const LayerGroups = {
	PIN: 'pinLayerGroup',
	TILE: 'tileLayerGroup',
};

let options = {
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

export function useVue3Leaflet(_options) {
	options = merge(options, _options);
}

export const LayerUrls = {
	IGN: (mapType) => {
		switch (mapType) {
			case MapTypes.SATELLITE:
				return 'https://wxs.ign.fr/essentiels/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg';
			case MapTypes.CADASTRAL:
				return 'https://wxs.ign.fr/essentiels/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CADASTRALPARCELS.PARCELLAIRE_EXPRESS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/png';
			default:
				return 'https://wxs.ign.fr/essentiels/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/png';
		}
	},
	MAPBOX: (mapType) => {
		return 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={apiKey}'.replace(
			'{apiKey}',
			options.MAPBOX.apiKey
		);
	},
	OPEN_STREET_MAP: (mapType) => {
		return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
	},
};

export function getOptions(layer) {
	return options[layer];
}
