var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
import { toRefs, reactive, ref, provide, onMounted, watch, openBlock, createElementBlock, createBlock, Suspense, withCtx, createElementVNode, mergeProps, renderSlot, createCommentVNode, inject, withAsyncContext, unref, onUnmounted, computed, toRaw, Teleport, nextTick } from "vue";
import { templateRef, get, whenever, set, useMounted, useMutationObserver } from "@vueuse/core";
const LEAFLET_VERSION = "1.9.2";
const LEAFLET_LOCATE_CONTROL_VERSION = "0.78.0";
const LEAFLET_GOOGLE_MUTANT_VERSION = "0.13.5";
const LEAFLET_PEGMAN_VERSION = "0.1.6";
const LEAFLET_SMOOTH_MARKER_BOUNCING_VERSION = "2.0.1";
const LEAFLET_ARROWHEADS_VERSION = "1.4.0";
const LEAFLET_GEOMETRYUTIL_VERSION = "0.10.1";
const LEAFLET_GEOMAN_VERSION = "2.13.0";
const LEAFLET_MARKERCLUSTER_VERSION = "1.4.1";
function renderless(component) {
  return Object.assign(component, { render: () => void 0 });
}
function isRealObject(object) {
  return typeof object === "object" && object !== null;
}
function clean(object) {
  if (!isRealObject(object)) {
    return object;
  }
  Object.keys(object).forEach((key) => {
    if (isRealObject(object[key])) {
      object[key] = clean(object[key]);
      return;
    }
    if (typeof object[key] === "undefined") {
      if (Array.isArray(object)) {
        object.splice(key, 1);
      } else {
        delete object[key];
      }
    }
  });
  return object;
}
async function loadGmapsApi(GOOGLE_MAPS_API_KEY) {
  var _a;
  window.gmapsApi = (_a = window.gmapsApi) != null ? _a : new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.type = "text/javascript";
    el.src = "https://maps.googleapis.com/maps/api/js?key=" + GOOGLE_MAPS_API_KEY;
    el.async = true;
    el.addEventListener("error", (event) => reject(event));
    el.addEventListener("abort", (event) => reject(event));
    el.addEventListener("load", () => {
      resolve(true);
    });
    document.head.appendChild(el);
  });
  return window.gmapsApi;
}
async function loadJSFromCDN(url) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src='${url}']`);
    if (existing) {
      return resolve();
    }
    const el = document.createElement("script");
    el.type = "text/javascript";
    el.src = url;
    el.addEventListener("error", (event) => reject(event));
    el.addEventListener("abort", (event) => reject(event));
    el.addEventListener("load", () => resolve());
    document.head.appendChild(el);
  });
}
async function loadCSSFromCDN(url) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`link[rel='stylesheet'][href='${url}']`);
    if (existing) {
      return resolve();
    }
    const el = document.createElement("link");
    el.rel = "stylesheet";
    el.href = url;
    el.crossOrigin = "";
    el.addEventListener("error", (event) => reject(event));
    el.addEventListener("abort", (event) => reject(event));
    el.addEventListener("load", () => resolve());
    document.head.appendChild(el);
  });
}
async function importLeafletGeoman(version = LEAFLET_GEOMAN_VERSION) {
  return Promise.all([
    loadJSFromCDN(`https://unpkg.com/@geoman-io/leaflet-geoman-free@${version}/dist/leaflet-geoman.min.js`),
    loadCSSFromCDN(`https://unpkg.com/@geoman-io/leaflet-geoman-free@${version}/dist/leaflet-geoman.css`)
  ]);
}
async function importLeafletSmoothMarkerBouncing(version = LEAFLET_SMOOTH_MARKER_BOUNCING_VERSION) {
  return loadJSFromCDN(`https://unpkg.com/leaflet.smooth_marker_bouncing@${version}/dist/bundle.js`);
}
async function importLeaflet(version = LEAFLET_VERSION) {
  await Promise.all([
    loadJSFromCDN(`https://unpkg.com/leaflet@${version}/dist/leaflet.js`),
    loadCSSFromCDN(`https://unpkg.com/leaflet@${version}/dist/leaflet.css`)
  ]);
  await Promise.all([
    importLeafletSmoothMarkerBouncing(),
    importLeafletGeoman()
  ]);
}
const _sfc_main$a = {
  __name: "MapContainer",
  props: {
    center: {
      type: [Array, Object],
      default: () => void 0
    },
    zoom: {
      type: Number,
      default: 13
    },
    zoomControl: {
      type: Boolean,
      default: true
    },
    scrollWheelZoom: {
      type: Boolean,
      default: true
    },
    bounds: {
      type: Array,
      default: void 0
    },
    version: {
      type: String,
      default: void 0
    }
  },
  emits: ["ready", "move", "zoomend"],
  setup(__props, { emit }) {
    const props = __props;
    const { center, zoom, zoomControl, bounds, scrollWheelZoom } = toRefs(props);
    const options = reactive({
      scrollWheelZoom,
      maxZoom: 18
    });
    const container = templateRef("container");
    const mapRef = ref();
    function fitBounds(map, bounds2) {
      if (bounds2.length > 0) {
        map.fitBounds(bounds2);
      }
    }
    provide("map", mapRef);
    provide("layer", mapRef);
    provide("leaflet.version", props.version);
    onMounted(async () => {
      await importLeaflet(props.version);
      const map = L.map(get(container), options);
      map.setView(props.center, props.zoom);
      watch(center, (center2) => map.setView(center2));
      watch(zoom, (zoom2) => map.setView(props.center, zoom2), { immediate: true });
      watch(zoomControl, (zoomControl2) => zoomControl2 ? map.zoomControl.addTo(map) : map.zoomControl.remove(), { immediate: true });
      whenever(bounds, (bounds2) => fitBounds(map, bounds2), { immediate: true });
      set(mapRef, map);
      map.on("move", (event) => emit("move", { event, center: map.getCenter(), map }));
      map.on("zoomend", () => emit("zoomend", { zoom: map.getZoom(), bounds: map.getBounds(), map }));
      emit("ready", map);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        (openBlock(), createBlock(Suspense, null, {
          default: withCtx(() => [
            createElementVNode("div", mergeProps({
              ref_key: "container",
              ref: container
            }, _ctx.$attrs), [
              mapRef.value ? renderSlot(_ctx.$slots, "default", {
                key: 0,
                map: mapRef.value
              }) : createCommentVNode("", true)
            ], 16)
          ]),
          _: 3
        }))
      ]);
    };
  }
};
const _sfc_main$9 = {
  __name: "OpenStreetMap",
  props: {
    url: {
      type: String,
      default: "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    },
    attribution: {
      type: String,
      default: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    type: {
      type: String,
      default: "roadmap",
      validator: (type) => ["roadmap"].includes(type)
    }
  },
  setup(__props) {
    const props = __props;
    const map = inject("map");
    const layer = L.tileLayer(props.url, {
      attribution: props.attribution
    });
    provide("layer", layer);
    whenever(map, (map2) => map2.addLayer(layer), { immediate: true });
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default");
    };
  }
};
const _sfc_main$8 = {
  __name: "Mapbox",
  props: {
    url: {
      type: String,
      default: "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={apiKey}"
    },
    apiKey: {
      type: String,
      required: true
    },
    attribution: {
      type: String,
      default: '&copy <a href="https://www.mapbox.com/about/maps/">Mapbox</a>&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> - <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'
    },
    tileSize: {
      type: Number,
      default: 512
    },
    zoomOffset: {
      type: Number,
      default: -1
    },
    type: {
      type: String,
      default: "roadmap",
      validator: (type) => ["roadmap"].includes(type)
    }
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    [__temp, __restore] = withAsyncContext(() => importLeaflet(inject("leaflet.version"))), await __temp, __restore();
    const map = inject("map");
    const options = reactive({
      apiKey: props.apiKey,
      attribution: props.attribution,
      tileSize: props.tileSize,
      zoomOffset: props.zoomOffset
    });
    const layer = L.tileLayer(props.url, options);
    provide("layer", layer);
    whenever(map, (map2) => map2.addLayer(layer), { immediate: true });
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default");
    };
  }
};
async function importLeafletGoogleMutant(version = LEAFLET_GOOGLE_MUTANT_VERSION) {
  return loadJSFromCDN(`https://unpkg.com/leaflet.gridlayer.googlemutant@${version}/dist/Leaflet.GoogleMutant.js`);
}
async function importGoogleMapsApi(GOOGLE_MAPS_API_KEY) {
  if (window.gmapsApi) {
    return true;
  }
  return loadJSFromCDN(`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`);
}
const _sfc_main$7 = {
  __name: "GoogleMaps",
  props: {
    url: {
      type: String,
      default: "https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
    },
    apiKey: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: "roadmap",
      validator: (type) => ["roadmap", "satellite", "terrain", "hybrid"].includes(type)
    },
    version: {
      type: String,
      default: void 0
    }
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    [__temp, __restore] = withAsyncContext(() => importLeaflet(inject("leaflet.version"))), await __temp, __restore();
    [__temp, __restore] = withAsyncContext(() => importLeafletGoogleMutant(props.version)), await __temp, __restore();
    const { type } = toRefs(props);
    const defaultOptions = reactive({ type });
    const useGoogleMutant = (GOOGLE_MAPS_API_KEY) => {
      const mount = (map2, options2) => L.gridLayer.googleMutant(options2).addTo(map2);
      const load = async (map2, options2 = defaultOptions) => {
        await importGoogleMapsApi(GOOGLE_MAPS_API_KEY);
        mount(map2, options2);
        return {};
      };
      return { load };
    };
    const map = inject("map");
    const options = reactive({
      apiKey: props.apiKey,
      attribution: props.attribution,
      tileSize: props.tileSize,
      zoomOffset: props.zoomOffset
    });
    const layer = L.tileLayer(props.url, options);
    const gmaps = useGoogleMutant(props.apiKey);
    const mutant = ref();
    watch(type, () => setMutant(unref(map)));
    async function setMutant(map2) {
      set(mutant, await gmaps.load(map2, defaultOptions));
    }
    provide("layer", layer);
    whenever(map, (map2) => setMutant(map2), { immediate: true });
    return (_ctx, _cache) => {
      return mutant.value ? renderSlot(_ctx.$slots, "default", { key: 0 }) : createCommentVNode("", true);
    };
  }
};
async function importLeafletMarkerCluster(version = LEAFLET_MARKERCLUSTER_VERSION) {
  return Promise.all([
    loadJSFromCDN(`https://unpkg.com/leaflet.markercluster@${version}/dist/leaflet.markercluster.js`),
    loadCSSFromCDN(`https://unpkg.com/leaflet.markercluster@${version}/dist/MarkerCluster.css`),
    loadCSSFromCDN(`https://unpkg.com/leaflet.markercluster@${version}/dist/MarkerCluster.Default.css`)
  ]);
}
const _sfc_main$6 = {
  __name: "Cluster",
  async setup(__props) {
    let __temp, __restore;
    const map = inject("map");
    [__temp, __restore] = withAsyncContext(() => importLeafletMarkerCluster()), await __temp, __restore();
    const cluster = L.markerClusterGroup();
    const $cluster = ref(cluster);
    provide("layer", $cluster);
    get(map).addLayer(cluster);
    onUnmounted(() => get(map).removeLayer(cluster));
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default");
    };
  }
};
const MUTE_ERRORS = () => ({});
const LOG_ERRORS = (e) => console.debug(e);
async function silently(callback, onFailure = LOG_ERRORS) {
  try {
    await callback();
  } catch (e) {
    onFailure(e);
  }
}
const _hoisted_1$1 = ["data-marker"];
const _sfc_main$5 = {
  __name: "Marker",
  props: {
    position: {
      type: [Array, Object],
      required: true
    },
    icon: {
      type: [String, Object],
      default: void 0
    },
    title: {
      type: String,
      default: void 0
    },
    alt: {
      type: String,
      default: void 0
    },
    opacity: {
      type: Number,
      default: void 0
    },
    tooltip: {
      type: [String, Node],
      default: void 0
    }
  },
  emits: ["click", "load"],
  async setup(__props, { emit }) {
    let __temp, __restore;
    const props = __props;
    [__temp, __restore] = withAsyncContext(() => importLeaflet(inject("leaflet.version"))), await __temp, __restore();
    L.Marker.prototype._animateZoom = function(opt) {
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
      tooltip
    } = toRefs(props);
    const options = reactive({
      title,
      alt,
      opacity
    });
    const icon = computed(() => {
      if (props.icon instanceof L.Icon) {
        return props.icon;
      }
      if (props.icon instanceof Object) {
        return L.icon(props.icon);
      }
      if (typeof props.icon === "string") {
        const defaults = {
          iconSize: [50, 50],
          iconAnchor: [22, 50],
          popupAnchor: [0, -50]
        };
        return L.icon(__spreadValues({ iconUrl: props.icon }, defaults));
      }
    });
    function updateOptions(marker2) {
      L.setOptions(marker2, clean(options));
      silently(() => {
        marker2._removeIcon();
        marker2._initIcon();
      }, MUTE_ERRORS);
      marker2.update();
    }
    const $layer = inject("layer");
    const $marker = ref();
    provide("marker", $marker);
    provide("layer", $marker);
    const layer = toRaw(get($layer));
    set($marker, L.marker(props.position, clean(options)));
    get($marker).on("click", () => emit("click", get($marker)));
    layer.addLayer(get($marker));
    emit("load", get($marker));
    whenever(position, (position2) => get($marker).setLatLng(position2));
    whenever(icon, (icon2) => silently(() => get($marker).setIcon(icon2), MUTE_ERRORS));
    whenever(options, () => updateOptions(get($marker)), { deep: true, immediate: true });
    whenever(tooltip, (tooltip2) => get(marker).bindTooltip(tooltip2), { deep: true, immediate: true });
    onUnmounted(() => {
      silently(() => {
        get($layer).removeLayer(get($marker));
        get($marker).remove();
      });
    });
    return (_ctx, _cache) => {
      return $marker.value ? (openBlock(), createElementBlock("span", {
        key: 0,
        "data-marker": $marker.value
      }, [
        renderSlot(_ctx.$slots, "default", { marker: $marker.value })
      ], 8, _hoisted_1$1)) : createCommentVNode("", true);
    };
  }
};
function setBouncingState(marker2, value) {
  if (value) {
    marker2.bounce();
  } else {
    marker2.stopBouncing();
  }
}
var Bounceable = {
  async mounted(el, binding, vnode) {
    const marker2 = toRaw(vnode.props["data-marker"]);
    if (!(marker2 instanceof L.Marker)) {
      throw Error("This directive can only be used on markers.");
    }
    if (binding.arg === "options") {
      marker2.setBouncingOptions(binding.value);
      return;
    }
    setBouncingState(marker2, binding.value);
  },
  async updated(el, binding, vnode) {
    const marker2 = toRaw(vnode.props["data-marker"]);
    if (binding.arg === "options") {
      marker2.setBouncingOptions(binding.value);
      return;
    }
    setBouncingState(marker2, binding.value);
  }
};
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
if (document && !document.getElementById("void")) {
  const voidElement = document.createElement("div");
  voidElement.id = "void";
  voidElement.style.width = 0;
  voidElement.style.height = 0;
  voidElement.style.opacity = 0;
  voidElement.style.display = "none";
  document.body.appendChild(voidElement);
}
const _sfc_main$4 = {};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Teleport, { to: "#void" }, [
    renderSlot(_ctx.$slots, "default")
  ]);
}
var Void = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render]]);
const _hoisted_1 = { ref: "popup-content" };
const _sfc_main$3 = {
  __name: "Popup",
  props: {
    position: {
      type: [Object, Array],
      default: void 0
    }
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    [__temp, __restore] = withAsyncContext(() => importLeaflet(inject("leaflet.version"))), await __temp, __restore();
    L.Popup.prototype._animateZoom = function(e) {
      if (!this._map) {
        return;
      }
      const pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
      const anchor = this._getAnchor();
      L.DomUtil.setPosition(this._container, pos.add(anchor));
    };
    if (!window.fixPopupCloseEvent) {
      document.addEventListener("click", (evt) => {
        let target = evt.target;
        while (target != null) {
          if (target.matches('a[href="#close"]')) {
            evt.preventDefault();
            return;
          }
          target = target.parentElement;
        }
      });
      window.fixPopupCloseEvent = true;
    }
    const { position } = toRefs(props);
    const popupContent = templateRef("popup-content");
    const popup = new L.Popup();
    const layer = inject("layer");
    const isMounted = useMounted();
    const isBound = ref(false);
    provide("layer", popup);
    function redraw() {
      if (popup.isOpen()) {
        popup.toggle();
        popup.toggle();
      }
    }
    function bindPopup() {
      if (get(isBound) === true) {
        return;
      }
      get(layer).bindPopup(popup);
      set(isBound, true);
      redraw();
    }
    function hydrateContent(content) {
      var _a;
      if (get(isMounted) === false) {
        return;
      }
      const isStructured = content.firstElementChild instanceof Element;
      if (content.innerHTML.trim().length > 0) {
        popup.setContent(isStructured ? content.firstElementChild : content);
        bindPopup();
      }
      useMutationObserver((_a = content.firstElementChild) != null ? _a : content, () => redraw(), { subtree: true, childList: true, characterData: true });
    }
    whenever(position, (position2) => popup.setLatLng(position2), { immediate: true });
    watch(popupContent, hydrateContent, { immediate: true });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Void, null, {
        default: withCtx(() => [
          createElementVNode("div", _hoisted_1, [
            renderSlot(_ctx.$slots, "default")
          ], 512)
        ]),
        _: 3
      });
    };
  }
};
var Tooltip = renderless({
  props: {
    position: {
      type: [Array, Object],
      required: true
    },
    text: {
      type: String,
      required: true
    },
    direction: {
      type: String,
      default: "auto"
    },
    offset: {
      type: Object,
      default: void 0
    },
    permanent: {
      type: Boolean,
      default: false
    },
    sticky: {
      type: Boolean,
      default: false
    },
    opacity: {
      type: Number,
      default: 0.9
    }
  },
  setup(props) {
    var _a;
    const { position, text } = toRefs(props);
    const options = reactive({
      direction: props.direction,
      offset: (_a = props.offset) != null ? _a : new L.Point(0, 0),
      permanent: props.permanent,
      sticky: props.sticky,
      opacity: props.opacity
    });
    const map = inject("map");
    const mount = (map2) => {
      const tooltip = new L.Tooltip();
      tooltip.setLatLng(props.position).addTo(map2);
      watch(position, (position2) => tooltip.setLatLng(position2));
      watch(text, (text2) => tooltip.setContent(text2), { immediate: true });
      watch(options, (options2) => L.setOptions(tooltip, options2), { immediate: true });
    };
    whenever(map, mount, { immediate: true });
  }
});
var PathProps = {
  color: {
    type: String
  },
  weight: {
    type: Number
  },
  opacity: {
    type: Number
  },
  fillColor: {
    type: String
  }
};
const _sfc_main$2 = {
  __name: "Circle",
  props: __spreadValues({
    center: {
      type: [Array, Object],
      required: true
    },
    radius: {
      type: Number,
      required: true
    }
  }, PathProps),
  setup(__props) {
    const props = __props;
    const {
      center,
      radius,
      color,
      weight,
      opacity,
      fillColor
    } = toRefs(props);
    const stroke = computed(() => props.color != null);
    const fill = computed(() => props.fillColor != null);
    const options = reactive({
      radius,
      stroke,
      color,
      weight,
      opacity,
      fill,
      fillColor
    });
    const map = inject("map");
    const circle = L.circle(props.center, clean(options));
    provide("layer", circle);
    whenever(map, (map2) => map2.addLayer(circle), { immediate: true });
    whenever(options, (options2) => L.setOptions(circle, clean(options2), { deep: true, immediate: true }));
    whenever(center, (position) => circle.setLatLng(position));
    onUnmounted(() => circle.remove());
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default");
    };
  }
};
async function importLeafletGeometryUtil(version = LEAFLET_GEOMETRYUTIL_VERSION) {
  return loadJSFromCDN(`https://unpkg.com/leaflet-geometryutil@${version}/src/leaflet.geometryutil.js`);
}
async function importLeafletArrowHeads(version = LEAFLET_ARROWHEADS_VERSION) {
  await importLeafletGeometryUtil();
  return loadJSFromCDN(`https://unpkg.com/leaflet-arrowheads@${version}/src/leaflet-arrowheads.js`);
}
const _sfc_main$1 = {
  __name: "Polyline",
  props: __spreadValues({
    positions: {
      type: Array,
      required: true
    },
    arrows: {
      type: Object,
      default: void 0
    }
  }, PathProps),
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const {
      positions,
      color,
      weight,
      opacity,
      fillColor
    } = toRefs(props);
    const stroke = computed(() => props.color != null);
    const fill = computed(() => props.fillColor != null);
    const options = reactive({
      stroke,
      color,
      weight,
      opacity,
      fill,
      fillColor
    });
    const map = inject("map");
    const polyline = L.polyline(props.positions, clean(options));
    provide("layer", polyline);
    onUnmounted(() => polyline.remove());
    if (props.arrows) {
      [__temp, __restore] = withAsyncContext(() => importLeafletArrowHeads()), await __temp, __restore();
      polyline.arrowheads(props.arrows);
    }
    whenever(map, (map2) => map2.addLayer(polyline), { immediate: true });
    whenever(options, (options2) => L.setOptions(polyline, clean(options2), { deep: true, immediate: true }));
    whenever(positions, (positions2) => polyline.setLatLngs(positions2));
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default");
    };
  }
};
const _sfc_main = {
  __name: "Polygon",
  props: __spreadValues({
    positions: {
      type: Array,
      required: true
    }
  }, PathProps),
  setup(__props) {
    const props = __props;
    const {
      positions,
      color,
      weight,
      opacity,
      fillColor
    } = toRefs(props);
    const stroke = computed(() => props.color != null);
    const fill = computed(() => props.fillColor != null);
    const options = reactive({
      stroke,
      color,
      weight,
      opacity,
      fill,
      fillColor
    });
    const map = inject("map");
    const polygon = L.polygon(props.positions, clean(options));
    provide("layer", polygon);
    whenever(map, (map2) => map2.addLayer(polygon), { immediate: true });
    whenever(options, (options2) => L.setOptions(polygon, clean(options2), { deep: true, immediate: true }));
    whenever(positions, (positions2) => polygon.setLatLngs(positions2));
    onUnmounted(() => polygon.remove());
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default");
    };
  }
};
var ZoomControl = renderless({
  props: {
    position: {
      type: String,
      default: void 0
    },
    zoomInTitle: {
      type: String,
      default: void 0
    },
    zoomOutTitle: {
      type: String,
      default: void 0
    }
  },
  setup(props) {
    const map = inject("map");
    const control = new L.Control.Zoom(clean(__spreadValues({}, props)));
    const mount = (map2) => {
      var _a;
      (_a = map2 == null ? void 0 : map2.zoomControl) == null ? void 0 : _a.remove();
      map2.addControl(control);
    };
    whenever(map, mount, { immediate: true });
  }
});
var ScaleControl = renderless({
  props: {
    position: {
      type: String,
      default: void 0
    },
    maxWidth: {
      type: Number,
      default: void 0
    },
    imperial: {
      type: Boolean,
      default: void 0
    },
    metric: {
      type: Boolean,
      default: void 0
    }
  },
  async setup(props) {
    const map = inject("map");
    await importLeaflet(inject("leaflet.version"));
    const control = L.control.scale(clean(__spreadValues({}, props)));
    whenever(map, (map2) => map2.addControl(control), { immediate: true });
  }
});
async function importLeafletLocateControl(version = LEAFLET_LOCATE_CONTROL_VERSION) {
  return Promise.all([
    loadCSSFromCDN(`https://unpkg.com/leaflet.locatecontrol@${version}/dist/L.Control.Locate.min.css`),
    loadJSFromCDN(`https://unpkg.com/leaflet.locatecontrol@${version}/dist/L.Control.Locate.min.js`)
  ]);
}
var LocateControl = renderless({
  props: {
    position: {
      type: String,
      default: void 0
    },
    strings: {
      type: Object,
      default: void 0
    },
    version: {
      type: String,
      default: void 0
    }
  },
  async setup(props) {
    const map = inject("map");
    await importLeaflet(inject("leaflet.version"));
    await importLeafletLocateControl(props.version);
    const control = L.control.locate(clean(__spreadValues({}, props)));
    whenever(map, (map2) => map2.addControl(control), { immediate: true });
  }
});
async function importLeafletPegman(version = LEAFLET_PEGMAN_VERSION) {
  return Promise.all([
    loadJSFromCDN(`https://unpkg.com/leaflet-pegman@${version}/leaflet-pegman.js`),
    loadCSSFromCDN(`https://unpkg.com/leaflet-pegman@${version}/leaflet-pegman.css`)
  ]);
}
var PegmanControl = renderless({
  emits: ["openstreetview", "closestreetview"],
  props: {
    apiKey: {
      type: String,
      default: void 0
    },
    position: {
      type: String,
      default: "bottomright"
    },
    theme: {
      type: String,
      default: "leaflet-pegman-v3-small"
    },
    version: {
      type: String,
      default: void 0
    }
  },
  async setup(props, { emit }) {
    const map = inject("map");
    if (props.apiKey) {
      await loadGmapsApi(props.apiKey);
    }
    await importLeaflet();
    await importLeafletPegman(props.version);
    const mount = async (map2) => {
      const control = new L.Control.Pegman({
        position: props.position,
        theme: props.theme
      });
      control.addTo(map2);
      const observer = new MutationObserver((mutationList) => {
        var _a, _b;
        for (const mutation of mutationList) {
          if (mutation.type === "childList") {
            for (const node of mutation.addedNodes) {
              if ((_a = node.classList) == null ? void 0 : _a.contains("pegman-marker")) {
                emit("openstreetview");
              }
            }
            for (const node of mutation.removedNodes) {
              if ((_b = node.classList) == null ? void 0 : _b.contains("pegman-marker")) {
                emit("closestreetview");
              }
            }
          }
        }
      });
      observer.observe(map2._container, { childList: true, subtree: true });
    };
    whenever(map, mount, { immediate: true });
  }
});
var DrawControl = renderless({
  props: {
    locale: {
      type: String,
      default: "en"
    },
    onlyOneShape: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: "topright"
    },
    drawControls: {
      type: Boolean,
      default: true
    },
    editControls: {
      type: Boolean,
      default: false
    },
    drawPolygon: {
      type: Boolean,
      default: false
    },
    drawCircle: {
      type: Boolean,
      default: false
    },
    drawPolyline: {
      type: Boolean,
      default: false
    },
    drawRectangle: {
      type: Boolean,
      default: false
    },
    drawMarker: {
      type: Boolean,
      default: false
    },
    drawCircleMarker: {
      type: Boolean,
      default: false
    },
    drawText: {
      type: Boolean,
      default: false
    },
    version: {
      type: String,
      default: void 0
    }
  },
  emits: ["drawstart", "drawend", "cancel"],
  async setup(props, { emit }) {
    const map = inject("map");
    const init = (map2) => {
      map2.pm.addControls(__spreadValues({}, props));
      map2.pm.enableGlobalEditMode();
      map2.pm.enableGlobalRemovalMode();
      map2.pm.setLang(props.locale);
      const layers = L.featureGroup();
      layers.last = function() {
        return this.getLayers()[this.getLayers().length - 1];
      };
      if (props.onlyOneShape) {
        map2.on("pm:create", (e) => e.layer.addTo(layers));
        map2.on("pm:drawstart", () => {
          layers.eachLayer((layer) => layer.removeFrom(map2));
          layers.clearLayers();
        });
      }
      map2.on("pm:drawstart", () => emit("drawstart"));
      map2.on("pm:drawend", async (e) => {
        await nextTick();
        const layer = layers.last();
        if (layer === void 0) {
          emit("cancel");
          return;
        }
        if (layers.last() instanceof L.CircleMarker) {
          emit("drawend", {
            shape: e.shape,
            center: layer.getLatLng(),
            radius: layer.getRadius()
          });
        } else {
          emit("drawend", {
            shape: e.shape,
            bounds: layer.getLatLngs()
          });
        }
      });
    };
    whenever(map, init, { immediate: true });
  }
});
export { _sfc_main$2 as Circle, _sfc_main$6 as Cluster, DrawControl, _sfc_main$7 as GoogleMaps, LocateControl, _sfc_main$a as MapContainer, _sfc_main$8 as Mapbox, _sfc_main$5 as Marker, _sfc_main$9 as OpenStreetMap, PegmanControl, _sfc_main as Polygon, _sfc_main$1 as Polyline, _sfc_main$3 as Popup, ScaleControl, Tooltip, ZoomControl, Bounceable as vBounce };
