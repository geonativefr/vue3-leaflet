import { loadJSFromCDN } from './utils.js';
import { Providers } from '../constants';
import { getProviderOptions } from './options.js';

export async function importGoogleMapsApi() {
	if (window.gmapsApi) {
		return true;
	}
	return loadJSFromCDN(
		`https://maps.googleapis.com/maps/api/js?key=${
			getProviderOptions(Providers.GOOGLE_MAPS).apiKey
		}&callback=console.debug`
	);
}
