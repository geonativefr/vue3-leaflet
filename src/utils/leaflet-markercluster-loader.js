import { LEAFLET_MARKERCLUSTER_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeafletMarkerCluster(version = LEAFLET_MARKERCLUSTER_VERSION) {
	return Promise.all([
		loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet.markercluster@${version}/dist/leaflet.markercluster.js`),
		loadCSSFromCDN(`${UNPKG_CDN_URL}/leaflet.markercluster@${version}/dist/MarkerCluster.css`),
		loadCSSFromCDN(`${UNPKG_CDN_URL}/leaflet.markercluster@${version}/dist/MarkerCluster.Default.css`),
	]);
}
