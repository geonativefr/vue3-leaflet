<template>
  <slot />
</template>

<script setup>
import { whenever } from '@vueuse/core';
import { inject, provide, ref } from 'vue';

const props = defineProps({
  url: {
    type: String,
    default: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  attribution: {
    type: String,
    default: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  type: {
    type: String,
    default: 'roadmap',
    validator: (type) => ['roadmap'].includes(type),
  },
});

const $layerGroup = inject('layerGroup');
const layer = L.tileLayer(props.url, {
  attribution: props.attribution,
});

provide('layer', ref(layer));
whenever($layerGroup, layerGroup => layerGroup.addLayer(layer), {immediate: true});
</script>
