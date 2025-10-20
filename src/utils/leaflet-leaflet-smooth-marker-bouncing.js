import { LEAFLET_SMOOTH_MARKER_BOUNCING_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadJSFromCDN } from './utils.js';

export async function importLeafletSmoothMarkerBouncing(version = LEAFLET_SMOOTH_MARKER_BOUNCING_VERSION) {
	await loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet.smooth_marker_bouncing@${version}/dist/bundle.js`);
	if (!L.Marker.prototype.bounce) {
		await loadJSFromCDN(`/leaflet/leaflet-smooth-marker-bouncing-${version}/dist/bundle.js`);
	}
}
