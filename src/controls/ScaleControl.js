import L from 'leaflet';
import { inject, ref } from 'vue';
import { whenever } from '@vueuse/core';
import { clean, renderless } from '../utils/utils.js';

export default renderless({
  props: {
    position: {
      type: String,
      default: undefined,
    },
    maxWidth: {
      type: Number,
      default: undefined,
    },
    imperial: {
      type: Boolean,
      default: undefined,
    },
    metric: {
      type: Boolean,
      default: undefined,
    },
  },
  setup(props) {
    const map = ref(inject('map'));
    const control = L.control.scale(clean({...props}));

    whenever(map, (map) => map.addControl(control), {immediate: true});
  },
});
