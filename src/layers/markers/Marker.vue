<template>
  <span v-if="$marker" :data-marker="$marker">
    <slot :marker="$marker"/>
  </span>
</template>

<script setup>
import { get, set, whenever } from '@vueuse/core';
import { computed, inject, onUnmounted, provide, reactive, ref, toRaw, toRefs } from 'vue';
import { importLeaflet } from '../../utils/leaflet-loader.js';
import { MUTE_ERRORS, silently } from '../../utils/silently.js';
import { clean } from '../../utils/utils.js';

const emit = defineEmits(['click', 'load']);
const props = defineProps({
  position: {
    type: [Array, Object],
    required: true,
  },
  icon: {
    type: [String, Object],
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
    type: [String, Node],
    default: undefined,
  },
});

await importLeaflet(inject('leaflet.version'));

// @link https://github.com/Leaflet/Leaflet/issues/4453#issuecomment-1151893365
L.Marker.prototype._animateZoom = function (opt) {
  if (!this._map) {
    return;
  }
  const pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();
  this._setPos(pos);
};

const {
  position,
  title,
  alt,
  opacity,
  tooltip,
} = toRefs(props);

const options = reactive({
  title,
  alt,
  opacity,
});

const icon = computed(() => {
  if (props.icon instanceof L.Icon) {
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
    return L.icon({iconUrl: props.icon, ...defaults});
  }
});

function updateOptions(marker) {
  L.setOptions(marker, clean(options));
  silently(() => {
    marker._removeIcon();
    marker._initIcon();
  }, MUTE_ERRORS);
  marker.update();
}

const $layerGroup = inject('layerGroup');
const $marker = ref();
provide('marker', $marker);
provide('layer', $marker);

const layerGroup = toRaw(get($layerGroup));
const marker = L.marker(props.position, clean(options));
marker.on('click', () => emit('click', get($marker)));
layerGroup.addLayer(marker);
set($marker, marker);
emit('load', get($marker));

whenever(position, position => get($marker).setLatLng(position));
whenever(icon, icon => silently(() => toRaw(get($marker)).setIcon(icon), MUTE_ERRORS), {immediate: true});
whenever(options, () => updateOptions(get($marker)), {deep: true, immediate: true});
whenever(tooltip, (tooltip) => get(marker).bindTooltip(tooltip), {deep: true, immediate: true});

onUnmounted(() => {
  silently(() => {
    get($layerGroup).removeLayer(get($marker));
    get($marker).remove();
  });
});
</script>
