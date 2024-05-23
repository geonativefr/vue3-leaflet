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
			default: '&copy; <a href="https://geoservices.ign.fr/">IGN</a>',
		},
		type: {
			type: String,
			default: MapTypes.ROADMAP,
			validator: (type) => [MapTypes.SATELLITE, MapTypes.ROADMAP, MapTypes.CADASTRAL].includes(type),
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
		switch(type) {
			case MapTypes.HYBRID:
				return [
					new TileLayerOffline(Providers.IGN, MapTypes.SATELLITE, {
						attribution: props.attribution,
						opacity: 1,
					}),
					new TileLayerOffline(Providers.IGN, MapTypes.ROADMAP, {
						attribution: props.attribution,
						opacity: 0.5,
					}),
				];
			default:
				return [
					new TileLayerOffline(Providers.IGN, type, {
						attribution: props.attribution,
						opacity: 1,
					}),
				];
		}
	}
</script>
