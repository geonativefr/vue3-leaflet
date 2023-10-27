<template>
	<slot />
</template>

<script setup>
	import { inject, watch } from 'vue';
	import { importLeaflet } from '../../utils/leaflet-loader.js';
	import { importLeafletGoogleMutant } from '../../utils/leaflet-google-mutant-loader.js';
	import { importGoogleMapsApi } from '../../utils/gmaps-api-loader.js';
	import { LayerGroups } from '../../constants';

	const props = defineProps({
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

	await importGoogleMapsApi();
	await importLeaflet(inject('leaflet.version'));
	await importLeafletGoogleMutant(props.version);

	const $layerGroup = inject(LayerGroups.TILE);

	watch(
		[$layerGroup, props],
		([layerGroup, props]) => {
			if (!layerGroup) return;

			layerGroup.clearLayers();
			L.gridLayer.googleMutant({ type: props.type }).addTo(layerGroup);
		},
		{ immediate: true }
	);
</script>
