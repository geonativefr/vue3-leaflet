import { computed, inject, onUnmounted, provide, reactive, ref, toRefs } from 'vue';
import { whenever } from '@vueuse/core';
import { clean, renderless } from '../../utils/utils.js';
import PathProps from '../PathProps.js';

export default renderless({
  props: {
    center: {
      type: [Array, Object],
      required: true,
    },
    radius: {
      type: Number,
      required: true,
    },
    ...PathProps,
  },
  setup(props) {
    const {
      center,
      radius,
      color,
      weight,
      opacity,
      fillColor,
    } = toRefs(props);

    const stroke = computed(() => null != props.color);
    const fill = computed(() => null != props.fillColor);

    const options = reactive({
      radius,
      stroke,
      color,
      weight,
      opacity,
      fill,
      fillColor,
    });

    const map = inject('map');
    const circle = L.circle(props.center, clean(options));
    provide('layer', circle);

    whenever(map, (map) => map.addLayer(circle), {immediate: true});
    whenever(options, (options) => L.setOptions(circle, clean(options), {deep: true, immediate: true}));
    whenever(center, position => circle.setLatLng(position));

    onUnmounted(() => circle.remove());
  },
});

