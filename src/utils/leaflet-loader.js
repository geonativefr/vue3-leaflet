import { LEAFLET_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeaflet() {
	await Promise.all([
		loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`),
		loadCSSFromCDN(`${UNPKG_CDN_URL}/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`),
	]);
}
