<template>
	<slot />
</template>

<script setup>
	import { whenever } from '@vueuse/core';
	import { computed, inject, onUnmounted, provide, reactive, toRefs } from 'vue';
	import { importLeafletArrowHeads } from '../../utils/leaflet-leaflet-arrowheads.js';
	import { clean } from '../../utils/utils.js';
	import PathProps from '../PathProps.js';

	const props = defineProps({
		positions: {
			type: Array,
			required: true,
		},
		arrows: {
			type: Object,
			default: undefined,
		},
		...PathProps,
	});

	const { positions, color, weight, opacity, fillColor } = toRefs(props);

	const stroke = computed(() => null != props.color);
	const fill = computed(() => null != props.fillColor);

	const options = reactive({
		stroke,
		color,
		weight,
		opacity,
		fill,
		fillColor,
	});

	const $layerGroup = inject('pinLayerGroup');
	const polyline = L.polyline(props.positions, clean(options));
	provide('layer', polyline);
	onUnmounted(() => polyline.remove());

	if (props.arrows) {
		await importLeafletArrowHeads();
		polyline.arrowheads(props.arrows);
	}

	whenever($layerGroup, (layerGroup) => layerGroup.addLayer(polyline), { immediate: true });
	whenever(options, (options) => L.setOptions(polyline, clean(options), { deep: true, immediate: true }));
	whenever(positions, (positions) => polyline.setLatLngs(positions));
</script>
