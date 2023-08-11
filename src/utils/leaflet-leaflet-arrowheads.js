import { LEAFLET_ARROWHEADS_VERSION } from '../vars.js';
import { importLeafletGeometryUtil } from './leaflet-geometryutil-loader.js';
import { loadJSFromCDN } from './utils.js';

export async function importLeafletArrowHeads(version = LEAFLET_ARROWHEADS_VERSION) {
	await importLeafletGeometryUtil();
	return loadJSFromCDN(`https://unpkg.com/leaflet-arrowheads@${version}/src/leaflet-arrowheads.js`);
}
