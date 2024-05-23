<template>
	<slot />
</template>

<script setup>
	import { get, set } from '@vueuse/core';
	import { inject, provide, ref, toRaw, watch } from 'vue';
	import TileLayerOffline from '../Offline';
	import { LayerGroups, MapTypes, Providers } from '../../constants';

	const props = defineProps({
		attribution: {
			type: String,
			default: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> - <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>',
		},
		type: {
			type: String,
			default: MapTypes.ROADMAP,
			validator: (type) => [MapTypes.SATELLITE, MapTypes.ROADMAP].includes(type),
		},
	});

	const $layerGroup = inject(LayerGroups.TILE);
	const layers = ref(getLayers(props.type));
	provide('layers', layers);

	watch(
		props,
		(props) => {
			set(layers, getLayers(props.type));
			toRaw(get($layerGroup))?.clearLayers();
			layers.value.forEach((layer) => toRaw(get($layerGroup))?.addLayer(layer));
		},
		{ deep: true, immediate: true }
	);

	function getLayers(type) {
		switch (type) {
			default:
				return [
					new TileLayerOffline(Providers.MAPBOX, type, {
						attribution: props.attribution,
						opacity: 1,
					}),
				];
		}
	}
</script>
