<template>
	<div class="app">
		<MapContainer :zoom-control="false" :center="center" :zoom="16" version="1.8.0">
			<GoogleMaps v-if="provider === 'gmaps'" :api-key="API_KEYS.gmaps" :type="mapType" />
			<IGN v-if="provider === 'ign'" :type="mapType" :detect-retina="true" />
			<Mapbox v-if="provider === 'mapbox'" :apiKey="API_KEYS.mapbox" />
			<OpenStreetMap v-if="provider === 'osm'" />
			<ZoomControl position="bottomright" />
			<ScaleControl />
			<LocateControl position="bottomright" />
			<OfflineControl @progress="downloadProgress" @maxSize="onMaxSize" />
			<Marker v-for="position of positions" :position="position"></Marker>
		</MapContainer>
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
				Google Maps
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
				OpenStreetMap
			</label>
		</div>
	</div>
</template>

<script setup>
	import { ref } from 'vue';
	import {
		GoogleMaps,
		Mapbox,
		IGN,
		OpenStreetMap,
		MapContainer,
		ZoomControl,
		ScaleControl,
		LocateControl,
		OfflineControl,
		mapTypes,
		Marker,
	} from '../src';
	import positions from './positions.json';

	const mapType = ref(mapTypes.roadmap);
	const provider = ref('ign');

	const API_KEYS = {
		gmaps: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
		mapbox: import.meta.env.VITE_MAPBOX_API_KEY,
	};

	const center = ref([50.60097732180697, 3.065646079092121]);

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
