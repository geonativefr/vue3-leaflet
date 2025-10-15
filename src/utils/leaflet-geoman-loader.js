import { LEAFLET_GEOMAN_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeafletGeoman(version = LEAFLET_GEOMAN_VERSION) {
	return Promise.all([
		loadJSFromCDN(`${UNPKG_CDN_URL}/@geoman-io/leaflet-geoman-free@${version}/dist/leaflet-geoman.min.js`),
		loadCSSFromCDN(`${UNPKG_CDN_URL}/@geoman-io/leaflet-geoman-free@${version}/dist/leaflet-geoman.css`),
	]);
}
