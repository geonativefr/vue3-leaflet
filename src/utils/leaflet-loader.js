import { LEAFLET_VERSION } from '../vars.js';
import { importLeafletGeoman } from './leaflet-geoman-loader.js';
import { importLeafletSmoothMarkerBouncing } from './leaflet-leaflet-smooth-marker-bouncing.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeaflet(version = LEAFLET_VERSION) {
  await Promise.all([
    loadJSFromCDN(`https://unpkg.com/leaflet@${version}/dist/leaflet.js`),
    loadCSSFromCDN(`https://unpkg.com/leaflet@${version}/dist/leaflet.css`),
  ]);

  // Those plugins won't work if they're loaded later 😢
  await Promise.all([
    importLeafletSmoothMarkerBouncing(),
    importLeafletGeoman(),
  ]);
}
