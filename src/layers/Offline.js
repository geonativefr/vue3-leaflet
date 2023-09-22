import { ref } from 'vue';
import { get, set } from '@vueuse/core';
import { bounds, DomEvent, Point, TileLayer, Util, latLngBounds } from 'leaflet';
import { deleteDB, deleteEntry, openDB, readDB, readAllDB, storeDB, storeArrayDB } from '../utils/indexed-db.js';

const oldZoomlevels = [12, 13, 14, 15, 16, 17, 18];
const zoomlevels = [12, 13, 14, 15, 16, 17, 18, 19];

const DB_NAME = 'leaflet-offline';

let maps = ref([]);

(async () => {
	try {
		const mainDb = await openDB(DB_NAME, 1, mainDBUpdate);
		const _maps = await readAllDB(mainDb, 'maps');
		set(maps, _maps);
		// migrate old maps to new format
		for (let i = 0; i < _maps.length; i++) {
			const map = _maps[i];
			if (!map.structure) {
				map.structure = oldZoomlevels.reduce(
					(structure, zoomLevel) => ({ ...structure, [zoomLevel]: ['0'] }),
					{}
				);
				const bounds = latLngBounds(map.NE, map.SW);
				map.NW = bounds.getNorthWest();
				map.SE = bounds.getSouthEast();
				delete map.NE;
				delete map.SW;
				await storeDB(mainDb, 'maps', map, { update: true });
			}
		}
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
		const point = tilePoints[index];
		const data = {
			x: point.x,
			y: point.y,
			z: zoom,
		};
		const url = getTileUrl(templateUrl, { ...options, ...data });
		tiles.push({ point, url });
	}
	return tiles;
}

function getPointIndex(area, tileSize, point) {
	const topLeftTile = area.min.divideBy(tileSize.x).floor();
	const bottomRightTile = area.max.divideBy(tileSize.x).floor();

	const start = new Point(topLeftTile.x, topLeftTile.y);
	const end = new Point(bottomRightTile.x, bottomRightTile.y);

	return (
		Math.floor((point.x - start.x) / 10) + Math.floor((point.y - start.y) / 10) * Math.ceil((end.x - start.x) / 10)
	);
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

		const url = getTileUrl(this._url, { ...this.options, ...coords });

		(async () => {
			let data;
			if (zoomlevels.includes(coords.z)) {
				const map = get(maps).find((map) => {
					if (map.provider !== this.provider || map.type !== this.type) return false;

					const area = bounds(this._map.project(map.NW, coords.z), this._map.project(map.SE, coords.z));
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
						Object.keys(map.structure).forEach((zoomLevel) =>
							tileUrls[zoomLevel].forEach((index) => db.createObjectStore(`tiles-${zoomLevel}-${index}`))
						);
					}));
				const index =
					db &&
					getPointIndex(
						bounds(this._map.project(map.NW, coords.z), this._map.project(map.SE, coords.z)),
						this.getTileSize(),
						coords
					);
				data =
					db &&
					map.structure[coords.z]?.includes('' + index) &&
					(await readDB(db, `tiles-${coords.z}-${index}`, url));

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
			NW: latlngBounds.getNorthWest(),
			SE: latlngBounds.getSouthEast(),
			provider: this.provider,
			type: this.type,
		};
		await storeDB(mainDb, 'maps', map);
		set(maps, [...get(maps), map]);

		const tileUrls = zoomlevels.reduce((tileUrls, zoomLevel) => ({ ...tileUrls, [zoomLevel]: {} }), {});
		let nbTiles = 0;
		for (let i = 0; i < zoomlevels.length; i += 1) {
			const zoomLevel = zoomlevels[i];

			const area = bounds(
				this._map.project(latlngBounds.getNorthWest(), zoomLevel),
				this._map.project(latlngBounds.getSouthEast(), zoomLevel)
			);
			getTileUrls(this._url, area, zoomLevel, this.getTileSize(), this.options).forEach(({ point, url }) => {
				const pointIndex = getPointIndex(area, this.getTileSize(), point);
				if (!tileUrls[zoomLevel][pointIndex]) tileUrls[zoomLevel][pointIndex] = [];
				tileUrls[zoomLevel][pointIndex].push(url);
				nbTiles++;
			});
		}

		const db = await openDB(DB_NAME + '-' + normalizedName, 1, (db) => {
			Object.keys(tileUrls).forEach((zoomLevel) =>
				Object.keys(tileUrls[zoomLevel]).forEach((index) => db.createObjectStore(`tiles-${zoomLevel}-${index}`))
			);
		});
		let nbSaved = 0;
		for (let i = 0; i < zoomlevels.length; i += 1) {
			const zoomLevel = zoomlevels[i];
			const indexes = Object.keys(tileUrls[zoomLevel]);
			for (let j = 0; j < indexes.length; j++) {
				const index = indexes[j];
				const urls = arraySplit(tileUrls[zoomLevel][index], 20);
				for (let k = 0; k < urls.length; k++) {
					const datas = [];
					await Promise.all(
						urls[k].map(async (url) => {
							try {
								const response = await fetch(url);
								if (response.ok) {
									datas.push({ key: url, value: await response.blob() });
								}
							} catch (e) {
								console.error(e);
							} finally {
								nbSaved++;
							}
						})
					);
					await storeArrayDB(db, `tiles-${zoomLevel}-${index}`, datas);
					progressHandler(nbSaved, nbTiles);
				}
			}
		}
		db.close();

		map.structure = Object.keys(tileUrls).reduce(
			(structure, zoomLevel) => ({ ...structure, [zoomLevel]: Object.keys(tileUrls[zoomLevel]) }),
			{}
		);

		await storeDB(mainDb, 'maps', map, { update: true });
		mainDb.close();
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
