<template>
	<slot />
</template>

<script setup>
	import { get, set } from '@vueuse/core';
	import { inject, provide, ref, toRaw, watch } from 'vue';
	import TileLayerOffline from '../Offline';
	import { LayerGroups, MapTypes, Providers, ProvidersMapTypes } from '../../constants';

	const props = defineProps({
		attribution: {
			type: String,
			default:
				'&copy <a href="https://www.mapbox.com/about/maps/">Mapbox</a>&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> - <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>',
		},
		type: {
			type: String,
			default: MapTypes.ROADMAP,
			validator: (type) => ProvidersMapTypes[Providers.MAPBOX].includes(type),
		},
	});
	const $layerGroup = inject(LayerGroups.TILE);
	const layer = ref(getLayer(props.type));

	provide('layer', layer);
	watch(
		props,
		(props) => {
			set(layer, getLayer(props.type));
			toRaw(get($layerGroup))?.clearLayers();
			toRaw(get($layerGroup))?.addLayer(get(layer));
		},
		{ deep: true, immediate: true }
	);

	function getLayer(type) {
		return new TileLayerOffline(Providers.MAPBOX, type, {
			attribution: props.attribution,
		});
	}
</script>
