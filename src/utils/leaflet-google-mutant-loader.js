import { LEAFLET_GOOGLE_MUTANT_VERSION, UNPKG_CDN_URL } from '../vars.js';
import { loadJSFromCDN } from './utils.js';

export async function importLeafletGoogleMutant(version = LEAFLET_GOOGLE_MUTANT_VERSION) {
	return loadJSFromCDN(`${UNPKG_CDN_URL}/leaflet.gridlayer.googlemutant@${version}/dist/Leaflet.GoogleMutant.js`).catch(async () => {
		console.warn('Leaflet Google Mutant CDN failed, loading from local copy');
		return loadJSFromCDN(`/leaflet/leaflet-google-mutant-${version}/Leaflet.GoogleMutant.js`).catch(async () =>
			console.error('Failed to load Leaflet Google Mutant from both CDN and local copy')
		);
	});
}
