import { LEAFLET_ARROWHEADS_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { importLeafletGeometryUtil } from './leaflet-geometryutil-loader.js';
import { loadJSFromCDN } from './utils.js';

export async function importLeafletArrowHeads(version = LEAFLET_ARROWHEADS_VERSION) {
	await importLeafletGeometryUtil();
	await loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet-arrowheads@${version}/src/leaflet-arrowheads.js`);
	if (typeof L === 'undefined' || typeof L.ArrowHeads === 'undefined') {
		await loadJSFromCDN(`/leaflet/leaflet-arrowheads-${version}/leaflet-arrowheads.js`);
	}
}
