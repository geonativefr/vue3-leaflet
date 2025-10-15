import { LEAFLET_LOCATE_CONTROL_VERSION } from '../vars.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeafletLocateControl(version = LEAFLET_LOCATE_CONTROL_VERSION) {
	return Promise.all([
		loadCSSFromCDN(`${UNPKG_CDN_URL}/leaflet.locatecontrol@${version}/dist/L.Control.Locate.min.css`),
		loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet.locatecontrol@${version}/dist/L.Control.Locate.min.js`),
	]);
}
