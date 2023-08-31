<template>
	<slot />
</template>

<script setup>
	import { whenever } from '@vueuse/core';
	import { inject, provide, reactive, ref } from 'vue';
	import { importLeaflet } from '../../utils/leaflet-loader.js';
	import TileLayerOffline from '../Offline';
	import { LayerGroups, LayerNames } from '../../constants';

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
			default:
				'&copy <a href="https://www.mapbox.com/about/maps/">Mapbox</a>&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> - <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>',
		},
		tileSize: {
			type: Number,
			default: 256,
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

	await importLeaflet(inject('leaflet.version'));
	const $layerGroup = inject(LayerGroups.TILE);
	const options = reactive({
		apiKey: props.apiKey,
		attribution: props.attribution,
		tileSize: props.tileSize,
		zoomOffset: props.zoomOffset,
	});
	const layer = new TileLayerOffline(LayerNames.MAPBOX, props.type, props.url, options);

	provide('layer', ref(layer));
	whenever($layerGroup, (map) => map.addLayer(layer), { immediate: true });
</script>
