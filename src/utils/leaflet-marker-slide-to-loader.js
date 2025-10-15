import { LEAFLET_MARKER_SLIDE_TO_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadJSFromCDN } from './utils.js';

export async function importLeafletMarkerSlideTo(version = LEAFLET_MARKER_SLIDE_TO_VERSION) {
	await loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet.marker.slideto@${version}/Leaflet.Marker.SlideTo.js`);
	if (typeof L === 'undefined' || typeof L.Marker.prototype.slideTo === 'undefined') {
		await loadJSFromCDN(`/leaflet/leaflet-marker-slideto-${version}/Leaflet.Marker.SlideTo.js`);
	}
}
