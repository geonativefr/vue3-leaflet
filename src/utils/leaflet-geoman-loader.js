import { LEAFLET_GEOMAN_VERSION } from '../vars.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeafletGeoman(version = LEAFLET_GEOMAN_VERSION) {
  return Promise.all([
    loadJSFromCDN(`https://unpkg.com/@geoman-io/leaflet-geoman-free@${version}/dist/leaflet-geoman.min.js`),
    loadCSSFromCDN(`https://unpkg.com/@geoman-io/leaflet-geoman-free@${version}/dist/leaflet-geoman.css`),
  ]);
}
