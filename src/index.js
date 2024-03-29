import * as Options from './utils/options.js';

export { default as MapContainer } from './MapContainer.vue';
export { default as OpenStreetMap } from './layers/tiles/OpenStreetMap.vue';
export { default as Mapbox } from './layers/tiles/Mapbox.vue';
export { default as IGN } from './layers/tiles/IGN.vue';
export { default as GoogleMaps } from './layers/tiles/GoogleMaps.vue';
export { default as Cluster } from './layers/markers/Cluster.vue';
export { default as Marker } from './layers/markers/Marker.vue';
export { default as vBounce } from './layers/markers/Bounceable.js';
export * as Offline from './layers/Offline.js';
export { default as Popup } from './layers/Popup.vue';
export { default as Tooltip } from './layers/Tooltip.js';
export { default as Circle } from './layers/vector/Circle.vue';
export { default as Polyline } from './layers/vector/Polyline.vue';
export { default as Polygon } from './layers/vector/Polygon.vue';
export { default as DrawControl } from './controls/DrawControl.js';
export { default as FullScreenControl } from './controls/FullScreenControl.js';
export { default as LocateControl } from './controls/LocateControl.js';
export { default as OfflineControl } from './controls/OfflineControl.js';
export { default as PegmanControl } from './controls/PegmanControl.js';
export { default as ScaleControl } from './controls/ScaleControl.js';
export { default as ZoomControl } from './controls/ZoomControl.js';
export * from './constants.js';
export * from './utils/gmaps-api-loader.js';
export * from './utils/leaflet-fullscreen-loader.js';
export * from './utils/leaflet-geoman-loader.js';
export * from './utils/leaflet-geometryutil-loader.js';
export * from './utils/leaflet-google-mutant-loader.js';
export * from './utils/leaflet-leaflet-arrowheads.js';
export * from './utils/leaflet-leaflet-smooth-marker-bouncing.js';
export * from './utils/leaflet-loader.js';
export * from './utils/leaflet-locatecontrol-loader.js';
export * from './utils/leaflet-markercluster-loader.js';
export * from './utils/leaflet-pegman-loader.js';
export * from './utils/urls.js';
export const getProviderOptions = Options.getProviderOptions;

export default function (options) {
	Options.setProviderOptions(options);
}
