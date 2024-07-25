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
			default: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		},
		type: {
			type: String,
			default: MapTypes.ROADMAP,
			validator: (type) => ProvidersMapTypes[Providers.OPEN_STREET_MAP].includes(type),
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
			case MapTypes.HYBRID:
				return [
					new TileLayerOffline(Providers.OPEN_STREET_MAP, MapTypes.SATELLITE, {
						attribution: props.attribution,
					}),
					new TileLayerOffline(Providers.OPEN_STREET_MAP, MapTypes.ROADMAP, {
						attribution: props.attribution,
						opacity: 0.5,
					}),
				];
			default:
				return [
					new TileLayerOffline(Providers.OPEN_STREET_MAP, type, {
						attribution: props.attribution,
					}),
				];
		}
	}
</script>
