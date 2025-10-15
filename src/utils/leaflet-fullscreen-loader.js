import { LEAFLET_FULLSCREEN_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeafletFullScreen(version = LEAFLET_FULLSCREEN_VERSION) {
	return Promise.all([
		loadJSFromCDN(`${UNPKG_CDN_URL}/@runette/leaflet-fullscreen@${version}/dist/Leaflet.fullscreen.js`),
		loadCSSFromCDN(`${UNPKG_CDN_URL}/@runette/leaflet-fullscreen@${version}/dist/leaflet.fullscreen.css`),
	]);
	if (typeof L === 'undefined' || typeof L.Control.Fullscreen === 'undefined') {
		return Promise.all([
			loadJSFromCDN(`/leaflet/leaflet-fullscreen-${version}/Leaflet.fullscreen.js`),
			loadCSSFromCDN(`/leaflet/leaflet-fullscreen-${version}/leaflet.fullscreen.css`),
		]);
	}
}
