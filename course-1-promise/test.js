const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('p1 3秒')
  }, 3000)
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p2 1秒')
  }, 1000)
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('p3 5秒')
  }, 5000)
})

Promise.allSettled([p1, p2, p3])
  .then((value) => {
    console.log('fulfilled')
    console.log(value)
  })
  .catch((reason) => {
    console.log('rejected')
    console.log(reason)
  })
