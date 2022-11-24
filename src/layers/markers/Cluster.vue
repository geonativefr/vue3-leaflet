<template>
  <slot />
</template>

<script setup>
import { get } from '@vueuse/core';
import { inject, onUnmounted, provide, ref } from 'vue';
import { importLeafletMarkerCluster } from '../../utils/leaflet-markercluster-loader.js';

const map = inject('map');
await importLeafletMarkerCluster();
const cluster = L.markerClusterGroup();
const $cluster = ref(cluster);
provide('layer', $cluster);

get(map).addLayer(cluster);
onUnmounted(() => get(map).removeLayer(cluster));
</script>
