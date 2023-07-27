<template>
	<slot />
</template>

<script setup>
	import { whenever, get, set } from '@vueuse/core';
	import { inject, provide, ref, watch } from 'vue';
	import mapTypes from '../../utils/map-types';

	const props = defineProps({
		attribution: {
			type: String,
			default: '&copy; <a href="https://geoservices.ign.fr/">IGN</a>',
		},
		type: {
			type: String,
			default: mapTypes.roadmap,
			validator: (type) => [mapTypes.satellite, mapTypes.roadmap, mapTypes.cadastral].includes(type),
		},
	});

	const $layerGroup = inject('layerGroup');

	const layer = ref(getLayer(props.type, props.attribution));

	provide('layer', layer);
	whenever($layerGroup, (layerGroup) => layerGroup.addLayer(get(layer)), {
		immediate: true,
	});

	watch(
		props,
		(props) => {
			set(layer, getLayer(props.type, props.attribution));
			get($layerGroup)?.addLayer(get(layer));
		},
		{ deep: true }
	);

	function getLayer(type, attribution) {
		//type: mapTypes.roadmap
		const options = {
			minZoom: 0,
			maxZoom: 19,
			attribution: attribution,
			tileSize: 256,
		};
		let url =
			'https://wxs.ign.fr/essentiels/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/png';
		switch (type) {
			case mapTypes.satellite:
				url =
					'https://wxs.ign.fr/essentiels/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg';
				options.maxZoom = 21;
				break;
			case mapTypes.cadastral:
				url =
					'https://wxs.ign.fr/essentiels/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=CADASTRALPARCELS.PARCELLAIRE_EXPRESS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/png';
				break;
		}
		return L.tileLayer(url, options);
	}
</script>
