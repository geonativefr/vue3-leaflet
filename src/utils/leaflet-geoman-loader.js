import { LEAFLET_GEOMAN_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeafletGeoman(version = LEAFLET_GEOMAN_VERSION) {
	return Promise.all([
		loadJSFromCDN(`${UNPKG_CDN_URL}/@geoman-io/leaflet-geoman-free@${version}/dist/leaflet-geoman.min.js`),
		loadCSSFromCDN(`${UNPKG_CDN_URL}/@geoman-io/leaflet-geoman-free@${version}/dist/leaflet-geoman.css`),
	]).catch(async () => {
		console.warn('Leaflet Geoman CDN failed, loading from local copy');
		return Promise.all([
			loadJSFromCDN(`/leaflet/leaflet-geoman-${version}/leaflet-geoman.min.js`),
			loadCSSFromCDN(`/leaflet/leaflet-geoman-${version}/leaflet-geoman.css`),
		]).catch(() => {
			console.error('Failed to load Leaflet Geoman from both CDN and local copy');
		});
	});
}
