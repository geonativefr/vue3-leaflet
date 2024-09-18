<template>
	<slot v-if="mutant" />
</template>

<script setup>
	import { set, whenever } from '@vueuse/core';
	import { inject, reactive, ref, toRefs, unref, toRaw, watch } from 'vue';
	import { importLeaflet } from '../../utils/leaflet-loader.js';
	import { importLeafletGoogleMutant } from '../../utils/leaflet-google-mutant-loader.js';
	import { importGoogleMapsApi } from '../../utils/gmaps-api-loader.js';
	import { AdditionalGoogleLayers, LayerGroups, Providers } from '../../constants';
	import { getProviderOptions } from '../../utils/options';

	const props = defineProps({
		type: {
			type: String,
			default: 'roadmap',
			validator: (type) => ['roadmap', 'satellite', 'terrain', 'hybrid'].includes(type),
		},
		additionalLayers: {
			type: Array,
			default: () => [],
			validator(value) {
				return value.every((layer) => Object.values(AdditionalGoogleLayers).includes(layer));
			}
		},
		version: {
			type: String,
			default: undefined,
		},
	});

	await importLeaflet(inject('leaflet.version'));
	await importLeafletGoogleMutant(props.version);

	const { type, additionalLayers } = toRefs(props);
	const defaultOptions = reactive({ type });

	const useGoogleMutant = (GOOGLE_MAPS_API_KEY) => {
		const googleLayers = ref();
		const mount = async (layerGroup, options) => {
			googleLayers.value = await L.gridLayer.googleMutant(options).addTo(layerGroup);
			// HACK : Find all div with class leaflet-control-attribution. Remove all except the first one.
			document.querySelectorAll('.leaflet-control-attribution').forEach((control, index) => {
				if (index > 0) {
					control.remove();
				}
			});
		};
		const load = async (layerGroup, options = defaultOptions) => {
			await importGoogleMapsApi(GOOGLE_MAPS_API_KEY);
			await mount(layerGroup, options);
			return googleLayers.value;
		};
		const addGoogleLayer = (googleLayerName) => {
			googleLayers.value.addGoogleLayer(googleLayerName);
		};
		const removeGoogleLayer = (googleLayerName) => {
			googleLayers.value.removeGoogleLayer(googleLayerName);
		};
		return { load, addGoogleLayer, removeGoogleLayer };
	};

	const $layerGroup = inject(LayerGroups.TILE);
	const gmaps = useGoogleMutant(getProviderOptions(Providers.GOOGLE_MAPS).apiKey);
	const mutant = ref();
	watch(type, () => setMutant(unref($layerGroup), unref(additionalLayers)));
	watch(additionalLayers, () => setMutant(unref($layerGroup), unref(additionalLayers)));

	async function setMutant(layerGroup, additionalLayers) {
		set(mutant, await gmaps.load(layerGroup, defaultOptions));
		additionalLayers.forEach((layer) => gmaps.addGoogleLayer(layer));
	}

	whenever(
		$layerGroup,
		(layerGroup) => {
			toRaw(layerGroup).clearLayers();
			setMutant(layerGroup, unref(additionalLayers));
		},
		{ immediate: true }
	);
</script>
