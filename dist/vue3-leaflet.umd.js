(function(d,e){typeof exports=="object"&&typeof module!="undefined"?e(exports,require("vue"),require("@vueuse/core")):typeof define=="function"&&define.amd?define(["exports","vue","@vueuse/core"],e):(d=typeof globalThis!="undefined"?globalThis:d||self,e(d["vue3-leaflet"]={},d.Vue,d.core))})(this,function(d,e,s){"use strict";var we=Object.defineProperty;var P=Object.getOwnPropertySymbols;var _e=Object.prototype.hasOwnProperty,Le=Object.prototype.propertyIsEnumerable;var T=(d,e,s)=>e in d?we(d,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):d[e]=s,k=(d,e)=>{for(var s in e||(e={}))_e.call(e,s)&&T(d,s,e[s]);if(P)for(var s of P(e))Le.call(e,s)&&T(d,s,e[s]);return d};const N="1.9.2",j="0.78.0",z="0.13.5",R="0.1.6",v="2.0.1",x="1.4.0",G="0.10.1",V="2.13.0";function b(t){return Object.assign(t,{render:()=>{}})}function A(t){return typeof t=="object"&&t!==null}function _(t){return A(t)&&Object.keys(t).forEach(n=>{if(A(t[n])){t[n]=_(t[n]);return}typeof t[n]=="undefined"&&(Array.isArray(t)?t.splice(n,1):delete t[n])}),t}async function I(t){var n;return window.gmapsApi=(n=window.gmapsApi)!=null?n:new Promise((i,r)=>{const o=document.createElement("script");o.type="text/javascript",o.src="https://maps.googleapis.com/maps/api/js?key="+t,o.async=!0,o.addEventListener("error",p=>r(p)),o.addEventListener("abort",p=>r(p)),o.addEventListener("load",()=>{i(!0)}),document.head.appendChild(o)}),window.gmapsApi}async function C(t){return new Promise((n,i)=>{if(document.querySelector(`script[src='${t}']`))return n();const o=document.createElement("script");o.type="text/javascript",o.src=t,o.addEventListener("error",p=>i(p)),o.addEventListener("abort",p=>i(p)),o.addEventListener("load",()=>n()),document.head.appendChild(o)})}async function M(t){return new Promise((n,i)=>{if(document.querySelector(`link[rel='stylesheet'][href='${t}']`))return n();const o=document.createElement("link");o.rel="stylesheet",o.href=t,o.crossOrigin="",o.addEventListener("error",p=>i(p)),o.addEventListener("abort",p=>i(p)),o.addEventListener("load",()=>n()),document.head.appendChild(o)})}async function q(t=V){return Promise.all([C(`https://unpkg.com/@geoman-io/leaflet-geoman-free@${t}/dist/leaflet-geoman.min.js`),M(`https://unpkg.com/@geoman-io/leaflet-geoman-free@${t}/dist/leaflet-geoman.css`)])}async function K(t=v){return C(`https://unpkg.com/leaflet.smooth_marker_bouncing@${t}/dist/bundle.js`)}async function O(t=N){await Promise.all([C(`https://unpkg.com/leaflet@${t}/dist/leaflet.js`),M(`https://unpkg.com/leaflet@${t}/dist/leaflet.css`)]),await Promise.all([K(),q()])}const F={__name:"MapContainer",props:{center:{type:[Array,Object],default:()=>{}},zoom:{type:Number,default:13},zoomControl:{type:Boolean,default:!0},scrollWheelZoom:{type:Boolean,default:!0},bounds:{type:Array,default:void 0},version:{type:String,default:void 0}},emits:["ready","move","zoomend"],setup(t,{emit:n}){const i=t,{center:r,zoom:o,zoomControl:p,bounds:c,scrollWheelZoom:m}=e.toRefs(i),h=e.reactive({scrollWheelZoom:m,maxZoom:18}),u=s.templateRef("container"),f=e.ref();function y(l,a){a.length>0&&l.fitBounds(a)}return e.provide("map",f),e.provide("leaflet.version",i.version),e.onMounted(async()=>{await O(i.version);const l=L.map(s.get(u),h);l.setView(i.center,i.zoom),e.watch(r,a=>l.setView(a)),e.watch(o,a=>l.setView(i.center,a),{immediate:!0}),e.watch(p,a=>a?l.zoomControl.addTo(l):l.zoomControl.remove(),{immediate:!0}),s.whenever(c,a=>y(l,a),{immediate:!0}),s.set(f,l),l.on("move",a=>n("move",{event:a,center:l.getCenter(),map:l})),l.on("zoomend",()=>n("zoomend",{zoom:l.getZoom(),bounds:l.getBounds(),map:l})),n("ready",l)}),(l,a)=>(e.openBlock(),e.createElementBlock("div",null,[(e.openBlock(),e.createBlock(e.Suspense,null,{default:e.withCtx(()=>[e.createElementVNode("div",e.mergeProps({ref_key:"container",ref:u},l.$attrs),[f.value?e.renderSlot(l.$slots,"default",{key:0,map:f.value}):e.createCommentVNode("",!0)],16)]),_:3}))]))}},U={__name:"OpenStreetMap",props:{url:{type:String,default:"https://tile.openstreetmap.org/{z}/{x}/{y}.png"},attribution:{type:String,default:'&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'},type:{type:String,default:"roadmap",validator:t=>["roadmap"].includes(t)}},setup(t){const n=t,i=e.inject("map"),r=L.tileLayer(n.url,{attribution:n.attribution});return e.provide("layer",r),s.whenever(i,o=>o.addLayer(r),{immediate:!0}),(o,p)=>e.renderSlot(o.$slots,"default")}},Z={__name:"Mapbox",props:{url:{type:String,default:"https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={apiKey}"},apiKey:{type:String,required:!0},attribution:{type:String,default:'&copy <a href="https://www.mapbox.com/about/maps/">Mapbox</a>&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> - <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'},tileSize:{type:Number,default:512},zoomOffset:{type:Number,default:-1},type:{type:String,default:"roadmap",validator:t=>["roadmap"].includes(t)}},async setup(t){let n,i;const r=t;[n,i]=e.withAsyncContext(()=>O(e.inject("leaflet.version"))),await n,i();const o=e.inject("map"),p=e.reactive({apiKey:r.apiKey,attribution:r.attribution,tileSize:r.tileSize,zoomOffset:r.zoomOffset}),c=L.tileLayer(r.url,p);return e.provide("layer",c),s.whenever(o,m=>m.addLayer(c),{immediate:!0}),(m,h)=>e.renderSlot(m.$slots,"default")}};async function D(t=z){return C(`https://unpkg.com/leaflet.gridlayer.googlemutant@${t}/dist/Leaflet.GoogleMutant.js`)}async function H(t){return window.gmapsApi?!0:C(`https://maps.googleapis.com/maps/api/js?key=${t}`)}const W={__name:"GoogleMaps",props:{url:{type:String,default:"https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"},apiKey:{type:String,required:!0},type:{type:String,default:"roadmap",validator:t=>["roadmap","satellite","terrain","hybrid"].includes(t)},version:{type:String,default:void 0}},async setup(t){let n,i;const r=t;[n,i]=e.withAsyncContext(()=>O(e.inject("leaflet.version"))),await n,i(),[n,i]=e.withAsyncContext(()=>D(r.version)),await n,i();const{type:o}=e.toRefs(r),p=e.reactive({type:o}),c=a=>{const g=(S,E)=>L.gridLayer.googleMutant(E).addTo(S);return{load:async(S,E=p)=>(await H(a),g(S,E),{})}},m=e.inject("map"),h=e.reactive({apiKey:r.apiKey,attribution:r.attribution,tileSize:r.tileSize,zoomOffset:r.zoomOffset}),u=L.tileLayer(r.url,h),f=c(r.apiKey),y=e.ref();e.watch(o,()=>l(e.unref(m)));async function l(a){s.set(y,await f.load(a,p))}return e.provide("layer",u),s.whenever(m,a=>l(a),{immediate:!0}),(a,g)=>y.value?e.renderSlot(a.$slots,"default",{key:0}):e.createCommentVNode("",!0)}},J=["data-marker"],Y={__name:"Marker",props:{position:{type:[Array,Object],required:!0},icon:{type:[String,Object],default:void 0},title:{type:String,default:void 0},alt:{type:String,default:void 0},opacity:{type:Number,default:void 0},tooltip:{type:[String,Node],default:void 0}},emits:["click","load"],async setup(t,{emit:n}){let i,r;const o=t;[i,r]=e.withAsyncContext(()=>O(e.inject("leaflet.version"))),await i,r(),L.Marker.prototype._animateZoom=function(w){if(!this._map)return;const S=this._map._latLngToNewLayerPoint(this._latlng,w.zoom,w.center).round();this._setPos(S)};const{position:p,title:c,alt:m,opacity:h,tooltip:u}=e.toRefs(o),f=e.reactive({title:c,alt:m,opacity:h}),y=e.computed(()=>{if(o.icon instanceof L.Icon)return o.icon;if(o.icon instanceof Object)return L.icon(o.icon);if(typeof o.icon=="string"){const w={iconSize:[50,50],iconAnchor:[22,50],popupAnchor:[0,-50]};return L.icon(k({iconUrl:o.icon},w))}}),l=e.inject("map"),a=e.ref();e.provide("layer",a),e.provide("marker",a);function g(w){L.setOptions(w,_(f)),w._removeIcon(),w._initIcon(),w.update()}return e.onMounted(()=>{s.whenever(l,w=>{const S=L.marker(o.position,_(f));S.on("click",()=>n("click",S)),s.set(a,S),w.addLayer(s.get(a)),n("load",s.get(a)),s.whenever(p,E=>s.get(a).setLatLng(E)),s.whenever(y,E=>s.get(a).setIcon(E),{deep:!0,immediate:!0}),s.whenever(f,()=>g(s.get(a)),{deep:!0,immediate:!0}),s.whenever(u,E=>s.get(S).bindTooltip(E),{deep:!0,immediate:!0})},{immediate:!0})}),e.onUnmounted(()=>s.get(a).remove()),(w,S)=>a.value?(e.openBlock(),e.createElementBlock("span",{key:0,"data-marker":a.value},[e.renderSlot(w.$slots,"default",{marker:a.value})],8,J)):e.createCommentVNode("",!0)}};function B(t,n){n?t.bounce():t.stopBouncing()}var Q={async mounted(t,n,i){const r=e.toRaw(i.props["data-marker"]);if(!(r instanceof L.Marker))throw Error("This directive can only be used on markers.");if(n.arg==="options"){r.setBouncingOptions(n.value);return}B(r,n.value)},async updated(t,n,i){const r=e.toRaw(i.props["data-marker"]);if(n.arg==="options"){r.setBouncingOptions(n.value);return}B(r,n.value)}},X=(t,n)=>{const i=t.__vccOpts||t;for(const[r,o]of n)i[r]=o;return i};if(document&&!document.getElementById("void")){const t=document.createElement("div");t.id="void",t.style.width=0,t.style.height=0,t.style.opacity=0,t.style.display="none",document.body.appendChild(t)}const ee={};function te(t,n,i,r,o,p){return e.openBlock(),e.createBlock(e.Teleport,{to:"#void"},[e.renderSlot(t.$slots,"default")])}var ne=X(ee,[["render",te]]);const oe={ref:"popup-content"},ae={__name:"Popup",props:{position:{type:[Object,Array],default:void 0}},async setup(t){let n,i;const r=t;[n,i]=e.withAsyncContext(()=>O(e.inject("leaflet.version"))),await n,i(),L.Popup.prototype._animateZoom=function(a){if(!this._map)return;const g=this._map._latLngToNewLayerPoint(this._latlng,a.zoom,a.center),w=this._getAnchor();L.DomUtil.setPosition(this._container,g.add(w))},window.fixPopupCloseEvent||(document.addEventListener("click",a=>{let g=a.target;for(;g!=null;){if(g.matches('a[href="#close"]')){a.preventDefault();return}g=g.parentElement}}),window.fixPopupCloseEvent=!0);const{position:o}=e.toRefs(r),p=s.templateRef("popup-content"),c=new L.Popup,m=e.inject("layer"),h=s.useMounted(),u=e.ref(!1);e.provide("layer",c);function f(){c.isOpen()&&(c.toggle(),c.toggle())}function y(){s.get(u)!==!0&&(s.get(m).bindPopup(c),s.set(u,!0),f())}function l(a){var w;if(s.get(h)===!1)return;const g=a.firstElementChild instanceof Element;a.innerHTML.trim().length>0&&(c.setContent(g?a.firstElementChild:a),y()),s.useMutationObserver((w=a.firstElementChild)!=null?w:a,()=>f(),{subtree:!0,childList:!0,characterData:!0})}return s.whenever(o,a=>c.setLatLng(a),{immediate:!0}),e.watch(p,l,{immediate:!0}),(a,g)=>(e.openBlock(),e.createBlock(ne,null,{default:e.withCtx(()=>[e.createElementVNode("div",oe,[e.renderSlot(a.$slots,"default")],512)]),_:3}))}};var re=b({props:{position:{type:[Array,Object],required:!0},text:{type:String,required:!0},direction:{type:String,default:"auto"},offset:{type:Object,default:void 0},permanent:{type:Boolean,default:!1},sticky:{type:Boolean,default:!1},opacity:{type:Number,default:.9}},setup(t){var c;const{position:n,text:i}=e.toRefs(t),r=e.reactive({direction:t.direction,offset:(c=t.offset)!=null?c:new L.Point(0,0),permanent:t.permanent,sticky:t.sticky,opacity:t.opacity}),o=e.inject("map"),p=m=>{const h=new L.Tooltip;h.setLatLng(t.position).addTo(m),e.watch(n,u=>h.setLatLng(u)),e.watch(i,u=>h.setContent(u),{immediate:!0}),e.watch(r,u=>L.setOptions(h,u),{immediate:!0})};s.whenever(o,p,{immediate:!0})}}),$={color:{type:String},weight:{type:Number},opacity:{type:Number},fillColor:{type:String}};const ie={__name:"Circle",props:k({center:{type:[Array,Object],required:!0},radius:{type:Number,required:!0}},$),setup(t){const n=t,{center:i,radius:r,color:o,weight:p,opacity:c,fillColor:m}=e.toRefs(n),h=e.computed(()=>n.color!=null),u=e.computed(()=>n.fillColor!=null),f=e.reactive({radius:r,stroke:h,color:o,weight:p,opacity:c,fill:u,fillColor:m}),y=e.inject("map"),l=L.circle(n.center,_(f));return e.provide("layer",l),s.whenever(y,a=>a.addLayer(l),{immediate:!0}),s.whenever(f,a=>L.setOptions(l,_(a),{deep:!0,immediate:!0})),s.whenever(i,a=>l.setLatLng(a)),e.onUnmounted(()=>l.remove()),(a,g)=>e.renderSlot(a.$slots,"default")}};async function se(t=G){return C(`https://unpkg.com/leaflet-geometryutil@${t}/src/leaflet.geometryutil.js`)}async function le(t=x){return await se(),C(`https://unpkg.com/leaflet-arrowheads@${t}/src/leaflet-arrowheads.js`)}const pe={__name:"Polyline",props:k({positions:{type:Array,required:!0},arrows:{type:Object,default:void 0}},$),async setup(t){let n,i;const r=t,{positions:o,color:p,weight:c,opacity:m,fillColor:h}=e.toRefs(r),u=e.computed(()=>r.color!=null),f=e.computed(()=>r.fillColor!=null),y=e.reactive({stroke:u,color:p,weight:c,opacity:m,fill:f,fillColor:h}),l=e.inject("map"),a=L.polyline(r.positions,_(y));return e.provide("layer",a),e.onUnmounted(()=>a.remove()),r.arrows&&([n,i]=e.withAsyncContext(()=>le()),await n,i(),a.arrowheads(r.arrows)),s.whenever(l,g=>g.addLayer(a),{immediate:!0}),s.whenever(y,g=>L.setOptions(a,_(g),{deep:!0,immediate:!0})),s.whenever(o,g=>a.setLatLngs(g)),(g,w)=>e.renderSlot(g.$slots,"default")}},ce={__name:"Polygon",props:k({positions:{type:Array,required:!0}},$),setup(t){const n=t,{positions:i,color:r,weight:o,opacity:p,fillColor:c}=e.toRefs(n),m=e.computed(()=>n.color!=null),h=e.computed(()=>n.fillColor!=null),u=e.reactive({stroke:m,color:r,weight:o,opacity:p,fill:h,fillColor:c}),f=e.inject("map"),y=L.polygon(n.positions,_(u));return e.provide("layer",y),s.whenever(f,l=>l.addLayer(y),{immediate:!0}),s.whenever(u,l=>L.setOptions(y,_(l),{deep:!0,immediate:!0})),s.whenever(i,l=>y.setLatLngs(l)),e.onUnmounted(()=>y.remove()),(l,a)=>e.renderSlot(l.$slots,"default")}};var de=b({props:{position:{type:String,default:void 0},zoomInTitle:{type:String,default:void 0},zoomOutTitle:{type:String,default:void 0}},setup(t){const n=e.inject("map"),i=new L.Control.Zoom(_(k({},t))),r=o=>{var p;(p=o==null?void 0:o.zoomControl)==null||p.remove(),o.addControl(i)};s.whenever(n,r,{immediate:!0})}}),me=b({props:{position:{type:String,default:void 0},maxWidth:{type:Number,default:void 0},imperial:{type:Boolean,default:void 0},metric:{type:Boolean,default:void 0}},async setup(t){const n=e.inject("map");await O(e.inject("leaflet.version"));const i=L.control.scale(_(k({},t)));s.whenever(n,r=>r.addControl(i),{immediate:!0})}});async function ue(t=j){return Promise.all([M(`https://unpkg.com/leaflet.locatecontrol@${t}/dist/L.Control.Locate.min.css`),C(`https://unpkg.com/leaflet.locatecontrol@${t}/dist/L.Control.Locate.min.js`)])}var fe=b({props:{position:{type:String,default:void 0},strings:{type:Object,default:void 0},version:{type:String,default:void 0}},async setup(t){const n=e.inject("map");await O(e.inject("leaflet.version")),await ue(t.version);const i=L.control.locate(_(k({},t)));s.whenever(n,r=>r.addControl(i),{immediate:!0})}});async function ye(t=R){return Promise.all([C(`https://unpkg.com/leaflet-pegman@${t}/leaflet-pegman.js`),M(`https://unpkg.com/leaflet-pegman@${t}/leaflet-pegman.css`)])}var ge=b({emits:["openstreetview","closestreetview"],props:{apiKey:{type:String,default:void 0},position:{type:String,default:"bottomright"},theme:{type:String,default:"leaflet-pegman-v3-small"},version:{type:String,default:void 0}},async setup(t,{emit:n}){const i=e.inject("map");t.apiKey&&await I(t.apiKey),await O(),await ye(t.version);const r=async o=>{new L.Control.Pegman({position:t.position,theme:t.theme}).addTo(o),new MutationObserver(m=>{var h,u;for(const f of m)if(f.type==="childList"){for(const y of f.addedNodes)(h=y.classList)!=null&&h.contains("pegman-marker")&&n("openstreetview");for(const y of f.removedNodes)(u=y.classList)!=null&&u.contains("pegman-marker")&&n("closestreetview")}}).observe(o._container,{childList:!0,subtree:!0})};s.whenever(i,r,{immediate:!0})}}),he=b({props:{locale:{type:String,default:"en"},onlyOneShape:{type:Boolean,default:!1},position:{type:String,default:"topright"},drawControls:{type:Boolean,default:!0},editControls:{type:Boolean,default:!1},drawPolygon:{type:Boolean,default:!1},drawCircle:{type:Boolean,default:!1},drawPolyline:{type:Boolean,default:!1},drawRectangle:{type:Boolean,default:!1},drawMarker:{type:Boolean,default:!1},drawCircleMarker:{type:Boolean,default:!1},drawText:{type:Boolean,default:!1},version:{type:String,default:void 0}},emits:["drawstart","drawend","cancel"],async setup(t,{emit:n}){const i=e.inject("map"),r=o=>{o.pm.addControls(k({},t)),o.pm.enableGlobalEditMode(),o.pm.enableGlobalRemovalMode(),o.pm.setLang(t.locale);const p=L.featureGroup();p.last=function(){return this.getLayers()[this.getLayers().length-1]},t.onlyOneShape&&(o.on("pm:create",c=>c.layer.addTo(p)),o.on("pm:drawstart",()=>{p.eachLayer(c=>c.removeFrom(o)),p.clearLayers()})),o.on("pm:drawstart",()=>n("drawstart")),o.on("pm:drawend",async c=>{await e.nextTick();const m=p.last();if(m===void 0){n("cancel");return}p.last()instanceof L.CircleMarker?n("drawend",{shape:c.shape,center:m.getLatLng(),radius:m.getRadius()}):n("drawend",{shape:c.shape,bounds:m.getLatLngs()})})};s.whenever(i,r,{immediate:!0})}});d.Circle=ie,d.DrawControl=he,d.GoogleMaps=W,d.LocateControl=fe,d.MapContainer=F,d.Mapbox=Z,d.Marker=Y,d.OpenStreetMap=U,d.PegmanControl=ge,d.Polygon=ce,d.Polyline=pe,d.Popup=ae,d.ScaleControl=me,d.Tooltip=re,d.ZoomControl=de,d.vBounce=Q,Object.defineProperties(d,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
