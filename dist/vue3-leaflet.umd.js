(function(m,e){typeof exports=="object"&&typeof module!="undefined"?e(exports,require("vue"),require("@vueuse/core")):typeof define=="function"&&define.amd?define(["exports","vue","@vueuse/core"],e):(m=typeof globalThis!="undefined"?globalThis:m||self,e(m["vue3-leaflet"]={},m.Vue,m.core))})(this,function(m,e,i){"use strict";var Ee=Object.defineProperty;var P=Object.getOwnPropertySymbols;var Oe=Object.prototype.hasOwnProperty,be=Object.prototype.propertyIsEnumerable;var j=(m,e,i)=>e in m?Ee(m,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):m[e]=i,C=(m,e)=>{for(var i in e||(e={}))Oe.call(e,i)&&j(m,i,e[i]);if(P)for(var i of P(e))be.call(e,i)&&j(m,i,e[i]);return m};const N="1.9.2",z="0.78.0",v="0.13.5",x="0.1.6",G="2.0.1",V="1.4.0",I="0.10.1",q="2.13.0",K="1.4.1";function O(t){return Object.assign(t,{render:()=>{}})}function R(t){return typeof t=="object"&&t!==null}function w(t){return R(t)&&Object.keys(t).forEach(n=>{if(R(t[n])){t[n]=w(t[n]);return}typeof t[n]=="undefined"&&(Array.isArray(t)?t.splice(n,1):delete t[n])}),t}async function U(t){var n;return window.gmapsApi=(n=window.gmapsApi)!=null?n:new Promise((r,a)=>{const o=document.createElement("script");o.type="text/javascript",o.src="https://maps.googleapis.com/maps/api/js?key="+t,o.async=!0,o.addEventListener("error",l=>a(l)),o.addEventListener("abort",l=>a(l)),o.addEventListener("load",()=>{r(!0)}),document.head.appendChild(o)}),window.gmapsApi}async function S(t){return new Promise((n,r)=>{if(document.querySelector(`script[src='${t}']`))return n();const o=document.createElement("script");o.type="text/javascript",o.src=t,o.addEventListener("error",l=>r(l)),o.addEventListener("abort",l=>r(l)),o.addEventListener("load",()=>n()),document.head.appendChild(o)})}async function b(t){return new Promise((n,r)=>{if(document.querySelector(`link[rel='stylesheet'][href='${t}']`))return n();const o=document.createElement("link");o.rel="stylesheet",o.href=t,o.crossOrigin="",o.addEventListener("error",l=>r(l)),o.addEventListener("abort",l=>r(l)),o.addEventListener("load",()=>n()),document.head.appendChild(o)})}async function F(t=q){return Promise.all([S(`https://unpkg.com/@geoman-io/leaflet-geoman-free@${t}/dist/leaflet-geoman.min.js`),b(`https://unpkg.com/@geoman-io/leaflet-geoman-free@${t}/dist/leaflet-geoman.css`)])}async function D(t=G){return S(`https://unpkg.com/leaflet.smooth_marker_bouncing@${t}/dist/bundle.js`)}async function k(t=N){await Promise.all([S(`https://unpkg.com/leaflet@${t}/dist/leaflet.js`),b(`https://unpkg.com/leaflet@${t}/dist/leaflet.css`)]),await Promise.all([D(),F()])}const Z={__name:"MapContainer",props:{center:{type:[Array,Object],default:()=>{}},zoom:{type:Number,default:13},zoomControl:{type:Boolean,default:!0},scrollWheelZoom:{type:Boolean,default:!0},bounds:{type:Array,default:void 0},version:{type:String,default:void 0}},emits:["ready","move","zoomend"],setup(t,{emit:n}){const r=t,{center:a,zoom:o,zoomControl:l,bounds:d,scrollWheelZoom:u}=e.toRefs(r),h=e.reactive({scrollWheelZoom:u,maxZoom:18}),f=i.templateRef("container"),y=e.ref();function g(c,s){s.length>0&&c.fitBounds(s)}return e.provide("map",y),e.provide("layer",y),e.provide("leaflet.version",r.version),e.onMounted(async()=>{await k(r.version);const c=L.map(i.get(f),h);c.setView(r.center,r.zoom),e.watch(a,s=>c.setView(s)),e.watch(o,s=>c.setView(r.center,s),{immediate:!0}),e.watch(l,s=>s?c.zoomControl.addTo(c):c.zoomControl.remove(),{immediate:!0}),i.whenever(d,s=>g(c,s),{immediate:!0}),i.set(y,c),c.on("move",s=>n("move",{event:s,center:c.getCenter(),map:c})),c.on("zoomend",()=>n("zoomend",{zoom:c.getZoom(),bounds:c.getBounds(),map:c})),n("ready",c)}),(c,s)=>(e.openBlock(),e.createElementBlock("div",null,[(e.openBlock(),e.createBlock(e.Suspense,null,{default:e.withCtx(()=>[e.createElementVNode("div",e.mergeProps({ref_key:"container",ref:f},c.$attrs),[y.value?e.renderSlot(c.$slots,"default",{key:0,map:y.value}):e.createCommentVNode("",!0)],16)]),_:3}))]))}},H={__name:"OpenStreetMap",props:{url:{type:String,default:"https://tile.openstreetmap.org/{z}/{x}/{y}.png"},attribution:{type:String,default:'&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'},type:{type:String,default:"roadmap",validator:t=>["roadmap"].includes(t)}},setup(t){const n=t,r=e.inject("map"),a=L.tileLayer(n.url,{attribution:n.attribution});return e.provide("layer",a),i.whenever(r,o=>o.addLayer(a),{immediate:!0}),(o,l)=>e.renderSlot(o.$slots,"default")}},W={__name:"Mapbox",props:{url:{type:String,default:"https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={apiKey}"},apiKey:{type:String,required:!0},attribution:{type:String,default:'&copy <a href="https://www.mapbox.com/about/maps/">Mapbox</a>&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> - <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'},tileSize:{type:Number,default:512},zoomOffset:{type:Number,default:-1},type:{type:String,default:"roadmap",validator:t=>["roadmap"].includes(t)}},async setup(t){let n,r;const a=t;[n,r]=e.withAsyncContext(()=>k(e.inject("leaflet.version"))),await n,r();const o=e.inject("map"),l=e.reactive({apiKey:a.apiKey,attribution:a.attribution,tileSize:a.tileSize,zoomOffset:a.zoomOffset}),d=L.tileLayer(a.url,l);return e.provide("layer",d),i.whenever(o,u=>u.addLayer(d),{immediate:!0}),(u,h)=>e.renderSlot(u.$slots,"default")}};async function J(t=v){return S(`https://unpkg.com/leaflet.gridlayer.googlemutant@${t}/dist/Leaflet.GoogleMutant.js`)}async function Y(t){return window.gmapsApi?!0:S(`https://maps.googleapis.com/maps/api/js?key=${t}`)}const Q={__name:"GoogleMaps",props:{url:{type:String,default:"https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"},apiKey:{type:String,required:!0},type:{type:String,default:"roadmap",validator:t=>["roadmap","satellite","terrain","hybrid"].includes(t)},version:{type:String,default:void 0}},async setup(t){let n,r;const a=t;[n,r]=e.withAsyncContext(()=>k(e.inject("leaflet.version"))),await n,r(),[n,r]=e.withAsyncContext(()=>J(a.version)),await n,r();const{type:o}=e.toRefs(a),l=e.reactive({type:o}),d=s=>{const p=(_,$)=>L.gridLayer.googleMutant($).addTo(_);return{load:async(_,$=l)=>(await Y(s),p(_,$),{})}},u=e.inject("map"),h=e.reactive({apiKey:a.apiKey,attribution:a.attribution,tileSize:a.tileSize,zoomOffset:a.zoomOffset}),f=L.tileLayer(a.url,h),y=d(a.apiKey),g=e.ref();e.watch(o,()=>c(e.unref(u)));async function c(s){i.set(g,await y.load(s,l))}return e.provide("layer",f),i.whenever(u,s=>c(s),{immediate:!0}),(s,p)=>g.value?e.renderSlot(s.$slots,"default",{key:0}):e.createCommentVNode("",!0)}};async function X(t=K){return Promise.all([S(`https://unpkg.com/leaflet.markercluster@${t}/dist/leaflet.markercluster.js`),b(`https://unpkg.com/leaflet.markercluster@${t}/dist/MarkerCluster.css`),b(`https://unpkg.com/leaflet.markercluster@${t}/dist/MarkerCluster.Default.css`)])}const ee={__name:"Cluster",async setup(t){let n,r;const a=e.inject("map");[n,r]=e.withAsyncContext(()=>X()),await n,r();const o=L.markerClusterGroup(),l=e.ref(o);return e.provide("layer",l),i.get(a).addLayer(o),e.onUnmounted(()=>i.get(a).removeLayer(o)),(d,u)=>e.renderSlot(d.$slots,"default")}},B=()=>({}),te=t=>console.debug(t);async function M(t,n=te){try{await t()}catch(r){n(r)}}const ne=["data-marker"],oe={__name:"Marker",props:{position:{type:[Array,Object],required:!0},icon:{type:[String,Object],default:void 0},title:{type:String,default:void 0},alt:{type:String,default:void 0},opacity:{type:Number,default:void 0},tooltip:{type:[String,Node],default:void 0}},emits:["click","load"],async setup(t,{emit:n}){let r,a;const o=t;[r,a]=e.withAsyncContext(()=>k(e.inject("leaflet.version"))),await r,a(),L.Marker.prototype._animateZoom=function(_){if(!this._map)return;const $=this._map._latLngToNewLayerPoint(this._latlng,_.zoom,_.center).round();this._setPos($)};const{position:l,title:d,alt:u,opacity:h,tooltip:f}=e.toRefs(o),y=e.reactive({title:d,alt:u,opacity:h}),g=e.computed(()=>{if(o.icon instanceof L.Icon)return o.icon;if(o.icon instanceof Object)return L.icon(o.icon);if(typeof o.icon=="string"){const _={iconSize:[50,50],iconAnchor:[22,50],popupAnchor:[0,-50]};return L.icon(C({iconUrl:o.icon},_))}});function c(_){L.setOptions(_,w(y)),M(()=>{_._removeIcon(),_._initIcon()},B),_.update()}const s=e.inject("layer"),p=e.ref();e.provide("marker",p),e.provide("layer",p);const E=e.toRaw(i.get(s));return i.set(p,L.marker(o.position,w(y))),i.get(p).on("click",()=>n("click",i.get(p))),E.addLayer(i.get(p)),n("load",i.get(p)),i.whenever(l,_=>i.get(p).setLatLng(_)),i.whenever(g,_=>M(()=>i.get(p).setIcon(_),B)),i.whenever(y,()=>c(i.get(p)),{deep:!0,immediate:!0}),i.whenever(f,_=>i.get(marker).bindTooltip(_),{deep:!0,immediate:!0}),e.onUnmounted(()=>{M(()=>{i.get(s).removeLayer(i.get(p)),i.get(p).remove()})}),(_,$)=>p.value?(e.openBlock(),e.createElementBlock("span",{key:0,"data-marker":p.value},[e.renderSlot(_.$slots,"default",{marker:p.value})],8,ne)):e.createCommentVNode("",!0)}};function T(t,n){n?t.bounce():t.stopBouncing()}var ae={async mounted(t,n,r){const a=e.toRaw(r.props["data-marker"]);if(!(a instanceof L.Marker))throw Error("This directive can only be used on markers.");if(n.arg==="options"){a.setBouncingOptions(n.value);return}T(a,n.value)},async updated(t,n,r){const a=e.toRaw(r.props["data-marker"]);if(n.arg==="options"){a.setBouncingOptions(n.value);return}T(a,n.value)}},re=(t,n)=>{const r=t.__vccOpts||t;for(const[a,o]of n)r[a]=o;return r};if(document&&!document.getElementById("void")){const t=document.createElement("div");t.id="void",t.style.width=0,t.style.height=0,t.style.opacity=0,t.style.display="none",document.body.appendChild(t)}const ie={};function se(t,n,r,a,o,l){return e.openBlock(),e.createBlock(e.Teleport,{to:"#void"},[e.renderSlot(t.$slots,"default")])}var le=re(ie,[["render",se]]);const ce={ref:"popup-content"},pe={__name:"Popup",props:{position:{type:[Object,Array],default:void 0}},async setup(t){let n,r;const a=t;[n,r]=e.withAsyncContext(()=>k(e.inject("leaflet.version"))),await n,r(),L.Popup.prototype._animateZoom=function(s){if(!this._map)return;const p=this._map._latLngToNewLayerPoint(this._latlng,s.zoom,s.center),E=this._getAnchor();L.DomUtil.setPosition(this._container,p.add(E))},window.fixPopupCloseEvent||(document.addEventListener("click",s=>{let p=s.target;for(;p!=null;){if(p.matches('a[href="#close"]')){s.preventDefault();return}p=p.parentElement}}),window.fixPopupCloseEvent=!0);const{position:o}=e.toRefs(a),l=i.templateRef("popup-content"),d=new L.Popup,u=e.inject("layer"),h=i.useMounted(),f=e.ref(!1);e.provide("layer",d);function y(){d.isOpen()&&(d.toggle(),d.toggle())}function g(){i.get(f)!==!0&&(i.get(u).bindPopup(d),i.set(f,!0),y())}function c(s){var E;if(i.get(h)===!1)return;const p=s.firstElementChild instanceof Element;s.innerHTML.trim().length>0&&(d.setContent(p?s.firstElementChild:s),g()),i.useMutationObserver((E=s.firstElementChild)!=null?E:s,()=>y(),{subtree:!0,childList:!0,characterData:!0})}return i.whenever(o,s=>d.setLatLng(s),{immediate:!0}),e.watch(l,c,{immediate:!0}),(s,p)=>(e.openBlock(),e.createBlock(le,null,{default:e.withCtx(()=>[e.createElementVNode("div",ce,[e.renderSlot(s.$slots,"default")],512)]),_:3}))}};var de=O({props:{position:{type:[Array,Object],required:!0},text:{type:String,required:!0},direction:{type:String,default:"auto"},offset:{type:Object,default:void 0},permanent:{type:Boolean,default:!1},sticky:{type:Boolean,default:!1},opacity:{type:Number,default:.9}},setup(t){var d;const{position:n,text:r}=e.toRefs(t),a=e.reactive({direction:t.direction,offset:(d=t.offset)!=null?d:new L.Point(0,0),permanent:t.permanent,sticky:t.sticky,opacity:t.opacity}),o=e.inject("map"),l=u=>{const h=new L.Tooltip;h.setLatLng(t.position).addTo(u),e.watch(n,f=>h.setLatLng(f)),e.watch(r,f=>h.setContent(f),{immediate:!0}),e.watch(a,f=>L.setOptions(h,f),{immediate:!0})};i.whenever(o,l,{immediate:!0})}}),A={color:{type:String},weight:{type:Number},opacity:{type:Number},fillColor:{type:String}};const me={__name:"Circle",props:C({center:{type:[Array,Object],required:!0},radius:{type:Number,required:!0}},A),setup(t){const n=t,{center:r,radius:a,color:o,weight:l,opacity:d,fillColor:u}=e.toRefs(n),h=e.computed(()=>n.color!=null),f=e.computed(()=>n.fillColor!=null),y=e.reactive({radius:a,stroke:h,color:o,weight:l,opacity:d,fill:f,fillColor:u}),g=e.inject("map"),c=L.circle(n.center,w(y));return e.provide("layer",c),i.whenever(g,s=>s.addLayer(c),{immediate:!0}),i.whenever(y,s=>L.setOptions(c,w(s),{deep:!0,immediate:!0})),i.whenever(r,s=>c.setLatLng(s)),e.onUnmounted(()=>c.remove()),(s,p)=>e.renderSlot(s.$slots,"default")}};async function ue(t=I){return S(`https://unpkg.com/leaflet-geometryutil@${t}/src/leaflet.geometryutil.js`)}async function fe(t=V){return await ue(),S(`https://unpkg.com/leaflet-arrowheads@${t}/src/leaflet-arrowheads.js`)}const ye={__name:"Polyline",props:C({positions:{type:Array,required:!0},arrows:{type:Object,default:void 0}},A),async setup(t){let n,r;const a=t,{positions:o,color:l,weight:d,opacity:u,fillColor:h}=e.toRefs(a),f=e.computed(()=>a.color!=null),y=e.computed(()=>a.fillColor!=null),g=e.reactive({stroke:f,color:l,weight:d,opacity:u,fill:y,fillColor:h}),c=e.inject("map"),s=L.polyline(a.positions,w(g));return e.provide("layer",s),e.onUnmounted(()=>s.remove()),a.arrows&&([n,r]=e.withAsyncContext(()=>fe()),await n,r(),s.arrowheads(a.arrows)),i.whenever(c,p=>p.addLayer(s),{immediate:!0}),i.whenever(g,p=>L.setOptions(s,w(p),{deep:!0,immediate:!0})),i.whenever(o,p=>s.setLatLngs(p)),(p,E)=>e.renderSlot(p.$slots,"default")}},ge={__name:"Polygon",props:C({positions:{type:Array,required:!0}},A),setup(t){const n=t,{positions:r,color:a,weight:o,opacity:l,fillColor:d}=e.toRefs(n),u=e.computed(()=>n.color!=null),h=e.computed(()=>n.fillColor!=null),f=e.reactive({stroke:u,color:a,weight:o,opacity:l,fill:h,fillColor:d}),y=e.inject("map"),g=L.polygon(n.positions,w(f));return e.provide("layer",g),i.whenever(y,c=>c.addLayer(g),{immediate:!0}),i.whenever(f,c=>L.setOptions(g,w(c),{deep:!0,immediate:!0})),i.whenever(r,c=>g.setLatLngs(c)),e.onUnmounted(()=>g.remove()),(c,s)=>e.renderSlot(c.$slots,"default")}};var he=O({props:{position:{type:String,default:void 0},zoomInTitle:{type:String,default:void 0},zoomOutTitle:{type:String,default:void 0}},setup(t){const n=e.inject("map"),r=new L.Control.Zoom(w(C({},t))),a=o=>{var l;(l=o==null?void 0:o.zoomControl)==null||l.remove(),o.addControl(r)};i.whenever(n,a,{immediate:!0})}}),_e=O({props:{position:{type:String,default:void 0},maxWidth:{type:Number,default:void 0},imperial:{type:Boolean,default:void 0},metric:{type:Boolean,default:void 0}},async setup(t){const n=e.inject("map");await k(e.inject("leaflet.version"));const r=L.control.scale(w(C({},t)));i.whenever(n,a=>a.addControl(r),{immediate:!0})}});async function we(t=z){return Promise.all([b(`https://unpkg.com/leaflet.locatecontrol@${t}/dist/L.Control.Locate.min.css`),S(`https://unpkg.com/leaflet.locatecontrol@${t}/dist/L.Control.Locate.min.js`)])}var Le=O({props:{position:{type:String,default:void 0},strings:{type:Object,default:void 0},version:{type:String,default:void 0}},async setup(t){const n=e.inject("map");await k(e.inject("leaflet.version")),await we(t.version);const r=L.control.locate(w(C({},t)));i.whenever(n,a=>a.addControl(r),{immediate:!0})}});async function Se(t=x){return Promise.all([S(`https://unpkg.com/leaflet-pegman@${t}/leaflet-pegman.js`),b(`https://unpkg.com/leaflet-pegman@${t}/leaflet-pegman.css`)])}var Ce=O({emits:["openstreetview","closestreetview"],props:{apiKey:{type:String,default:void 0},position:{type:String,default:"bottomright"},theme:{type:String,default:"leaflet-pegman-v3-small"},version:{type:String,default:void 0}},async setup(t,{emit:n}){const r=e.inject("map");t.apiKey&&await U(t.apiKey),await k(),await Se(t.version);const a=async o=>{new L.Control.Pegman({position:t.position,theme:t.theme}).addTo(o),new MutationObserver(u=>{var h,f;for(const y of u)if(y.type==="childList"){for(const g of y.addedNodes)(h=g.classList)!=null&&h.contains("pegman-marker")&&n("openstreetview");for(const g of y.removedNodes)(f=g.classList)!=null&&f.contains("pegman-marker")&&n("closestreetview")}}).observe(o._container,{childList:!0,subtree:!0})};i.whenever(r,a,{immediate:!0})}}),ke=O({props:{locale:{type:String,default:"en"},onlyOneShape:{type:Boolean,default:!1},position:{type:String,default:"topright"},drawControls:{type:Boolean,default:!0},editControls:{type:Boolean,default:!1},drawPolygon:{type:Boolean,default:!1},drawCircle:{type:Boolean,default:!1},drawPolyline:{type:Boolean,default:!1},drawRectangle:{type:Boolean,default:!1},drawMarker:{type:Boolean,default:!1},drawCircleMarker:{type:Boolean,default:!1},drawText:{type:Boolean,default:!1},version:{type:String,default:void 0}},emits:["drawstart","drawend","cancel"],async setup(t,{emit:n}){const r=e.inject("map"),a=o=>{o.pm.addControls(C({},t)),o.pm.enableGlobalEditMode(),o.pm.enableGlobalRemovalMode(),o.pm.setLang(t.locale);const l=L.featureGroup();l.last=function(){return this.getLayers()[this.getLayers().length-1]},t.onlyOneShape&&(o.on("pm:create",d=>d.layer.addTo(l)),o.on("pm:drawstart",()=>{l.eachLayer(d=>d.removeFrom(o)),l.clearLayers()})),o.on("pm:drawstart",()=>n("drawstart")),o.on("pm:drawend",async d=>{await e.nextTick();const u=l.last();if(u===void 0){n("cancel");return}l.last()instanceof L.CircleMarker?n("drawend",{shape:d.shape,center:u.getLatLng(),radius:u.getRadius()}):n("drawend",{shape:d.shape,bounds:u.getLatLngs()})})};i.whenever(r,a,{immediate:!0})}});m.Circle=me,m.Cluster=ee,m.DrawControl=ke,m.GoogleMaps=Q,m.LocateControl=Le,m.MapContainer=Z,m.Mapbox=W,m.Marker=oe,m.OpenStreetMap=H,m.PegmanControl=Ce,m.Polygon=ge,m.Polyline=ye,m.Popup=pe,m.ScaleControl=_e,m.Tooltip=de,m.ZoomControl=he,m.vBounce=ae,Object.defineProperties(m,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
