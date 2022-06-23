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
