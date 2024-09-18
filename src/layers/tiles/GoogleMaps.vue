<template>
	<slot v-if="mutant" />
</template>

<script setup>
	import { set, whenever } from '@vueuse/core';
	import { inject, reactive, ref, toRefs, unref, toRaw, watch } from 'vue';
	import { importLeaflet } from '../../utils/leaflet-loader.js';
	import { importLeafletGoogleMutant } from '../../utils/leaflet-google-mutant-loader.js';
	import { importGoogleMapsApi } from '../../utils/gmaps-api-loader.js';
	import { LayerGroups, Providers } from '../../constants';
	import { getProviderOptions } from '../../utils/options';

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

	await importLeaflet(inject('leaflet.version'));
	await importLeafletGoogleMutant(props.version);

	const { type } = toRefs(props);
	const defaultOptions = reactive({ type });

	const useGoogleMutant = (GOOGLE_MAPS_API_KEY) => {
		const mount = async (layerGroup, options) => {
			const gmapsLayer = await L.gridLayer.googleMutant(options).addTo(layerGroup);
			// HACK : Find all div with class leaflet-control-attribution. Remove all except the first one.
			document.querySelectorAll('.leaflet-control-attribution').forEach((control, index) => {
				if (index > 0) {
					control.remove();
				}
			});
			return gmapsLayer;
		};

		const load = async (layerGroup, options = defaultOptions) => {
			await importGoogleMapsApi(GOOGLE_MAPS_API_KEY);
			mount(layerGroup, options);
			return {};
		};

		return { load };
	};

	const $layerGroup = inject(LayerGroups.TILE);
	const gmaps = useGoogleMutant(getProviderOptions(Providers.GOOGLE_MAPS).apiKey);
	const mutant = ref();
	watch(type, () => setMutant(unref($layerGroup)));

	async function setMutant(layerGroup) {
		set(mutant, await gmaps.load(layerGroup, defaultOptions));
	}

	whenever(
		$layerGroup,
		(layerGroup) => {
			toRaw(layerGroup).clearLayers();
			setMutant(layerGroup);
		},
		{ immediate: true }
	);
</script>
