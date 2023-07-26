<template>
	<slot />
</template>

<script setup>
	import { whenever } from '@vueuse/core';
	import { inject, provide, ref } from 'vue';

	const props = defineProps({
		attribution: {
			type: String,
			default: '&copy; <a href="https://geoservices.ign.fr/">IGN</a>',
		},
		type: {
			type: String,
			default: 'terrain',
			validator: (type) => ['satellite', 'terrain'].includes(type),
		},
	});

	const $layerGroup = inject('layerGroup');

	const url =
		props.type === 'satellite'
			? 'https://wxs.ign.fr/essentiels/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg'
			: 'https://wxs.ign.fr/essentiels/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/png';
	const options =
		props.type === 'satellite'
			? {
					minZoom: 0,
					maxZoom: 21,
					attribution: props.attribution,
					tileSize: 256,
			  }
			: {
					minZoom: 0,
					maxZoom: 19,
					attribution: props.attribution,
					tileSize: 256,
			  };

	const layer = L.tileLayer(url, options);

	provide('layer', ref(layer));
	whenever($layerGroup, (layerGroup) => layerGroup.addLayer(layer), {
		immediate: true,
	});
</script>
