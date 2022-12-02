import { whenever } from '@vueuse/core';
import { inject, reactive } from 'vue';
import { importLeafletFullScreen } from '../utils/leaflet-fullscreen-loader.js';
import { importLeaflet } from '../utils/leaflet-loader.js';
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

    await importLeaflet(inject('leaflet.version'));
    await importLeafletFullScreen(props.version);
    const options = reactive({
      position: props.position,
      title: {
        'false': props.viewText,
        'true': props.exitText,
      },
    });
    const control = new L.Control.Fullscreen(clean(options));

    whenever(map, (map) => map.addControl(control), {immediate: true});
  },
});
