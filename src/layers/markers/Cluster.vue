<template>
  <slot />
</template>

<script setup>
import { get } from '@vueuse/core';
import { inject, onUnmounted, provide, ref } from 'vue';
import { importLeafletMarkerCluster } from '../../utils/leaflet-markercluster-loader.js';
import { LayerGroups } from '../../constants';

const $layerGroup = inject(LayerGroups.PIN);
await importLeafletMarkerCluster();
const cluster = L.markerClusterGroup();
const $cluster = ref(cluster);
provide('layer', $cluster);
provide(LayerGroups.PIN, $cluster);

get($layerGroup).addLayer(cluster);
onUnmounted(() => get($layerGroup).removeLayer(cluster));
</script>
