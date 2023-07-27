<template>
	<slot />
</template>

<script setup>
	import { whenever, get } from '@vueuse/core';
	import { inject, provide, ref, watch } from 'vue';

	const props = defineProps({
		attribution: {
			type: String,
			default: '&copy; <a href="https://geoservices.ign.fr/">IGN</a>',
		},
		type: {
			type: String,
			default: 'roadmap',
			validator: (type) => ['satellite', 'roadmap'].includes(type),
		},
	});

	const $layerGroup = inject('layerGroup');

	const layer = getLayer(props.type, props.attribution);

	provide('layer', ref(layer));
	whenever($layerGroup, (layerGroup) => layerGroup.addLayer(layer), {
		immediate: true,
	});

	watch(
		props,
		(props) => {
			const layer = getLayer(props.type, props.attribution);
			get($layerGroup)?.addLayer(layer);
			provide('layer', layer);
		},
		{ deep: true }
	);

	function getLayer(type, attribution) {
		const url =
			type === 'satellite'
				? 'https://wxs.ign.fr/essentiels/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg'
				: 'https://wxs.ign.fr/essentiels/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/png';
		const options =
			type === 'satellite'
				? {
						minZoom: 0,
						maxZoom: 21,
						attribution: attribution,
						tileSize: 256,
				  }
				: {
						minZoom: 0,
						maxZoom: 19,
						attribution: attribution,
						tileSize: 256,
				  };
		return L.tileLayer(url, options);
	}
</script>
