import { LEAFLET_MARKER_SLIDE_TO_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadJSFromCDN } from './utils.js';

export async function importLeafletMarkerSlideTo(version = LEAFLET_MARKER_SLIDE_TO_VERSION) {
	return loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet.marker.slideto@${version}/Leaflet.Marker.SlideTo.js`).catch(async () => {
		console.warn('Leaflet Marker SlideTo CDN failed, loading from local copy');
		return loadJSFromCDN(`/leaflet/leaflet-marker-slideto-${version}/Leaflet.Marker.SlideTo.js`).catch(async () =>
			console.error('Failed to load Leaflet Marker SlideTo from both CDN and local copy')
		);
	})
}
