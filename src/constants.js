export const Providers = {
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

export const ProvidersMapTypes = {
	GOOGLE_MAPS: [MapTypes.ROADMAP, MapTypes.SATELLITE, MapTypes.HYBRID],
	IGN: [MapTypes.ROADMAP, MapTypes.SATELLITE, MapTypes.CADASTRAL, MapTypes.HYBRID],
	MAPBOX: [MapTypes.ROADMAP, MapTypes.SATELLITE, MapTypes.HYBRID],
	OPEN_STREET_MAP: [MapTypes.ROADMAP, MapTypes.HYBRID],
};

export const ProvidersNames = {
	GOOGLE_MAPS: 'GoogleMaps',
	IGN: 'IGN',
	MAPBOX: 'Mapbox',
	OPEN_STREET_MAP: 'OpenStreetMap',
};

export const LayerGroups = {
	PIN: 'pinLayerGroup',
	TILE: 'tileLayerGroup',
};
