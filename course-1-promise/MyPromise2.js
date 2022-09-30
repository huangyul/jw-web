const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  fulfilledFnList = []
  rejectedFnList = []
  constructor(fn) {
    this.status = PENDING
    this.value = null
    this.reason = null
    try {
      fn(this.resolve.bind(this), this.reject.bind(this))
    } catch (err) {
      this.reject(err)
    }
  }

  resolve(value) {
    if (this.status == PENDING) {
      this.value = value
      this.status = FULFILLED

      this.fulfilledFnList.forEach((cb) => {
        cb(this.value)
      })
    }
  }

  reject(reason) {
    if (this.status == PENDING) {
      this.reason = reason
      this.status = REJECTED

      this.rejectedFnList.forEach((cb) => {
        cb(this.reason)
      })
    }
  }

  then(onFulfilled, onRejected) {
    const fulfilledCatch = (resolve, reject, newPromise) => {
      try {
        if (!this.isFunction(onFulfilled)) {
          resolve(this.value)
        } else {
          const x = onFulfilled(this.value)
          this.resolvePromise(newPromise, x, resolve, reject)
        }
      } catch (err) {
        reject(err)
      }
    }
    const rejectedCatch = (resolve, reject, newPromise) => {
      try {
        if (!this.isFunction(onRejected)) {
          reject(this.reason)
        } else {
          const x = onRejected(this.reason)
          this.resolvePromise(newPromise, x, resolve, reject)
        }
      } catch (err) {
        reject(err)
      }
    }
    switch (this.status) {
      case FULFILLED: {
        const newPromise = new MyPromise((resolve, reject) => {
          fulfilledCatch(resolve, reject, newPromise)
        })
        return newPromise
      }
      case REJECTED: {
        const newPromise = new MyPromise((resovle, reject) => {
          rejectedCatch(resolve, reject, newPromise)
        })
        return newPromise
      }
      case PENDING: {
        const newPromise = new MyPromise((resolve, reject) => {
          this.fulfilledFnList.push(() => {
            fulfilledCatch(resolve, reject, newPromise)
          })
          this.rejectedFnList.push(() => {
            rejectedCatch(resolve, reject, newPromise)
          })
        })
        return newPromise
      }
    }
  }

  resolvePromise(newPromise, x, resolve, reject) {
    if (x === newPromise) {
      return reject(
        new TypeError('Chaining cycle detected for promise #<Promise>')
      )
    }
    if (x instanceof MyPromise) {
      x.then(resolve, reject)
    } else if (typeof x === 'object' || this.isFunction(x)) {
      if (x === null) {
        return resolve(x)
      }

      let then = null

      try {
        then = x.then
      } catch (err) {
        return reject(err)
      }

      if (this.isFunction(then)) {
        let called = false

        try {
          then.call(
            x,
            (y) => {
              if (called) return
              this.resolvePromise(newPromise, y, resolve, reject)
            },
            (r) => {
              if (called) return
              reject(r)
            }
          )
        } catch (err) {
          if (called) return
          reject(err)
        }
      } else {
        resolve(x)
      }
    } else {
      resolve(x)
    }
  }

  isFunction(params) {
    return typeof params === 'function'
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value
    }
    return new MyPromise((resolve) => {
      resolve(value)
    })
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason)
    })
  }

  catch(onRejected) {
    this.then(null, onRejected)
  }
}

const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject(123)
  }, 100)
})

// MyPromise.resolve(133).then((value) => {
//   console.log(value)
// })

// MyPromise.reject('fail').catch((reason) => {
//   console.log(reason)
// })

// p.then(
//   (value) => {
//     console.log('p1 success')
//     console.log(value)
//     return p2
//   },
//   (reason) => {
//     console.log('p1 fail')
//     console.log(reason)
//   }
// ).catch((err) => {
//   console.log(err)
// })

// p2.then(
//   (value) => {
//     console.log('p2 success')
//     console.log(value)
//   },
//   (reason) => {
//     console.log('p2 fail')
//     console.log(reason)
//   }
// )
