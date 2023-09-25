export function openDB(name, version, upgradeNeeded) {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(name, version);
		request.addEventListener('error', (e) => {
			console.error(e);
			reject('Database failed to open');
		});
		request.addEventListener('success', () => {
			resolve(request.result);
		});
		request.addEventListener('upgradeneeded', (event) => {
			upgradeNeeded(event.target.result);
		});
	});
}

export function deleteDB(name) {
	return new Promise((resolve, reject) => {
		const request = indexedDB.deleteDatabase(name);
		request.addEventListener('error', (e) => {
			console.error(e);
			reject('Database failed to delete');
		});
		request.addEventListener('success', () => {
			resolve(request.result);
		});
	});
}

export function deleteEntry(db, tableName, id) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([tableName], 'readwrite');
		const store = transaction.objectStore(tableName);
		const request = store.delete(id);
		request.addEventListener('error', (e) => {
			console.error(e);
			reject('failed to delete entry');
		});
		request.addEventListener('success', () => {
			resolve(request.result);
		});
		transaction.commit();
	});
}

export function storeDB(db, tableName, data, { key, update } = { update: false }) {
	return new Promise(async (resolve, reject) => {
		const transaction = db.transaction([tableName], 'readwrite');
		const store = transaction.objectStore(tableName);

		let request;
		if (update) {
			request = store.put(data);
		} else if (key) {
			const old = await new Promise((res, rej) => {
				const req = store.get(key);
				req.addEventListener('success', () => {
					res(req.result);
				});
				req.addEventListener('error', () => {
					rej('Failed to read the data');
				});
			});

			if (old) {
				request = store.put(data, key);
			} else {
				request = store.add(data, key);
			}
		} else {
			request = store.add(data);
		}
		request.addEventListener('success', (event) => {
			resolve(event.target.result);
		});
		request.addEventListener('error', (e) => {
			console.error(e);
			reject('Failed to save the data');
		});
		transaction.commit();
	});
}

export async function storeArrayDB(db, tableName, datas) {
	const transaction = db.transaction([tableName], 'readwrite');
	const store = transaction.objectStore(tableName);

	let requests = datas.map(async (data) => {
		let request;
		if (data.key) {
			const old = await new Promise((res, rej) => {
				const req = store.get(data.key);
				req.addEventListener('success', () => {
					res(req.result);
				});
				req.addEventListener('error', () => {
					rej('Failed to read the data');
				});
			});

			if (old) {
				request = store.put(data.value, data.key);
			} else {
				request = store.add(data.value, data.key);
			}
		} else {
			request = store.add(data);
		}
		return await new Promise((res, rej) => {
			request.addEventListener('success', () => {
				res();
			});
			request.addEventListener('error', (e) => {
				console.error(e);
				rej('Failed to save the data');
			});
		});
	});
	return Promise.all(requests).then(() => {
		transaction.commit();
	});
}

export function readAllDB(db, tableName) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([tableName]);
		const store = transaction.objectStore(tableName);
		const request = store.getAll();
		request.addEventListener('success', () => {
			resolve(request.result);
		});
		request.addEventListener('error', () => {
			reject('Failed to read the data');
		});
		transaction.commit();
	});
}

export function readDB(db, tableName, key) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([tableName]);
		const store = transaction.objectStore(tableName);
		const request = store.get(key);
		request.addEventListener('success', () => {
			resolve(request.result);
		});
		request.addEventListener('error', () => {
			reject('Failed to read the data');
		});
		transaction.commit();
	});
}

const queue = [];

export function readQueuedDB(db, tableName, key) {
	return new Promise((resolve, reject) => {
		queue.push({
			db,
			tableName,
			key,
			resolve,
			reject,
		});
	});
}

async function readQueue() {
	let next = queue.shift();
	if (next) {
		const transaction = next.db.transaction([next.tableName]);
		const store = transaction.objectStore(next.tableName);
		while (next) {
			const request = store.get(next.key);
			const { resolve, reject } = next;
			request.addEventListener('success', () => {
				resolve(request.result);
			});
			request.addEventListener('error', () => {
				reject('Failed to read the data');
			});
			next = queue.shift();
		}
		transaction.commit();
	}
	setTimeout(readQueue, 100);
}
readQueue();
