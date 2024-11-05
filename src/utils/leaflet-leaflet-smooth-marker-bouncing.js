import { LEAFLET_SMOOTH_MARKER_BOUNCING_VERSION } from '../vars.js';
import { loadJSFromCDN } from './utils.js';

export async function importLeafletSmoothMarkerBouncing(version = LEAFLET_SMOOTH_MARKER_BOUNCING_VERSION) {
  return loadJSFromCDN(`https://unpkg.com/leaflet.smooth_marker_bouncing@${version}/dist/bundle.js`);
}
