import { whenever } from '@vueuse/core';
import { inject } from 'vue';
import { importLeaflet } from '../utils/leaflet-loader.js';
import { importLeafletLocateControl } from '../utils/leaflet-locatecontrol-loader.js';
import { clean, renderless } from '../utils/utils.js';

export default renderless({
  props: {
    position: {
      type: String,
      default: undefined,
    },
    strings: {
      type: Object,
      default: undefined,
    },
    enableHighAccuracy: {
      type: Boolean,
      default: undefined,
    },
    version: {
      type: String,
      default: undefined,
    },
  },
  async setup(props) {
    const map = inject('map');

    await importLeaflet(inject('leaflet.version'));
    await importLeafletLocateControl(props.version);
    const control = L.control.locate(clean({ ...props }));

    whenever(map, (map) => map.addControl(control), { immediate: true });
  },
});
