// promise测试

const MyPromise = require('./MyPromise')

const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('resolve')
  }, 100)
})

p.then((value) => {
  console.log(value)
})
