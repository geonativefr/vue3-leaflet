import L from 'leaflet';
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
    const polygon = L.polygon(props.positions, clean(options));
    provide('layer', polygon);

    whenever(map, (map) => map.addLayer(polygon), {immediate: true});
    whenever(options, (options) => L.setOptions(polygon, clean(options), {deep: true, immediate: true}));
    whenever(positions, positions => polygon.setLatLngs(positions));
    onUnmounted(() => polygon.remove());
  },
});

