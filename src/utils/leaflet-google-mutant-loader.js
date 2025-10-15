import { LEAFLET_GOOGLE_MUTANT_VERSION } from '../vars.js';
import { loadJSFromCDN } from './utils.js';

export async function importLeafletGoogleMutant(version = LEAFLET_GOOGLE_MUTANT_VERSION) {
	return loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet.gridlayer.googlemutant@${version}/dist/Leaflet.GoogleMutant.js`);
}
