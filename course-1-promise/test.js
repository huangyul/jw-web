// promise测试

const MyPromise = require('./MyPromise')

const p = new MyPromise((resolve, reject) => {
  resolve(123)
})

const p2 = p.then((value) => {
  throw value
})

console.log(p2)
p2.then(
  (value) => console.log(value),
  (reason) => console.log(reason)
)

// git测试
