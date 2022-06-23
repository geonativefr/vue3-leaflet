<template>
  <slot />
</template>

<script setup>
import L from 'leaflet';
import 'leaflet.gridlayer.googlemutant/dist/Leaflet.GoogleMutant.js';
import { inject, onMounted, provide, reactive, ref, toRefs, unref, watch } from 'vue';
import { get, set, whenever } from '@vueuse/core';

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
});

const {type} = toRefs(props);
const defaultOptions = reactive({type});

const useGoogleMaps = (GOOGLE_MAPS_API_KEY) => {
  window.gmapsApiLoaded = window.gmapsApiLoaded ?? false;
  const mount = (map, options) => L.gridLayer.googleMutant(options).addTo(map);

  const load = async (map, options = defaultOptions) => {
    return new Promise((resolve, reject) => {

      if (true === window.gmapsApiLoaded) {
        return resolve(mount(map, options));
      }

      const el = document.createElement('script');
      el.type = 'text/javascript';
      el.src = 'https://maps.googleapis.com/maps/api/js?key=' + GOOGLE_MAPS_API_KEY;
      el.async = true;
      el.addEventListener('error', event => reject(event));
      el.addEventListener('abort', event => reject(event));
      el.addEventListener('load', () => {
        window.L = L;
        window.gmapsApiLoaded = true;
        resolve(mount(map, options));
      });
      document.head.appendChild(el);
    });
  };

  return {load};
};

const map = ref(inject('map'));
const options = reactive({
  apiKey: props.apiKey,
  attribution: props.attribution,
  tileSize: props.tileSize,
  zoomOffset: props.zoomOffset,
})
const layer = L.tileLayer(props.url, options);
const gmaps = useGoogleMaps(props.apiKey);
const mutant = ref();
whenever(mutant, (mutant, oldMutant) => oldMutant?.remove());
watch(type, () => setMutant(unref(map)));

async function setMutant(map) {
  set(mutant, await gmaps.load(map, defaultOptions));
}

provide('layer', layer);
whenever(map, map => setMutant(map), {immediate: true});
</script>
