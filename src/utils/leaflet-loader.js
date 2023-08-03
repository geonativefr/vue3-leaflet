import { LEAFLET_VERSION } from '../vars.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeaflet(version = LEAFLET_VERSION) {
	await Promise.all([
		loadJSFromCDN(`https://unpkg.com/leaflet@${version}/dist/leaflet.js`),
		loadCSSFromCDN(`https://unpkg.com/leaflet@${version}/dist/leaflet.css`),
	]);
}
