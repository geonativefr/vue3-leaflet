import { reactive } from 'vue';
import { get, set } from '@vueuse/core';
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
} from '../utils/indexed-db.js';
import { waitForDefined } from '../utils/utils.js';

const ZOOM_LEVELS = [12, 13, 14, 15, 16, 17, 18, 19];

const DB_NAME = 'leaflet-offline';

const tableNames = {
	MAPS: 'maps',
	TILES: 'tiles',
};

const state = reactive({
	db: undefined,
	maps: [],
});

(async () => {
	try {
		state.db = await openDB(DB_NAME, 2, mainDBUpdate);
		state.maps, await readAllDB(state.db, tableNames.MAPS);
	} catch (e) {
		console.error('fail open db', e);
	}
})();

async function mainDBUpdate(db, oldVersion, newVersion, transaction) {
	if (oldVersion < 1 && newVersion >= 1) {
		db.createObjectStore(tableNames.MAPS, { keyPath: 'normalizedName' });
	}
	if (oldVersion < 2 && newVersion >= 2) {
		const tileObjectStore = db.createObjectStore(tableNames.TILES);
		tileObjectStore.createIndex('map', 'map', { unique: false });

		const maps = await readAllDB(db, tableNames.MAPS, transaction);
		for (const map of maps) {
			const subDbName = DB_NAME + '-' + map.normalizedName;
			const subDb = await openDB(subDbName, 1, subDBUpdate);
			for (const zoomLevel of ZOOM_LEVELS) {
				const keys = await readAllKeysDB(subDb, 'tiles-' + zoomLevel, transaction);
				for (const key of keys) {
					const tile = await readDB(subDb, 'tiles-' + zoomLevel, key, transaction);
					await storeDB(db, tableNames.TILES, { map: map.normalizedName, tile }, key, transaction);
				}
			}
			await deleteDB(subDbName);
		}
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
	await deleteDB(DB_NAME + '-' + mapName);
	set(
		maps,
		get(maps).filter((map) => map.normalizedName !== mapName)
	);
	const mainDb = await openDB(DB_NAME, 1, mainDBUpdate);
	await deleteEntry(mainDb, 'maps', mapName);
	mainDb.close();
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
				const map = state.maps.find((map) => {
					if (map.provider !== this.provider || map.type !== this.type) return false;

					const area = bounds(this._map.project(map.NE, coords.z), this._map.project(map.SW, coords.z));
					const topLeftTile = area.min.divideBy(this.getTileSize().x).floor();
					const bottomRightTile = area.max.divideBy(this.getTileSize().x).floor();
					return (
						coords.x >= topLeftTile.x &&
						coords.x <= bottomRightTile.x &&
						coords.y >= topLeftTile.y &&
						coords.y <= bottomRightTile.y
					);
				});
				await waitForDefined(() => state.db);
				data = await readQueuedDB(tableNames.TILES, state.db, tableNames.TILES, url);
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
			await storeArrayDB(state.db, tableNames.TILES, datas);
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
