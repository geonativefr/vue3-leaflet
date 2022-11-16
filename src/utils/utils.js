export function renderless(component) {
  return Object.assign(component, {render: () => undefined});
}

function isRealObject(object) {
  return 'object' === typeof object && null !== object;
}

export function clean(object) {
  if (!isRealObject(object)) {
    return object;
  }
  Object.keys(object).forEach(key => {
    if (isRealObject(object[key])) {
      object[key] = clean(object[key]);
      return;
    }
    if ('undefined' === typeof object[key]) {
      if (Array.isArray(object)) {
        object.splice(key, 1);
      } else {
        delete object[key];
      }
    }
  });
  return object;
}

export async function loadGmapsApi(GOOGLE_MAPS_API_KEY) {
  window.gmapsApi = window.gmapsApi ?? new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.type = 'text/javascript';
    el.src = 'https://maps.googleapis.com/maps/api/js?key=' + GOOGLE_MAPS_API_KEY;
    el.async = true;
    el.addEventListener('error', event => reject(event));
    el.addEventListener('abort', event => reject(event));
    el.addEventListener('load', () => {
      resolve(true);
    });
    document.head.appendChild(el);
  });

  return window.gmapsApi;
}

export async function loadJSFromCDN(url) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src='${url}']`);
    if (existing) {
      return resolve();
    }
    const el = document.createElement('script');
    el.type = 'text/javascript';
    el.src = url;
    el.addEventListener('error', event => reject(event));
    el.addEventListener('abort', event => reject(event));
    el.addEventListener('load', () => resolve());
    document.head.appendChild(el);
  });
}

export async function loadCSSFromCDN(url) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`link[rel='stylesheet'][href='${url}']`);
    if (existing) {
      return resolve();
    }
    const el = document.createElement('link');
    el.rel = 'stylesheet';
    el.href = url;
    el.crossOrigin = '';
    el.addEventListener('error', event => reject(event));
    el.addEventListener('abort', event => reject(event));
    el.addEventListener('load', () => resolve());
    document.head.appendChild(el);
  });
}
