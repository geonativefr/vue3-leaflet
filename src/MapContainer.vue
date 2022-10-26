<template>
  <div ref="container">
    <slot v-if="mapRef" :map="mapRef" />
  </div>
</template>

<script setup>
import { LatLng, Map } from 'leaflet';
import { get, set, templateRef, whenever } from '@vueuse/core';
import { onMounted, provide, reactive, ref, toRefs, watch } from 'vue';

import.meta.env.PROD || import('leaflet/dist/leaflet.css');

const emit = defineEmits(['ready', 'move', 'zoomend']);
const props = defineProps({
  center: {
    type: [LatLng, Array, Object],
    default: () => new LatLng(0, 0),
  },
  zoom: {
    type: Number,
    default: 13,
  },
  zoomControl: {
    type: Boolean,
    default: true,
  },
  scrollWheelZoom: {
    type: Boolean,
    default: true,
  },
  bounds: {
    type: Array,
    default: undefined,
  },
});

const {center, zoom, zoomControl, bounds, scrollWheelZoom} = toRefs(props);
const options = reactive({
  scrollWheelZoom,
});
const container = templateRef('container');
const mapRef = ref();

function fitBounds(map, bounds) {
  if (bounds.length > 0) {
    map.fitBounds(bounds);
  }
}

onMounted(() => {
  const map = new Map(get(container), options);
  map.setView(props.center, props.zoom);
  provide('map', map);
  watch(center, center => map.setView(center));
  watch(zoom, zoom => map.setView(props.center, zoom), {immediate: true});
  watch(zoomControl, zoomControl => zoomControl ? map.zoomControl.addTo(map) : map.zoomControl.remove(), {immediate: true});
  whenever(bounds, bounds => fitBounds(map, bounds), {immediate: true});
  set(mapRef, map);
  map.on('move', (event) => emit('move', {event, center: map.getCenter(), map}));
  map.on('zoomend', () => emit('zoomend', {zoom: map.getZoom(), bounds: map.getBounds(), map}));
  emit('ready', map);
});
</script>
