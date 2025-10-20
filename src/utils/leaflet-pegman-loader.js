import { LEAFLET_PEGMAN_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadJSFromCDN, loadCSSFromCDN } from './utils.js';

export async function importLeafletPegman(version = LEAFLET_PEGMAN_VERSION) {
	return Promise.all([
		loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet-pegman@${version}/leaflet-pegman.js`),
		loadCSSFromCDN(`${UNPKG_CDN_URL}/leaflet-pegman@${version}/leaflet-pegman.css`),
	]).catch(async () => {
		console.warn('Leaflet Pegman CDN failed, loading from local copy');
		return Promise.all([
			loadJSFromCDN(`/leaflet/leaflet-pegman-${version}/leaflet-pegman.js`),
			loadCSSFromCDN(`/leaflet/leaflet-pegman-${version}/leaflet-pegman.css`),
		]).catch(() => {
			console.error('Failed to load Leaflet Pegman from both CDN and local copy');
		});
	});
}
