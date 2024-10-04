<template>
	<slot />
</template>

<script setup>
	import { whenever } from '@vueuse/core';
	import { inject, provide, ref, toRaw } from 'vue';
	import TileLayerOffline from '../Offline';
	import { LayerGroups, MapTypes, Providers, ProvidersMapTypes } from '../../constants';

	const props = defineProps({
		attribution: {
			type: String,
			default: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		},
		type: {
			type: String,
			default: MapTypes.ROADMAP,
			validator: (type) => ProvidersMapTypes[Providers.OPEN_STREET_MAP].includes(type),
		},
	});

	const $layerGroup = inject(LayerGroups.TILE);
	const layer = new TileLayerOffline(Providers.OPEN_STREET_MAP, props.type, {
		attribution: props.attribution,
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
