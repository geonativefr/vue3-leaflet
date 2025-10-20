import { LEAFLET_GEOMAN_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeafletGeoman(version = LEAFLET_GEOMAN_VERSION) {
	await Promise.all([
		loadJSFromCDN(`${UNPKG_CDN_URL}/@geoman-io/leaflet-geoman-free@${version}/dist/leaflet-geoman.min.js`),
		loadCSSFromCDN(`${UNPKG_CDN_URL}/@geoman-io/leaflet-geoman-free@${version}/dist/leaflet-geoman.css`),
	]);
	if (typeof L === 'undefined' || typeof L.PM === 'undefined') {
		await Promise.all([
			loadJSFromCDN(`/leaflet/leaflet-geoman-${version}/leaflet-geoman.min.js`),
			loadCSSFromCDN(`/leaflet/leaflet-geoman-${version}/leaflet-geoman.css`),
		]);
	}
}
