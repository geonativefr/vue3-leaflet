import { LEAFLET_VERSION } from '../vars.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeaflet(version = LEAFLET_VERSION) {
	await Promise.all([
		loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet@${version}/dist/leaflet.js`),
		loadCSSFromCDN(`${UNPKG_CDN_URL}/leaflet@${version}/dist/leaflet.css`),
	]);
}
