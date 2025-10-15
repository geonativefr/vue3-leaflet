import { LEAFLET_PEGMAN_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadJSFromCDN, loadCSSFromCDN } from './utils.js';

export async function importLeafletPegman(version = LEAFLET_PEGMAN_VERSION) {
	await Promise.all([
		loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet-pegman@${version}/leaflet-pegman.js`),
		loadCSSFromCDN(`${UNPKG_CDN_URL}/leaflet-pegman@${version}/leaflet-pegman.css`),
	]);
	if (typeof L === 'undefined' || typeof L.Control.Pegman === 'undefined') {
		await Promise.all([
			loadJSFromCDN(`/leaflet/leaflet-pegman-${version}/leaflet-pegman.js`),
			loadCSSFromCDN(`/leaflet/leaflet-pegman-${version}/leaflet-pegman.css`),
		]);
	}
}
