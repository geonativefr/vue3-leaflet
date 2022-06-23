<template>
  <slot />
</template>

<script setup>
import L from 'leaflet';
import { inject, provide, reactive, ref } from 'vue';
import { whenever } from '@vueuse/core';

const props = defineProps({
  url: {
    type: String,
    default: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={apiKey}',
  },
  apiKey: {
    type: String,
    required: true,
  },
  attribution: {
    type: String,
    default: '&copy <a href="https://www.mapbox.com/about/maps/">Mapbox</a>&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> - <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>',
  },
  tileSize: {
    type: Number,
    default: 512,
  },
  zoomOffset: {
    type: Number,
    default: -1,
  },
  type: {
    type: String,
    default: 'roadmap',
    validator: (type) => ['roadmap'].includes(type),
  },
});

const map = ref(inject('map'));
const options = reactive({
  apiKey: props.apiKey,
  attribution: props.attribution,
  tileSize: props.tileSize,
  zoomOffset: props.zoomOffset,
})
const layer = L.tileLayer(props.url, options);

provide('layer', layer);
whenever(map, map => map.addLayer(layer), {immediate: true});
</script>
