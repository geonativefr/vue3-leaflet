<template>
	<slot v-if="mutant" />
</template>

<script setup>
	import { set, whenever } from '@vueuse/core';
	import { inject, provide, reactive, ref, toRefs, unref, watch } from 'vue';
	import { importLeaflet } from '../../utils/leaflet-loader.js';
	import { importLeafletGoogleMutant } from '../../utils/leaflet-google-mutant-loader.js';
	import { importGoogleMapsApi } from '../../utils/gmaps-api-loader.js';
	import TileLayerOffline from '../Offline';

	const props = defineProps({
		url: {
			type: String,
			default: 'https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
		},
		apiKey: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			default: 'roadmap',
			validator: (type) => ['roadmap', 'satellite', 'terrain', 'hybrid'].includes(type),
		},
		version: {
			type: String,
			default: undefined,
		},
	});

	await importLeaflet(inject('leaflet.version'));
	await importLeafletGoogleMutant(props.version);

	const { type } = toRefs(props);
	const defaultOptions = reactive({ type });

	const useGoogleMutant = (GOOGLE_MAPS_API_KEY) => {
		const mount = (map, options) => L.gridLayer.googleMutant(options).addTo(map);
		const load = async (map, options = defaultOptions) => {
			await importGoogleMapsApi(GOOGLE_MAPS_API_KEY);
			mount(map, options);
			return {};
		};

		return { load };
	};

	const $map = inject('map');
	const options = reactive({
		apiKey: props.apiKey,
		attribution: props.attribution,
		tileSize: props.tileSize,
		zoomOffset: props.zoomOffset,
	});
	const layer = new TileLayerOffline('google maps', props.type, props.url, options);
	const gmaps = useGoogleMutant(props.apiKey);
	const mutant = ref();
	watch(type, () => setMutant(unref($map)));

	async function setMutant(map) {
		set(mutant, await gmaps.load(map, defaultOptions));
	}

	provide('layer', ref(layer));
	whenever($map, (map) => setMutant(map), { immediate: true });
</script>
