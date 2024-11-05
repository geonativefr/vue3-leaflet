import { MapTypes, Providers } from '../constants.js';

export function getProviderUrl(provider, mapType) {
  switch (provider) {
    case Providers.IGN:
      switch (mapType) {
        case MapTypes.ROADMAP:
          return 'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/png';
        case MapTypes.SATELLITE:
          return 'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg';
        case MapTypes.CADASTRAL:
          return 'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CADASTRALPARCELS.PARCELLAIRE_EXPRESS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/png';
        default:
          throw new Error('Map type ' + mapType + ' not supported for IGN');
      }
    case Providers.MAPBOX:
      switch (mapType) {
        case MapTypes.ROADMAP:
          return 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={apiKey}';
        case MapTypes.SATELLITE:
          return 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token={apiKey}';
        case MapTypes.HYBRID:
          return 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token={apiKey}';
        default:
          throw new Error('Map type ' + mapType + ' not supported for Mapbox');
      }
    case Providers.OPEN_STREET_MAP:
      switch (mapType) {
        case MapTypes.ROADMAP:
          return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
        default:
          throw new Error('Map type ' + mapType + ' not supported for OpenStreetMap');
      }
    default:
      throw new Error('Provider ' + provider + ' not supported');
  }
}
