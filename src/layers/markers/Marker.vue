<template>
  <span v-if="$marker" :data-marker="$marker">
    <slot :marker="$marker"/>
  </span>
</template>

<script setup>
import { get, set, whenever } from '@vueuse/core';
import { computed, inject, onMounted, onUnmounted, provide, reactive, ref, toRefs } from 'vue';
import { importLeaflet } from '../../utils/leaflet-loader.js';
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
    type: String,
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

const $map = inject('map');
const $marker = ref();
provide('layer', $marker);
provide('marker', $marker);

function updateOptions(marker) {
  L.setOptions(marker, clean(options));
  marker._removeIcon();
  marker._initIcon();
  marker.update();
}

onMounted(() => {
  whenever($map, (map) => {
    const marker = L.marker(props.position, clean(options));
    marker.on('click', () => emit('click', marker));
    set($marker, marker);
    map.addLayer(get($marker));
    emit('load', get($marker));

    whenever(position, position => get($marker).setLatLng(position));
    whenever(icon, icon => get($marker).setIcon(icon), {deep: true, immediate: true});
    whenever(options, () => updateOptions(get($marker)), {deep: true, immediate: true});

  }, {immediate: true});
});




onUnmounted(() => get($marker).remove());
</script>
