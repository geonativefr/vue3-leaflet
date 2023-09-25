import { reactive } from 'vue';
import { bounds, DomEvent, Point, TileLayer, Util } from 'leaflet';
import {
	deleteDB,
	deleteEntry,
	openDB,
	readDB,
	readAllDB,
	readAllKeysDB,
	storeDB,
	storeArrayDB,
	readQueuedDB,
	readAllKeysIndex,
} from '../utils/indexed-db.js';
import { waitForDefined } from '../utils/utils.js';

const ZOOM_LEVELS = [12, 13, 14, 15, 16, 17, 18, 19];

const DB_NAME = 'leaflet-offline';

const TABLES = {
	MAPS: {
		name: 'maps',
	},
	TILES: {
		name: 'tiles',
		indexes: {
			MAP: 'map',
		},
	},
};

const state = reactive({
	db: undefined,
	maps: [],
});

(async () => {
	try {
		state.db = await openDB(DB_NAME, 2, mainDBUpdate);
		state.maps = await readAllDB(state.db, TABLES.MAPS.name);
	} catch (e) {
		console.error('fail open db', e);
	}
})();

async function mainDBUpdate(db, oldVersion, newVersion) {
	if (oldVersion < 1 && newVersion >= 1) {
		db.createObjectStore(TABLES.MAPS.name, { keyPath: 'normalizedName' });
	}
	if (oldVersion < 2 && newVersion >= 2) {
		const tileObjectStore = db.createObjectStore(TABLES.TILES.name);
		tileObjectStore.createIndex(TABLES.TILES.indexes.MAP, 'map', { unique: false });
		migrateV1Maps();
	}
}

async function migrateV1Maps() {
	await waitForDefined(() => state.db);
	const maps = await readAllDB(state.db, TABLES.MAPS.name);
	for (const map of maps) {
		const subDbName = DB_NAME + '-' + map.normalizedName;
		const subDb = await openDB(subDbName, 1, subDBUpdate);
		for (const zoomLevel of ZOOM_LEVELS) {
			try {
				const keys = await readAllKeysDB(subDb, 'tiles-' + zoomLevel);
				for (const key of keys) {
					const tile = await readDB(subDb, 'tiles-' + zoomLevel, key);
					await storeDB(state.db, TABLES.TILES.name, { map: map.normalizedName, tile }, key);
				}
			} catch (e) {
				console.error(subDbName, 'tiles-' + zoomLevel, e);
			}
		}
		subDb.close();
		await deleteDB(subDbName);
	}
}

async function subDBUpdate(db) {
	ZOOM_LEVELS.forEach((zoomLevel) => db.createObjectStore('tiles-' + zoomLevel));
}

function getTilePoints(area, tileSize) {
	const points = [];
	if (!area.min || !area.max) {
		return points;
	}
	const topLeftTile = area.min.divideBy(tileSize.x).floor();
	const bottomRightTile = area.max.divideBy(tileSize.x).floor();

	for (let j = topLeftTile.y; j <= bottomRightTile.y; j += 1) {
		for (let i = topLeftTile.x; i <= bottomRightTile.x; i += 1) {
			points.push(new Point(i, j));
		}
	}
	return points;
}

function getTileUrls(templateUrl, bounds, zoom, tileSize, options) {
	const tiles = [];
	const tilePoints = getTilePoints(bounds, tileSize);
	for (let index = 0; index < tilePoints.length; index += 1) {
		const tilePoint = tilePoints[index];
		const data = {
			x: tilePoint.x,
			y: tilePoint.y,
			z: zoom,
		};
		const url = getTileUrl(templateUrl, { ...options, ...data });
		tiles.push(url);
	}
	return tiles;
}

function getTileUrl(urlTemplate, data) {
	return Util.template(urlTemplate, data);
}

export function getMaps() {
	return state.maps;
}

export async function deleteMap(mapName) {
	const map = state.maps.find((map) => map.normalizedName === mapName);
	state.maps = state.maps.filter((_map) => _map !== map);
	await deleteEntry(state.db, TABLES.MAPS.name, mapName);
	const keys = await readAllKeysIndex(
		state.db,
		TABLES.TILES.name,
		TABLES.TILES.indexes.MAP,
		IDBKeyRange.only(map.normalizedName)
	);
	for (const key of keys) {
		await deleteEntry(state.db, TABLES.TILES, key);
	}
}

export default class TileLayerOffline extends TileLayer {
	provider;
	type;

	constructor(provider, type, url, options) {
		super(url, options);
		this.provider = provider;
		this.type = type;
	}

	createTile(coords, done) {
		const image = document.createElement('img');
		image.setAttribute('role', 'presentation');

		DomEvent.on(image, 'load', Util.bind(this._tileOnLoad, this, done, image));
		DomEvent.on(image, 'error', Util.bind(this._tileOnError, this, done, image));

		const url = getTileUrl(this._url, { ...this.options, ...coords });

		(async () => {
			let data;
			if (ZOOM_LEVELS.includes(coords.z)) {
				await waitForDefined(() => state.db);
				data = await readQueuedDB(TABLES.TILES.name, state.db, TABLES.TILES.name, url);
			}
			if (data) {
				image.src = URL.createObjectURL(data.tile);
			} else {
				image.src = url;
			}
		})();

		return image;
	}

	async saveTiles(mapName, progressHandler) {
		const normalizedName = mapName.replace(/[^A-Za-z0-9]/g, ''); //remove non ascii characters

		if (state.maps.find((map) => map.normalizedName === normalizedName)) {
			throw `this name already exist : ${normalizedName}`;
		}

		console.time('saveTiles');

		const latlngBounds = this._map.getBounds();
		const map = {
			name: mapName,
			normalizedName,
			NE: latlngBounds._northEast,
			SW: latlngBounds._southWest,
			provider: this.provider,
			type: this.type,
		};
		await waitForDefined(() => state.db);
		await storeDB(state.db, 'maps', map);
		state.maps.push(map);

		const tileUrls = [];
		for (let i = 0; i < ZOOM_LEVELS.length; i += 1) {
			const zoomLevel = ZOOM_LEVELS[i];
			const area = bounds(
				this._map.project(latlngBounds.getNorthWest(), zoomLevel),
				this._map.project(latlngBounds.getSouthEast(), zoomLevel)
			);
			tileUrls.push(...getTileUrls(this._url, area, zoomLevel, this.getTileSize(), this.options));
		}

		let nbSaved = 0;
		for (const urls of arraySplit(tileUrls, 20)) {
			const datas = [];
			await Promise.all(
				urls.map(async (tileUrl) => {
					try {
						const response = await fetch(tileUrl);
						if (response.ok) {
							datas.push({
								key: tileUrl,
								value: { map: map.normalizedName, tile: await response.blob() },
							});
						}
					} catch (e) {
						console.error(e);
					} finally {
						nbSaved++;
					}
				})
			);
			await storeArrayDB(state.db, TABLES.TILES.name, datas);
			progressHandler(nbSaved, tileUrls.length);
		}
		console.timeEnd('saveTiles');
	}
}

function arraySplit(array, size) {
	const output = [];
	for (let i = 0; i < array.length; i += size) {
		output.push(array.slice(i, i + size));
	}
	return output;
}
