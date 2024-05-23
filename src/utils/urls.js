import { MapTypes, Providers } from '../constants.js';

export function getProviderUrl(provider, mapType) {
	console.log('getProviderUrl');
	switch (provider) {
		case Providers.IGN:
			switch (mapType) {
				case MapTypes.SATELLITE:
					return 'https://wxs.ign.fr/essentiels/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg';
				case MapTypes.CADASTRAL:
					return 'https://wxs.ign.fr/essentiels/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CADASTRALPARCELS.PARCELLAIRE_EXPRESS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/png';
				default:
					return 'https://wxs.ign.fr/essentiels/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/png';
			}
		case Providers.MAPBOX:
			switch (mapType) {
				case MapTypes.SATELLITE:
					console.log('SATELLITE');
					return 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token={apiKey}';
				default:
					console.log('STREETS');
					return 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={apiKey}';
			}
		case Providers.OPEN_STREET_MAP:
			return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
	}
}
