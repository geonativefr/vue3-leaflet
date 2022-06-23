import L from 'leaflet';
import 'leaflet-arrowheads';
import { computed, inject, onUnmounted, provide, reactive, ref, toRefs } from 'vue';
import { whenever } from '@vueuse/core';
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
  setup(props) {
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

    const map = ref(inject('map'));
    const polyline = L.polyline(props.positions, clean(options));
    if (props.arrows) {
      polyline.arrowheads(props.arrows);
    }
    provide('layer', polyline);

    whenever(map, (map) => map.addLayer(polyline), {immediate: true});
    whenever(options, (options) => L.setOptions(polyline, clean(options), {deep: true, immediate: true}));
    whenever(positions, positions => polyline.setLatLngs(positions));

    onUnmounted(() => polyline.remove());
  },
});

