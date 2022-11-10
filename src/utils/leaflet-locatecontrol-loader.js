import { LEAFLET_LOCATE_CONTROL_VERSION } from '../vars.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeafletLocateControl(version = LEAFLET_LOCATE_CONTROL_VERSION) {
  return Promise.all([
    loadCSSFromCDN(`https://unpkg.com/leaflet.locatecontrol@${version}/dist/L.Control.Locate.min.css`),
    loadJSFromCDN(`https://unpkg.com/leaflet.locatecontrol@${version}/dist/L.Control.Locate.min.js`),
  ]);
}
