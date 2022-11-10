(function(p,e){typeof exports=="object"&&typeof module!="undefined"?e(exports,require("vue"),require("@vueuse/core")):typeof define=="function"&&define.amd?define(["exports","vue","@vueuse/core"],e):(p=typeof globalThis!="undefined"?globalThis:p||self,e(p["vue3-leaflet"]={},p.Vue,p.core))})(this,function(p,e,i){"use strict";var ye=Object.defineProperty;var B=Object.getOwnPropertySymbols;var ge=Object.prototype.hasOwnProperty,he=Object.prototype.propertyIsEnumerable;var N=(p,e,i)=>e in p?ye(p,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):p[e]=i,C=(p,e)=>{for(var i in e||(e={}))ge.call(e,i)&&N(p,i,e[i]);if(B)for(var i of B(e))he.call(e,i)&&N(p,i,e[i]);return p};const T="1.9.2",v="0.78.0",z="0.13.5",R="0.1.6",$="2.0.1",G="1.4.0",x="0.10.1",V="2.13.0";function _(t){return Object.assign(t,{render:()=>{}})}function P(t){return typeof t=="object"&&t!==null}function w(t){return P(t)&&Object.keys(t).forEach(o=>{if(P(t[o])){t[o]=w(t[o]);return}typeof t[o]=="undefined"&&(Array.isArray(t)?t.splice(o,1):delete t[o])}),t}async function I(t){var o;return window.gmapsApi=(o=window.gmapsApi)!=null?o:new Promise((s,r)=>{const n=document.createElement("script");n.type="text/javascript",n.src="https://maps.googleapis.com/maps/api/js?key="+t,n.async=!0,n.addEventListener("error",l=>r(l)),n.addEventListener("abort",l=>r(l)),n.addEventListener("load",()=>{s(!0)}),document.head.appendChild(n)}),window.gmapsApi}async function S(t){return new Promise((o,s)=>{if(document.querySelector(`script[src='${t}']`))return o();const n=document.createElement("script");n.type="text/javascript",n.src=t,n.addEventListener("error",l=>s(l)),n.addEventListener("abort",l=>s(l)),n.addEventListener("load",()=>o()),document.head.appendChild(n)})}async function b(t){return new Promise((o,s)=>{if(document.querySelector(`link[rel='stylesheet'][href='${t}']`))return o();const n=document.createElement("link");n.rel="stylesheet",n.href=t,n.crossOrigin="",n.addEventListener("error",l=>s(l)),n.addEventListener("abort",l=>s(l)),n.addEventListener("load",()=>o()),document.head.appendChild(n)})}async function q(t=V){return Promise.all([S(`https://unpkg.com/@geoman-io/leaflet-geoman-free@${t}/dist/leaflet-geoman.min.js`),b(`https://unpkg.com/@geoman-io/leaflet-geoman-free@${t}/dist/leaflet-geoman.css`)])}async function K(t=$){return S(`https://unpkg.com/leaflet.smooth_marker_bouncing@${t}/dist/bundle.js`)}async function E(t=T){await Promise.all([S(`https://unpkg.com/leaflet@${t}/dist/leaflet.js`),b(`https://unpkg.com/leaflet@${t}/dist/leaflet.css`)]),await Promise.all([K(),q()])}const F={__name:"MapContainer",props:{center:{type:[Array,Object],default:()=>{}},zoom:{type:Number,default:13},zoomControl:{type:Boolean,default:!0},scrollWheelZoom:{type:Boolean,default:!0},bounds:{type:Array,default:void 0},version:{type:String,default:void 0}},emits:["ready","move","zoomend"],setup(t,{emit:o}){const s=t,{center:r,zoom:n,zoomControl:l,bounds:u,scrollWheelZoom:d}=e.toRefs(s),h=e.reactive({scrollWheelZoom:d,maxZoom:18}),g=i.templateRef("container"),f=e.ref();function m(a,c){c.length>0&&a.fitBounds(c)}return e.provide("map",f),e.provide("leaflet.version",s.version),e.onMounted(async()=>{await E(s.version);const a=L.map(i.get(g),h);a.setView(s.center,s.zoom),e.watch(r,c=>a.setView(c)),e.watch(n,c=>a.setView(s.center,c),{immediate:!0}),e.watch(l,c=>c?a.zoomControl.addTo(a):a.zoomControl.remove(),{immediate:!0}),i.whenever(u,c=>m(a,c),{immediate:!0}),i.set(f,a),a.on("move",c=>o("move",{event:c,center:a.getCenter(),map:a})),a.on("zoomend",()=>o("zoomend",{zoom:a.getZoom(),bounds:a.getBounds(),map:a})),o("ready",a)}),(a,c)=>(e.openBlock(),e.createBlock(e.Suspense,null,{default:e.withCtx(()=>[e.createElementVNode("div",e.mergeProps({ref_key:"container",ref:g},a.$attrs),[f.value?e.renderSlot(a.$slots,"default",{key:0,map:f.value}):e.createCommentVNode("",!0)],16)]),_:3}))}},U={__name:"OpenStreetMap",props:{url:{type:String,default:"https://tile.openstreetmap.org/{z}/{x}/{y}.png"},attribution:{type:String,default:'&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'},type:{type:String,default:"roadmap",validator:t=>["roadmap"].includes(t)}},setup(t){const o=t,s=e.inject("map"),r=L.tileLayer(o.url,{attribution:o.attribution});return e.provide("layer",r),i.whenever(s,n=>n.addLayer(r),{immediate:!0}),(n,l)=>e.renderSlot(n.$slots,"default")}},Z={__name:"Mapbox",props:{url:{type:String,default:"https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={apiKey}"},apiKey:{type:String,required:!0},attribution:{type:String,default:'&copy <a href="https://www.mapbox.com/about/maps/">Mapbox</a>&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> - <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'},tileSize:{type:Number,default:512},zoomOffset:{type:Number,default:-1},type:{type:String,default:"roadmap",validator:t=>["roadmap"].includes(t)}},async setup(t){let o,s;const r=t;[o,s]=e.withAsyncContext(()=>E(e.inject("leaflet.version"))),await o,s();const n=e.inject("map"),l=e.reactive({apiKey:r.apiKey,attribution:r.attribution,tileSize:r.tileSize,zoomOffset:r.zoomOffset}),u=L.tileLayer(r.url,l);return e.provide("layer",u),i.whenever(n,d=>d.addLayer(u),{immediate:!0}),(d,h)=>e.renderSlot(d.$slots,"default")}};async function D(t=z){return S(`https://unpkg.com/leaflet.gridlayer.googlemutant@${t}/dist/Leaflet.GoogleMutant.js`)}async function H(t){return window.gmapsApi?!0:S(`https://maps.googleapis.com/maps/api/js?key=${t}`)}const W={__name:"GoogleMaps",props:{url:{type:String,default:"https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"},apiKey:{type:String,required:!0},type:{type:String,default:"roadmap",validator:t=>["roadmap","satellite","terrain","hybrid"].includes(t)},version:{type:String,default:void 0}},async setup(t){let o,s;const r=t;[o,s]=e.withAsyncContext(()=>E(e.inject("leaflet.version"))),await o,s(),[o,s]=e.withAsyncContext(()=>D(r.version)),await o,s();const{type:n}=e.toRefs(r),l=e.reactive({type:n}),u=c=>{const y=(k,M)=>L.gridLayer.googleMutant(M).addTo(k);return{load:async(k,M=l)=>(await H(c),y(k,M),{})}},d=e.inject("map"),h=e.reactive({apiKey:r.apiKey,attribution:r.attribution,tileSize:r.tileSize,zoomOffset:r.zoomOffset}),g=L.tileLayer(r.url,h),f=u(r.apiKey),m=e.ref();i.whenever(m,(c,y)=>y==null?void 0:y.remove()),e.watch(n,()=>a(e.unref(d)));async function a(c){i.set(m,await f.load(c,l))}return e.provide("layer",g),i.whenever(d,c=>a(c),{immediate:!0}),(c,y)=>m.value?e.renderSlot(c.$slots,"default",{key:0}):e.createCommentVNode("",!0)}},J=["data-marker"],Y={__name:"Marker",props:{position:{type:[Array,Object],required:!0},icon:{type:[String,Object],default:void 0},title:{type:String,default:void 0},alt:{type:String,default:void 0},opacity:{type:Number,default:void 0},tooltip:{type:String,default:void 0}},emits:["click","load"],async setup(t,{emit:o}){let s,r;const n=t;[s,r]=e.withAsyncContext(()=>E(e.inject("leaflet.version"))),await s,r(),L.Marker.prototype._animateZoom=function(y){if(!this._map)return;const O=this._map._latLngToNewLayerPoint(this._latlng,y.zoom,y.center).round();this._setPos(O)};const{position:l,title:u,alt:d,opacity:h}=e.toRefs(n),g=e.reactive({title:u,alt:d,opacity:h}),f=e.computed(()=>{if(n.icon instanceof L.Icon)return n.icon;if(n.icon instanceof Object)return L.icon(n.icon);if(typeof n.icon=="string"){const y={iconSize:[50,50],iconAnchor:[22,50],popupAnchor:[0,-50]};return L.icon(C({iconUrl:n.icon},y))}}),m=e.inject("map"),a=e.ref();e.provide("layer",a);function c(y){L.setOptions(y,w(g)),y._removeIcon(),y._initIcon(),y.update()}return e.onMounted(()=>{i.whenever(m,y=>{const O=L.marker(n.position,w(g));O.on("click",()=>o("click",O)),i.set(a,O),y.addLayer(i.get(a)),o("load",i.get(a)),i.whenever(l,k=>i.get(a).setLatLng(k)),i.whenever(f,k=>i.get(a).setIcon(k),{deep:!0,immediate:!0}),i.whenever(g,()=>c(i.get(a)),{deep:!0,immediate:!0})},{immediate:!0})}),e.onUnmounted(()=>i.get(a).remove()),(y,O)=>a.value?(e.openBlock(),e.createElementBlock("span",{key:0,"data-marker":a.value},[e.renderSlot(y.$slots,"default",{marker:a.value})],8,J)):e.createCommentVNode("",!0)}};function j(t,o){o?t.bounce():t.stopBouncing()}var Q={async mounted(t,o,s){const r=e.toRaw(s.props["data-marker"]);if(!(r instanceof L.Marker))throw Error("This directive can only be used on markers.");if(o.arg==="options"){r.setBouncingOptions(o.value);return}j(r,o.value)},async updated(t,o,s){const r=e.toRaw(s.props["data-marker"]);if(o.arg==="options"){r.setBouncingOptions(o.value);return}j(r,o.value)}};const X={style:{opacity:"0"}},ee={ref:"popup-content",id:"popup-container"},te={__name:"Popup",props:{position:{type:[Object,Array],default:void 0}},async setup(t){let o,s;const r=t;[o,s]=e.withAsyncContext(()=>E(e.inject("leaflet.version"))),await o,s(),L.Popup.prototype._animateZoom=function(a){if(!this._map)return;const c=this._map._latLngToNewLayerPoint(this._latlng,a.zoom,a.center),y=this._getAnchor();L.DomUtil.setPosition(this._container,c.add(y))},window.fixPopupCloseEvent||(document.addEventListener("click",a=>{let c=a.target;for(;c!=null;){if(c.matches('a[href="#close"]')){a.preventDefault();return}c=c.parentElement}}),window.fixPopupCloseEvent=!0);const{position:n}=e.toRefs(r),l=i.templateRef("popup-content"),u=new L.Popup,d=e.inject("layer"),h=i.useMounted(),g=e.ref(!1);e.provide("layer",u);function f(){i.get(g)!==!0&&(i.get(d).bindPopup(u),i.set(g,!0))}function m(a){if(i.get(h)===!1)return;const c=a.firstElementChild instanceof Element;a.innerHTML.trim().length>0&&(u.setContent(c?a.firstElementChild:a),f())}return i.whenever(n,a=>u.setLatLng(a),{immediate:!0}),e.watch(l,m,{immediate:!0}),(a,c)=>(e.openBlock(),e.createElementBlock("div",X,[e.createElementVNode("div",ee,[e.renderSlot(a.$slots,"default")],512)]))}};var ne=_({props:{position:{type:[Array,Object],required:!0},text:{type:String,required:!0},direction:{type:String,default:"auto"},offset:{type:Object,default:void 0},permanent:{type:Boolean,default:!1},sticky:{type:Boolean,default:!1},opacity:{type:Number,default:.9}},setup(t){var u;const{position:o,text:s}=e.toRefs(t),r=e.reactive({direction:t.direction,offset:(u=t.offset)!=null?u:new L.Point(0,0),permanent:t.permanent,sticky:t.sticky,opacity:t.opacity}),n=e.inject("map"),l=new L.Tooltip;l.setLatLng(t.position).addTo(n),e.watch(o,d=>l.setLatLng(d)),e.watch(s,d=>l.setContent(d),{immediate:!0}),e.watch(r,d=>L.setOptions(l,d),{immediate:!0})}}),A={color:{type:String},weight:{type:Number},opacity:{type:Number},fillColor:{type:String}},oe=_({props:C({center:{type:[Array,Object],required:!0},radius:{type:Number,required:!0}},A),setup(t){const{center:o,radius:s,color:r,weight:n,opacity:l,fillColor:u}=e.toRefs(t),d=e.computed(()=>t.color!=null),h=e.computed(()=>t.fillColor!=null),g=e.reactive({radius:s,stroke:d,color:r,weight:n,opacity:l,fill:h,fillColor:u}),f=e.inject("map"),m=L.circle(t.center,w(g));e.provide("layer",m),i.whenever(f,a=>a.addLayer(m),{immediate:!0}),i.whenever(g,a=>L.setOptions(m,w(a),{deep:!0,immediate:!0})),i.whenever(o,a=>m.setLatLng(a)),e.onUnmounted(()=>m.remove())}});async function ae(t=x){return S(`https://unpkg.com/leaflet-geometryutil@${t}/src/leaflet.geometryutil.js`)}async function re(t=G){return await ae(),S(`https://unpkg.com/leaflet-arrowheads@${t}/src/leaflet-arrowheads.js`)}var ie=_({props:C({positions:{type:Array,required:!0},arrows:{type:Object,default:void 0}},A),async setup(t){const{positions:o,color:s,weight:r,opacity:n,fillColor:l}=e.toRefs(t),u=e.computed(()=>t.color!=null),d=e.computed(()=>t.fillColor!=null),h=e.reactive({stroke:u,color:s,weight:r,opacity:n,fill:d,fillColor:l}),g=e.inject("map"),f=L.polyline(t.positions,w(h));e.provide("layer",f),e.onUnmounted(()=>f.remove()),t.arrows&&(await re(),f.arrowheads(t.arrows)),i.whenever(g,m=>m.addLayer(f),{immediate:!0}),i.whenever(h,m=>L.setOptions(f,w(m),{deep:!0,immediate:!0})),i.whenever(o,m=>f.setLatLngs(m))}}),se=_({props:C({positions:{type:Array,required:!0}},A),setup(t){const{positions:o,color:s,weight:r,opacity:n,fillColor:l}=e.toRefs(t),u=e.computed(()=>t.color!=null),d=e.computed(()=>t.fillColor!=null),h=e.reactive({stroke:u,color:s,weight:r,opacity:n,fill:d,fillColor:l}),g=e.inject("map"),f=L.polygon(t.positions,w(h));e.provide("layer",f),i.whenever(g,m=>m.addLayer(f),{immediate:!0}),i.whenever(h,m=>L.setOptions(f,w(m),{deep:!0,immediate:!0})),i.whenever(o,m=>f.setLatLngs(m)),e.onUnmounted(()=>f.remove())}}),le=_({props:{position:{type:String,default:void 0},zoomInTitle:{type:String,default:void 0},zoomOutTitle:{type:String,default:void 0}},setup(t){const o=e.inject("map"),s=new L.Control.Zoom(w(C({},t))),r=n=>{var l;(l=n==null?void 0:n.zoomControl)==null||l.remove(),n.addControl(s)};i.whenever(o,r,{immediate:!0})}}),ce=_({props:{position:{type:String,default:void 0},maxWidth:{type:Number,default:void 0},imperial:{type:Boolean,default:void 0},metric:{type:Boolean,default:void 0}},async setup(t){const o=e.inject("map");await E(e.inject("leaflet.version"));const s=L.control.scale(w(C({},t)));i.whenever(o,r=>r.addControl(s),{immediate:!0})}});async function pe(t=v){return Promise.all([b(`https://unpkg.com/leaflet.locatecontrol@${t}/dist/L.Control.Locate.min.css`),S(`https://unpkg.com/leaflet.locatecontrol@${t}/dist/L.Control.Locate.min.js`)])}var de=_({props:{position:{type:String,default:void 0},strings:{type:Object,default:void 0},version:{type:String,default:void 0}},async setup(t){const o=e.inject("map");await E(e.inject("leaflet.version")),await pe(t.version);const s=L.control.locate(w(C({},t)));i.whenever(o,r=>r.addControl(s),{immediate:!0})}});async function me(t=R){return Promise.all([S(`https://unpkg.com/leaflet-pegman@${t}/leaflet-pegman.js`),b(`https://unpkg.com/leaflet-pegman@${t}/leaflet-pegman.css`)])}var ue=_({emits:["openstreetview","closestreetview"],props:{apiKey:{type:String,default:void 0},position:{type:String,default:"bottomright"},theme:{type:String,default:"leaflet-pegman-v3-small"},version:{type:String,default:void 0}},async setup(t,{emit:o}){const s=e.inject("map");t.apiKey&&await I(t.apiKey),await E(),await me(t.version);const r=async n=>{new L.Control.Pegman({position:t.position,theme:t.theme}).addTo(n),new MutationObserver(d=>{var h,g;for(const f of d)if(f.type==="childList"){for(const m of f.addedNodes)(h=m.classList)!=null&&h.contains("pegman-marker")&&o("openstreetview");for(const m of f.removedNodes)(g=m.classList)!=null&&g.contains("pegman-marker")&&o("closestreetview")}}).observe(n._container,{childList:!0,subtree:!0})};i.whenever(s,r,{immediate:!0})}}),fe=_({props:{locale:{type:String,default:"en"},onlyOneShape:{type:Boolean,default:!1},position:{type:String,default:"topright"},drawControls:{type:Boolean,default:!0},editControls:{type:Boolean,default:!1},drawPolygon:{type:Boolean,default:!1},drawCircle:{type:Boolean,default:!1},drawPolyline:{type:Boolean,default:!1},drawRectangle:{type:Boolean,default:!1},drawMarker:{type:Boolean,default:!1},drawCircleMarker:{type:Boolean,default:!1},drawText:{type:Boolean,default:!1},version:{type:String,default:void 0}},emits:["drawstart","drawend","cancel"],async setup(t,{emit:o}){const s=e.inject("map"),r=n=>{n.pm.addControls(C({},t)),n.pm.enableGlobalEditMode(),n.pm.enableGlobalRemovalMode(),n.pm.setLang(t.locale);const l=L.featureGroup();l.last=function(){return this.getLayers()[this.getLayers().length-1]},t.onlyOneShape&&(n.on("pm:create",u=>u.layer.addTo(l)),n.on("pm:drawstart",()=>{l.eachLayer(u=>u.removeFrom(n)),l.clearLayers()})),n.on("pm:drawstart",()=>o("drawstart")),n.on("pm:drawend",async u=>{await e.nextTick();const d=l.last();if(d===void 0){o("cancel");return}l.last()instanceof L.CircleMarker?o("drawend",{shape:u.shape,center:d.getLatLng(),radius:d.getRadius()}):o("drawend",{shape:u.shape,bounds:d.getLatLngs()})})};i.whenever(s,r,{immediate:!0})}});p.Circle=oe,p.DrawControl=fe,p.GoogleMaps=W,p.LocateControl=de,p.MapContainer=F,p.Mapbox=Z,p.Marker=Y,p.OpenStreetMap=U,p.PegmanControl=ue,p.Polygon=se,p.Polyline=ie,p.Popup=te,p.ScaleControl=ce,p.Tooltip=ne,p.ZoomControl=le,p.vBounce=Q,Object.defineProperties(p,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
