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
			upgradeNeeded(event.target.result, event.oldVersion, event.newVersion, event.target.transaction);
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

export function deleteEntry(db, tableName, id, transaction = null) {
	return new Promise((resolve, reject) => {
		let commit = false;
		if (!transaction) [transaction, commit] = [db.transaction([tableName], 'readwrite'), true];
		const store = transaction.objectStore(tableName);
		const request = store.delete(id);
		request.addEventListener('error', (e) => {
			console.error(e);
			reject('failed to delete entry');
		});
		request.addEventListener('success', () => {
			resolve(request.result);
		});
		if (commit) transaction.commit();
	});
}

export function storeDB(db, tableName, data, key, transaction = null) {
	return new Promise(async (resolve, reject) => {
		let commit = false;
		if (!transaction) [transaction, commit] = [db.transaction([tableName], 'readwrite'), true];
		const store = transaction.objectStore(tableName);

		let request;

		if (key) {
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
		request.addEventListener('success', () => {
			resolve();
		});
		request.addEventListener('error', (e) => {
			console.error(e);
			reject('Failed to save the data');
		});
		if (commit) transaction.commit();
	});
}

export async function storeArrayDB(db, tableName, datas, transaction = null) {
	let commit = false;
	if (!transaction) [transaction, commit] = [db.transaction([tableName], 'readwrite'), true];
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
		if (commit) transaction.commit();
	});
}

export function readAllDB(db, tableName, transaction = null) {
	return new Promise((resolve, reject) => {
		let commit = false;
		if (!transaction) [transaction, commit] = [db.transaction([tableName]), true];
		const store = transaction.objectStore(tableName);
		const request = store.getAll();
		request.addEventListener('success', () => {
			resolve(request.result);
		});
		request.addEventListener('error', () => {
			reject('Failed to read the data');
		});
		if (commit) transaction.commit();
	});
}

export function readAllKeysDB(db, tableName, transaction = null) {
	return new Promise((resolve, reject) => {
		let commit = false;
		if (!transaction) [transaction, commit] = [db.transaction([tableName]), true];
		const store = transaction.objectStore(tableName);
		const request = store.getAllKeys();
		request.addEventListener('success', () => {
			resolve(request.result);
		});
		request.addEventListener('error', () => {
			reject('Failed to read the data');
		});
		if (commit) transaction.commit();
	});
}

export function readAllKeysIndex(db, tableName, indexName, keyRange = null, transaction = null) {
	return new Promise((resolve, reject) => {
		let commit = false;
		if (!transaction) [transaction, commit] = [db.transaction([tableName]), true];
		const store = transaction.objectStore(tableName);
		const index = store.index(indexName);
		const request = index.getAllKeys(keyRange);
		request.addEventListener('success', () => {
			resolve(request.result);
		});
		request.addEventListener('error', () => {
			reject('Failed to read the data');
		});
		if (commit) transaction.commit();
	});
}

export function readDB(db, tableName, key, transaction = null) {
	return new Promise((resolve, reject) => {
		let commit = false;
		if (!transaction) [transaction, commit] = [db.transaction([tableName]), true];
		const store = transaction.objectStore(tableName);
		const request = store.get(key);
		request.addEventListener('success', () => {
			resolve(request.result);
		});
		request.addEventListener('error', () => {
			reject('Failed to read the data');
		});
		if (commit) transaction.commit();
	});
}

const queues = {};

export function readQueuedDB(queueName, db, tableName, key) {
	return new Promise((resolve, reject) => {
		if (!queues[queueName]) {
			queues[queueName] = {
				db,
				tableName,
				keys: [],
			};
			readQueue(queues[queueName]);
		}
		queues[queueName].keys.push({
			key,
			resolve,
			reject,
		});
	});
}

async function readQueue(queue) {
	if (queue.keys.length) {
		const transaction = queue.db.transaction([queue.tableName]);
		const store = transaction.objectStore(queue.tableName);
		do {
			const { key, resolve, reject } = queue.keys.shift();
			const request = store.get(key);
			request.addEventListener('success', () => {
				resolve(request.result);
			});
			request.addEventListener('error', () => {
				reject('Failed to read the data');
			});
		} while (queue.keys.length);
		transaction.commit();
	}
	setTimeout(() => readQueue(queue), 100);
}
