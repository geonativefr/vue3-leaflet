import L from 'leaflet';
import 'leaflet.locatecontrol';
import { inject, ref } from 'vue';
import { whenever } from '@vueuse/core';
import { clean, renderless } from '../utils/utils.js';

import.meta.env.PROD || import('leaflet.locatecontrol/dist/L.Control.Locate.min.css');

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
  },
  setup(props) {
    const map = ref(inject('map'));
    const control = L.control.locate(clean({...props}));

    whenever(map, (map) => map.addControl(control), {immediate: true});
  },
});
