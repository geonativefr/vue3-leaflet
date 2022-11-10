<template>
  <div style="opacity: 0">
    <div ref="popup-content" id="popup-container">
      <slot/>
    </div>
  </div>
</template>

<script setup>
import { get, set, templateRef, useMounted, whenever } from '@vueuse/core';
import { inject, provide, ref, toRefs, watch } from 'vue';
import { importLeaflet } from '../utils/leaflet-loader.js';

const props = defineProps({
  position: {
    type: [Object, Array],
    default: undefined,
  },
});

await importLeaflet(inject('leaflet.version'));

// @link https://github.com/Leaflet/Leaflet/issues/4453#issuecomment-1151893365
L.Popup.prototype._animateZoom = function (e) {
  if (!this._map) {
    return;
  }
  const pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
  const anchor = this._getAnchor();
  L.DomUtil.setPosition(this._container, pos.add(anchor));
};

// @link https://github.com/Leaflet/Leaflet/issues/8235
if (!window.fixPopupCloseEvent) {
  document.addEventListener('click', (evt) => {
    let target = evt.target;
    while (target != null){
      if (target.matches('a[href="#close"]')){
        evt.preventDefault();
        return;
      }
      target = target.parentElement;
    }
  })
  window.fixPopupCloseEvent = true; // Prevent declaring same listener twice
}

const {position} = toRefs(props);
const popupContent = templateRef('popup-content');
const popup = new L.Popup();
const layer = inject('layer');
const isMounted = useMounted();
const isBound = ref(false);
provide('layer', popup);

function bindPopup() {
  if (true === get(isBound)) {
    return;
  }
  get(layer).bindPopup(popup);
  set(isBound, true);
}

function hydrateContent(content) {
  if (false === get(isMounted)) {
    return;
  }
  const isStructured = content.firstElementChild instanceof Element;
  if (content.innerHTML.trim().length > 0) {
    popup.setContent(isStructured ? content.firstElementChild : content);
    bindPopup();
  }
}

whenever(position, position => popup.setLatLng(position), {immediate: true});
watch(popupContent, hydrateContent, {immediate: true});
</script>
