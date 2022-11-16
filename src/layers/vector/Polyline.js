import { computed, inject, onUnmounted, provide, reactive, ref, toRefs } from 'vue';
import { whenever } from '@vueuse/core';
import { importLeafletArrowHeads } from '../../utils/leaflet-leaflet-arrowheads.js';
import { clean, renderless } from '../../utils/utils.js';
import PathProps from '../PathProps.js';

export default renderless({
  props: {
    positions: {
      type: Array,
      required: true,
    },
    arrows: {
      type: Object,
      default: undefined,
    },
    ...PathProps,
  },
  async setup(props) {
    const {
      positions,
      color,
      weight,
      opacity,
      fillColor,
    } = toRefs(props);

    const stroke = computed(() => null != props.color);
    const fill = computed(() => null != props.fillColor);

    const options = reactive({
      stroke,
      color,
      weight,
      opacity,
      fill,
      fillColor,
    });

    const map = inject('map');
    const polyline = L.polyline(props.positions, clean(options));
    provide('layer', polyline);
    onUnmounted(() => polyline.remove());

    if (props.arrows) {
      await importLeafletArrowHeads();
      polyline.arrowheads(props.arrows);
    }

    whenever(map, (map) => map.addLayer(polyline), {immediate: true});
    whenever(options, (options) => L.setOptions(polyline, clean(options), {deep: true, immediate: true}));
    whenever(positions, positions => polyline.setLatLngs(positions));
  },
});

