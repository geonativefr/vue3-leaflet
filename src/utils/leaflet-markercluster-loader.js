import { LEAFLET_MARKERCLUSTER_VERSION } from '../vars.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeafletMarkerCluster(version = LEAFLET_MARKERCLUSTER_VERSION) {
	return Promise.all([
		loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet.markercluster@${version}/dist/leaflet.markercluster.js`),
		loadCSSFromCDN(`${UNPKG_CDN_URL}/leaflet.markercluster@${version}/dist/MarkerCluster.css`),
		loadCSSFromCDN(`${UNPKG_CDN_URL}/leaflet.markercluster@${version}/dist/MarkerCluster.Default.css`),
	]);
	if (typeof L === 'undefined' || typeof L.MarkerClusterGroup === 'undefined') {
		await Promise.all([
			loadJSFromCDN(`/leaflet/leaflet-markercluster-${version}/leaflet.markercluster.js`),
			loadCSSFromCDN(`/leaflet/leaflet-markercluster-${version}/MarkerCluster.css`),
			loadCSSFromCDN(`/leaflet/leaflet-markercluster-${version}/MarkerCluster.Default.css`),
		]);
	}
}
