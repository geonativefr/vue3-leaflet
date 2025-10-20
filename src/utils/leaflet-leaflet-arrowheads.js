import { LEAFLET_ARROWHEADS_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { importLeafletGeometryUtil } from './leaflet-geometryutil-loader.js';
import { loadJSFromCDN } from './utils.js';

export async function importLeafletArrowHeads(version = LEAFLET_ARROWHEADS_VERSION) {
	await importLeafletGeometryUtil();
	return loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet-arrowheads@${version}/src/leaflet-arrowheads.js`).catch(async () => {
		console.warn('Leaflet ArrowHeads CDN failed, loading from local copy');
		return loadJSFromCDN(`/leaflet/leaflet-arrowheads-${version}/leaflet-arrowheads.js`).catch(async () =>
			console.error('Failed to load Leaflet ArrowHeads from both CDN and local copy')
		);
	});
}
