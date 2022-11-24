<template>
  <div>
    <Suspense>
      <div ref="container" v-bind="$attrs">
        <slot v-if="mapRef" :map="mapRef" />
      </div>
    </Suspense>
  </div>
</template>

<script setup>
import { get, set, templateRef, whenever } from '@vueuse/core';
import { onMounted, provide, reactive, ref, toRefs, watch } from 'vue';
import { importLeaflet } from './utils/leaflet-loader.js';

const emit = defineEmits(['ready', 'move', 'zoomend']);
const props = defineProps({
  center: {
    type: [Array, Object],
    default: () => undefined,
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
  version: {
    type: String,
    default: undefined,
  },
});

const {center, zoom, zoomControl, bounds, scrollWheelZoom} = toRefs(props);
const options = reactive({
  scrollWheelZoom,
  maxZoom: 18,
});
const container = templateRef('container');
const mapRef = ref();

function fitBounds(map, bounds) {
  if (bounds.length > 0) {
    map.fitBounds(bounds);
  }
}

provide('map', mapRef);
provide('layer', mapRef);
provide('leaflet.version', props.version);

onMounted(async () => {
  await importLeaflet(props.version);
  const map = L.map(get(container), options);
  map.setView(props.center, props.zoom);
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
