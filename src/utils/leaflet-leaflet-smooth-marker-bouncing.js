import { LEAFLET_SMOOTH_MARKER_BOUNCING_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadJSFromCDN } from './utils.js';

export async function importLeafletSmoothMarkerBouncing(version = LEAFLET_SMOOTH_MARKER_BOUNCING_VERSION) {
	return loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet.smooth_marker_bouncing@${version}/dist/bundle.js`).catch(async () => {
		console.warn('Leaflet Smooth Marker Bouncing CDN failed, loading from local copy');
		return loadJSFromCDN(`/leaflet/leaflet-smooth-marker-bouncing-${version}/dist/bundle.js`).catch(async () =>
			console.error('Failed to load Leaflet Smooth Marker Bouncing from both CDN and local copy')
		);
	});
}
