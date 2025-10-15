import { LEAFLET_LOCATE_CONTROL_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeafletLocateControl(version = LEAFLET_LOCATE_CONTROL_VERSION) {
	await Promise.all([
		loadCSSFromCDN(`${UNPKG_CDN_URL}/leaflet.locatecontrol@${version}/dist/L.Control.Locate.min.css`),
		loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet.locatecontrol@${version}/dist/L.Control.Locate.min.js`),
	]);
	if (typeof L === 'undefined' || typeof L.Control.Locate === 'undefined') {
		await Promise.all([
			loadCSSFromCDN(`/leaflet/leaflet.locatecontrol-${version}/L.Control.Locate.min.css`),
			loadJSFromCDN(`/leaflet/leaflet.locatecontrol-${version}/L.Control.Locate.min.js`),
		]);
	}
}
