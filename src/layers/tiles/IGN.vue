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
		return new TileLayerOffline(Providers.IGN, type, {
			attribution: props.attribution,
		});
	}
</script>
