import { LEAFLET_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeaflet() {
	await Promise.all([
		loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`),
		loadCSSFromCDN(`${UNPKG_CDN_URL}/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`),
	]);
	// If CDN fails, Load Leaflet from local copy
	if (typeof L === 'undefined') {
		await Promise.all([
			loadJSFromCDN(`/leaflet/leaflet-${LEAFLET_VERSION}/leaflet.js`),
			loadCSSFromCDN(`/leaflet/leaflet-${LEAFLET_VERSION}/leaflet.css`),
		]);
	}
}
