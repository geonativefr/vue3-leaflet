<template>
	<slot />
</template>

<script setup>
	import { whenever } from '@vueuse/core';
	import { computed, inject, onUnmounted, provide, reactive, toRefs } from 'vue';
	import { clean } from '../../utils/utils.js';
	import PathProps from '../PathProps.js';

	const props = defineProps({
		center: {
			type: [Array, Object],
			required: true,
		},
		radius: {
			type: Number,
			required: true,
		},
		...PathProps,
	});

	const { center, radius, color, weight, opacity, fillColor } = toRefs(props);

	const stroke = computed(() => null != props.color);
	const fill = computed(() => null != props.fillColor);

	const options = reactive({
		radius,
		stroke,
		color,
		weight,
		opacity,
		fill,
		fillColor,
	});

	const $layerGroup = inject('pinLayerGroup');
	const circle = L.circle(props.center, clean(options));
	provide('layer', circle);

	whenever($layerGroup, (layerGroup) => layerGroup.addLayer(circle), { immediate: true });
	whenever(options, (options) => L.setOptions(circle, clean(options), { deep: true, immediate: true }));
	whenever(center, (position) => circle.setLatLng(position));

	onUnmounted(() => circle.remove());
</script>
