import { ref } from 'vue';
import { get, set } from '@vueuse/core';
import { bounds, DomEvent, Point, TileLayer, Util } from 'leaflet';
import { deleteDB, deleteEntry, openDB, readDB, readAllDB, storeDB, storeArrayDB } from '../utils/indexed-db.js';

const zoomlevels = [12, 13, 14, 15, 16, 17, 18];

const DB_NAME = 'leaflet-offline';

let maps = ref([]);

(async () => {
	try {
		const mainDb = await openDB(DB_NAME, 1, mainDBUpdate);
		set(maps, await readAllDB(mainDb, 'maps'));
		mainDb.close();
	} catch (e) {
		console.error('fail open db', e);
	}
})();

function mainDBUpdate(db) {
	db.createObjectStore('maps', { keyPath: 'normalizedName' });
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
		const url = getTileUrl(templateUrl, {...options, ...data});
		tiles.push(url);
	}
	return tiles;
}

function getTileUrl(urlTemplate, data) {
	return Util.template(urlTemplate, data);
}

export function getMaps() {
	return maps;
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

		const url = getTileUrl(this._url, {...this.options, ...coords});

		(async () => {
			let data;
			if (zoomlevels.includes(coords.z)) {
				const map = get(maps).find((map) => {
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
				const db =
					map &&
					(await openDB(DB_NAME + '-' + map.normalizedName, 1, (db) => {
						zoomlevels.forEach((zoomLevel) => db.createObjectStore('tiles-' + zoomLevel));
					}));
				data = db && (await readDB(db, 'tiles-' + coords.z, url));
				db?.close();
			}
			if (data) {
				image.src = URL.createObjectURL(data);
			} else {
				image.src = url;
			}
		})();

		return image;
	}

	async saveTiles(mapName, progressHandler) {
		const normalizedName = mapName.replace(/[^A-Za-z0-9]/g, ''); //remove non ascii characters

		if (get(maps)?.find((map) => map.normalizedName === normalizedName)) {
			throw `this name already exist : ${normalizedName}`;
		}

		console.time('saveTiles');

		const latlngBounds = this._map.getBounds();
		const mainDb = await openDB(DB_NAME, 1, mainDBUpdate);
		const map = {
			name: mapName,
			normalizedName,
			NE: latlngBounds._northEast,
			SW: latlngBounds._southWest,
			provider: this.provider,
			type: this.type,
		};
		await storeDB(mainDb, 'maps', map);
		set(maps, [...get(maps), map]);
		mainDb.close();

		const db = await openDB(DB_NAME + '-' + normalizedName, 1, (db) => {
			zoomlevels.forEach((zoomLevel) => db.createObjectStore('tiles-' + zoomLevel));
		});

		const tileUrls = zoomlevels.reduce((tileUrls, zoomLevel) => ({ ...tileUrls, [zoomLevel]: [] }), {});
		let nbTiles = 0;
		for (let i = 0; i < zoomlevels.length; i += 1) {
			const zoomLevel = zoomlevels[i];
			const area = bounds(
				this._map.project(latlngBounds.getNorthWest(), zoomLevel),
				this._map.project(latlngBounds.getSouthEast(), zoomLevel)
			);
			tileUrls[zoomLevel].push(...getTileUrls(this._url, area, zoomLevel, this.getTileSize(), this.options));
			nbTiles += tileUrls[zoomLevel].length;
		}

		let nbSaved = 0;
		for (let i = 0; i < zoomlevels.length; i += 1) {
			const zoomLevel = zoomlevels[i];
			const urls = arraySplit(tileUrls[zoomLevel], 20);
			const datas = [];
			for (let j = 0; j < urls.length; j++) {
				await Promise.all(
					urls[j].map(async (tileUrl) => {
						try {
							const response = await fetch(tileUrl);
							if (response.ok) {
								datas.push({ key: tileUrl, value: await response.blob() });
							}
						} catch (e) {
							console.error(e);
						} finally {
							nbSaved++;
						}
					})
				);
				await storeArrayDB(db, 'tiles-' + zoomLevel, datas);
				progressHandler(nbSaved, nbTiles);
			}
		}
		db.close();
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
