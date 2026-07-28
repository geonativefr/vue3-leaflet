import { whenever } from '@vueuse/core';
import { inject } from 'vue';
import L from 'leaflet';
import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
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

    const control = L.control.locate(clean({ ...props }));

    whenever(map, (map) => map.addControl(control), { immediate: true });
  },
});
