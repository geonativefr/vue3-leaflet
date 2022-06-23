import { Control } from 'leaflet';
import { whenever } from '@vueuse/core';
import { inject, ref } from 'vue';
import { clean, renderless } from '../utils/utils.js';

export default renderless({
  props: {
    position: {
      type: String,
      default: undefined,
    },
    zoomInTitle: {
      type: String,
      default: undefined,
    },
    zoomOutTitle: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    const map = ref(inject('map'));
    const control = new Control.Zoom(clean({...props}));

    const mount = map => {
      map?.zoomControl?.remove();
      map.addControl(control);
    }

    whenever(map, mount, {immediate: true});
  },
});
