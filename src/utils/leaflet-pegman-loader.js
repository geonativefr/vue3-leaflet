import { LEAFLET_PEGMAN_VERSION } from '../vars.js';
import { loadJSFromCDN, loadCSSFromCDN } from './utils.js';

export async function importLeafletPegman(version = LEAFLET_PEGMAN_VERSION) {
	return Promise.all([
		loadJSFromCDN(`https://unpkg.com/leaflet-pegman@${version}/leaflet-pegman.js`),
		loadCSSFromCDN(`https://unpkg.com/leaflet-pegman@${version}/leaflet-pegman.css`),
	]);
}
