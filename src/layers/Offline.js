import { reactive } from 'vue';
import { bounds, DomEvent, Point, TileLayer, Util, latLngBounds } from 'leaflet';
import { deleteDB, deleteEntry, openDB, readQueuedDB, readAllDB, storeDB, storeArrayDB } from '../utils/indexed-db.js';
import { waitForDefined } from '../utils/utils.js';

const oldZoomlevels = [12, 13, 14, 15, 16, 17, 18];
const zoomlevels = [12, 13, 14, 15, 16, 17, 18, 19];

const DB_NAME = 'leaflet-offline';

const state = reactive({
	db: {},
	maps: [],
	initialized: undefined,
});

init();

async function init() {
	try {
		state.db.main = await openDB(DB_NAME, 1, mainDBUpdate);
		state.maps = await readAllDB(state.db.main, 'maps');
		// migrate old maps to new format
		for (const map of state.maps) {
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
				await storeDB(state.db.main, 'maps', map, { update: true });
			}
			state.db[map.normalizedName] = await openDB(DB_NAME + '-' + map.normalizedName, 1, subDBUpdate);
		}
	} catch (e) {
		console.error('fail open db', e);
	}
	state.initialized = true;
}

function mainDBUpdate(db) {
	db.createObjectStore('maps', { keyPath: 'normalizedName' });
}

function subDBUpdate(db) {
	Object.keys(map.structure).forEach((zoomLevel) =>
		tileUrls[zoomLevel].forEach((index) => db.createObjectStore(`tiles-${zoomLevel}-${index}`))
	);
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
	state.maps = state.maps.filter((map) => map.normalizedName !== mapName);
	await deleteEntry(state.db.main, 'maps', mapName);
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
			await waitForDefined(() => state.initialized);
			if (zoomlevels.includes(coords.z)) {
				const map = state.maps.find((map) => {
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
				const db = map && (await waitForDefined(() => state.db[map.normalizedName]));
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
					(await readQueuedDB(db, `tiles-${coords.z}-${index}`, url));
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

		if (state.maps.find((map) => map.normalizedName === normalizedName)) {
			throw `this name already exist : ${normalizedName}`;
		}

		console.time('saveTiles');

		const latlngBounds = this._map.getBounds();
		const map = {
			name: mapName,
			normalizedName,
			NW: latlngBounds.getNorthWest(),
			SE: latlngBounds.getSouthEast(),
			provider: this.provider,
			type: this.type,
		};
		await storeDB(state.db.main, 'maps', map);
		state.maps.push(map);

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

		state.db[map.normalizedName] = await openDB(DB_NAME + '-' + normalizedName, 1, (db) => {
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
					await storeArrayDB(state.db[map.normalizedName], `tiles-${zoomLevel}-${index}`, datas);
					progressHandler(nbSaved, nbTiles);
				}
			}
		}

		map.structure = Object.keys(tileUrls).reduce(
			(structure, zoomLevel) => ({ ...structure, [zoomLevel]: Object.keys(tileUrls[zoomLevel]) }),
			{}
		);

		await storeDB(state.db.main, 'maps', map, { update: true });
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
