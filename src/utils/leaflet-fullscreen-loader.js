import { LEAFLET_FULLSCREEN_VERSION } from '../vars.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeafletFullScreen(version = LEAFLET_FULLSCREEN_VERSION) {
  return Promise.all([
    loadJSFromCDN(`https://unpkg.com/@runette/leaflet-fullscreen@${version}/dist/Leaflet.fullscreen.js`),
    loadCSSFromCDN(`https://unpkg.com/@runette/leaflet-fullscreen@${version}/dist/leaflet.fullscreen.css`),
  ]);
}
