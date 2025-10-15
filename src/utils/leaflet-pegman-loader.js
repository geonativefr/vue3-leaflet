import { LEAFLET_PEGMAN_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadJSFromCDN, loadCSSFromCDN } from './utils.js';

export async function importLeafletPegman(version = LEAFLET_PEGMAN_VERSION) {
	return Promise.all([
		loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet-pegman@${version}/leaflet-pegman.js`),
		loadCSSFromCDN(`${UNPKG_CDN_URL}/leaflet-pegman@${version}/leaflet-pegman.css`),
	]);
}
