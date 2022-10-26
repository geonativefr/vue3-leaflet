var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import { toRefs, reactive, ref, onMounted, provide, watch, openBlock, createElementBlock, renderSlot, createCommentVNode, inject, unref, computed, onUnmounted, createElementVNode } from "vue";
import L$1, { LatLng, Map, Icon, Marker, Popup, Tooltip as Tooltip$1, Control } from "leaflet";
import { templateRef, get, whenever, set, useMounted } from "@vueuse/core";
import "leaflet.gridlayer.googlemutant/dist/Leaflet.GoogleMutant.js";
import "leaflet.smooth_marker_bouncing";
import "leaflet-pegman";
const _sfc_main$5 = {
  __name: "MapContainer",
  props: {
    center: {
      type: [LatLng, Array, Object],
      default: () => new LatLng(0, 0)
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
    }
  },
  emits: ["ready", "move", "zoomend"],
  setup(__props, { emit }) {
    const props = __props;
    const { center, zoom, zoomControl, bounds, scrollWheelZoom } = toRefs(props);
    const options = reactive({
      scrollWheelZoom
    });
    const container = templateRef("container");
    const mapRef = ref();
    function fitBounds(map, bounds2) {
      if (bounds2.length > 0) {
        map.fitBounds(bounds2);
      }
    }
    onMounted(() => {
      const map = new Map(get(container), options);
      map.setView(props.center, props.zoom);
      provide("map", map);
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
      return openBlock(), createElementBlock("div", {
        ref_key: "container",
        ref: container
      }, [
        mapRef.value ? renderSlot(_ctx.$slots, "default", {
          key: 0,
          map: mapRef.value
        }) : createCommentVNode("", true)
      ], 512);
    };
  }
};
const _sfc_main$4 = {
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
    const map = ref(inject("map"));
    const layer = L$1.tileLayer(props.url, {
      attribution: props.attribution
    });
    provide("layer", layer);
    whenever(map, (map2) => map2.addLayer(layer), { immediate: true });
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default");
    };
  }
};
const _sfc_main$3 = {
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
  setup(__props) {
    const props = __props;
    const map = ref(inject("map"));
    const options = reactive({
      apiKey: props.apiKey,
      attribution: props.attribution,
      tileSize: props.tileSize,
      zoomOffset: props.zoomOffset
    });
    const layer = L$1.tileLayer(props.url, options);
    provide("layer", layer);
    whenever(map, (map2) => map2.addLayer(layer), { immediate: true });
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default");
    };
  }
};
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
      window.L = L$1;
      resolve(true);
    });
    document.head.appendChild(el);
  });
  return window.gmapsApi;
}
const _sfc_main$2 = {
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
    }
  },
  setup(__props) {
    const props = __props;
    const { type } = toRefs(props);
    const defaultOptions = reactive({ type });
    const useGoogleMutant = (GOOGLE_MAPS_API_KEY) => {
      const mount = (map2, options2) => L$1.gridLayer.googleMutant(options2).addTo(map2);
      const load = async (map2, options2 = defaultOptions) => {
        await loadGmapsApi(GOOGLE_MAPS_API_KEY);
        mount(map2, options2);
      };
      return { load };
    };
    const map = ref(inject("map"));
    const options = reactive({
      apiKey: props.apiKey,
      attribution: props.attribution,
      tileSize: props.tileSize,
      zoomOffset: props.zoomOffset
    });
    const layer = L$1.tileLayer(props.url, options);
    const gmaps = useGoogleMutant(props.apiKey);
    const mutant = ref();
    whenever(mutant, (mutant2, oldMutant) => oldMutant == null ? void 0 : oldMutant.remove());
    watch(type, () => setMutant(unref(map)));
    async function setMutant(map2) {
      set(mutant, await gmaps.load(map2, defaultOptions));
    }
    provide("layer", layer);
    whenever(map, (map2) => setMutant(map2), { immediate: true });
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default");
    };
  }
};
const _sfc_main$1 = {
  __name: "Marker",
  props: {
    position: {
      type: [LatLng, Array, Object],
      required: true
    },
    icon: {
      type: [String, Object, Icon],
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
      type: String,
      default: void 0
    },
    bounce: {
      type: [Boolean, Number],
      default: false
    },
    bounceHeight: {
      type: Number,
      default: void 0
    },
    contractHeight: {
      type: Number,
      default: void 0
    },
    bounceSpeed: {
      type: Number,
      default: void 0
    },
    contractSpeed: {
      type: Number,
      default: void 0
    },
    shadowAngle: {
      type: Number,
      default: void 0
    },
    elastic: {
      type: Boolean,
      default: void 0
    },
    exclusive: {
      type: Boolean,
      default: void 0
    }
  },
  emits: ["click", "bounceend"],
  setup(__props, { emit }) {
    const props = __props;
    Marker.prototype._animateZoom = function(opt) {
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
      bounce,
      bounceHeight,
      contractHeight,
      bounceSpeed,
      contractSpeed,
      shadowAngle,
      elastic,
      exclusive
    } = toRefs(props);
    const options = reactive({
      title,
      alt,
      opacity
    });
    const icon = computed(() => {
      if (props.icon instanceof Icon) {
        return props.icon;
      }
      if (props.icon instanceof Object) {
        return L$1.icon(props.icon);
      }
      if (typeof props.icon === "string") {
        const defaults = {
          iconSize: [50, 50],
          iconAnchor: [22, 50],
          popupAnchor: [0, -50]
        };
        return L$1.icon(__spreadValues({ iconUrl: props.icon }, defaults));
      }
    });
    const bouncingOptions = reactive({
      bounceHeight,
      contractHeight,
      bounceSpeed,
      contractSpeed,
      shadowAngle,
      elastic,
      exclusive
    });
    const map = ref(inject("map"));
    const marker = L$1.marker(props.position, clean(options));
    provide("layer", marker);
    marker.on("click", () => emit("click", marker));
    marker.on("bounceend", () => emit("bounceend"));
    function doBounce(marker2, value) {
      if (typeof value === "boolean") {
        value ? marker2.bounce() : marker2.stopBouncing();
        return;
      }
      marker2.bounce(value);
    }
    function updateOptions(marker2) {
      L$1.setOptions(marker2, clean(options));
      marker2._removeIcon();
      marker2._initIcon();
      marker2.update();
    }
    whenever(map, (map2) => map2.addLayer(marker), { immediate: true });
    whenever(position, (position2) => marker.setLatLng(position2));
    whenever(icon, (icon2) => marker.setIcon(icon2), { deep: true, immediate: true });
    whenever(options, () => updateOptions(marker), { deep: true, immediate: true });
    whenever(bouncingOptions, (bouncingOptions2) => marker.setBouncingOptions(clean(bouncingOptions2)), { deep: true, immediate: true });
    watch(bounce, (value) => doBounce(marker, value), { immediate: true });
    onUnmounted(() => marker.remove());
    return (_ctx, _cache) => {
      return renderSlot(_ctx.$slots, "default", { marker: unref(marker) });
    };
  }
};
const _hoisted_1 = { style: { "opacity": "0" } };
const _hoisted_2 = {
  ref: "popup-content",
  id: "popup-container"
};
const _sfc_main = {
  __name: "Popup",
  props: {
    position: {
      type: LatLng,
      default: void 0
    }
  },
  setup(__props) {
    const props = __props;
    Popup.prototype._animateZoom = function(e) {
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
    const popup = new Popup();
    const layer = inject("layer");
    const isMounted = useMounted();
    const isBound = ref(false);
    provide("layer", popup);
    function bindPopup() {
      if (get(isBound) === true) {
        return;
      }
      get(layer).bindPopup(popup);
      set(isBound, true);
    }
    function hydrateContent(content) {
      if (get(isMounted) === false) {
        return;
      }
      const isStructured = content.firstElementChild instanceof Element;
      if (content.innerHTML.trim().length > 0) {
        popup.setContent(isStructured ? content.firstElementChild : content);
        bindPopup();
      }
    }
    whenever(position, (position2) => popup.setLatLng(position2), { immediate: true });
    watch(popupContent, hydrateContent, { immediate: true });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createElementVNode("div", _hoisted_2, [
          renderSlot(_ctx.$slots, "default")
        ], 512)
      ]);
    };
  }
};
function formatNum(num, precision) {
  if (precision === false) {
    return num;
  }
  var pow = Math.pow(10, precision === void 0 ? 6 : precision);
  return Math.round(num * pow) / pow;
}
var isArray = Array.isArray || function(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
};
function Point(x, y, round) {
  this.x = round ? Math.round(x) : x;
  this.y = round ? Math.round(y) : y;
}
var trunc = Math.trunc || function(v) {
  return v > 0 ? Math.floor(v) : Math.ceil(v);
};
Point.prototype = {
  clone: function() {
    return new Point(this.x, this.y);
  },
  add: function(point) {
    return this.clone()._add(toPoint(point));
  },
  _add: function(point) {
    this.x += point.x;
    this.y += point.y;
    return this;
  },
  subtract: function(point) {
    return this.clone()._subtract(toPoint(point));
  },
  _subtract: function(point) {
    this.x -= point.x;
    this.y -= point.y;
    return this;
  },
  divideBy: function(num) {
    return this.clone()._divideBy(num);
  },
  _divideBy: function(num) {
    this.x /= num;
    this.y /= num;
    return this;
  },
  multiplyBy: function(num) {
    return this.clone()._multiplyBy(num);
  },
  _multiplyBy: function(num) {
    this.x *= num;
    this.y *= num;
    return this;
  },
  scaleBy: function(point) {
    return new Point(this.x * point.x, this.y * point.y);
  },
  unscaleBy: function(point) {
    return new Point(this.x / point.x, this.y / point.y);
  },
  round: function() {
    return this.clone()._round();
  },
  _round: function() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  },
  floor: function() {
    return this.clone()._floor();
  },
  _floor: function() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  },
  ceil: function() {
    return this.clone()._ceil();
  },
  _ceil: function() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  },
  trunc: function() {
    return this.clone()._trunc();
  },
  _trunc: function() {
    this.x = trunc(this.x);
    this.y = trunc(this.y);
    return this;
  },
  distanceTo: function(point) {
    point = toPoint(point);
    var x = point.x - this.x, y = point.y - this.y;
    return Math.sqrt(x * x + y * y);
  },
  equals: function(point) {
    point = toPoint(point);
    return point.x === this.x && point.y === this.y;
  },
  contains: function(point) {
    point = toPoint(point);
    return Math.abs(point.x) <= Math.abs(this.x) && Math.abs(point.y) <= Math.abs(this.y);
  },
  toString: function() {
    return "Point(" + formatNum(this.x) + ", " + formatNum(this.y) + ")";
  }
};
function toPoint(x, y, round) {
  if (x instanceof Point) {
    return x;
  }
  if (isArray(x)) {
    return new Point(x[0], x[1]);
  }
  if (x === void 0 || x === null) {
    return x;
  }
  if (typeof x === "object" && "x" in x && "y" in x) {
    return new Point(x.x, x.y);
  }
  return new Point(x, y, round);
}
var Tooltip = renderless({
  props: {
    position: {
      type: LatLng,
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
      type: Point,
      default: () => new Point(0, 0)
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
    const { position, text } = toRefs(props);
    const options = reactive({
      direction: props.direction,
      offset: props.offset,
      permanent: props.permanent,
      sticky: props.sticky,
      opacity: props.opacity
    });
    const map = inject("map");
    const tooltip = new Tooltip$1();
    tooltip.setLatLng(props.position).addTo(map);
    watch(position, (position2) => tooltip.setLatLng(position2));
    watch(text, (text2) => tooltip.setContent(text2), { immediate: true });
    watch(options, (options2) => L$1.setOptions(tooltip, options2), { immediate: true });
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
var Circle = renderless({
  props: __spreadValues({
    center: {
      type: [LatLng, Array, Object],
      required: true
    },
    radius: {
      type: Number,
      required: true
    }
  }, PathProps),
  setup(props) {
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
    const map = ref(inject("map"));
    const circle = L$1.circle(props.center, clean(options));
    provide("layer", circle);
    whenever(map, (map2) => map2.addLayer(circle), { immediate: true });
    whenever(options, (options2) => L$1.setOptions(circle, clean(options2), { deep: true, immediate: true }));
    whenever(center, (position) => circle.setLatLng(position));
    onUnmounted(() => circle.remove());
  }
});
var leaflet_geometryutil = { exports: {} };
(function(module) {
  (function(factory) {
    var L2;
    {
      L2 = L$1;
      module.exports = factory(L2);
    }
  })(function(L2) {
    L2.Polyline._flat = L2.LineUtil.isFlat || L2.Polyline._flat || function(latlngs) {
      return !L2.Util.isArray(latlngs[0]) || typeof latlngs[0][0] !== "object" && typeof latlngs[0][0] !== "undefined";
    };
    L2.GeometryUtil = L2.extend(L2.GeometryUtil || {}, {
      distance: function(map, latlngA, latlngB) {
        return map.latLngToLayerPoint(latlngA).distanceTo(map.latLngToLayerPoint(latlngB));
      },
      distanceSegment: function(map, latlng, latlngA, latlngB) {
        var p = map.latLngToLayerPoint(latlng), p1 = map.latLngToLayerPoint(latlngA), p2 = map.latLngToLayerPoint(latlngB);
        return L2.LineUtil.pointToSegmentDistance(p, p1, p2);
      },
      readableDistance: function(distance, unit) {
        var isMetric = unit !== "imperial", distanceStr;
        if (isMetric) {
          if (distance > 1e3) {
            distanceStr = (distance / 1e3).toFixed(2) + " km";
          } else {
            distanceStr = distance.toFixed(1) + " m";
          }
        } else {
          distance *= 1.09361;
          if (distance > 1760) {
            distanceStr = (distance / 1760).toFixed(2) + " miles";
          } else {
            distanceStr = distance.toFixed(1) + " yd";
          }
        }
        return distanceStr;
      },
      belongsSegment: function(latlng, latlngA, latlngB, tolerance) {
        tolerance = tolerance === void 0 ? 0.2 : tolerance;
        var hypotenuse = latlngA.distanceTo(latlngB), delta = latlngA.distanceTo(latlng) + latlng.distanceTo(latlngB) - hypotenuse;
        return delta / hypotenuse < tolerance;
      },
      length: function(coords) {
        var accumulated = L2.GeometryUtil.accumulatedLengths(coords);
        return accumulated.length > 0 ? accumulated[accumulated.length - 1] : 0;
      },
      accumulatedLengths: function(coords) {
        if (typeof coords.getLatLngs == "function") {
          coords = coords.getLatLngs();
        }
        if (coords.length === 0)
          return [];
        var total = 0, lengths = [0];
        for (var i = 0, n = coords.length - 1; i < n; i++) {
          total += coords[i].distanceTo(coords[i + 1]);
          lengths.push(total);
        }
        return lengths;
      },
      closestOnSegment: function(map, latlng, latlngA, latlngB) {
        var maxzoom = map.getMaxZoom();
        if (maxzoom === Infinity)
          maxzoom = map.getZoom();
        var p = map.project(latlng, maxzoom), p1 = map.project(latlngA, maxzoom), p2 = map.project(latlngB, maxzoom), closest = L2.LineUtil.closestPointOnSegment(p, p1, p2);
        return map.unproject(closest, maxzoom);
      },
      closest: function(map, layer, latlng, vertices) {
        var latlngs, mindist = Infinity, result = null, i, n, distance, subResult;
        if (layer instanceof Array) {
          if (layer[0] instanceof Array && typeof layer[0][0] !== "number") {
            for (i = 0; i < layer.length; i++) {
              subResult = L2.GeometryUtil.closest(map, layer[i], latlng, vertices);
              if (subResult && subResult.distance < mindist) {
                mindist = subResult.distance;
                result = subResult;
              }
            }
            return result;
          } else if (layer[0] instanceof L2.LatLng || typeof layer[0][0] === "number" || typeof layer[0].lat === "number") {
            layer = L2.polyline(layer);
          } else {
            return result;
          }
        }
        if (!(layer instanceof L2.Polyline))
          return result;
        latlngs = JSON.parse(JSON.stringify(layer.getLatLngs().slice(0)));
        if (layer instanceof L2.Polygon) {
          var addLastSegment = function(latlngs2) {
            if (L2.Polyline._flat(latlngs2)) {
              latlngs2.push(latlngs2[0]);
            } else {
              for (var i2 = 0; i2 < latlngs2.length; i2++) {
                addLastSegment(latlngs2[i2]);
              }
            }
          };
          addLastSegment(latlngs);
        }
        if (!L2.Polyline._flat(latlngs)) {
          for (i = 0; i < latlngs.length; i++) {
            subResult = L2.GeometryUtil.closest(map, latlngs[i], latlng, vertices);
            if (subResult.distance < mindist) {
              mindist = subResult.distance;
              result = subResult;
            }
          }
          return result;
        } else {
          if (vertices) {
            for (i = 0, n = latlngs.length; i < n; i++) {
              var ll = latlngs[i];
              distance = L2.GeometryUtil.distance(map, latlng, ll);
              if (distance < mindist) {
                mindist = distance;
                result = ll;
                result.distance = distance;
              }
            }
            return result;
          }
          for (i = 0, n = latlngs.length; i < n - 1; i++) {
            var latlngA = latlngs[i], latlngB = latlngs[i + 1];
            distance = L2.GeometryUtil.distanceSegment(map, latlng, latlngA, latlngB);
            if (distance <= mindist) {
              mindist = distance;
              result = L2.GeometryUtil.closestOnSegment(map, latlng, latlngA, latlngB);
              result.distance = distance;
            }
          }
          return result;
        }
      },
      closestLayer: function(map, layers, latlng) {
        var mindist = Infinity, result = null, ll = null, distance = Infinity;
        for (var i = 0, n = layers.length; i < n; i++) {
          var layer = layers[i];
          if (layer instanceof L2.LayerGroup) {
            var subResult = L2.GeometryUtil.closestLayer(map, layer.getLayers(), latlng);
            if (subResult.distance < mindist) {
              mindist = subResult.distance;
              result = subResult;
            }
          } else {
            if (typeof layer.getLatLng == "function") {
              ll = layer.getLatLng();
              distance = L2.GeometryUtil.distance(map, latlng, ll);
            } else {
              ll = L2.GeometryUtil.closest(map, layer, latlng);
              if (ll)
                distance = ll.distance;
            }
            if (distance < mindist) {
              mindist = distance;
              result = { layer, latlng: ll, distance };
            }
          }
        }
        return result;
      },
      nClosestLayers: function(map, layers, latlng, n) {
        n = typeof n === "number" ? n : layers.length;
        if (n < 1 || layers.length < 1) {
          return null;
        }
        var results = [];
        var distance, ll;
        for (var i = 0, m = layers.length; i < m; i++) {
          var layer = layers[i];
          if (layer instanceof L2.LayerGroup) {
            var subResult = L2.GeometryUtil.closestLayer(map, layer.getLayers(), latlng);
            results.push(subResult);
          } else {
            if (typeof layer.getLatLng == "function") {
              ll = layer.getLatLng();
              distance = L2.GeometryUtil.distance(map, latlng, ll);
            } else {
              ll = L2.GeometryUtil.closest(map, layer, latlng);
              if (ll)
                distance = ll.distance;
            }
            results.push({ layer, latlng: ll, distance });
          }
        }
        results.sort(function(a, b) {
          return a.distance - b.distance;
        });
        if (results.length > n) {
          return results.slice(0, n);
        } else {
          return results;
        }
      },
      layersWithin: function(map, layers, latlng, radius) {
        radius = typeof radius == "number" ? radius : Infinity;
        var results = [];
        var ll = null;
        var distance = 0;
        for (var i = 0, n = layers.length; i < n; i++) {
          var layer = layers[i];
          if (typeof layer.getLatLng == "function") {
            ll = layer.getLatLng();
            distance = L2.GeometryUtil.distance(map, latlng, ll);
          } else {
            ll = L2.GeometryUtil.closest(map, layer, latlng);
            if (ll)
              distance = ll.distance;
          }
          if (ll && distance < radius) {
            results.push({ layer, latlng: ll, distance });
          }
        }
        var sortedResults = results.sort(function(a, b) {
          return a.distance - b.distance;
        });
        return sortedResults;
      },
      closestLayerSnap: function(map, layers, latlng, tolerance, withVertices) {
        tolerance = typeof tolerance == "number" ? tolerance : Infinity;
        withVertices = typeof withVertices == "boolean" ? withVertices : true;
        var result = L2.GeometryUtil.closestLayer(map, layers, latlng);
        if (!result || result.distance > tolerance)
          return null;
        if (withVertices && typeof result.layer.getLatLngs == "function") {
          var closest = L2.GeometryUtil.closest(map, result.layer, result.latlng, true);
          if (closest.distance < tolerance) {
            result.latlng = closest;
            result.distance = L2.GeometryUtil.distance(map, closest, latlng);
          }
        }
        return result;
      },
      interpolateOnPointSegment: function(pA, pB, ratio) {
        return L2.point(pA.x * (1 - ratio) + ratio * pB.x, pA.y * (1 - ratio) + ratio * pB.y);
      },
      interpolateOnLine: function(map, latLngs, ratio) {
        latLngs = latLngs instanceof L2.Polyline ? latLngs.getLatLngs() : latLngs;
        var n = latLngs.length;
        if (n < 2) {
          return null;
        }
        ratio = Math.max(Math.min(ratio, 1), 0);
        if (ratio === 0) {
          return {
            latLng: latLngs[0] instanceof L2.LatLng ? latLngs[0] : L2.latLng(latLngs[0]),
            predecessor: -1
          };
        }
        if (ratio == 1) {
          return {
            latLng: latLngs[latLngs.length - 1] instanceof L2.LatLng ? latLngs[latLngs.length - 1] : L2.latLng(latLngs[latLngs.length - 1]),
            predecessor: latLngs.length - 2
          };
        }
        var maxzoom = map.getMaxZoom();
        if (maxzoom === Infinity)
          maxzoom = map.getZoom();
        var pts = [];
        var lineLength = 0;
        for (var i = 0; i < n; i++) {
          pts[i] = map.project(latLngs[i], maxzoom);
          if (i > 0)
            lineLength += pts[i - 1].distanceTo(pts[i]);
        }
        var ratioDist = lineLength * ratio;
        var cumulativeDistanceToA = 0, cumulativeDistanceToB = 0;
        for (var i = 0; cumulativeDistanceToB < ratioDist; i++) {
          var pointA = pts[i], pointB = pts[i + 1];
          cumulativeDistanceToA = cumulativeDistanceToB;
          cumulativeDistanceToB += pointA.distanceTo(pointB);
        }
        if (pointA == void 0 && pointB == void 0) {
          var pointA = pts[0], pointB = pts[1], i = 1;
        }
        var segmentRatio = cumulativeDistanceToB - cumulativeDistanceToA !== 0 ? (ratioDist - cumulativeDistanceToA) / (cumulativeDistanceToB - cumulativeDistanceToA) : 0;
        var interpolatedPoint = L2.GeometryUtil.interpolateOnPointSegment(pointA, pointB, segmentRatio);
        return {
          latLng: map.unproject(interpolatedPoint, maxzoom),
          predecessor: i - 1
        };
      },
      locateOnLine: function(map, polyline, latlng) {
        var latlngs = polyline.getLatLngs();
        if (latlng.equals(latlngs[0]))
          return 0;
        if (latlng.equals(latlngs[latlngs.length - 1]))
          return 1;
        var point = L2.GeometryUtil.closest(map, polyline, latlng, false), lengths = L2.GeometryUtil.accumulatedLengths(latlngs), total_length = lengths[lengths.length - 1], portion = 0, found = false;
        for (var i = 0, n = latlngs.length - 1; i < n; i++) {
          var l1 = latlngs[i], l2 = latlngs[i + 1];
          portion = lengths[i];
          if (L2.GeometryUtil.belongsSegment(point, l1, l2, 1e-3)) {
            portion += l1.distanceTo(point);
            found = true;
            break;
          }
        }
        if (!found) {
          throw "Could not interpolate " + latlng.toString() + " within " + polyline.toString();
        }
        return portion / total_length;
      },
      reverse: function(polyline) {
        return L2.polyline(polyline.getLatLngs().slice(0).reverse());
      },
      extract: function(map, polyline, start, end) {
        if (start > end) {
          return L2.GeometryUtil.extract(map, L2.GeometryUtil.reverse(polyline), 1 - start, 1 - end);
        }
        start = Math.max(Math.min(start, 1), 0);
        end = Math.max(Math.min(end, 1), 0);
        var latlngs = polyline.getLatLngs(), startpoint = L2.GeometryUtil.interpolateOnLine(map, polyline, start), endpoint = L2.GeometryUtil.interpolateOnLine(map, polyline, end);
        if (start == end) {
          var point = L2.GeometryUtil.interpolateOnLine(map, polyline, end);
          return [point.latLng];
        }
        if (startpoint.predecessor == -1)
          startpoint.predecessor = 0;
        if (endpoint.predecessor == -1)
          endpoint.predecessor = 0;
        var result = latlngs.slice(startpoint.predecessor + 1, endpoint.predecessor + 1);
        result.unshift(startpoint.latLng);
        result.push(endpoint.latLng);
        return result;
      },
      isBefore: function(polyline, other) {
        if (!other)
          return false;
        var lla = polyline.getLatLngs(), llb = other.getLatLngs();
        return lla[lla.length - 1].equals(llb[0]);
      },
      isAfter: function(polyline, other) {
        if (!other)
          return false;
        var lla = polyline.getLatLngs(), llb = other.getLatLngs();
        return lla[0].equals(llb[llb.length - 1]);
      },
      startsAtExtremity: function(polyline, other) {
        if (!other)
          return false;
        var lla = polyline.getLatLngs(), llb = other.getLatLngs(), start = lla[0];
        return start.equals(llb[0]) || start.equals(llb[llb.length - 1]);
      },
      computeAngle: function(a, b) {
        return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      },
      computeSlope: function(a, b) {
        var s = (b.y - a.y) / (b.x - a.x), o = a.y - s * a.x;
        return { "a": s, "b": o };
      },
      rotatePoint: function(map, latlngPoint, angleDeg, latlngCenter) {
        var maxzoom = map.getMaxZoom();
        if (maxzoom === Infinity)
          maxzoom = map.getZoom();
        var angleRad = angleDeg * Math.PI / 180, pPoint = map.project(latlngPoint, maxzoom), pCenter = map.project(latlngCenter, maxzoom), x2 = Math.cos(angleRad) * (pPoint.x - pCenter.x) - Math.sin(angleRad) * (pPoint.y - pCenter.y) + pCenter.x, y2 = Math.sin(angleRad) * (pPoint.x - pCenter.x) + Math.cos(angleRad) * (pPoint.y - pCenter.y) + pCenter.y;
        return map.unproject(new L2.Point(x2, y2), maxzoom);
      },
      bearing: function(latlng1, latlng2) {
        var rad = Math.PI / 180, lat1 = latlng1.lat * rad, lat2 = latlng2.lat * rad, lon1 = latlng1.lng * rad, lon2 = latlng2.lng * rad, y = Math.sin(lon2 - lon1) * Math.cos(lat2), x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
        var bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
        return bearing >= 180 ? bearing - 360 : bearing;
      },
      destination: function(latlng, heading, distance) {
        heading = (heading + 360) % 360;
        var rad = Math.PI / 180, radInv = 180 / Math.PI, R = 6378137, lon1 = latlng.lng * rad, lat1 = latlng.lat * rad, rheading = heading * rad, sinLat1 = Math.sin(lat1), cosLat1 = Math.cos(lat1), cosDistR = Math.cos(distance / R), sinDistR = Math.sin(distance / R), lat2 = Math.asin(sinLat1 * cosDistR + cosLat1 * sinDistR * Math.cos(rheading)), lon2 = lon1 + Math.atan2(Math.sin(rheading) * sinDistR * cosLat1, cosDistR - sinLat1 * Math.sin(lat2));
        lon2 = lon2 * radInv;
        lon2 = lon2 > 180 ? lon2 - 360 : lon2 < -180 ? lon2 + 360 : lon2;
        return L2.latLng([lat2 * radInv, lon2]);
      },
      angle: function(map, latlngA, latlngB) {
        var pointA = map.latLngToContainerPoint(latlngA), pointB = map.latLngToContainerPoint(latlngB), angleDeg = Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) * 180 / Math.PI + 90;
        angleDeg += angleDeg < 0 ? 360 : 0;
        return angleDeg;
      },
      destinationOnSegment: function(map, latlngA, latlngB, distance) {
        var angleDeg = L2.GeometryUtil.angle(map, latlngA, latlngB), latlng = L2.GeometryUtil.destination(latlngA, angleDeg, distance);
        return L2.GeometryUtil.closestOnSegment(map, latlng, latlngA, latlngB);
      }
    });
    return L2.GeometryUtil;
  });
})(leaflet_geometryutil);
function modulus(i, n) {
  return (i % n + n) % n;
}
function definedProps(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v !== void 0));
}
function isInMeters(value) {
  return value.toString().trim().slice(value.toString().length - 1, value.toString().length) === "m";
}
function isInPercent(value) {
  return value.toString().trim().slice(value.toString().length - 1, value.toString().length) === "%";
}
function isInPixels(value) {
  return value.toString().trim().slice(value.toString().length - 2, value.toString().length) === "px";
}
function pixelsToMeters(pixels, map) {
  let refPoint1 = map.getCenter();
  let xy1 = map.latLngToLayerPoint(refPoint1);
  let xy2 = {
    x: xy1.x + Number(pixels),
    y: xy1.y
  };
  let refPoint2 = map.layerPointToLatLng(xy2);
  let derivedMeters = map.distance(refPoint1, refPoint2);
  return derivedMeters;
}
L.Polyline.include({
  arrowheads: function(options = {}) {
    const defaults = {
      yawn: 60,
      size: "15%",
      frequency: "allvertices",
      proportionalToTotal: false
    };
    this.options.noClip = true;
    let actualOptions = Object.assign({}, defaults, options);
    this._arrowheadOptions = actualOptions;
    this._hatsApplied = true;
    return this;
  },
  buildVectorHats: function(options) {
    if (this._arrowheads) {
      this._arrowheads.remove();
    }
    if (this._ghosts) {
      this._ghosts.remove();
    }
    let defaultOptionsOfParent = Object.getPrototypeOf(Object.getPrototypeOf(this.options));
    let parentOptions = Object.assign({}, defaultOptionsOfParent, this.options);
    let hatOptions = Object.assign({}, parentOptions, options);
    hatOptions.smoothFactor = 1;
    hatOptions.fillOpacity = 1;
    hatOptions.fill = options.fill ? true : false;
    hatOptions.interactive = false;
    let size = options.size.toString();
    let allhats = [];
    const { frequency, offsets } = options;
    if ((offsets == null ? void 0 : offsets.start) || (offsets == null ? void 0 : offsets.end)) {
      this._buildGhosts({ start: offsets.start, end: offsets.end });
    }
    const lineToTrace = this._ghosts || this;
    lineToTrace._parts.forEach((peice, index) => {
      var _b;
      const latlngs = peice.map((point) => this._map.layerPointToLatLng(point));
      const totalLength = (() => {
        let total = 0;
        for (var i2 = 0; i2 < peice.length - 1; i2++) {
          total += this._map.distance(latlngs[i2], latlngs[i2 + 1]);
        }
        return total;
      })();
      let derivedLatLngs;
      let derivedBearings;
      let spacing;
      let noOfPoints;
      if (!isNaN(frequency)) {
        spacing = 1 / frequency;
        noOfPoints = frequency;
      } else if (isInPercent(frequency)) {
        console.error("Error: arrowhead frequency option cannot be given in percent.  Try another unit.");
      } else if (isInMeters(frequency)) {
        spacing = frequency.slice(0, frequency.length - 1) / totalLength;
        noOfPoints = 1 / spacing;
        noOfPoints = Math.floor(noOfPoints);
        spacing = 1 / noOfPoints;
      } else if (isInPixels(frequency)) {
        spacing = (() => {
          let chosenFrequency = frequency.slice(0, frequency.length - 2);
          let derivedMeters = pixelsToMeters(chosenFrequency, this._map);
          return derivedMeters / totalLength;
        })();
        noOfPoints = 1 / spacing;
        noOfPoints = Math.floor(noOfPoints);
        spacing = 1 / noOfPoints;
      }
      if (options.frequency === "allvertices") {
        derivedBearings = (() => {
          let bearings = [];
          for (var i2 = 1; i2 < latlngs.length; i2++) {
            let bearing = L.GeometryUtil.angle(this._map, latlngs[modulus(i2 - 1, latlngs.length)], latlngs[i2]) + 180;
            bearings.push(bearing);
          }
          return bearings;
        })();
        derivedLatLngs = latlngs;
        derivedLatLngs.shift();
      } else if (options.frequency === "endonly" && latlngs.length >= 2) {
        derivedLatLngs = [latlngs[latlngs.length - 1]];
        derivedBearings = [
          L.GeometryUtil.angle(this._map, latlngs[latlngs.length - 2], latlngs[latlngs.length - 1]) + 180
        ];
      } else {
        derivedLatLngs = [];
        let interpolatedPoints = [];
        for (var i = 0; i < noOfPoints; i++) {
          let interpolatedPoint = L.GeometryUtil.interpolateOnLine(this._map, latlngs, spacing * (i + 1));
          if (interpolatedPoint) {
            interpolatedPoints.push(interpolatedPoint);
            derivedLatLngs.push(interpolatedPoint.latLng);
          }
        }
        derivedBearings = (() => {
          let bearings = [];
          for (var i2 = 0; i2 < interpolatedPoints.length; i2++) {
            let bearing = L.GeometryUtil.angle(this._map, latlngs[interpolatedPoints[i2].predecessor + 1], latlngs[interpolatedPoints[i2].predecessor]);
            bearings.push(bearing);
          }
          return bearings;
        })();
      }
      let hats = [];
      const pushHats = (size2, localHatOptions = {}) => {
        var _a2;
        let yawn = (_a2 = localHatOptions.yawn) != null ? _a2 : options.yawn;
        let leftWingPoint = L.GeometryUtil.destination(derivedLatLngs[i], derivedBearings[i] - yawn / 2, size2);
        let rightWingPoint = L.GeometryUtil.destination(derivedLatLngs[i], derivedBearings[i] + yawn / 2, size2);
        let hatPoints = [
          [leftWingPoint.lat, leftWingPoint.lng],
          [derivedLatLngs[i].lat, derivedLatLngs[i].lng],
          [rightWingPoint.lat, rightWingPoint.lng]
        ];
        let hat = options.fill ? L.polygon(hatPoints, __spreadValues(__spreadValues({}, hatOptions), localHatOptions)) : L.polyline(hatPoints, __spreadValues(__spreadValues({}, hatOptions), localHatOptions));
        hats.push(hat);
      };
      const pushHatsFromPixels = (size2, localHatOptions = {}) => {
        var _a2;
        let sizePixels = size2.slice(0, size2.length - 2);
        let yawn = (_a2 = localHatOptions.yawn) != null ? _a2 : options.yawn;
        let derivedXY = this._map.latLngToLayerPoint(derivedLatLngs[i]);
        let bearing = derivedBearings[i];
        let thetaLeft = (180 - bearing - yawn / 2) * (Math.PI / 180), thetaRight = (180 - bearing + yawn / 2) * (Math.PI / 180);
        let dxLeft = sizePixels * Math.sin(thetaLeft), dyLeft = sizePixels * Math.cos(thetaLeft), dxRight = sizePixels * Math.sin(thetaRight), dyRight = sizePixels * Math.cos(thetaRight);
        let leftWingXY = {
          x: derivedXY.x + dxLeft,
          y: derivedXY.y + dyLeft
        };
        let rightWingXY = {
          x: derivedXY.x + dxRight,
          y: derivedXY.y + dyRight
        };
        let leftWingPoint = this._map.layerPointToLatLng(leftWingXY), rightWingPoint = this._map.layerPointToLatLng(rightWingXY);
        let hatPoints = [
          [leftWingPoint.lat, leftWingPoint.lng],
          [derivedLatLngs[i].lat, derivedLatLngs[i].lng],
          [rightWingPoint.lat, rightWingPoint.lng]
        ];
        let hat = options.fill ? L.polygon(hatPoints, __spreadValues(__spreadValues({}, hatOptions), localHatOptions)) : L.polyline(hatPoints, __spreadValues(__spreadValues({}, hatOptions), localHatOptions));
        hats.push(hat);
      };
      for (var i = 0; i < derivedLatLngs.length; i++) {
        let _a = options, { perArrowheadOptions } = _a, globalOptions = __objRest(_a, ["perArrowheadOptions"]);
        perArrowheadOptions = perArrowheadOptions ? perArrowheadOptions(i) : {};
        perArrowheadOptions = Object.assign(globalOptions, definedProps(perArrowheadOptions));
        size = (_b = perArrowheadOptions.size) != null ? _b : size;
        if (isInMeters(size)) {
          let hatSize = size.slice(0, size.length - 1);
          pushHats(hatSize, perArrowheadOptions);
        } else if (isInPercent(size)) {
          let sizePercent = size.slice(0, size.length - 1);
          let hatSize = (() => {
            if (options.frequency === "endonly" && options.proportionalToTotal) {
              return totalLength * sizePercent / 100;
            } else {
              let averageDistance = totalLength / (peice.length - 1);
              return averageDistance * sizePercent / 100;
            }
          })();
          pushHats(hatSize, perArrowheadOptions);
        } else if (isInPixels(size)) {
          pushHatsFromPixels(options.size, perArrowheadOptions);
        } else {
          console.error("Error: Arrowhead size unit not defined.  Check your arrowhead options.");
        }
      }
      allhats.push(...hats);
    });
    let arrowheads = L.layerGroup(allhats);
    this._arrowheads = arrowheads;
    return this;
  },
  getArrowheads: function() {
    if (this._arrowheads) {
      return this._arrowheads;
    } else {
      return console.error(`Error: You tried to call '.getArrowheads() on a shape that does not have a arrowhead.  Use '.arrowheads()' to add a arrowheads before trying to call '.getArrowheads()'`);
    }
  },
  _buildGhosts: function({ start, end }) {
    if (start || end) {
      let latlngs = this.getLatLngs();
      latlngs = Array.isArray(latlngs[0]) ? latlngs : [latlngs];
      const newLatLngs = latlngs.map((segment) => {
        const totalLength = (() => {
          let total = 0;
          for (var i = 0; i < segment.length - 1; i++) {
            total += this._map.distance(segment[i], segment[i + 1]);
          }
          return total;
        })();
        if (start) {
          let endOffsetInMeters = (() => {
            if (isInMeters(start)) {
              return Number(start.slice(0, start.length - 1));
            } else if (isInPixels(start)) {
              let pixels = Number(start.slice(0, start.length - 2));
              return pixelsToMeters(pixels, this._map);
            }
          })();
          let newStart = L.GeometryUtil.interpolateOnLine(this._map, segment, endOffsetInMeters / totalLength);
          segment = segment.slice(newStart.predecessor === -1 ? 1 : newStart.predecessor + 1, segment.length);
          segment.unshift(newStart.latLng);
        }
        if (end) {
          let endOffsetInMeters = (() => {
            if (isInMeters(end)) {
              return Number(end.slice(0, end.length - 1));
            } else if (isInPixels(end)) {
              let pixels = Number(end.slice(0, end.length - 2));
              return pixelsToMeters(pixels, this._map);
            }
          })();
          let newEnd = L.GeometryUtil.interpolateOnLine(this._map, segment, (totalLength - endOffsetInMeters) / totalLength);
          segment = segment.slice(0, newEnd.predecessor + 1);
          segment.push(newEnd.latLng);
        }
        return segment;
      });
      this._ghosts = L.polyline(newLatLngs, __spreadProps(__spreadValues({}, this.options), {
        color: "rgba(0,0,0,0)",
        stroke: 0,
        smoothFactor: 0,
        interactive: false
      }));
      this._ghosts.addTo(this._map);
    }
  },
  deleteArrowheads: function() {
    if (this._arrowheads) {
      this._arrowheads.remove();
      delete this._arrowheads;
      delete this._arrowheadOptions;
      this._hatsApplied = false;
    }
    if (this._ghosts) {
      this._ghosts.remove();
    }
  },
  _update: function() {
    if (!this._map) {
      return;
    }
    this._clipPoints();
    this._simplifyPoints();
    this._updatePath();
    if (this._hatsApplied) {
      this.buildVectorHats(this._arrowheadOptions);
      this._map.addLayer(this._arrowheads);
    }
  },
  remove: function() {
    if (this._arrowheads) {
      this._arrowheads.remove();
    }
    if (this._ghosts) {
      this._ghosts.remove();
    }
    return this.removeFrom(this._map || this._mapToAdd);
  }
});
L.LayerGroup.include({
  removeLayer: function(layer) {
    var id = layer in this._layers ? layer : this.getLayerId(layer);
    if (this._map && this._layers[id]) {
      if (this._layers[id]._arrowheads) {
        this._layers[id]._arrowheads.remove();
      }
      this._map.removeLayer(this._layers[id]);
    }
    delete this._layers[id];
    return this;
  },
  onRemove: function(map, layer) {
    for (var layer in this._layers) {
      if (this._layers[layer]) {
        this._layers[layer].remove();
      }
    }
    this.eachLayer(map.removeLayer, map);
  }
});
L.Map.include({
  removeLayer: function(layer) {
    var id = L.Util.stamp(layer);
    if (layer._arrowheads) {
      layer._arrowheads.remove();
    }
    if (layer._ghosts) {
      layer._ghosts.remove();
    }
    if (!this._layers[id]) {
      return this;
    }
    if (this._loaded) {
      layer.onRemove(this);
    }
    if (layer.getAttribution && this.attributionControl) {
      this.attributionControl.removeAttribution(layer.getAttribution());
    }
    delete this._layers[id];
    if (this._loaded) {
      this.fire("layerremove", { layer });
      layer.fire("remove");
    }
    layer._map = layer._mapToAdd = null;
    return this;
  }
});
L.GeoJSON.include({
  geometryToLayer: function(geojson, options) {
    var geometry = geojson.type === "Feature" ? geojson.geometry : geojson, coords = geometry ? geometry.coordinates : null, layers = [], pointToLayer = options && options.pointToLayer, _coordsToLatLng = options && options.coordsToLatLng || L.GeoJSON.coordsToLatLng, latlng, latlngs, i, len;
    if (!coords && !geometry) {
      return null;
    }
    switch (geometry.type) {
      case "Point":
        latlng = _coordsToLatLng(coords);
        return this._pointToLayer(pointToLayer, geojson, latlng, options);
      case "MultiPoint":
        for (i = 0, len = coords.length; i < len; i++) {
          latlng = _coordsToLatLng(coords[i]);
          layers.push(this._pointToLayer(pointToLayer, geojson, latlng, options));
        }
        return new L.FeatureGroup(layers);
      case "LineString":
      case "MultiLineString":
        latlngs = L.GeoJSON.coordsToLatLngs(coords, geometry.type === "LineString" ? 0 : 1, _coordsToLatLng);
        var polyline = new L.Polyline(latlngs, options);
        if (options.arrowheads) {
          polyline.arrowheads(options.arrowheads);
        }
        return polyline;
      case "Polygon":
      case "MultiPolygon":
        latlngs = L.GeoJSON.coordsToLatLngs(coords, geometry.type === "Polygon" ? 1 : 2, _coordsToLatLng);
        return new L.Polygon(latlngs, options);
      case "GeometryCollection":
        for (i = 0, len = geometry.geometries.length; i < len; i++) {
          var layer = this.geometryToLayer({
            geometry: geometry.geometries[i],
            type: "Feature",
            properties: geojson.properties
          }, options);
          if (layer) {
            layers.push(layer);
          }
        }
        return new L.FeatureGroup(layers);
      default:
        throw new Error("Invalid GeoJSON object.");
    }
  },
  addData: function(geojson) {
    var features = L.Util.isArray(geojson) ? geojson : geojson.features, i, len, feature;
    if (features) {
      for (i = 0, len = features.length; i < len; i++) {
        feature = features[i];
        if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
          this.addData(feature);
        }
      }
      return this;
    }
    var options = this.options;
    if (options.filter && !options.filter(geojson)) {
      return this;
    }
    var layer = this.geometryToLayer(geojson, options);
    if (!layer) {
      return this;
    }
    layer.feature = L.GeoJSON.asFeature(geojson);
    layer.defaultOptions = layer.options;
    this.resetStyle(layer);
    if (options.onEachFeature) {
      options.onEachFeature(geojson, layer);
    }
    return this.addLayer(layer);
  },
  _pointToLayer: function(pointToLayerFn, geojson, latlng, options) {
    return pointToLayerFn ? pointToLayerFn(geojson, latlng) : new L.Marker(latlng, options && options.markersInheritOptions && options);
  }
});
var Polyline = renderless({
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
  setup(props) {
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
    const map = ref(inject("map"));
    const polyline = L$1.polyline(props.positions, clean(options));
    if (props.arrows) {
      polyline.arrowheads(props.arrows);
    }
    provide("layer", polyline);
    whenever(map, (map2) => map2.addLayer(polyline), { immediate: true });
    whenever(options, (options2) => L$1.setOptions(polyline, clean(options2), { deep: true, immediate: true }));
    whenever(positions, (positions2) => polyline.setLatLngs(positions2));
    onUnmounted(() => polyline.remove());
  }
});
var Polygon = renderless({
  props: __spreadValues({
    positions: {
      type: Array,
      required: true
    }
  }, PathProps),
  setup(props) {
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
    const map = ref(inject("map"));
    const polygon = L$1.polygon(props.positions, clean(options));
    provide("layer", polygon);
    whenever(map, (map2) => map2.addLayer(polygon), { immediate: true });
    whenever(options, (options2) => L$1.setOptions(polygon, clean(options2), { deep: true, immediate: true }));
    whenever(positions, (positions2) => polygon.setLatLngs(positions2));
    onUnmounted(() => polygon.remove());
  }
});
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
    const map = ref(inject("map"));
    const control = new Control.Zoom(clean(__spreadValues({}, props)));
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
  setup(props) {
    const map = ref(inject("map"));
    const control = L$1.control.scale(clean(__spreadValues({}, props)));
    whenever(map, (map2) => map2.addControl(control), { immediate: true });
  }
});
var L_Control_Locate = { exports: {} };
/*!
Copyright (c) 2016 Dominik Moritz

This file is part of the leaflet locate control. It is licensed under the MIT license.
You can find the project at: https://github.com/domoritz/leaflet-locatecontrol
*/
(function(module, exports) {
  (function(factory, window2) {
    {
      if (typeof window2 !== "undefined" && window2.L) {
        module.exports = factory(L);
      } else {
        module.exports = factory(L$1);
      }
    }
    if (typeof window2 !== "undefined" && window2.L) {
      window2.L.Control.Locate = factory(L);
    }
  })(function(L2) {
    const LDomUtilApplyClassesMethod = (method, element, classNames) => {
      classNames = classNames.split(" ");
      classNames.forEach(function(className) {
        L2.DomUtil[method].call(this, element, className);
      });
    };
    const addClasses = (el, names) => LDomUtilApplyClassesMethod("addClass", el, names);
    const removeClasses = (el, names) => LDomUtilApplyClassesMethod("removeClass", el, names);
    const LocationMarker = L2.Marker.extend({
      initialize(latlng, options) {
        L2.Util.setOptions(this, options);
        this._latlng = latlng;
        this.createIcon();
      },
      createIcon() {
        const opt = this.options;
        let style = "";
        if (opt.color !== void 0) {
          style += `stroke:${opt.color};`;
        }
        if (opt.weight !== void 0) {
          style += `stroke-width:${opt.weight};`;
        }
        if (opt.fillColor !== void 0) {
          style += `fill:${opt.fillColor};`;
        }
        if (opt.fillOpacity !== void 0) {
          style += `fill-opacity:${opt.fillOpacity};`;
        }
        if (opt.opacity !== void 0) {
          style += `opacity:${opt.opacity};`;
        }
        const icon = this._getIconSVG(opt, style);
        this._locationIcon = L2.divIcon({
          className: icon.className,
          html: icon.svg,
          iconSize: [icon.w, icon.h]
        });
        this.setIcon(this._locationIcon);
      },
      _getIconSVG(options, style) {
        const r = options.radius;
        const w = options.weight;
        const s = r + w;
        const s2 = s * 2;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s2}" height="${s2}" version="1.1" viewBox="-${s} -${s} ${s2} ${s2}"><circle r="` + r + '" style="' + style + '" /></svg>';
        return {
          className: "leaflet-control-locate-location",
          svg,
          w: s2,
          h: s2
        };
      },
      setStyle(style) {
        L2.Util.setOptions(this, style);
        this.createIcon();
      }
    });
    const CompassMarker = LocationMarker.extend({
      initialize(latlng, heading, options) {
        L2.Util.setOptions(this, options);
        this._latlng = latlng;
        this._heading = heading;
        this.createIcon();
      },
      setHeading(heading) {
        this._heading = heading;
      },
      _getIconSVG(options, style) {
        const r = options.radius;
        const w = options.width + options.weight;
        const h = (r + options.depth + options.weight) * 2;
        const path = `M0,0 l${options.width / 2},${options.depth} l-${w},0 z`;
        const svgstyle = `transform: rotate(${this._heading}deg)`;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" version="1.1" viewBox="-${w / 2} 0 ${w} ${h}" style="${svgstyle}"><path d="` + path + '" style="' + style + '" /></svg>';
        return {
          className: "leaflet-control-locate-heading",
          svg,
          w,
          h
        };
      }
    });
    const LocateControl2 = L2.Control.extend({
      options: {
        position: "topleft",
        layer: void 0,
        setView: "untilPanOrZoom",
        keepCurrentZoomLevel: false,
        initialZoomLevel: false,
        getLocationBounds(locationEvent) {
          return locationEvent.bounds;
        },
        flyTo: false,
        clickBehavior: {
          inView: "stop",
          outOfView: "setView",
          inViewNotFollowing: "inView"
        },
        returnToPrevBounds: false,
        cacheLocation: true,
        drawCircle: true,
        drawMarker: true,
        showCompass: true,
        markerClass: LocationMarker,
        compassClass: CompassMarker,
        circleStyle: {
          className: "leaflet-control-locate-circle",
          color: "#136AEC",
          fillColor: "#136AEC",
          fillOpacity: 0.15,
          weight: 0
        },
        markerStyle: {
          className: "leaflet-control-locate-marker",
          color: "#fff",
          fillColor: "#2A93EE",
          fillOpacity: 1,
          weight: 3,
          opacity: 1,
          radius: 9
        },
        compassStyle: {
          fillColor: "#2A93EE",
          fillOpacity: 1,
          weight: 0,
          color: "#fff",
          opacity: 1,
          radius: 9,
          width: 9,
          depth: 6
        },
        followCircleStyle: {},
        followMarkerStyle: {},
        followCompassStyle: {},
        icon: "leaflet-control-locate-location-arrow",
        iconLoading: "leaflet-control-locate-spinner",
        iconElementTag: "span",
        textElementTag: "small",
        circlePadding: [0, 0],
        metric: true,
        createButtonCallback(container, options) {
          const link = L2.DomUtil.create("a", "leaflet-bar-part leaflet-bar-part-single", container);
          link.title = options.strings.title;
          link.href = "#";
          link.setAttribute("role", "button");
          const icon = L2.DomUtil.create(options.iconElementTag, options.icon, link);
          if (options.strings.text !== void 0) {
            const text = L2.DomUtil.create(options.textElementTag, "leaflet-locate-text", link);
            text.textContent = options.strings.text;
            link.classList.add("leaflet-locate-text-active");
            link.parentNode.style.display = "flex";
            if (options.icon.length > 0) {
              icon.classList.add("leaflet-locate-icon");
            }
          }
          return { link, icon };
        },
        onLocationError(err, control) {
          alert(err.message);
        },
        onLocationOutsideMapBounds(control) {
          control.stop();
          alert(control.options.strings.outsideMapBoundsMsg);
        },
        showPopup: true,
        strings: {
          title: "Show me where I am",
          metersUnit: "meters",
          feetUnit: "feet",
          popup: "You are within {distance} {unit} from this point",
          outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
        },
        locateOptions: {
          maxZoom: Infinity,
          watch: true,
          setView: false
        }
      },
      initialize(options) {
        for (const i in options) {
          if (typeof this.options[i] === "object") {
            L2.extend(this.options[i], options[i]);
          } else {
            this.options[i] = options[i];
          }
        }
        this.options.followMarkerStyle = L2.extend({}, this.options.markerStyle, this.options.followMarkerStyle);
        this.options.followCircleStyle = L2.extend({}, this.options.circleStyle, this.options.followCircleStyle);
        this.options.followCompassStyle = L2.extend({}, this.options.compassStyle, this.options.followCompassStyle);
      },
      onAdd(map) {
        const container = L2.DomUtil.create("div", "leaflet-control-locate leaflet-bar leaflet-control");
        this._container = container;
        this._map = map;
        this._layer = this.options.layer || new L2.LayerGroup();
        this._layer.addTo(map);
        this._event = void 0;
        this._compassHeading = null;
        this._prevBounds = null;
        const linkAndIcon = this.options.createButtonCallback(container, this.options);
        this._link = linkAndIcon.link;
        this._icon = linkAndIcon.icon;
        L2.DomEvent.on(this._link, "click", function(ev) {
          L2.DomEvent.stopPropagation(ev);
          L2.DomEvent.preventDefault(ev);
          this._onClick();
        }, this).on(this._link, "dblclick", L2.DomEvent.stopPropagation);
        this._resetVariables();
        this._map.on("unload", this._unload, this);
        return container;
      },
      _onClick() {
        this._justClicked = true;
        const wasFollowing = this._isFollowing();
        this._userPanned = false;
        this._userZoomed = false;
        if (this._active && !this._event) {
          this.stop();
        } else if (this._active) {
          const behaviors = this.options.clickBehavior;
          let behavior = behaviors.outOfView;
          if (this._map.getBounds().contains(this._event.latlng)) {
            behavior = wasFollowing ? behaviors.inView : behaviors.inViewNotFollowing;
          }
          if (behaviors[behavior]) {
            behavior = behaviors[behavior];
          }
          switch (behavior) {
            case "setView":
              this.setView();
              break;
            case "stop":
              this.stop();
              if (this.options.returnToPrevBounds) {
                const f = this.options.flyTo ? this._map.flyToBounds : this._map.fitBounds;
                f.bind(this._map)(this._prevBounds);
              }
              break;
          }
        } else {
          if (this.options.returnToPrevBounds) {
            this._prevBounds = this._map.getBounds();
          }
          this.start();
        }
        this._updateContainerStyle();
      },
      start() {
        this._activate();
        if (this._event) {
          this._drawMarker(this._map);
          if (this.options.setView) {
            this.setView();
          }
        }
        this._updateContainerStyle();
      },
      stop() {
        this._deactivate();
        this._cleanClasses();
        this._resetVariables();
        this._removeMarker();
      },
      stopFollowing() {
        this._userPanned = true;
        this._updateContainerStyle();
        this._drawMarker();
      },
      _activate() {
        if (!this._active) {
          this._map.locate(this.options.locateOptions);
          this._map.fire("locateactivate", this);
          this._active = true;
          this._map.on("locationfound", this._onLocationFound, this);
          this._map.on("locationerror", this._onLocationError, this);
          this._map.on("dragstart", this._onDrag, this);
          this._map.on("zoomstart", this._onZoom, this);
          this._map.on("zoomend", this._onZoomEnd, this);
          if (this.options.showCompass) {
            const oriAbs = "ondeviceorientationabsolute" in window;
            if (oriAbs || "ondeviceorientation" in window) {
              const _this = this;
              const deviceorientation = function() {
                L2.DomEvent.on(window, oriAbs ? "deviceorientationabsolute" : "deviceorientation", _this._onDeviceOrientation, _this);
              };
              if (DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
                DeviceOrientationEvent.requestPermission().then(function(permissionState) {
                  if (permissionState === "granted") {
                    deviceorientation();
                  }
                });
              } else {
                deviceorientation();
              }
            }
          }
        }
      },
      _deactivate() {
        this._map.stopLocate();
        this._map.fire("locatedeactivate", this);
        this._active = false;
        if (!this.options.cacheLocation) {
          this._event = void 0;
        }
        this._map.off("locationfound", this._onLocationFound, this);
        this._map.off("locationerror", this._onLocationError, this);
        this._map.off("dragstart", this._onDrag, this);
        this._map.off("zoomstart", this._onZoom, this);
        this._map.off("zoomend", this._onZoomEnd, this);
        if (this.options.showCompass) {
          this._compassHeading = null;
          if ("ondeviceorientationabsolute" in window) {
            L2.DomEvent.off(window, "deviceorientationabsolute", this._onDeviceOrientation, this);
          } else if ("ondeviceorientation" in window) {
            L2.DomEvent.off(window, "deviceorientation", this._onDeviceOrientation, this);
          }
        }
      },
      setView() {
        this._drawMarker();
        if (this._isOutsideMapBounds()) {
          this._event = void 0;
          this.options.onLocationOutsideMapBounds(this);
        } else {
          if (this._justClicked && this.options.initialZoomLevel !== false) {
            var f = this.options.flyTo ? this._map.flyTo : this._map.setView;
            f.bind(this._map)([this._event.latitude, this._event.longitude], this.options.initialZoomLevel);
          } else if (this.options.keepCurrentZoomLevel) {
            var f = this.options.flyTo ? this._map.flyTo : this._map.panTo;
            f.bind(this._map)([this._event.latitude, this._event.longitude]);
          } else {
            var f = this.options.flyTo ? this._map.flyToBounds : this._map.fitBounds;
            this._ignoreEvent = true;
            f.bind(this._map)(this.options.getLocationBounds(this._event), {
              padding: this.options.circlePadding,
              maxZoom: this.options.initialZoomLevel || this.options.locateOptions.maxZoom
            });
            L2.Util.requestAnimFrame(function() {
              this._ignoreEvent = false;
            }, this);
          }
        }
      },
      _drawCompass() {
        if (!this._event) {
          return;
        }
        const latlng = this._event.latlng;
        if (this.options.showCompass && latlng && this._compassHeading !== null) {
          const cStyle = this._isFollowing() ? this.options.followCompassStyle : this.options.compassStyle;
          if (!this._compass) {
            this._compass = new this.options.compassClass(latlng, this._compassHeading, cStyle).addTo(this._layer);
          } else {
            this._compass.setLatLng(latlng);
            this._compass.setHeading(this._compassHeading);
            if (this._compass.setStyle) {
              this._compass.setStyle(cStyle);
            }
          }
        }
        if (this._compass && (!this.options.showCompass || this._compassHeading === null)) {
          this._compass.removeFrom(this._layer);
          this._compass = null;
        }
      },
      _drawMarker() {
        if (this._event.accuracy === void 0) {
          this._event.accuracy = 0;
        }
        const radius = this._event.accuracy;
        const latlng = this._event.latlng;
        if (this.options.drawCircle) {
          const style = this._isFollowing() ? this.options.followCircleStyle : this.options.circleStyle;
          if (!this._circle) {
            this._circle = L2.circle(latlng, radius, style).addTo(this._layer);
          } else {
            this._circle.setLatLng(latlng).setRadius(radius).setStyle(style);
          }
        }
        let distance;
        let unit;
        if (this.options.metric) {
          distance = radius.toFixed(0);
          unit = this.options.strings.metersUnit;
        } else {
          distance = (radius * 3.2808399).toFixed(0);
          unit = this.options.strings.feetUnit;
        }
        if (this.options.drawMarker) {
          const mStyle = this._isFollowing() ? this.options.followMarkerStyle : this.options.markerStyle;
          if (!this._marker) {
            this._marker = new this.options.markerClass(latlng, mStyle).addTo(this._layer);
          } else {
            this._marker.setLatLng(latlng);
            if (this._marker.setStyle) {
              this._marker.setStyle(mStyle);
            }
          }
        }
        this._drawCompass();
        const t = this.options.strings.popup;
        function getPopupText() {
          if (typeof t === "string") {
            return L2.Util.template(t, { distance, unit });
          } else if (typeof t === "function") {
            return t({ distance, unit });
          } else {
            return t;
          }
        }
        if (this.options.showPopup && t && this._marker) {
          this._marker.bindPopup(getPopupText())._popup.setLatLng(latlng);
        }
        if (this.options.showPopup && t && this._compass) {
          this._compass.bindPopup(getPopupText())._popup.setLatLng(latlng);
        }
      },
      _removeMarker() {
        this._layer.clearLayers();
        this._marker = void 0;
        this._circle = void 0;
      },
      _unload() {
        this.stop();
        this._map.off("unload", this._unload, this);
      },
      _setCompassHeading(angle) {
        if (!isNaN(parseFloat(angle)) && isFinite(angle)) {
          angle = Math.round(angle);
          this._compassHeading = angle;
          L2.Util.requestAnimFrame(this._drawCompass, this);
        } else {
          this._compassHeading = null;
        }
      },
      _onCompassNeedsCalibration() {
        this._setCompassHeading();
      },
      _onDeviceOrientation(e) {
        if (!this._active) {
          return;
        }
        if (e.webkitCompassHeading) {
          this._setCompassHeading(e.webkitCompassHeading);
        } else if (e.absolute && e.alpha) {
          this._setCompassHeading(360 - e.alpha);
        }
      },
      _onLocationError(err) {
        if (err.code == 3 && this.options.locateOptions.watch) {
          return;
        }
        this.stop();
        this.options.onLocationError(err, this);
      },
      _onLocationFound(e) {
        if (this._event && (this._event.latlng.lat === e.latlng.lat && this._event.latlng.lng === e.latlng.lng && this._event.accuracy === e.accuracy)) {
          return;
        }
        if (!this._active) {
          return;
        }
        this._event = e;
        this._drawMarker();
        this._updateContainerStyle();
        switch (this.options.setView) {
          case "once":
            if (this._justClicked) {
              this.setView();
            }
            break;
          case "untilPan":
            if (!this._userPanned) {
              this.setView();
            }
            break;
          case "untilPanOrZoom":
            if (!this._userPanned && !this._userZoomed) {
              this.setView();
            }
            break;
          case "always":
            this.setView();
            break;
        }
        this._justClicked = false;
      },
      _onDrag() {
        if (this._event && !this._ignoreEvent) {
          this._userPanned = true;
          this._updateContainerStyle();
          this._drawMarker();
        }
      },
      _onZoom() {
        if (this._event && !this._ignoreEvent) {
          this._userZoomed = true;
          this._updateContainerStyle();
          this._drawMarker();
        }
      },
      _onZoomEnd() {
        if (this._event) {
          this._drawCompass();
        }
        if (this._event && !this._ignoreEvent) {
          if (this._marker && !this._map.getBounds().pad(-0.3).contains(this._marker.getLatLng())) {
            this._userPanned = true;
            this._updateContainerStyle();
            this._drawMarker();
          }
        }
      },
      _isFollowing() {
        if (!this._active) {
          return false;
        }
        if (this.options.setView === "always") {
          return true;
        } else if (this.options.setView === "untilPan") {
          return !this._userPanned;
        } else if (this.options.setView === "untilPanOrZoom") {
          return !this._userPanned && !this._userZoomed;
        }
      },
      _isOutsideMapBounds() {
        if (this._event === void 0) {
          return false;
        }
        return this._map.options.maxBounds && !this._map.options.maxBounds.contains(this._event.latlng);
      },
      _updateContainerStyle() {
        if (!this._container) {
          return;
        }
        if (this._active && !this._event) {
          this._setClasses("requesting");
        } else if (this._isFollowing()) {
          this._setClasses("following");
        } else if (this._active) {
          this._setClasses("active");
        } else {
          this._cleanClasses();
        }
      },
      _setClasses(state) {
        if (state == "requesting") {
          removeClasses(this._container, "active following");
          addClasses(this._container, "requesting");
          removeClasses(this._icon, this.options.icon);
          addClasses(this._icon, this.options.iconLoading);
        } else if (state == "active") {
          removeClasses(this._container, "requesting following");
          addClasses(this._container, "active");
          removeClasses(this._icon, this.options.iconLoading);
          addClasses(this._icon, this.options.icon);
        } else if (state == "following") {
          removeClasses(this._container, "requesting");
          addClasses(this._container, "active following");
          removeClasses(this._icon, this.options.iconLoading);
          addClasses(this._icon, this.options.icon);
        }
      },
      _cleanClasses() {
        L2.DomUtil.removeClass(this._container, "requesting");
        L2.DomUtil.removeClass(this._container, "active");
        L2.DomUtil.removeClass(this._container, "following");
        removeClasses(this._icon, this.options.iconLoading);
        addClasses(this._icon, this.options.icon);
      },
      _resetVariables() {
        this._active = false;
        this._justClicked = false;
        this._userPanned = false;
        this._userZoomed = false;
      }
    });
    L2.control.locate = (options) => new L2.Control.Locate(options);
    return LocateControl2;
  }, window);
})(L_Control_Locate);
var LocateControl = renderless({
  props: {
    position: {
      type: String,
      default: void 0
    },
    strings: {
      type: Object,
      default: void 0
    }
  },
  setup(props) {
    const map = ref(inject("map"));
    const control = L$1.control.locate(clean(__spreadValues({}, props)));
    whenever(map, (map2) => map2.addControl(control), { immediate: true });
  }
});
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
    }
  },
  setup(props, { emit }) {
    const map = ref(inject("map"));
    const mount = async (map2) => {
      if (props.apiKey) {
        await loadGmapsApi(props.apiKey);
      }
      const control = new L$1.Control.Pegman({
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
export { Circle, _sfc_main$2 as GoogleMaps, LocateControl, _sfc_main$5 as MapContainer, _sfc_main$3 as Mapbox, _sfc_main$1 as Marker, _sfc_main$4 as OpenStreetMap, PegmanControl, Polygon, Polyline, _sfc_main as Popup, ScaleControl, Tooltip, ZoomControl };
