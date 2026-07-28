import { whenever } from '@vueuse/core';
import { inject, reactive } from 'vue';
import L from 'leaflet';
import '@runette/leaflet-fullscreen';
import '@runette/leaflet-fullscreen/dist/leaflet.fullscreen.css';
import { clean, renderless } from '../utils/utils.js';

export default renderless({
  props: {
    position: {
      type: String,
      default: undefined,
    },
    viewText: {
      type: String,
      default: undefined,
    },
    exitText: {
      type: String,
      default: undefined,
    },
    version: {
      type: String,
      default: undefined,
    },
  },
  async setup(props) {
    const map = inject('map');

    const options = reactive({
      position: props.position,
      title: {
        false: props.viewText,
        true: props.exitText,
      },
    });
    const control = new L.Control.Fullscreen(clean(options));

    whenever(map, (map) => map.addControl(control), { immediate: true });
  },
});
