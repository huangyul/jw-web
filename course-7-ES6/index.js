function shallowClone(source) {
  const obj = {}
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      obj[key] = source[key]
    }
  }
  return obj
}

console.log(shallowClone({ name: 1, age: 3 }))
