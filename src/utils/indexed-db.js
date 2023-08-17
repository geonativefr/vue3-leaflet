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

export function storeDB(db, tableName, data, key) {
	return new Promise(async (resolve, reject) => {
		const transaction = db.transaction([tableName], 'readwrite');
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