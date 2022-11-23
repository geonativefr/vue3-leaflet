import { LEAFLET_MARKERCLUSTER_VERSION } from '../vars.js';
import { loadCSSFromCDN, loadJSFromCDN } from './utils.js';

export async function importLeafletMarkerCluster(version = LEAFLET_MARKERCLUSTER_VERSION) {
  return Promise.all([
    loadJSFromCDN(`https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js`),
    loadCSSFromCDN(`https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css`),
    loadCSSFromCDN(`https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css`),
  ]);
}
