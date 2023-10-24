<template>
	<slot />
</template>

<script setup>
	import { whenever } from '@vueuse/core';
	import { inject, provide, reactive, ref, toRaw } from 'vue';
	import { importLeaflet } from '../../utils/leaflet-loader.js';
	import TileLayerOffline from '../Offline';
	import { LayerGroups, Layers } from '../../constants';

	const props = defineProps({
		attribution: {
			type: String,
			default:
				'&copy <a href="https://www.mapbox.com/about/maps/">Mapbox</a>&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> - <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>',
		},
		type: {
			type: String,
			default: 'roadmap',
			validator: (type) => ['roadmap'].includes(type),
		},
	});

	await importLeaflet(inject('leaflet.version'));
	const $layerGroup = inject(LayerGroups.TILE);
	const layer = new TileLayerOffline(Layers.MAPBOX, props.type, {
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
