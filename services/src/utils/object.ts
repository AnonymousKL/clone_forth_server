export function removeEmptyProps(obj: any) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === '') {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      obj[key] = removeEmptyProps(obj[key])
    }
  }
  return obj
}

