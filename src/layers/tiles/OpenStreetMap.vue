<template>
	<slot />
</template>

<script setup>
	import { whenever } from '@vueuse/core';
	import { inject, provide, ref, toRaw } from 'vue';
	import TileLayerOffline from '../Offline';
	import { LayerGroups, LayerNames } from '../../constants';

	const props = defineProps({
		url: {
			type: String,
			default: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
		},
		attribution: {
			type: String,
			default: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		},
		type: {
			type: String,
			default: 'roadmap',
			validator: (type) => ['roadmap'].includes(type),
		},
	});

	const $layerGroup = inject(LayerGroups.TILE);
	const layer = new TileLayerOffline(LayerNames.OPEN_STREET_MAP, props.type, props.url, {
		attribution: props.attribution,
		maxZoom: 19,
	});

	provide('layer', ref(layer));
	whenever(
		$layerGroup,
		(layerGroup) => {
			toRaw(layerGroup).clearLayers();
			toRaw(layerGroup).addLayer(layer);
		},
		{ immediate: true }
	);
</script>
