<template>
	<slot />
</template>

<script setup>
	import { get } from '@vueuse/core';
	import { inject, onUnmounted, provide, ref } from 'vue';
	import { importLeafletMarkerCluster } from '../../utils/leaflet-markercluster-loader.js';

	const $layerGroup = inject('layerGroup');
	await importLeafletMarkerCluster();
	const cluster = L.markerClusterGroup();
	const $cluster = ref(cluster);
	provide('layer', $cluster);
	provide('layerGroup', $cluster);

	get($layerGroup).addLayer(cluster);
	onUnmounted(() => get($layerGroup).removeLayer(cluster));
</script>
