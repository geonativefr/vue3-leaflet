(function(_,u){typeof exports=="object"&&typeof module!="undefined"?u(exports,require("vue"),require("leaflet"),require("@vueuse/core"),require("leaflet.gridlayer.googlemutant/dist/Leaflet.GoogleMutant.js"),require("leaflet.smooth_marker_bouncing")):typeof define=="function"&&define.amd?define(["exports","vue","leaflet","@vueuse/core","leaflet.gridlayer.googlemutant/dist/Leaflet.GoogleMutant.js","leaflet.smooth_marker_bouncing"],u):(_=typeof globalThis!="undefined"?globalThis:_||self,u(_["vue3-leaflet"]={},_.Vue,_.L,_.core))})(this,function(_,u,b,g){"use strict";var kt=Object.defineProperty,Tt=Object.defineProperties;var Ut=Object.getOwnPropertyDescriptors;var q=Object.getOwnPropertySymbols;var Q=Object.prototype.hasOwnProperty,tt=Object.prototype.propertyIsEnumerable;var X=(_,u,b)=>u in _?kt(_,u,{enumerable:!0,configurable:!0,writable:!0,value:b}):_[u]=b,k=(_,u)=>{for(var b in u||(u={}))Q.call(u,b)&&X(_,b,u[b]);if(q)for(var b of q(u))tt.call(u,b)&&X(_,b,u[b]);return _},et=(_,u)=>Tt(_,Ut(u));var it=(_,u)=>{var b={};for(var g in _)Q.call(_,g)&&u.indexOf(g)<0&&(b[g]=_[g]);if(_!=null&&q)for(var g of q(_))u.indexOf(g)<0&&tt.call(_,g)&&(b[g]=_[g]);return b};function nt(s){return s&&typeof s=="object"&&"default"in s?s:{default:s}}var x=nt(b);const ot={__name:"MapContainer",props:{center:{type:[b.LatLng,Array,Object],default:()=>new b.LatLng(0,0)},zoom:{type:Number,default:13},zoomControl:{type:Boolean,default:!0},scrollWheelZoom:{type:Boolean,default:!0},bounds:{type:Array,default:void 0}},emits:["ready","move","zoomend"],setup(s,{emit:n}){const t=s,{center:i,zoom:o,zoomControl:r,bounds:c,scrollWheelZoom:h}=u.toRefs(t),f=u.reactive({scrollWheelZoom:h}),e=g.templateRef("container"),a=u.ref();function l(d,p){p.length>0&&d.fitBounds(p)}return u.onMounted(()=>{const d=new b.Map(g.get(e),f);u.provide("map",d),u.watch(i,p=>d.setView(p,t.zoom),{immediate:!0}),u.watch(o,p=>d.setView(t.center,p),{immediate:!0}),u.watch(r,p=>p?d.zoomControl.addTo(d):d.zoomControl.remove(),{immediate:!0}),g.whenever(c,p=>l(d,p),{immediate:!0}),g.set(a,d),d.on("move",p=>n("move",{event:p,center:d.getCenter()})),d.on("zoomend",()=>n("zoomend",d.getZoom())),n("ready",d)}),(d,p)=>(u.openBlock(),u.createElementBlock("div",{ref_key:"container",ref:e},[a.value?u.renderSlot(d.$slots,"default",{key:0,map:a.value}):u.createCommentVNode("",!0)],512))}},st={__name:"OpenStreetMap",props:{url:{type:String,default:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"},attribution:{type:String,default:'&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'},type:{type:String,default:"roadmap",validator:s=>["roadmap"].includes(s)}},setup(s){const n=s,t=u.ref(u.inject("map")),i=x.default.tileLayer(n.url,{attribution:n.attribution});return u.provide("layer",i),g.whenever(t,o=>o.addLayer(i),{immediate:!0}),(o,r)=>u.renderSlot(o.$slots,"default")}},rt={__name:"Mapbox",props:{url:{type:String,default:"https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={apiKey}"},apiKey:{type:String,required:!0},attribution:{type:String,default:'&copy <a href="https://www.mapbox.com/about/maps/">Mapbox</a>&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> - <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'},tileSize:{type:Number,default:512},zoomOffset:{type:Number,default:-1},type:{type:String,default:"roadmap",validator:s=>["roadmap"].includes(s)}},setup(s){const n=s,t=u.ref(u.inject("map")),i=u.reactive({apiKey:n.apiKey,attribution:n.attribution,tileSize:n.tileSize,zoomOffset:n.zoomOffset}),o=x.default.tileLayer(n.url,i);return u.provide("layer",o),g.whenever(t,r=>r.addLayer(o),{immediate:!0}),(r,c)=>u.renderSlot(r.$slots,"default")}},at={__name:"GoogleMaps",props:{url:{type:String,default:"https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"},apiKey:{type:String,required:!0},type:{type:String,default:"roadmap",validator:s=>["roadmap","satellite","terrain","hybrid"].includes(s)}},setup(s){const n=s,{type:t}=u.toRefs(n),i=u.reactive({type:t}),o=l=>{var m;window.gmapsApiLoaded=(m=window.gmapsApiLoaded)!=null?m:!1;const d=(w,v)=>x.default.gridLayer.googleMutant(v).addTo(w);return{load:async(w,v=i)=>new Promise((M,C)=>{if(window.gmapsApiLoaded===!0)return M(d(w,v));const P=document.createElement("script");P.type="text/javascript",P.src="https://maps.googleapis.com/maps/api/js?key="+l,P.async=!0,P.addEventListener("error",A=>C(A)),P.addEventListener("abort",A=>C(A)),P.addEventListener("load",()=>{window.L=x.default,window.gmapsApiLoaded=!0,M(d(w,v))}),document.head.appendChild(P)})}},r=u.ref(u.inject("map")),c=u.reactive({apiKey:n.apiKey,attribution:n.attribution,tileSize:n.tileSize,zoomOffset:n.zoomOffset}),h=x.default.tileLayer(n.url,c),f=o(n.apiKey),e=u.ref();g.whenever(e,(l,d)=>d==null?void 0:d.remove()),u.watch(t,()=>a(u.unref(r)));async function a(l){g.set(e,await f.load(l,i))}return u.provide("layer",h),g.whenever(r,l=>a(l),{immediate:!0}),(l,d)=>u.renderSlot(l.$slots,"default")}};function I(s){return Object.assign(s,{render:()=>{}})}function H(s){return typeof s=="object"&&s!==null}function U(s){return H(s)&&Object.keys(s).forEach(n=>{if(H(s[n])){s[n]=U(s[n]);return}typeof s[n]=="undefined"&&(Array.isArray(s)?s.splice(n,1):delete s[n])}),s}const lt={__name:"Marker",props:{position:{type:[b.LatLng,Array,Object],required:!0},icon:{type:[String,Object,b.Icon],default:void 0},title:{type:String,default:void 0},alt:{type:String,default:void 0},opacity:{type:Number,default:void 0},tooltip:{type:String,default:void 0},bounce:{type:[Boolean,Number],default:!1},bounceHeight:{type:Number,default:void 0},contractHeight:{type:Number,default:void 0},bounceSpeed:{type:Number,default:void 0},contractSpeed:{type:Number,default:void 0},shadowAngle:{type:Number,default:void 0},elastic:{type:Boolean,default:void 0},exclusive:{type:Boolean,default:void 0}},emits:["click","bounceend"],setup(s,{emit:n}){const t=s;b.Marker.prototype._animateZoom=function(S){if(!this._map)return;const E=this._map._latLngToNewLayerPoint(this._latlng,S.zoom,S.center).round();this._setPos(E)};const{position:i,title:o,alt:r,opacity:c,bounce:h,bounceHeight:f,contractHeight:e,bounceSpeed:a,contractSpeed:l,shadowAngle:d,elastic:p,exclusive:m}=u.toRefs(t),w=u.reactive({title:o,alt:r,opacity:c}),v=u.computed(()=>{if(t.icon instanceof b.Icon)return t.icon;if(t.icon instanceof Object)return x.default.icon(t.icon);if(typeof t.icon=="string"){const S={iconSize:[50,50],iconAnchor:[22,50],popupAnchor:[0,-50]};return x.default.icon(k({iconUrl:t.icon},S))}}),M=u.reactive({bounceHeight:f,contractHeight:e,bounceSpeed:a,contractSpeed:l,shadowAngle:d,elastic:p,exclusive:m}),C=u.ref(u.inject("map")),P=x.default.marker(t.position,U(w));u.provide("layer",P),P.on("click",()=>n("click",P)),P.on("bounceend",()=>n("bounceend"));function A(S,E){if(typeof E=="boolean"){E?S.bounce():S.stopBouncing();return}S.bounce(E)}function R(S){x.default.setOptions(S,U(w)),S._removeIcon(),S._initIcon(),S.update()}return g.whenever(C,S=>S.addLayer(P),{immediate:!0}),g.whenever(i,S=>P.setLatLng(S)),g.whenever(v,S=>P.setIcon(S),{deep:!0,immediate:!0}),g.whenever(w,()=>R(P),{deep:!0,immediate:!0}),g.whenever(M,S=>P.setBouncingOptions(U(S)),{deep:!0,immediate:!0}),u.watch(h,S=>A(P,S),{immediate:!0}),u.onUnmounted(()=>P.remove()),(S,E)=>u.renderSlot(S.$slots,"default",{marker:u.unref(P)})}},ct={style:{opacity:"0"}},ht={ref:"popup-content",id:"popup-container"},dt={__name:"Popup",props:{position:{type:b.LatLng,default:void 0}},setup(s){const n=s;b.Popup.prototype._animateZoom=function(a){if(!this._map)return;const l=this._map._latLngToNewLayerPoint(this._latlng,a.zoom,a.center),d=this._getAnchor();L.DomUtil.setPosition(this._container,l.add(d))},window.fixPopupCloseEvent||(document.addEventListener("click",a=>{let l=a.target;for(;l!=null;){if(l.matches('a[href="#close"]')){a.preventDefault();return}l=l.parentElement}}),window.fixPopupCloseEvent=!0);const{position:t}=u.toRefs(n),i=g.templateRef("popup-content"),o=new b.Popup,r=u.inject("layer"),c=g.useMounted(),h=u.ref(!1);u.provide("layer",o);function f(){g.get(h)!==!0&&(g.get(r).bindPopup(o),g.set(h,!0))}function e(a){if(g.get(c)===!1)return;const l=a.firstElementChild instanceof Element;a.innerHTML.trim().length>0&&(o.setContent(l?a.firstElementChild:a),f())}return g.whenever(t,a=>o.setLatLng(a),{immediate:!0}),u.watch(i,e,{immediate:!0}),(a,l)=>(u.openBlock(),u.createElementBlock("div",ct,[u.createElementVNode("div",ht,[u.renderSlot(a.$slots,"default")],512)]))}};var V={color:{type:String},weight:{type:Number},opacity:{type:Number},fillColor:{type:String}},ut=I({props:k({center:{type:[b.LatLng,Array,Object],required:!0},radius:{type:Number,required:!0}},V),setup(s){const{center:n,radius:t,color:i,weight:o,opacity:r,fillColor:c}=u.toRefs(s),h=u.computed(()=>s.color!=null),f=u.computed(()=>s.fillColor!=null),e=u.reactive({radius:t,stroke:h,color:i,weight:o,opacity:r,fill:f,fillColor:c}),a=u.ref(u.inject("map")),l=x.default.circle(s.center,U(e));u.provide("layer",l),g.whenever(a,d=>d.addLayer(l),{immediate:!0}),g.whenever(e,d=>x.default.setOptions(l,U(d),{deep:!0,immediate:!0})),g.whenever(n,d=>l.setLatLng(d)),u.onUnmounted(()=>l.remove())}}),ft={exports:{}};(function(s){(function(n){var t;t=x.default,s.exports=n(t)})(function(n){return n.Polyline._flat=n.LineUtil.isFlat||n.Polyline._flat||function(t){return!n.Util.isArray(t[0])||typeof t[0][0]!="object"&&typeof t[0][0]!="undefined"},n.GeometryUtil=n.extend(n.GeometryUtil||{},{distance:function(t,i,o){return t.latLngToLayerPoint(i).distanceTo(t.latLngToLayerPoint(o))},distanceSegment:function(t,i,o,r){var c=t.latLngToLayerPoint(i),h=t.latLngToLayerPoint(o),f=t.latLngToLayerPoint(r);return n.LineUtil.pointToSegmentDistance(c,h,f)},readableDistance:function(t,i){var o=i!=="imperial",r;return o?t>1e3?r=(t/1e3).toFixed(2)+" km":r=t.toFixed(1)+" m":(t*=1.09361,t>1760?r=(t/1760).toFixed(2)+" miles":r=t.toFixed(1)+" yd"),r},belongsSegment:function(t,i,o,r){r=r===void 0?.2:r;var c=i.distanceTo(o),h=i.distanceTo(t)+t.distanceTo(o)-c;return h/c<r},length:function(t){var i=n.GeometryUtil.accumulatedLengths(t);return i.length>0?i[i.length-1]:0},accumulatedLengths:function(t){if(typeof t.getLatLngs=="function"&&(t=t.getLatLngs()),t.length===0)return[];for(var i=0,o=[0],r=0,c=t.length-1;r<c;r++)i+=t[r].distanceTo(t[r+1]),o.push(i);return o},closestOnSegment:function(t,i,o,r){var c=t.getMaxZoom();c===1/0&&(c=t.getZoom());var h=t.project(i,c),f=t.project(o,c),e=t.project(r,c),a=n.LineUtil.closestPointOnSegment(h,f,e);return t.unproject(a,c)},closest:function(t,i,o,r){var c,h=1/0,f=null,e,a,l,d;if(i instanceof Array)if(i[0]instanceof Array&&typeof i[0][0]!="number"){for(e=0;e<i.length;e++)d=n.GeometryUtil.closest(t,i[e],o,r),d&&d.distance<h&&(h=d.distance,f=d);return f}else if(i[0]instanceof n.LatLng||typeof i[0][0]=="number"||typeof i[0].lat=="number")i=n.polyline(i);else return f;if(!(i instanceof n.Polyline))return f;if(c=JSON.parse(JSON.stringify(i.getLatLngs().slice(0))),i instanceof n.Polygon){var p=function(M){if(n.Polyline._flat(M))M.push(M[0]);else for(var C=0;C<M.length;C++)p(M[C])};p(c)}if(n.Polyline._flat(c)){if(r){for(e=0,a=c.length;e<a;e++){var m=c[e];l=n.GeometryUtil.distance(t,o,m),l<h&&(h=l,f=m,f.distance=l)}return f}for(e=0,a=c.length;e<a-1;e++){var w=c[e],v=c[e+1];l=n.GeometryUtil.distanceSegment(t,o,w,v),l<=h&&(h=l,f=n.GeometryUtil.closestOnSegment(t,o,w,v),f.distance=l)}return f}else{for(e=0;e<c.length;e++)d=n.GeometryUtil.closest(t,c[e],o,r),d.distance<h&&(h=d.distance,f=d);return f}},closestLayer:function(t,i,o){for(var r=1/0,c=null,h=null,f=1/0,e=0,a=i.length;e<a;e++){var l=i[e];if(l instanceof n.LayerGroup){var d=n.GeometryUtil.closestLayer(t,l.getLayers(),o);d.distance<r&&(r=d.distance,c=d)}else typeof l.getLatLng=="function"?(h=l.getLatLng(),f=n.GeometryUtil.distance(t,o,h)):(h=n.GeometryUtil.closest(t,l,o),h&&(f=h.distance)),f<r&&(r=f,c={layer:l,latlng:h,distance:f})}return c},nClosestLayers:function(t,i,o,r){if(r=typeof r=="number"?r:i.length,r<1||i.length<1)return null;for(var c=[],h,f,e=0,a=i.length;e<a;e++){var l=i[e];if(l instanceof n.LayerGroup){var d=n.GeometryUtil.closestLayer(t,l.getLayers(),o);c.push(d)}else typeof l.getLatLng=="function"?(f=l.getLatLng(),h=n.GeometryUtil.distance(t,o,f)):(f=n.GeometryUtil.closest(t,l,o),f&&(h=f.distance)),c.push({layer:l,latlng:f,distance:h})}return c.sort(function(p,m){return p.distance-m.distance}),c.length>r?c.slice(0,r):c},layersWithin:function(t,i,o,r){r=typeof r=="number"?r:1/0;for(var c=[],h=null,f=0,e=0,a=i.length;e<a;e++){var l=i[e];typeof l.getLatLng=="function"?(h=l.getLatLng(),f=n.GeometryUtil.distance(t,o,h)):(h=n.GeometryUtil.closest(t,l,o),h&&(f=h.distance)),h&&f<r&&c.push({layer:l,latlng:h,distance:f})}var d=c.sort(function(p,m){return p.distance-m.distance});return d},closestLayerSnap:function(t,i,o,r,c){r=typeof r=="number"?r:1/0,c=typeof c=="boolean"?c:!0;var h=n.GeometryUtil.closestLayer(t,i,o);if(!h||h.distance>r)return null;if(c&&typeof h.layer.getLatLngs=="function"){var f=n.GeometryUtil.closest(t,h.layer,h.latlng,!0);f.distance<r&&(h.latlng=f,h.distance=n.GeometryUtil.distance(t,f,o))}return h},interpolateOnPointSegment:function(t,i,o){return n.point(t.x*(1-o)+o*i.x,t.y*(1-o)+o*i.y)},interpolateOnLine:function(t,i,o){i=i instanceof n.Polyline?i.getLatLngs():i;var r=i.length;if(r<2)return null;if(o=Math.max(Math.min(o,1),0),o===0)return{latLng:i[0]instanceof n.LatLng?i[0]:n.latLng(i[0]),predecessor:-1};if(o==1)return{latLng:i[i.length-1]instanceof n.LatLng?i[i.length-1]:n.latLng(i[i.length-1]),predecessor:i.length-2};var c=t.getMaxZoom();c===1/0&&(c=t.getZoom());for(var h=[],f=0,e=0;e<r;e++)h[e]=t.project(i[e],c),e>0&&(f+=h[e-1].distanceTo(h[e]));for(var a=f*o,l=0,d=0,e=0;d<a;e++){var p=h[e],m=h[e+1];l=d,d+=p.distanceTo(m)}if(p==null&&m==null)var p=h[0],m=h[1],e=1;var w=d-l!==0?(a-l)/(d-l):0,v=n.GeometryUtil.interpolateOnPointSegment(p,m,w);return{latLng:t.unproject(v,c),predecessor:e-1}},locateOnLine:function(t,i,o){var r=i.getLatLngs();if(o.equals(r[0]))return 0;if(o.equals(r[r.length-1]))return 1;for(var c=n.GeometryUtil.closest(t,i,o,!1),h=n.GeometryUtil.accumulatedLengths(r),f=h[h.length-1],e=0,a=!1,l=0,d=r.length-1;l<d;l++){var p=r[l],m=r[l+1];if(e=h[l],n.GeometryUtil.belongsSegment(c,p,m,.001)){e+=p.distanceTo(c),a=!0;break}}if(!a)throw"Could not interpolate "+o.toString()+" within "+i.toString();return e/f},reverse:function(t){return n.polyline(t.getLatLngs().slice(0).reverse())},extract:function(t,i,o,r){if(o>r)return n.GeometryUtil.extract(t,n.GeometryUtil.reverse(i),1-o,1-r);o=Math.max(Math.min(o,1),0),r=Math.max(Math.min(r,1),0);var c=i.getLatLngs(),h=n.GeometryUtil.interpolateOnLine(t,i,o),f=n.GeometryUtil.interpolateOnLine(t,i,r);if(o==r){var e=n.GeometryUtil.interpolateOnLine(t,i,r);return[e.latLng]}h.predecessor==-1&&(h.predecessor=0),f.predecessor==-1&&(f.predecessor=0);var a=c.slice(h.predecessor+1,f.predecessor+1);return a.unshift(h.latLng),a.push(f.latLng),a},isBefore:function(t,i){if(!i)return!1;var o=t.getLatLngs(),r=i.getLatLngs();return o[o.length-1].equals(r[0])},isAfter:function(t,i){if(!i)return!1;var o=t.getLatLngs(),r=i.getLatLngs();return o[0].equals(r[r.length-1])},startsAtExtremity:function(t,i){if(!i)return!1;var o=t.getLatLngs(),r=i.getLatLngs(),c=o[0];return c.equals(r[0])||c.equals(r[r.length-1])},computeAngle:function(t,i){return Math.atan2(i.y-t.y,i.x-t.x)*180/Math.PI},computeSlope:function(t,i){var o=(i.y-t.y)/(i.x-t.x),r=t.y-o*t.x;return{a:o,b:r}},rotatePoint:function(t,i,o,r){var c=t.getMaxZoom();c===1/0&&(c=t.getZoom());var h=o*Math.PI/180,f=t.project(i,c),e=t.project(r,c),a=Math.cos(h)*(f.x-e.x)-Math.sin(h)*(f.y-e.y)+e.x,l=Math.sin(h)*(f.x-e.x)+Math.cos(h)*(f.y-e.y)+e.y;return t.unproject(new n.Point(a,l),c)},bearing:function(t,i){var o=Math.PI/180,r=t.lat*o,c=i.lat*o,h=t.lng*o,f=i.lng*o,e=Math.sin(f-h)*Math.cos(c),a=Math.cos(r)*Math.sin(c)-Math.sin(r)*Math.cos(c)*Math.cos(f-h),l=(Math.atan2(e,a)*180/Math.PI+360)%360;return l>=180?l-360:l},destination:function(t,i,o){i=(i+360)%360;var r=Math.PI/180,c=180/Math.PI,h=6378137,f=t.lng*r,e=t.lat*r,a=i*r,l=Math.sin(e),d=Math.cos(e),p=Math.cos(o/h),m=Math.sin(o/h),w=Math.asin(l*p+d*m*Math.cos(a)),v=f+Math.atan2(Math.sin(a)*m*d,p-l*Math.sin(w));return v=v*c,v=v>180?v-360:v<-180?v+360:v,n.latLng([w*c,v])},angle:function(t,i,o){var r=t.latLngToContainerPoint(i),c=t.latLngToContainerPoint(o),h=Math.atan2(c.y-r.y,c.x-r.x)*180/Math.PI+90;return h+=h<0?360:0,h},destinationOnSegment:function(t,i,o,r){var c=n.GeometryUtil.angle(t,i,o),h=n.GeometryUtil.destination(i,c,r);return n.GeometryUtil.closestOnSegment(t,h,i,o)}}),n.GeometryUtil})})(ft);function pt(s,n){return(s%n+n)%n}function mt(s){return Object.fromEntries(Object.entries(s).filter(([n,t])=>t!==void 0))}function N(s){return s.toString().trim().slice(s.toString().length-1,s.toString().length)==="m"}function $(s){return s.toString().trim().slice(s.toString().length-1,s.toString().length)==="%"}function Z(s){return s.toString().trim().slice(s.toString().length-2,s.toString().length)==="px"}function j(s,n){let t=n.getCenter(),i=n.latLngToLayerPoint(t),o={x:i.x+Number(s),y:i.y},r=n.layerPointToLatLng(o);return n.distance(t,r)}L.Polyline.include({arrowheads:function(s={}){const n={yawn:60,size:"15%",frequency:"allvertices",proportionalToTotal:!1};this.options.noClip=!0;let t=Object.assign({},n,s);return this._arrowheadOptions=t,this._hatsApplied=!0,this},buildVectorHats:function(s){this._arrowheads&&this._arrowheads.remove(),this._ghosts&&this._ghosts.remove();let n=Object.getPrototypeOf(Object.getPrototypeOf(this.options)),t=Object.assign({},n,this.options),i=Object.assign({},t,s);i.smoothFactor=1,i.fillOpacity=1,i.fill=!!s.fill,i.interactive=!1;let o=s.size.toString(),r=[];const{frequency:c,offsets:h}=s;((h==null?void 0:h.start)||(h==null?void 0:h.end))&&this._buildGhosts({start:h.start,end:h.end}),(this._ghosts||this)._parts.forEach((a,l)=>{var E;const d=a.map(O=>this._map.layerPointToLatLng(O)),p=(()=>{let O=0;for(var y=0;y<a.length-1;y++)O+=this._map.distance(d[y],d[y+1]);return O})();let m,w,v,M;if(isNaN(c)?$(c)?console.error("Error: arrowhead frequency option cannot be given in percent.  Try another unit."):N(c)?(v=c.slice(0,c.length-1)/p,M=1/v,M=Math.floor(M),v=1/M):Z(c)&&(v=(()=>{let O=c.slice(0,c.length-2);return j(O,this._map)/p})(),M=1/v,M=Math.floor(M),v=1/M):(v=1/c,M=c),s.frequency==="allvertices")w=(()=>{let O=[];for(var y=1;y<d.length;y++){let T=L.GeometryUtil.angle(this._map,d[pt(y-1,d.length)],d[y])+180;O.push(T)}return O})(),m=d,m.shift();else if(s.frequency==="endonly"&&d.length>=2)m=[d[d.length-1]],w=[L.GeometryUtil.angle(this._map,d[d.length-2],d[d.length-1])+180];else{m=[];let O=[];for(var C=0;C<M;C++){let y=L.GeometryUtil.interpolateOnLine(this._map,d,v*(C+1));y&&(O.push(y),m.push(y.latLng))}w=(()=>{let y=[];for(var T=0;T<O.length;T++){let G=L.GeometryUtil.angle(this._map,d[O[T].predecessor+1],d[O[T].predecessor]);y.push(G)}return y})()}let P=[];const A=(O,y={})=>{var D;let T=(D=y.yawn)!=null?D:s.yawn,G=L.GeometryUtil.destination(m[C],w[C]-T/2,O),z=L.GeometryUtil.destination(m[C],w[C]+T/2,O),B=[[G.lat,G.lng],[m[C].lat,m[C].lng],[z.lat,z.lng]],F=s.fill?L.polygon(B,k(k({},i),y)):L.polyline(B,k(k({},i),y));P.push(F)},R=(O,y={})=>{var Y;let T=O.slice(0,O.length-2),G=(Y=y.yawn)!=null?Y:s.yawn,z=this._map.latLngToLayerPoint(m[C]),B=w[C],F=(180-B-G/2)*(Math.PI/180),D=(180-B+G/2)*(Math.PI/180),bt=T*Math.sin(F),St=T*Math.cos(F),Ct=T*Math.sin(D),Pt=T*Math.cos(D),Mt={x:z.x+bt,y:z.y+St},Ot={x:z.x+Ct,y:z.y+Pt},W=this._map.layerPointToLatLng(Mt),J=this._map.layerPointToLatLng(Ot),K=[[W.lat,W.lng],[m[C].lat,m[C].lng],[J.lat,J.lng]],xt=s.fill?L.polygon(K,k(k({},i),y)):L.polyline(K,k(k({},i),y));P.push(xt)};for(var C=0;C<m.length;C++){let S=s,{perArrowheadOptions:y}=S,T=it(S,["perArrowheadOptions"]);if(y=y?y(C):{},y=Object.assign(T,mt(y)),o=(E=y.size)!=null?E:o,N(o)){let G=o.slice(0,o.length-1);A(G,y)}else if($(o)){let G=o.slice(0,o.length-1),z=(()=>s.frequency==="endonly"&&s.proportionalToTotal?p*G/100:p/(a.length-1)*G/100)();A(z,y)}else Z(o)?R(s.size,y):console.error("Error: Arrowhead size unit not defined.  Check your arrowhead options.")}r.push(...P)});let e=L.layerGroup(r);return this._arrowheads=e,this},getArrowheads:function(){return this._arrowheads?this._arrowheads:console.error("Error: You tried to call '.getArrowheads() on a shape that does not have a arrowhead.  Use '.arrowheads()' to add a arrowheads before trying to call '.getArrowheads()'")},_buildGhosts:function({start:s,end:n}){if(s||n){let t=this.getLatLngs();t=Array.isArray(t[0])?t:[t];const i=t.map(o=>{const r=(()=>{let c=0;for(var h=0;h<o.length-1;h++)c+=this._map.distance(o[h],o[h+1]);return c})();if(s){let c=(()=>{if(N(s))return Number(s.slice(0,s.length-1));if(Z(s)){let f=Number(s.slice(0,s.length-2));return j(f,this._map)}})(),h=L.GeometryUtil.interpolateOnLine(this._map,o,c/r);o=o.slice(h.predecessor===-1?1:h.predecessor+1,o.length),o.unshift(h.latLng)}if(n){let c=(()=>{if(N(n))return Number(n.slice(0,n.length-1));if(Z(n)){let f=Number(n.slice(0,n.length-2));return j(f,this._map)}})(),h=L.GeometryUtil.interpolateOnLine(this._map,o,(r-c)/r);o=o.slice(0,h.predecessor+1),o.push(h.latLng)}return o});this._ghosts=L.polyline(i,et(k({},this.options),{color:"rgba(0,0,0,0)",stroke:0,smoothFactor:0,interactive:!1})),this._ghosts.addTo(this._map)}},deleteArrowheads:function(){this._arrowheads&&(this._arrowheads.remove(),delete this._arrowheads,delete this._arrowheadOptions,this._hatsApplied=!1),this._ghosts&&this._ghosts.remove()},_update:function(){!this._map||(this._clipPoints(),this._simplifyPoints(),this._updatePath(),this._hatsApplied&&(this.buildVectorHats(this._arrowheadOptions),this._map.addLayer(this._arrowheads)))},remove:function(){return this._arrowheads&&this._arrowheads.remove(),this._ghosts&&this._ghosts.remove(),this.removeFrom(this._map||this._mapToAdd)}}),L.LayerGroup.include({removeLayer:function(s){var n=s in this._layers?s:this.getLayerId(s);return this._map&&this._layers[n]&&(this._layers[n]._arrowheads&&this._layers[n]._arrowheads.remove(),this._map.removeLayer(this._layers[n])),delete this._layers[n],this},onRemove:function(s,n){for(var n in this._layers)this._layers[n]&&this._layers[n].remove();this.eachLayer(s.removeLayer,s)}}),L.Map.include({removeLayer:function(s){var n=L.Util.stamp(s);return s._arrowheads&&s._arrowheads.remove(),s._ghosts&&s._ghosts.remove(),this._layers[n]?(this._loaded&&s.onRemove(this),s.getAttribution&&this.attributionControl&&this.attributionControl.removeAttribution(s.getAttribution()),delete this._layers[n],this._loaded&&(this.fire("layerremove",{layer:s}),s.fire("remove")),s._map=s._mapToAdd=null,this):this}}),L.GeoJSON.include({geometryToLayer:function(s,n){var t=s.type==="Feature"?s.geometry:s,i=t?t.coordinates:null,o=[],r=n&&n.pointToLayer,c=n&&n.coordsToLatLng||L.GeoJSON.coordsToLatLng,h,f,e,a;if(!i&&!t)return null;switch(t.type){case"Point":return h=c(i),this._pointToLayer(r,s,h,n);case"MultiPoint":for(e=0,a=i.length;e<a;e++)h=c(i[e]),o.push(this._pointToLayer(r,s,h,n));return new L.FeatureGroup(o);case"LineString":case"MultiLineString":f=L.GeoJSON.coordsToLatLngs(i,t.type==="LineString"?0:1,c);var l=new L.Polyline(f,n);return n.arrowheads&&l.arrowheads(n.arrowheads),l;case"Polygon":case"MultiPolygon":return f=L.GeoJSON.coordsToLatLngs(i,t.type==="Polygon"?1:2,c),new L.Polygon(f,n);case"GeometryCollection":for(e=0,a=t.geometries.length;e<a;e++){var d=this.geometryToLayer({geometry:t.geometries[e],type:"Feature",properties:s.properties},n);d&&o.push(d)}return new L.FeatureGroup(o);default:throw new Error("Invalid GeoJSON object.")}},addData:function(s){var n=L.Util.isArray(s)?s:s.features,t,i,o;if(n){for(t=0,i=n.length;t<i;t++)o=n[t],(o.geometries||o.geometry||o.features||o.coordinates)&&this.addData(o);return this}var r=this.options;if(r.filter&&!r.filter(s))return this;var c=this.geometryToLayer(s,r);return c?(c.feature=L.GeoJSON.asFeature(s),c.defaultOptions=c.options,this.resetStyle(c),r.onEachFeature&&r.onEachFeature(s,c),this.addLayer(c)):this},_pointToLayer:function(s,n,t,i){return s?s(n,t):new L.Marker(t,i&&i.markersInheritOptions&&i)}});var gt=I({props:k({positions:{type:Array,required:!0},arrows:{type:Object,default:void 0}},V),setup(s){const{positions:n,color:t,weight:i,opacity:o,fillColor:r}=u.toRefs(s),c=u.computed(()=>s.color!=null),h=u.computed(()=>s.fillColor!=null),f=u.reactive({stroke:c,color:t,weight:i,opacity:o,fill:h,fillColor:r}),e=u.ref(u.inject("map")),a=x.default.polyline(s.positions,U(f));s.arrows&&a.arrowheads(s.arrows),u.provide("layer",a),g.whenever(e,l=>l.addLayer(a),{immediate:!0}),g.whenever(f,l=>x.default.setOptions(a,U(l),{deep:!0,immediate:!0})),g.whenever(n,l=>a.setLatLngs(l)),u.onUnmounted(()=>a.remove())}}),_t=I({props:k({positions:{type:Array,required:!0}},V),setup(s){const{positions:n,color:t,weight:i,opacity:o,fillColor:r}=u.toRefs(s),c=u.computed(()=>s.color!=null),h=u.computed(()=>s.fillColor!=null),f=u.reactive({stroke:c,color:t,weight:i,opacity:o,fill:h,fillColor:r}),e=u.ref(u.inject("map")),a=x.default.polygon(s.positions,U(f));u.provide("layer",a),g.whenever(e,l=>l.addLayer(a),{immediate:!0}),g.whenever(f,l=>x.default.setOptions(a,U(l),{deep:!0,immediate:!0})),g.whenever(n,l=>a.setLatLngs(l)),u.onUnmounted(()=>a.remove())}}),yt=I({props:{position:{type:String,default:void 0},zoomInTitle:{type:String,default:void 0},zoomOutTitle:{type:String,default:void 0}},setup(s){const n=u.ref(u.inject("map")),t=new b.Control.Zoom(U(k({},s))),i=o=>{var r;(r=o==null?void 0:o.zoomControl)==null||r.remove(),o.addControl(t)};g.whenever(n,i,{immediate:!0})}}),wt=I({props:{position:{type:String,default:void 0},maxWidth:{type:Number,default:void 0},imperial:{type:Boolean,default:void 0},metric:{type:Boolean,default:void 0}},setup(s){const n=u.ref(u.inject("map")),t=x.default.control.scale(U(k({},s)));g.whenever(n,i=>i.addControl(t),{immediate:!0})}}),vt={exports:{}};/*!
  Copyright (c) 2016 Dominik Moritz

  This file is part of the leaflet locate control. It is licensed under the MIT license.
  You can find the project at: https://github.com/domoritz/leaflet-locatecontrol
  */(function(s,n){(function(t,i){typeof i!="undefined"&&i.L?s.exports=t(L):s.exports=t(x.default),typeof i!="undefined"&&i.L&&(i.L.Control.Locate=t(L))})(function(t){const i=(e,a,l)=>{l=l.split(" "),l.forEach(function(d){t.DomUtil[e].call(this,a,d)})},o=(e,a)=>i("addClass",e,a),r=(e,a)=>i("removeClass",e,a),c=t.Marker.extend({initialize(e,a){t.Util.setOptions(this,a),this._latlng=e,this.createIcon()},createIcon(){const e=this.options;let a="";e.color!==void 0&&(a+=`stroke:${e.color};`),e.weight!==void 0&&(a+=`stroke-width:${e.weight};`),e.fillColor!==void 0&&(a+=`fill:${e.fillColor};`),e.fillOpacity!==void 0&&(a+=`fill-opacity:${e.fillOpacity};`),e.opacity!==void 0&&(a+=`opacity:${e.opacity};`);const l=this._getIconSVG(e,a);this._locationIcon=t.divIcon({className:l.className,html:l.svg,iconSize:[l.w,l.h]}),this.setIcon(this._locationIcon)},_getIconSVG(e,a){const l=e.radius,d=e.weight,p=l+d,m=p*2,w=`<svg xmlns="http://www.w3.org/2000/svg" width="${m}" height="${m}" version="1.1" viewBox="-${p} -${p} ${m} ${m}"><circle r="`+l+'" style="'+a+'" /></svg>';return{className:"leaflet-control-locate-location",svg:w,w:m,h:m}},setStyle(e){t.Util.setOptions(this,e),this.createIcon()}}),h=c.extend({initialize(e,a,l){t.Util.setOptions(this,l),this._latlng=e,this._heading=a,this.createIcon()},setHeading(e){this._heading=e},_getIconSVG(e,a){const l=e.radius,d=e.width+e.weight,p=(l+e.depth+e.weight)*2,m=`M0,0 l${e.width/2},${e.depth} l-${d},0 z`,w=`transform: rotate(${this._heading}deg)`,v=`<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${p}" version="1.1" viewBox="-${d/2} 0 ${d} ${p}" style="${w}"><path d="`+m+'" style="'+a+'" /></svg>';return{className:"leaflet-control-locate-heading",svg:v,w:d,h:p}}}),f=t.Control.extend({options:{position:"topleft",layer:void 0,setView:"untilPanOrZoom",keepCurrentZoomLevel:!1,initialZoomLevel:!1,getLocationBounds(e){return e.bounds},flyTo:!1,clickBehavior:{inView:"stop",outOfView:"setView",inViewNotFollowing:"inView"},returnToPrevBounds:!1,cacheLocation:!0,drawCircle:!0,drawMarker:!0,showCompass:!0,markerClass:c,compassClass:h,circleStyle:{className:"leaflet-control-locate-circle",color:"#136AEC",fillColor:"#136AEC",fillOpacity:.15,weight:0},markerStyle:{className:"leaflet-control-locate-marker",color:"#fff",fillColor:"#2A93EE",fillOpacity:1,weight:3,opacity:1,radius:9},compassStyle:{fillColor:"#2A93EE",fillOpacity:1,weight:0,color:"#fff",opacity:1,radius:9,width:9,depth:6},followCircleStyle:{},followMarkerStyle:{},followCompassStyle:{},icon:"leaflet-control-locate-location-arrow",iconLoading:"leaflet-control-locate-spinner",iconElementTag:"span",textElementTag:"small",circlePadding:[0,0],metric:!0,createButtonCallback(e,a){const l=t.DomUtil.create("a","leaflet-bar-part leaflet-bar-part-single",e);l.title=a.strings.title,l.href="#",l.setAttribute("role","button");const d=t.DomUtil.create(a.iconElementTag,a.icon,l);if(a.strings.text!==void 0){const p=t.DomUtil.create(a.textElementTag,"leaflet-locate-text",l);p.textContent=a.strings.text,l.classList.add("leaflet-locate-text-active"),l.parentNode.style.display="flex",a.icon.length>0&&d.classList.add("leaflet-locate-icon")}return{link:l,icon:d}},onLocationError(e,a){alert(e.message)},onLocationOutsideMapBounds(e){e.stop(),alert(e.options.strings.outsideMapBoundsMsg)},showPopup:!0,strings:{title:"Show me where I am",metersUnit:"meters",feetUnit:"feet",popup:"You are within {distance} {unit} from this point",outsideMapBoundsMsg:"You seem located outside the boundaries of the map"},locateOptions:{maxZoom:1/0,watch:!0,setView:!1}},initialize(e){for(const a in e)typeof this.options[a]=="object"?t.extend(this.options[a],e[a]):this.options[a]=e[a];this.options.followMarkerStyle=t.extend({},this.options.markerStyle,this.options.followMarkerStyle),this.options.followCircleStyle=t.extend({},this.options.circleStyle,this.options.followCircleStyle),this.options.followCompassStyle=t.extend({},this.options.compassStyle,this.options.followCompassStyle)},onAdd(e){const a=t.DomUtil.create("div","leaflet-control-locate leaflet-bar leaflet-control");this._container=a,this._map=e,this._layer=this.options.layer||new t.LayerGroup,this._layer.addTo(e),this._event=void 0,this._compassHeading=null,this._prevBounds=null;const l=this.options.createButtonCallback(a,this.options);return this._link=l.link,this._icon=l.icon,t.DomEvent.on(this._link,"click",function(d){t.DomEvent.stopPropagation(d),t.DomEvent.preventDefault(d),this._onClick()},this).on(this._link,"dblclick",t.DomEvent.stopPropagation),this._resetVariables(),this._map.on("unload",this._unload,this),a},_onClick(){this._justClicked=!0;const e=this._isFollowing();if(this._userPanned=!1,this._userZoomed=!1,this._active&&!this._event)this.stop();else if(this._active){const a=this.options.clickBehavior;let l=a.outOfView;switch(this._map.getBounds().contains(this._event.latlng)&&(l=e?a.inView:a.inViewNotFollowing),a[l]&&(l=a[l]),l){case"setView":this.setView();break;case"stop":this.stop(),this.options.returnToPrevBounds&&(this.options.flyTo?this._map.flyToBounds:this._map.fitBounds).bind(this._map)(this._prevBounds);break}}else this.options.returnToPrevBounds&&(this._prevBounds=this._map.getBounds()),this.start();this._updateContainerStyle()},start(){this._activate(),this._event&&(this._drawMarker(this._map),this.options.setView&&this.setView()),this._updateContainerStyle()},stop(){this._deactivate(),this._cleanClasses(),this._resetVariables(),this._removeMarker()},stopFollowing(){this._userPanned=!0,this._updateContainerStyle(),this._drawMarker()},_activate(){if(!this._active&&(this._map.locate(this.options.locateOptions),this._map.fire("locateactivate",this),this._active=!0,this._map.on("locationfound",this._onLocationFound,this),this._map.on("locationerror",this._onLocationError,this),this._map.on("dragstart",this._onDrag,this),this._map.on("zoomstart",this._onZoom,this),this._map.on("zoomend",this._onZoomEnd,this),this.options.showCompass)){const e="ondeviceorientationabsolute"in window;if(e||"ondeviceorientation"in window){const a=this,l=function(){t.DomEvent.on(window,e?"deviceorientationabsolute":"deviceorientation",a._onDeviceOrientation,a)};DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission=="function"?DeviceOrientationEvent.requestPermission().then(function(d){d==="granted"&&l()}):l()}}},_deactivate(){this._map.stopLocate(),this._map.fire("locatedeactivate",this),this._active=!1,this.options.cacheLocation||(this._event=void 0),this._map.off("locationfound",this._onLocationFound,this),this._map.off("locationerror",this._onLocationError,this),this._map.off("dragstart",this._onDrag,this),this._map.off("zoomstart",this._onZoom,this),this._map.off("zoomend",this._onZoomEnd,this),this.options.showCompass&&(this._compassHeading=null,"ondeviceorientationabsolute"in window?t.DomEvent.off(window,"deviceorientationabsolute",this._onDeviceOrientation,this):"ondeviceorientation"in window&&t.DomEvent.off(window,"deviceorientation",this._onDeviceOrientation,this))},setView(){if(this._drawMarker(),this._isOutsideMapBounds())this._event=void 0,this.options.onLocationOutsideMapBounds(this);else if(this._justClicked&&this.options.initialZoomLevel!==!1){var e=this.options.flyTo?this._map.flyTo:this._map.setView;e.bind(this._map)([this._event.latitude,this._event.longitude],this.options.initialZoomLevel)}else if(this.options.keepCurrentZoomLevel){var e=this.options.flyTo?this._map.flyTo:this._map.panTo;e.bind(this._map)([this._event.latitude,this._event.longitude])}else{var e=this.options.flyTo?this._map.flyToBounds:this._map.fitBounds;this._ignoreEvent=!0,e.bind(this._map)(this.options.getLocationBounds(this._event),{padding:this.options.circlePadding,maxZoom:this.options.initialZoomLevel||this.options.locateOptions.maxZoom}),t.Util.requestAnimFrame(function(){this._ignoreEvent=!1},this)}},_drawCompass(){if(!this._event)return;const e=this._event.latlng;if(this.options.showCompass&&e&&this._compassHeading!==null){const a=this._isFollowing()?this.options.followCompassStyle:this.options.compassStyle;this._compass?(this._compass.setLatLng(e),this._compass.setHeading(this._compassHeading),this._compass.setStyle&&this._compass.setStyle(a)):this._compass=new this.options.compassClass(e,this._compassHeading,a).addTo(this._layer)}this._compass&&(!this.options.showCompass||this._compassHeading===null)&&(this._compass.removeFrom(this._layer),this._compass=null)},_drawMarker(){this._event.accuracy===void 0&&(this._event.accuracy=0);const e=this._event.accuracy,a=this._event.latlng;if(this.options.drawCircle){const w=this._isFollowing()?this.options.followCircleStyle:this.options.circleStyle;this._circle?this._circle.setLatLng(a).setRadius(e).setStyle(w):this._circle=t.circle(a,e,w).addTo(this._layer)}let l,d;if(this.options.metric?(l=e.toFixed(0),d=this.options.strings.metersUnit):(l=(e*3.2808399).toFixed(0),d=this.options.strings.feetUnit),this.options.drawMarker){const w=this._isFollowing()?this.options.followMarkerStyle:this.options.markerStyle;this._marker?(this._marker.setLatLng(a),this._marker.setStyle&&this._marker.setStyle(w)):this._marker=new this.options.markerClass(a,w).addTo(this._layer)}this._drawCompass();const p=this.options.strings.popup;function m(){return typeof p=="string"?t.Util.template(p,{distance:l,unit:d}):typeof p=="function"?p({distance:l,unit:d}):p}this.options.showPopup&&p&&this._marker&&this._marker.bindPopup(m())._popup.setLatLng(a),this.options.showPopup&&p&&this._compass&&this._compass.bindPopup(m())._popup.setLatLng(a)},_removeMarker(){this._layer.clearLayers(),this._marker=void 0,this._circle=void 0},_unload(){this.stop(),this._map.off("unload",this._unload,this)},_setCompassHeading(e){!isNaN(parseFloat(e))&&isFinite(e)?(e=Math.round(e),this._compassHeading=e,t.Util.requestAnimFrame(this._drawCompass,this)):this._compassHeading=null},_onCompassNeedsCalibration(){this._setCompassHeading()},_onDeviceOrientation(e){!this._active||(e.webkitCompassHeading?this._setCompassHeading(e.webkitCompassHeading):e.absolute&&e.alpha&&this._setCompassHeading(360-e.alpha))},_onLocationError(e){e.code==3&&this.options.locateOptions.watch||(this.stop(),this.options.onLocationError(e,this))},_onLocationFound(e){if(!(this._event&&this._event.latlng.lat===e.latlng.lat&&this._event.latlng.lng===e.latlng.lng&&this._event.accuracy===e.accuracy)&&!!this._active){switch(this._event=e,this._drawMarker(),this._updateContainerStyle(),this.options.setView){case"once":this._justClicked&&this.setView();break;case"untilPan":this._userPanned||this.setView();break;case"untilPanOrZoom":!this._userPanned&&!this._userZoomed&&this.setView();break;case"always":this.setView();break}this._justClicked=!1}},_onDrag(){this._event&&!this._ignoreEvent&&(this._userPanned=!0,this._updateContainerStyle(),this._drawMarker())},_onZoom(){this._event&&!this._ignoreEvent&&(this._userZoomed=!0,this._updateContainerStyle(),this._drawMarker())},_onZoomEnd(){this._event&&this._drawCompass(),this._event&&!this._ignoreEvent&&this._marker&&!this._map.getBounds().pad(-.3).contains(this._marker.getLatLng())&&(this._userPanned=!0,this._updateContainerStyle(),this._drawMarker())},_isFollowing(){if(!this._active)return!1;if(this.options.setView==="always")return!0;if(this.options.setView==="untilPan")return!this._userPanned;if(this.options.setView==="untilPanOrZoom")return!this._userPanned&&!this._userZoomed},_isOutsideMapBounds(){return this._event===void 0?!1:this._map.options.maxBounds&&!this._map.options.maxBounds.contains(this._event.latlng)},_updateContainerStyle(){!this._container||(this._active&&!this._event?this._setClasses("requesting"):this._isFollowing()?this._setClasses("following"):this._active?this._setClasses("active"):this._cleanClasses())},_setClasses(e){e=="requesting"?(r(this._container,"active following"),o(this._container,"requesting"),r(this._icon,this.options.icon),o(this._icon,this.options.iconLoading)):e=="active"?(r(this._container,"requesting following"),o(this._container,"active"),r(this._icon,this.options.iconLoading),o(this._icon,this.options.icon)):e=="following"&&(r(this._container,"requesting"),o(this._container,"active following"),r(this._icon,this.options.iconLoading),o(this._icon,this.options.icon))},_cleanClasses(){t.DomUtil.removeClass(this._container,"requesting"),t.DomUtil.removeClass(this._container,"active"),t.DomUtil.removeClass(this._container,"following"),r(this._icon,this.options.iconLoading),o(this._icon,this.options.icon)},_resetVariables(){this._active=!1,this._justClicked=!1,this._userPanned=!1,this._userZoomed=!1}});return t.control.locate=e=>new t.Control.Locate(e),f},window)})(vt);var Lt=I({props:{position:{type:String,default:void 0},strings:{type:Object,default:void 0}},setup(s){const n=u.ref(u.inject("map")),t=x.default.control.locate(U(k({},s)));g.whenever(n,i=>i.addControl(t),{immediate:!0})}});_.Circle=ut,_.GoogleMaps=at,_.LocateControl=Lt,_.MapContainer=ot,_.Mapbox=rt,_.Marker=lt,_.OpenStreetMap=st,_.Polygon=_t,_.Polyline=gt,_.Popup=dt,_.ScaleControl=wt,_.ZoomControl=yt,Object.defineProperties(_,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
