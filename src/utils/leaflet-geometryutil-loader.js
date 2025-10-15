import { LEAFLET_GEOMETRYUTIL_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadJSFromCDN } from './utils.js';

export async function importLeafletGeometryUtil(version = LEAFLET_GEOMETRYUTIL_VERSION) {
	await loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet-geometryutil@${version}/src/leaflet.geometryutil.js`);
	if (typeof L === 'undefined' || typeof L.GeometryUtil === 'undefined') {
		await loadJSFromCDN(`/leaflet/leaflet-geometryutil-${version}/leaflet.geometryutil.js`);
	}

}
