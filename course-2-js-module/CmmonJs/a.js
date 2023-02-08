let { a, b } = require('./a')
console.log('123')

console.log(a)
console.log(b)
setTimeout(() => {
  console.log(a)
  console.log(b)
}, 400)
