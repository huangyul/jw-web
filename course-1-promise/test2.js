const MyPromsie2 = require('./MyPromise2')

const promise = new MyPromsie2((resolve, reject) => {
  resolve(100)
})
const p1 = promise.then((value) => {
  console.log(value)
  return p1
})
