<template>
	<div class="app">
		<Map :zoom-control="false" :center="center" :zoom="16" version="1.8.0">
			<GoogleMaps v-if="provider === 'gmaps'" :api-key="API_KEYS.gmaps" :type="mapType"></GoogleMaps>
			<IGN v-if="provider === 'ign'" :type="mapType"></IGN>
			<Mapbox v-if="provider === 'mapbox'" :apiKey="API_KEYS.mapbox"></Mapbox>
			<OpenStreetMap v-if="provider === 'osm'"></OpenStreetMap>
			<ZoomControl position="bottomright" />
			<ScaleControl />
			<LocateControl position="bottomright" />
			<OfflineControl @progress="downloadProgress" @maxSize="onMaxSize" />
			<Marker v-for="point of latlngs" :position="point"></Marker>
		</Map>
		<div>
			<label>
				<input type="radio" :value="mapTypes.satellite" v-model="mapType" />
				{{ mapTypes.satellite }}
			</label>
			<label>
				<input type="radio" :value="mapTypes.roadmap" v-model="mapType" />
				{{ mapTypes.roadmap }}
			</label>
		</div>
		<div>
			<label>
				<input type="radio" value="gmaps" v-model="provider" />
				Google maps
			</label>
			<label>
				<input type="radio" value="ign" v-model="provider" />
				IGN
			</label>
			<label>
				<input type="radio" value="mapbox" v-model="provider" />
				Mapbox
			</label>
			<label>
				<input type="radio" value="osm" v-model="provider" />
				Open Street Map
			</label>
		</div>
	</div>
</template>

<script setup>
	import { ref } from 'vue';
	import GoogleMaps from '../src/layers/tiles/GoogleMaps.vue';
	import Mapbox from '../src/layers/tiles/Mapbox.vue';
	import IGN from '../src/layers/tiles/IGN.vue';
	import OpenStreetMap from '../src/layers/tiles/OpenStreetMap.vue';
	import Map from '../src/MapContainer.vue';
	import ZoomControl from '../src/controls/ZoomControl.js';
	import ScaleControl from '../src/controls/ScaleControl.js';
	import LocateControl from '../src/controls/LocateControl.js';
	import OfflineControl from '../src/controls/OfflineControl';
	import mapTypes from '../src/utils/map-types';
	import Marker from '../src/layers/markers/Marker.vue';

	const mapType = ref(mapTypes.roadmap);
	const provider = ref('ign');

	const API_KEYS = {
		gmaps: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
		mapbox: import.meta.env.VITE_MAPBOX_API_KEY,
	};

	const center = ref([50.60097732180697, 3.065646079092121]);
	const latlngs = [
		[50.5997333, 3.0676366],
		[50.5996966, 3.06761],
		[50.5995799, 3.0682266],
		[50.5966583, 3.0687366],
		[50.596595, 3.068815],
		[50.5966049, 3.0689733],
		[50.5969916, 3.0706299],
		[50.5970633, 3.0706483],
		[50.5976516, 3.0705133],
		[50.5990199, 3.0728833],
		[50.5989799, 3.0733183],
		[50.5988416, 3.0735283],
		[50.5968783, 3.0746216],
		[50.5969033, 3.0748183],
		[50.5974649, 3.0766933],
		[50.5974483, 3.0767249],
		[50.5973883, 3.0767433],
		[50.59656, 3.0769916],
		[50.5962733, 3.0766266],
		[50.5959, 3.0772183],
		[50.5959016, 3.0773599],
		[50.5959616, 3.0774083],
		[50.5960616, 3.07732],
		[50.596375, 3.0768266],
		[50.596365, 3.076795],
		[50.5963516, 3.0767516],
		[50.596225, 3.0766833],
		[50.5960883, 3.0768883],
		[50.5954, 3.0778999],
		[50.5953433, 3.0778416],
		[50.5950133, 3.077085],
		[50.59471, 3.0758683],
		[50.5945916, 3.0758516],
		[50.5937416, 3.07711],
		[50.5936066, 3.0770933],
		[50.59346, 3.0779683],
		[50.5934183, 3.0779533],
		[50.5901533, 3.0745616],
		[50.5900533, 3.0746866],
		[50.5882616, 3.0765916],
		[50.588165, 3.0765766],
		[50.587935, 3.0764033],
		[50.58732, 3.0754266],
		[50.587225, 3.0755883],
		[50.5863199, 3.0762766],
		[50.5814433, 3.07738],
		[50.5814266, 3.0776333],
		[50.5812549, 3.07826],
		[50.5803766, 3.0793766],
		[50.5804133, 3.0795033],
		[50.5804566, 3.0796966],
		[50.5803566, 3.08006],
		[50.5803783, 3.08009],
		[50.5807083, 3.0801933],
		[50.5807466, 3.08014],
		[50.5808283, 3.0797383],
		[50.5807933, 3.0796399],
		[50.58072, 3.07949],
		[50.5807466, 3.07926],
		[50.5807699, 3.079195],
		[50.5808883, 3.0791466],
		[50.5809566, 3.079165],
		[50.5809966, 3.0792549],
		[50.5809583, 3.0794583],
		[50.5808866, 3.0796866],
		[50.58095, 3.0798716],
		[50.58074, 3.0795533],
		[50.5805733, 3.0794016],
		[50.5805199, 3.0792983],
		[50.580555, 3.0792],
		[50.581725, 3.07729],
		[50.5875166, 3.0757449],
		[50.5880216, 3.07664],
		[50.5880866, 3.0768916],
		[50.5881783, 3.0768966],
		[50.5882183, 3.0768366],
		[50.594245, 3.06964],
		[50.5977449, 3.0685],
		[50.5979416, 3.0684566],
		[50.5998683, 3.0682516],
		[50.5998733, 3.068075],
		[50.5996583, 3.0674183],
		[50.601165, 3.0663083],
		[50.60111, 3.0660616],
		[50.600745, 3.065095],
		[50.6006333, 3.0650866],
		[50.60039, 3.06521],
	];

	window.bounceFast = {
		bounceHeight: 12,
		bounceSpeed: 85,
		elastic: false,
	};

	window.bounceSlow = {
		bounceHeight: 1,
		bounceSpeed: 300,
		elastic: true,
		contractHeight: 2,
	};

	function downloadProgress(e) {
		console.log('progress', e);
	}

	function onMaxSize() {
		console.log('maxSize');
	}
</script>

<style lang="scss">
	.app {
		.map-container {
			height: 600px;
		}
	}
</style>
