import { LEAFLET_MARKER_SLIDE_TO_VERSION } from '../vars.js';
import { loadJSFromCDN } from './utils.js';

export async function importLeafletMarkerSlideTo(version = LEAFLET_MARKER_SLIDE_TO_VERSION) {
	return loadJSFromCDN(`https://unpkg.com/leaflet.marker.slideto@${version}/Leaflet.Marker.SlideTo.js`);
}
