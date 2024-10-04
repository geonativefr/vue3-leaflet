<template>
	<div class="app">
		<MapContainer :zoom-control="false" :center="center" :zoom="16" version="1.8.0">
			<GoogleMaps
				v-if="provider === Providers.GOOGLE_MAPS"
				:type="mapType"
				:additional-layers="additionalLayers"
			/>
			<IGN v-if="provider === Providers.IGN" :type="mapType" />
			<Mapbox v-if="provider === Providers.MAPBOX" :type="mapType" />
			<OpenStreetMap v-if="provider === Providers.OPEN_STREET_MAP" :type="mapType" />
			<ZoomControl position="bottomright" />
			<ScaleControl />
			<LocateControl position="bottomright" />
			<OfflineControl @progress="downloadProgress" @maxSize="onMaxSize" />
			<Marker v-for="position of positions" :position="position"></Marker>
			<Polygon v-for="(zone, name) of zones" :positions="zone" color="#3388ff" fillColor="#3388ff"></Polygon>
		</MapContainer>
		<div class="selector">
			<label v-for="providerKey in Object.keys(ProvidersNames)" :key="providerKey">
				<input type="radio" :value="providerKey" v-model="provider" />
				{{ ProvidersNames[providerKey] }}
			</label>
		</div>
		<div class="selector">
			<label v-for="mapTypeKey in ProvidersMapTypes[provider]" :key="mapTypeKey">
				<input type="radio" :value="mapTypeKey" v-model="mapType" />
				{{ mapTypeKey }}
			</label>
		</div>
		<div class="selector" v-if="provider === Providers.GOOGLE_MAPS && mapType !== MapTypes.SATELLITE">
			<label v-for="layer in AdditionalGoogleLayers" :key="layer">
				<input type="checkbox" :value="layer" v-model="additionalLayers" />
				{{ layer }}
			</label>
		</div>

		<div class="app_saved-maps">
			<h2 class="app_saved-maps_title">Saved maps</h2>
			<div class="app_saved-maps_list">
				<div v-for="savedMap of savedMaps" :key="savedMap.normalizedName" class="app_saved-maps_list_map">
					<span class="app_saved-maps_list_map_name">{{ savedMap.name }}</span>
					<span class="app_saved-maps_list_map_provider">{{ ProvidersNames[savedMap.provider] }}</span>
					<span class="app_saved-maps_list_map_type">{{ savedMap.type }}</span>
					<span class="app_saved-maps_list_map_missing-tiles">{{ savedMap.state }}</span>
					<button class="app_saved-maps_list_map_destroy-button" @click="deleteMap(savedMap)">Delete</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, watch } from 'vue';
	import Vue3Leaflet, {
		GoogleMaps,
		Mapbox,
		IGN,
		OpenStreetMap,
		MapContainer,
		ZoomControl,
		ScaleControl,
		LocateControl,
		OfflineControl,
		MapTypes,
		Marker,
		Offline,
		ProvidersMapTypes,
		ProvidersNames,
		Providers,
		AdditionalGoogleLayers,
		Polygon,
	} from '../src';
	import positions from './positions.json';
	import zones from './zones.json';

	const mapType = ref(MapTypes.ROADMAP);
	const provider = ref(Providers.IGN);
	const additionalLayers = ref([]);

	watch(provider, () => {
		mapType.value = ProvidersMapTypes[provider.value][0];
	});

	Vue3Leaflet({
		[Providers.GOOGLE_MAPS]: {
			apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
		},
		[Providers.MAPBOX]: {
			apiKey: import.meta.env.VITE_MAPBOX_API_KEY,
		},
	});

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

	const savedMaps = Offline.getMaps();

	function downloadProgress(e) {
		console.log('progress', e);
	}

	function onMaxSize() {
		console.log('maxSize');
	}

	function deleteMap(map) {
		Offline.deleteMap(map.normalizedName);
	}
</script>

<style lang="scss">
	.app {
		.selector {
			margin: 1rem 0;
		}
		.map-container {
			height: 600px;
		}

		&_saved-maps {
			&_list {
				display: flex;
				flex-direction: column;
				gap: 1rem;
				&_map {
					display: flex;
					gap: 1rem;
					border: 1px solid black;
					padding: 0.5rem 1rem;

					&_name {
						flex-grow: 1;
					}
					&_provider {
						width: 7rem;
					}
					&_type {
						width: 6rem;
					}
					&_missing-tiles {
						width: 6rem;
					}
					&_delete {
						width: 5rem;
					}
				}
			}
		}
	}
</style>
