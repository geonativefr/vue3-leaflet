import { LEAFLET_GEOMETRYUTIL_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadJSFromCDN } from './utils.js';

export async function importLeafletGeometryUtil(version = LEAFLET_GEOMETRYUTIL_VERSION) {
	return loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet-geometryutil@${version}/src/leaflet.geometryutil.js`).catch(async () => {
		console.warn('Leaflet GeometryUtil CDN failed, loading from local copy');
		return loadJSFromCDN(`/leaflet/leaflet-geometryutil-${version}/leaflet.geometryutil.js`).catch(async () =>
			console.error('Failed to load Leaflet GeometryUtil from both CDN and local copy')
		);
	});
}
