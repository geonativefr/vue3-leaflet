<template>
	<slot />
</template>

<script setup>
	import { get } from '@vueuse/core';
	import { inject, onUnmounted, provide, ref } from 'vue';
	import L from 'leaflet';
	import 'leaflet.markercluster';
	import 'leaflet.markercluster/dist/MarkerCluster.css';
	import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
	import { LayerGroups } from '../../constants';

	const $layerGroup = inject(LayerGroups.PIN);
	const cluster = L.markerClusterGroup();
	const $cluster = ref(cluster);
	provide('layer', $cluster);
	provide(LayerGroups.PIN, $cluster);

	get($layerGroup).addLayer(cluster);
	onUnmounted(() => get($layerGroup).removeLayer(cluster));
</script>
