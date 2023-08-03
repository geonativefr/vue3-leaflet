import { LEAFLET_GEOMETRYUTIL_VERSION } from '../vars.js';
import { loadJSFromCDN } from './utils.js';

export async function importLeafletGeometryUtil(version = LEAFLET_GEOMETRYUTIL_VERSION) {
	return loadJSFromCDN(`https://unpkg.com/leaflet-geometryutil@${version}/src/leaflet.geometryutil.js`);
}
