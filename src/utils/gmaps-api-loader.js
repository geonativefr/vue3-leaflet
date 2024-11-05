import { loadJSFromCDN } from './utils.js';

export async function importGoogleMapsApi(GOOGLE_MAPS_API_KEY) {
  if (window.gmapsApi) {
    return true;
  }
  return loadJSFromCDN(`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`);
}
