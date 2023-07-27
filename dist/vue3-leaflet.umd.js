(function(c,e){typeof exports=="object"&&typeof module!="undefined"?e(exports,require("vue"),require("@vueuse/core")):typeof define=="function"&&define.amd?define(["exports","vue","@vueuse/core"],e):(c=typeof globalThis!="undefined"?globalThis:c||self,e(c["vue3-leaflet"]={},c.Vue,c.core))})(this,function(c,e,s){"use strict";var $e=Object.defineProperty;var v=Object.getOwnPropertySymbols;var be=Object.prototype.hasOwnProperty,Ae=Object.prototype.propertyIsEnumerable;var U=(c,e,s)=>e in c?$e(c,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):c[e]=s,O=(c,e)=>{for(var s in e||(e={}))be.call(e,s)&&U(c,s,e[s]);if(v)for(var s of v(e))Ae.call(e,s)&&U(c,s,e[s]);return c};const q="1.9.2",Z="0.78.0",K="0.13.5",D="0.1.6",H="2.0.1",W="1.4.0",Y="0.10.1",X="2.13.0",Q="1.4.1",J="1.0.5";function T(t){return Object.assign(t,{render:()=>{}})}function b(t){return typeof t=="object"&&t!==null}function S(t){return b(t)&&Object.keys(t).forEach(n=>{if(b(t[n])){t[n]=S(t[n]);return}typeof t[n]=="undefined"&&(Array.isArray(t)?t.splice(n,1):delete t[n])}),t}async function ee(t){var n;return window.gmapsApi=(n=window.gmapsApi)!=null?n:new Promise((a,r)=>{const o=document.createElement("script");o.type="text/javascript",o.src="https://maps.googleapis.com/maps/api/js?key="+t,o.async=!0,o.addEventListener("error",l=>r(l)),o.addEventListener("abort",l=>r(l)),o.addEventListener("load",()=>{a(!0)}),document.head.appendChild(o)}),window.gmapsApi}async function E(t){return new Promise((n,a)=>{if(document.querySelector(`script[src='${t}']`))return n();const o=document.createElement("script");o.type="text/javascript",o.src=t,o.addEventListener("error",l=>a(l)),o.addEventListener("abort",l=>a(l)),o.addEventListener("load",()=>n()),document.head.appendChild(o)})}async function R(t){return new Promise((n,a)=>{if(document.querySelector(`link[rel='stylesheet'][href='${t}']`))return n();const o=document.createElement("link");o.rel="stylesheet",o.href=t,o.crossOrigin="",o.addEventListener("error",l=>a(l)),o.addEventListener("abort",l=>a(l)),o.addEventListener("load",()=>n()),document.head.appendChild(o)})}async function C(t=q){await Promise.all([E(`https://unpkg.com/leaflet@${t}/dist/leaflet.js`),R(`https://unpkg.com/leaflet@${t}/dist/leaflet.css`)])}const te={__name:"MapContainer",props:{center:{type:[Array,Object],default:()=>{}},zoom:{type:Number,default:13},zoomControl:{type:Boolean,default:!0},scrollWheelZoom:{type:Boolean,default:!0},bounds:{type:Array,default:void 0},version:{type:String,default:void 0}},emits:["ready","move","zoomend"],setup(t,{emit:n}){const a=t,{center:r,zoom:o,zoomControl:l,bounds:p,scrollWheelZoom:u}=e.toRefs(a),f=e.reactive({scrollWheelZoom:u,maxZoom:18}),m=s.templateRef("container"),y=e.ref(),g=e.ref();function h(i,d){d.length>0&&i.fitBounds(d)}return e.provide("map",y),e.provide("layerGroup",g),e.provide("leaflet.version",a.version),e.onMounted(async()=>{await C(a.version);const i=L.map(s.get(m),f);i.setView(a.center,a.zoom),i.on("move",w=>n("move",{event:w,center:i.getCenter(),map:i})),i.on("zoomend",()=>n("zoomend",{zoom:i.getZoom(),bounds:i.getBounds(),map:i}));const d=L.layerGroup();d.addTo(i),s.set(y,i),s.set(g,d),e.watch(r,w=>i.setView(w)),e.watch(o,w=>i.setView(a.center,w),{immediate:!0}),e.watch(l,w=>w?i.zoomControl.addTo(i):i.zoomControl.remove(),{immediate:!0}),s.whenever(p,w=>h(i,w),{immediate:!0}),n("ready",i)}),(i,d)=>(e.openBlock(),e.createElementBlock("div",null,[(e.openBlock(),e.createBlock(e.Suspense,null,{default:e.withCtx(()=>[e.createElementVNode("div",e.mergeProps({ref_key:"container",ref:m},i.$attrs),[y.value?e.renderSlot(i.$slots,"default",{key:0,map:y.value}):e.createCommentVNode("",!0)],16)]),_:3}))]))}},ne={__name:"OpenStreetMap",props:{url:{type:String,default:"https://tile.openstreetmap.org/{z}/{x}/{y}.png"},attribution:{type:String,default:'&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'},type:{type:String,default:"roadmap",validator:t=>["roadmap"].includes(t)}},setup(t){const n=t,a=e.inject("layerGroup"),r=L.tileLayer(n.url,{attribution:n.attribution});return e.provide("layer",e.ref(r)),s.whenever(a,o=>o.addLayer(r),{immediate:!0}),(o,l)=>e.renderSlot(o.$slots,"default")}},oe={__name:"Mapbox",props:{url:{type:String,default:"https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={apiKey}"},apiKey:{type:String,required:!0},attribution:{type:String,default:'&copy <a href="https://www.mapbox.com/about/maps/">Mapbox</a>&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> - <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'},tileSize:{type:Number,default:512},zoomOffset:{type:Number,default:-1},type:{type:String,default:"roadmap",validator:t=>["roadmap"].includes(t)}},async setup(t){let n,a;const r=t;[n,a]=e.withAsyncContext(()=>C(e.inject("leaflet.version"))),await n,a();const o=e.inject("layerGroup"),l=e.reactive({apiKey:r.apiKey,attribution:r.attribution,tileSize:r.tileSize,zoomOffset:r.zoomOffset}),p=L.tileLayer(r.url,l);return e.provide("layer",e.ref(p)),s.whenever(o,u=>u.addLayer(p),{immediate:!0}),(u,f)=>e.renderSlot(u.$slots,"default")}},re={__name:"IGN",props:{attribution:{type:String,default:'&copy; <a href="https://geoservices.ign.fr/">IGN</a>'},type:{type:String,default:"roadmap",validator:t=>["satellite","roadmap"].includes(t)}},setup(t){const n=t,a=e.inject("layerGroup"),r=o(n.type,n.attribution);e.provide("layer",e.ref(r)),s.whenever(a,l=>l.addLayer(r),{immediate:!0}),e.watch(n,l=>{var u;const p=o(l.type,l.attribution);(u=s.get(a))==null||u.addLayer(p),e.provide("layer",p)},{deep:!0});function o(l,p){const u=l==="satellite"?"https://wxs.ign.fr/essentiels/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg":"https://wxs.ign.fr/9ekkq9nqzr2eix5mc8c6hmip/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}&STYLE=normal&FORMAT=image/jpeg",f=l==="satellite"?{minZoom:0,maxZoom:21,attribution:p,tileSize:256}:{minZoom:0,maxZoom:19,attribution:p,tileSize:256};return L.tileLayer(u,f)}return(l,p)=>e.renderSlot(l.$slots,"default")}};async function A(t=K){return E(`https://unpkg.com/leaflet.gridlayer.googlemutant@${t}/dist/Leaflet.GoogleMutant.js`)}async function G(t){return window.gmapsApi?!0:E(`https://maps.googleapis.com/maps/api/js?key=${t}`)}const ae={__name:"GoogleMaps",props:{url:{type:String,default:"https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"},apiKey:{type:String,required:!0},type:{type:String,default:"roadmap",validator:t=>["roadmap","satellite","terrain","hybrid"].includes(t)},version:{type:String,default:void 0}},async setup(t){let n,a;const r=t;[n,a]=e.withAsyncContext(()=>C(e.inject("leaflet.version"))),await n,a(),[n,a]=e.withAsyncContext(()=>A(r.version)),await n,a();const{type:o}=e.toRefs(r),l=e.reactive({type:o}),p=i=>{const d=(k,_)=>L.gridLayer.googleMutant(_).addTo(k);return{load:async(k,_=l)=>(await G(i),d(k,_),{})}},u=e.inject("map"),f=e.reactive({apiKey:r.apiKey,attribution:r.attribution,tileSize:r.tileSize,zoomOffset:r.zoomOffset}),m=L.tileLayer(r.url,f),y=p(r.apiKey),g=e.ref();e.watch(o,()=>h(e.unref(u)));async function h(i){s.set(g,await y.load(i,l))}return e.provide("layer",e.ref(m)),s.whenever(u,i=>h(i),{immediate:!0}),(i,d)=>g.value?e.renderSlot(i.$slots,"default",{key:0}):e.createCommentVNode("",!0)}};async function P(t=Q){return Promise.all([E(`https://unpkg.com/leaflet.markercluster@${t}/dist/leaflet.markercluster.js`),R(`https://unpkg.com/leaflet.markercluster@${t}/dist/MarkerCluster.css`),R(`https://unpkg.com/leaflet.markercluster@${t}/dist/MarkerCluster.Default.css`)])}const ie={__name:"Cluster",async setup(t){let n,a;const r=e.inject("layerGroup");[n,a]=e.withAsyncContext(()=>P()),await n,a();const o=L.markerClusterGroup(),l=e.ref(o);return e.provide("layer",l),e.provide("layerGroup",l),s.get(r).addLayer(o),e.onUnmounted(()=>s.get(r).removeLayer(o)),(p,u)=>e.renderSlot(p.$slots,"default")}},N=()=>({}),se=t=>console.debug(t);async function M(t,n=se){try{await t()}catch(a){n(a)}}const le=["data-marker"],ce={__name:"Marker",props:{position:{type:[Array,Object],required:!0},icon:{type:[String,Object],default:void 0},title:{type:String,default:void 0},alt:{type:String,default:void 0},opacity:{type:Number,default:void 0},tooltip:{type:[String,Node],default:void 0}},emits:["click","load"],async setup(t,{emit:n}){let a,r;const o=t;[a,r]=e.withAsyncContext(()=>C(e.inject("leaflet.version"))),await a,r(),L.Marker.prototype._animateZoom=function(_){if(!this._map)return;const x=this._map._latLngToNewLayerPoint(this._latlng,_.zoom,_.center).round();this._setPos(x)};const{position:l,title:p,alt:u,opacity:f,tooltip:m}=e.toRefs(o),y=e.reactive({title:p,alt:u,opacity:f}),g=e.computed(()=>{if(o.icon instanceof L.Icon)return o.icon;if(o.icon instanceof Object)return L.icon(o.icon);if(typeof o.icon=="string"){const _={iconSize:[50,50],iconAnchor:[22,50],popupAnchor:[0,-50]};return L.icon(O({iconUrl:o.icon},_))}});function h(_){L.setOptions(_,S(y)),M(()=>{_._removeIcon(),_._initIcon()},N),_.update()}const i=e.inject("layerGroup"),d=e.ref();e.provide("marker",d),e.provide("layer",d);const w=e.toRaw(s.get(i)),k=L.marker(o.position,S(y));return k.on("click",()=>n("click",s.get(d))),w.addLayer(k),s.set(d,k),n("load",s.get(d)),s.whenever(l,_=>s.get(d).setLatLng(_)),s.whenever(g,_=>M(()=>e.toRaw(s.get(d)).setIcon(_),N),{immediate:!0}),s.whenever(y,()=>h(s.get(d)),{deep:!0,immediate:!0}),s.whenever(m,_=>s.get(k).bindTooltip(_),{deep:!0,immediate:!0}),e.onUnmounted(()=>{M(()=>{s.get(i).removeLayer(s.get(d)),s.get(d).remove()})}),(_,x)=>d.value?(e.openBlock(),e.createElementBlock("span",{key:0,"data-marker":d.value},[e.renderSlot(_.$slots,"default",{marker:d.value})],8,le)):e.createCommentVNode("",!0)}};function j(t,n){n?t.bounce():t.stopBouncing()}var pe={async mounted(t,n,a){const r=e.toRaw(s.get(a.props["data-marker"]));if(!(r instanceof L.Marker))throw Error("This directive can only be used on markers.");if(n.arg==="options"){r.setBouncingOptions(n.value);return}j(r,n.value)},async updated(t,n,a){const r=e.toRaw(s.get(a.props["data-marker"]));if(n.arg==="options"){r.setBouncingOptions(n.value);return}j(r,n.value)}},de=(t,n)=>{const a=t.__vccOpts||t;for(const[r,o]of n)a[r]=o;return a};if(document&&!document.getElementById("void")){const t=document.createElement("div");t.id="void",t.style.width=0,t.style.height=0,t.style.opacity=0,t.style.display="none",document.body.appendChild(t)}const ue={};function me(t,n,a,r,o,l){return e.openBlock(),e.createBlock(e.Teleport,{to:"#void"},[e.renderSlot(t.$slots,"default")])}var fe=de(ue,[["render",me]]);const ye={ref:"popup-content"},ge={__name:"Popup",props:{position:{type:[Object,Array],default:void 0}},async setup(t){let n,a;const r=t;[n,a]=e.withAsyncContext(()=>C(e.inject("leaflet.version"))),await n,a(),L.Popup.prototype._animateZoom=function(i){if(!this._map)return;const d=this._map._latLngToNewLayerPoint(this._latlng,i.zoom,i.center),w=this._getAnchor();L.DomUtil.setPosition(this._container,d.add(w))},window.fixPopupCloseEvent||(document.addEventListener("click",i=>{let d=i.target;for(;d!=null;){if(d.matches('a[href="#close"]')){i.preventDefault();return}d=d.parentElement}}),window.fixPopupCloseEvent=!0);const{position:o}=e.toRefs(r),l=s.templateRef("popup-content"),p=new L.Popup,u=e.inject("layer"),f=s.useMounted(),m=e.ref(!1);e.provide("layer",p);function y(){p.isOpen()&&(p.toggle(),p.toggle())}function g(){s.get(m)!==!0&&(s.get(u).bindPopup(p),s.set(m,!0),y())}function h(i){var w;if(s.get(f)===!1)return;const d=i.firstElementChild instanceof Element;i.innerHTML.trim().length>0&&(p.setContent(d?i.firstElementChild:i),g()),s.useMutationObserver((w=i.firstElementChild)!=null?w:i,()=>y(),{subtree:!0,childList:!0,characterData:!0})}return s.whenever(o,i=>p.setLatLng(i),{immediate:!0}),e.watch(l,h,{immediate:!0}),(i,d)=>(e.openBlock(),e.createBlock(fe,null,{default:e.withCtx(()=>[e.createElementVNode("div",ye,[e.renderSlot(i.$slots,"default")],512)]),_:3}))}};var he=T({props:{position:{type:[Array,Object],required:!0},text:{type:String,required:!0},direction:{type:String,default:"auto"},offset:{type:Object,default:void 0},permanent:{type:Boolean,default:!1},sticky:{type:Boolean,default:!1},opacity:{type:Number,default:.9}},setup(t){var p;L.Tooltip.prototype._animateZoom=function(u){if(!this._map)return;const f=this._map._latLngToNewLayerPoint(this._latlng,u.zoom,u.center),m=this._getAnchor();L.DomUtil.setPosition(this._container,f.add(m))};const{position:n,text:a}=e.toRefs(t),r=e.reactive({direction:t.direction,offset:(p=t.offset)!=null?p:new L.Point(0,0),permanent:t.permanent,sticky:t.sticky,opacity:t.opacity}),o=e.inject("map"),l=u=>{const f=new L.Tooltip;f.setLatLng(t.position).addTo(u),e.watch(n,m=>f.setLatLng(m)),e.watch(a,m=>f.setContent(m),{immediate:!0}),e.watch(r,m=>L.setOptions(f,m),{immediate:!0})};s.whenever(o,l,{immediate:!0})}}),$={color:{type:String},weight:{type:Number},opacity:{type:Number},fillColor:{type:String}};const Le={__name:"Circle",props:O({center:{type:[Array,Object],required:!0},radius:{type:Number,required:!0}},$),setup(t){const n=t,{center:a,radius:r,color:o,weight:l,opacity:p,fillColor:u}=e.toRefs(n),f=e.computed(()=>n.color!=null),m=e.computed(()=>n.fillColor!=null),y=e.reactive({radius:r,stroke:f,color:o,weight:l,opacity:p,fill:m,fillColor:u}),g=e.inject("layerGroup"),h=L.circle(n.center,S(y));return e.provide("layer",h),s.whenever(g,i=>i.addLayer(h),{immediate:!0}),s.whenever(y,i=>L.setOptions(h,S(i),{deep:!0,immediate:!0})),s.whenever(a,i=>h.setLatLng(i)),e.onUnmounted(()=>h.remove()),(i,d)=>e.renderSlot(i.$slots,"default")}};async function I(t=Y){return E(`https://unpkg.com/leaflet-geometryutil@${t}/src/leaflet.geometryutil.js`)}async function B(t=W){return await I(),E(`https://unpkg.com/leaflet-arrowheads@${t}/src/leaflet-arrowheads.js`)}const _e={__name:"Polyline",props:O({positions:{type:Array,required:!0},arrows:{type:Object,default:void 0}},$),async setup(t){let n,a;const r=t,{positions:o,color:l,weight:p,opacity:u,fillColor:f}=e.toRefs(r),m=e.computed(()=>r.color!=null),y=e.computed(()=>r.fillColor!=null),g=e.reactive({stroke:m,color:l,weight:p,opacity:u,fill:y,fillColor:f}),h=e.inject("layerGroup"),i=L.polyline(r.positions,S(g));return e.provide("layer",i),e.onUnmounted(()=>i.remove()),r.arrows&&([n,a]=e.withAsyncContext(()=>B()),await n,a(),i.arrowheads(r.arrows)),s.whenever(h,d=>d.addLayer(i),{immediate:!0}),s.whenever(g,d=>L.setOptions(i,S(d),{deep:!0,immediate:!0})),s.whenever(o,d=>i.setLatLngs(d)),(d,w)=>e.renderSlot(d.$slots,"default")}},we={__name:"Polygon",props:O({positions:{type:Array,required:!0}},$),setup(t){const n=t,{positions:a,color:r,weight:o,opacity:l,fillColor:p}=e.toRefs(n),u=e.computed(()=>n.color!=null),f=e.computed(()=>n.fillColor!=null),m=e.reactive({stroke:u,color:r,weight:o,opacity:l,fill:f,fillColor:p}),y=e.inject("layerGroup"),g=L.polygon(n.positions,S(m));return e.provide("layer",g),s.whenever(y,h=>h.addLayer(g),{immediate:!0}),s.whenever(m,h=>L.setOptions(g,S(h),{deep:!0,immediate:!0})),s.whenever(a,h=>g.setLatLngs(h)),e.onUnmounted(()=>g.remove()),(h,i)=>e.renderSlot(h.$slots,"default")}};var Se=T({props:{locale:{type:String,default:"en"},onlyOneShape:{type:Boolean,default:!1},position:{type:String,default:"topright"},drawControls:{type:Boolean,default:!0},editControls:{type:Boolean,default:!1},drawPolygon:{type:Boolean,default:!1},drawCircle:{type:Boolean,default:!1},drawPolyline:{type:Boolean,default:!1},drawRectangle:{type:Boolean,default:!1},drawMarker:{type:Boolean,default:!1},drawCircleMarker:{type:Boolean,default:!1},drawText:{type:Boolean,default:!1},version:{type:String,default:void 0}},emits:["drawstart","drawend","cancel"],async setup(t,{emit:n}){const a=e.inject("map"),r=o=>{o.pm.addControls(O({},t)),o.pm.enableGlobalEditMode(),o.pm.enableGlobalRemovalMode(),o.pm.setLang(t.locale);const l=L.featureGroup();l.last=function(){return this.getLayers()[this.getLayers().length-1]},t.onlyOneShape&&(o.on("pm:create",p=>p.layer.addTo(l)),o.on("pm:drawstart",()=>{l.eachLayer(p=>p.removeFrom(o)),l.clearLayers()})),o.on("pm:drawstart",()=>n("drawstart")),o.on("pm:drawend",async p=>{await e.nextTick();const u=l.last();if(u===void 0){n("cancel");return}l.last()instanceof L.CircleMarker?n("drawend",{shape:p.shape,center:u.getLatLng(),radius:u.getRadius()}):n("drawend",{shape:p.shape,bounds:u.getLatLngs()})})};s.whenever(a,r,{immediate:!0})}});async function z(t=J){return Promise.all([E(`https://unpkg.com/@runette/leaflet-fullscreen@${t}/dist/Leaflet.fullscreen.js`),R(`https://unpkg.com/@runette/leaflet-fullscreen@${t}/dist/leaflet.fullscreen.css`)])}var Ee=T({props:{position:{type:String,default:void 0},viewText:{type:String,default:void 0},exitText:{type:String,default:void 0},version:{type:String,default:void 0}},async setup(t){const n=e.inject("map");await C(e.inject("leaflet.version")),await z(t.version);const a=e.reactive({position:t.position,title:{false:t.viewText,true:t.exitText}}),r=new L.Control.Fullscreen(S(a));s.whenever(n,o=>o.addControl(r),{immediate:!0})}});async function V(t=Z){return Promise.all([R(`https://unpkg.com/leaflet.locatecontrol@${t}/dist/L.Control.Locate.min.css`),E(`https://unpkg.com/leaflet.locatecontrol@${t}/dist/L.Control.Locate.min.js`)])}var Ce=T({props:{position:{type:String,default:void 0},strings:{type:Object,default:void 0},version:{type:String,default:void 0}},async setup(t){const n=e.inject("map");await C(e.inject("leaflet.version")),await V(t.version);const a=L.control.locate(S(O({},t)));s.whenever(n,r=>r.addControl(a),{immediate:!0})}});async function F(t=D){return Promise.all([E(`https://unpkg.com/leaflet-pegman@${t}/leaflet-pegman.js`),R(`https://unpkg.com/leaflet-pegman@${t}/leaflet-pegman.css`)])}var Oe=T({emits:["openstreetview","closestreetview"],props:{apiKey:{type:String,default:void 0},position:{type:String,default:"bottomright"},theme:{type:String,default:"leaflet-pegman-v3-small"},version:{type:String,default:void 0}},async setup(t,{emit:n}){const a=e.inject("map");t.apiKey&&await ee(t.apiKey),await C(),await F(t.version);const r=async o=>{new L.Control.Pegman({position:t.position,theme:t.theme}).addTo(o),new MutationObserver(u=>{var f,m;for(const y of u)if(y.type==="childList"){for(const g of y.addedNodes)(f=g.classList)!=null&&f.contains("pegman-marker")&&n("openstreetview");for(const g of y.removedNodes)(m=g.classList)!=null&&m.contains("pegman-marker")&&n("closestreetview")}}).observe(o._container,{childList:!0,subtree:!0})};s.whenever(a,r,{immediate:!0})}}),ke=T({props:{position:{type:String,default:void 0},maxWidth:{type:Number,default:void 0},imperial:{type:Boolean,default:void 0},metric:{type:Boolean,default:void 0}},async setup(t){const n=e.inject("map");await C(e.inject("leaflet.version"));const a=L.control.scale(S(O({},t)));s.whenever(n,r=>r.addControl(a),{immediate:!0})}}),Te=T({props:{position:{type:String,default:void 0},zoomInTitle:{type:String,default:void 0},zoomOutTitle:{type:String,default:void 0}},setup(t){const n=e.inject("map"),a=new L.Control.Zoom(S(O({},t))),r=o=>{var l;(l=o==null?void 0:o.zoomControl)==null||l.remove(),o.addControl(a)};s.whenever(n,r,{immediate:!0})}});async function Re(t=X){return Promise.all([E(`https://unpkg.com/@geoman-io/leaflet-geoman-free@${t}/dist/leaflet-geoman.min.js`),R(`https://unpkg.com/@geoman-io/leaflet-geoman-free@${t}/dist/leaflet-geoman.css`)])}async function Me(t=H){return E(`https://unpkg.com/leaflet.smooth_marker_bouncing@${t}/dist/bundle.js`)}c.Circle=Le,c.Cluster=ie,c.DrawControl=Se,c.FullScreenControl=Ee,c.GoogleMaps=ae,c.IGN=re,c.LocateControl=Ce,c.MapContainer=te,c.Mapbox=oe,c.Marker=ce,c.OpenStreetMap=ne,c.PegmanControl=Oe,c.Polygon=we,c.Polyline=_e,c.Popup=ge,c.ScaleControl=ke,c.Tooltip=he,c.ZoomControl=Te,c.importGoogleMapsApi=G,c.importLeaflet=C,c.importLeafletArrowHeads=B,c.importLeafletFullScreen=z,c.importLeafletGeoman=Re,c.importLeafletGeometryUtil=I,c.importLeafletGoogleMutant=A,c.importLeafletLocateControl=V,c.importLeafletMarkerCluster=P,c.importLeafletPegman=F,c.importLeafletSmoothMarkerBouncing=Me,c.vBounce=pe,Object.defineProperties(c,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
