<template>
  <slot />
</template>

<script setup>
import { whenever } from '@vueuse/core';
import { computed, inject, onUnmounted, provide, reactive, toRefs } from 'vue';
import { clean } from '../../utils/utils.js';
import PathProps from '../PathProps.js';

const props = defineProps({
  positions: {
    type: Array,
    required: true,
  },
  ...PathProps,
});

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
const polygon = L.polygon(props.positions, clean(options));
provide('layer', polygon);

whenever(map, (map) => map.addLayer(polygon), {immediate: true});
whenever(options, (options) => L.setOptions(polygon, clean(options), {deep: true, immediate: true}));
whenever(positions, positions => polygon.setLatLngs(positions));
onUnmounted(() => polygon.remove());
</script>
