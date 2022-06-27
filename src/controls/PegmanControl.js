import L from 'leaflet';
import 'leaflet-pegman';
import { inject, ref } from 'vue';
import { whenever } from '@vueuse/core';
import { loadGmapsApi, renderless } from '../utils/utils.js';

export default renderless({
  props: {
    apiKey: {
      type: String,
      default: undefined,
    },
    position: {
      type: String,
      default: 'bottomright',
    },
    theme: {
      type: String,
      default: 'leaflet-pegman-v3-small',
    },
  },
  setup(props) {
    const map = ref(inject('map'));
    const mount = async (map) => {
      if (props.apiKey) {
        await loadGmapsApi(props.apiKey);
      }
      const control = new L.Control.Pegman({
        position: props.position,
        theme: props.theme,
      });
      control.addTo(map);
    }
    whenever(map, mount, {immediate: true});
  },
});
