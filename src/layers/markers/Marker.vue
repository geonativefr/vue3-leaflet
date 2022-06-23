<template>
  <slot :marker="marker"/>
</template>

<script setup>
import L, { LatLng, Marker, Icon } from 'leaflet';
import 'leaflet.smooth_marker_bouncing';
import { whenever } from '@vueuse/core';
import { computed, inject, onUnmounted, provide, reactive, ref, toRefs, watch } from 'vue';
import { clean } from '../../utils/utils.js';

// @link https://github.com/Leaflet/Leaflet/issues/4453#issuecomment-1151893365
Marker.prototype._animateZoom = function (opt) {
  if (!this._map) {
    return;
  }
  const pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();
  this._setPos(pos);
};

const emit = defineEmits(['click', 'bounceend']);
const props = defineProps({
  position: {
    type: [LatLng, Array, Object],
    required: true,
  },
  icon: {
    type: [String, Object, Icon],
    default: undefined,
  },
  title: {
    type: String,
    default: undefined,
  },
  alt: {
    type: String,
    default: undefined,
  },
  opacity: {
    type: Number,
    default: undefined,
  },
  tooltip: {
    type: String,
    default: undefined,
  },
  bounce: {
    type: [Boolean, Number],
    default: false,
  },
  bounceHeight: {
    type: Number,
    default: undefined,
  },
  contractHeight: {
    type: Number,
    default: undefined,
  },
  bounceSpeed: {
    type: Number,
    default: undefined,
  },
  contractSpeed: {
    type: Number,
    default: undefined,
  },
  shadowAngle: {
    type: Number,
    default: undefined,
  },
  elastic: {
    type: Boolean,
    default: undefined,
  },
  exclusive: {
    type: Boolean,
    default: undefined,
  },
});

const {
  position,
  title,
  alt,
  opacity,
  bounce,
  bounceHeight,
  contractHeight,
  bounceSpeed,
  contractSpeed,
  shadowAngle,
  elastic,
  exclusive,
} = toRefs(props);

const options = reactive({
  title,
  alt,
  opacity,
});

const icon = computed(() => {
  if (props.icon instanceof Icon) {
    return props.icon;
  }
  if (props.icon instanceof Object) {
    return L.icon(props.icon);
  }
  if ('string' === typeof props.icon) {
    const defaults = {
      iconSize: [50, 50],
      iconAnchor: [22, 50], // half width, full height
      popupAnchor: [0, -50],
    };
    return {iconUrl: props.icon, ...defaults};
  }
});

const bouncingOptions = reactive({
  bounceHeight,
  contractHeight,
  bounceSpeed,
  contractSpeed,
  shadowAngle,
  elastic,
  exclusive,
});
const map = ref(inject('map'));
const marker = L.marker(props.position, clean(options));
marker.on('click', () => emit('click', marker));
marker.on('bounceend', () => emit('bounceend'));

function doBounce(marker, value) {
  if ('boolean' === typeof value) {
    value ? marker.bounce() : marker.stopBouncing();
    return;
  }

  marker.bounce(value);
}

provide('layer', marker);

function updateOptions(marker) {
  L.setOptions(marker, clean(options));
  marker._removeIcon();
  marker._initIcon();
  marker.update();
}

whenever(map, (map) => map.addLayer(marker), {immediate: true});
whenever(position, position => marker.setLatLng(position));
whenever(icon, icon => marker.setIcon(icon), {deep: true, immediate: true});
whenever(options, () => updateOptions(marker), {deep: true, immediate: true});
whenever(bouncingOptions, options => marker.setBouncingOptions(clean(options)), {deep: true, immediate: true});
watch(bounce, value => doBounce(marker, value), {immediate: true});
onUnmounted(() => marker.remove());
</script>
