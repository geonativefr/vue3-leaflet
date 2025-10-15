import { LEAFLET_SMOOTH_MARKER_BOUNCING_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadJSFromCDN } from './utils.js';

export async function importLeafletSmoothMarkerBouncing(version = LEAFLET_SMOOTH_MARKER_BOUNCING_VERSION) {
	return loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet.smooth_marker_bouncing@${version}/dist/bundle.js`);
}
