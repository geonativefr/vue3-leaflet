# Vue 3 Leaflet Wrapper

An opinionated Leaflet wrapper for Vue 3.

## Installation

### In your project

```bash
yarn add git+https://git@github.com/geonativefr/vue3-leaflet
```

### For development

```bash
git clone git+ssh://git@github.com:geonativefr/vue3-leaflet.git
cd vue3-leaflet
yarn install
```

## Usage

### MapContainer

Wraps `L.Map` inside a container.

```vue
<template>
	<MapContainer :center="center" />
</template>

<script setup>
	import { MapContainer } from 'vue3-leaflet';
	import { ref } from 'vue';

	const center = ref([48.3151, 3.68461]);
</script>

<style lang="scss">
	@import 'leaflet/dist/leaflet.css';
</style>
```

### Tile Layers (OpenStreetMap, Mapbox, GoogleMaps)

Above example will show an "empty" map. To add tiles:

```vue
<template>
	<MapContainer :center="center">
		<GoogleMaps :api-key="apiKey" type="satellite" />
	</MapContainer>
</template>

<script setup>
	import { MapContainer, GoogleMaps } from 'vue3-leaflet';
	import { ref } from 'vue';

	const center = ref([48.3151, 3.68461]);
	const apiKey = ref('AIzaSyCzoMz4nAXXLRc1WAcToAVzfNoQ60UWdkt');
</script>

<style lang="scss">
	@import 'leaflet/dist/leaflet.css';
</style>
```

### Controls

Add controls on map (zoom, geolocation, scale)

```vue
<template>
	<MapContainer :center="center">
		<GoogleMaps :api-key="apiKey" type="satellite" />
		<ZoomControl />
		<ScaleControl />
		<LocateControl />
	</MapContainer>
</template>

<script setup>
	import { MapContainer, GoogleMaps, ZoomControl, ScaleControl, LocateControl } from 'vue3-leaflet';
	import { ref } from 'vue';

	const center = ref([48.3151, 3.68461]);
	const apiKey = ref('AIzaSyCzoMz4nAXXLRc1WAcToAVzfNoQ60UWdkt');
</script>

<style lang="scss">
	@import 'leaflet/dist/leaflet.css';
</style>
```

#### Pegman (Google Street View)

```vue
<template>
	<MapContainer :center="center">
		<GoogleMaps :api-key="apiKey" type="satellite" />
		<PegmanControl :api-key="apiKey" />
	</MapContainer>
</template>

<script setup>
	import { MapContainer, GoogleMaps, PegmanControl } from 'vue3-leaflet';
	import { ref } from 'vue';

	const center = ref([48.3151, 3.68461]);
	const apiKey = ref('AIzaSyCzoMz4nAXXLRc1WAcToAVzfNoQ60UWdkt');
</script>

<style lang="scss">
	@import 'leaflet/dist/leaflet.css';
	@import 'leaflet-pegman/leaflet-pegman.css';
</style>
```

### Vectors

Add vectors on map (Circle, Polygon, Polyline)

```vue
<template>
	<MapContainer :center="center">
		<GoogleMaps :api-key="apiKey" type="satellite" />
		<Circle :center="circle.center" :radius="circle.radius" color="blue" fill-color="green" />
	</MapContainer>
</template>

<script setup>
	import { MapContainer, GoogleMaps, Circle } from 'vue3-leaflet';
	import { ref } from 'vue';

	const center = ref([48.3151, 3.68461]);
	const apiKey = ref('AIzaSyCzoMz4nAXXLRc1WAcToAVzfNoQ60UWdkt');
	const circle = {
		center: [48.3151, 3.68461],
		radius: 250, // in meters
	};
</script>

<style lang="scss">
	@import 'leaflet/dist/leaflet.css';
</style>
```

### Markers and popups

Add markers on map

```vue
<template>
	<MapContainer :center="center">
		<OpenStreetMap />
		<Marker :position="[48.3151, 3.68461]" icon="/path/to/icon.png" />
		<Marker :position="[49.68561, 3.9881]" :icon="{ iconUrl: '/path/to/icon.png' }">
			<Popup>
				<div class="text-blue-600 font-semibold">Hello world!</div>
			</Popup>
		</Marker>
	</MapContainer>
</template>

<script setup>
	import { MapContainer, OpenStreetMap, Marker, Popup } from 'vue3-leaflet';
	import { ref } from 'vue';

	const center = ref([48.3151, 3.68461]);
</script>

<style lang="scss">
	@import 'leaflet/dist/leaflet.css';
</style>
```

## HMR

Play with `examles/App.vue` and watch for changes:

Add a `.env.local` file:

```env
VITE_GOOGLE_MAPS_API_KEY=
VITE_MAPBOX_API_KEY=
```

then

```bash
yarn dev
```

### Within your project

```bash
yarn link # Do this once, will register your local copy of vue3-leaflet as a local repository
yarn build -w
```

Then, inside your project:

```bash
yarn link vue3-leaflet # Will override your node_modules dependency to use your local copy
yarn dev --force # Will watch for changes in your project + in vue3-leaflet
yarn unlink vue3-leaflet # Once you're done
```
