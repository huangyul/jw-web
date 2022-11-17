const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  FULFILLED_CALLBACK_LIST = []
  REJECTED_CALLBACK_LIST = []
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
    if (this.status === PENDING) {
      this.value = value
      this.status = FULFILLED

      this.FULFILLED_CALLBACK_LIST.forEach((fn) => {
        fn(this.value)
      })
    }
  }

  reject(reason) {
    if (this.status === PENDING) {
      this.reason = reason
      this.status = REJECTED

      this.REJECTED_CALLBACK_LIST.forEach((fn) => {
        fn(this.reason)
      })
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }

    const fulfilledWithCatch = (resolve, reject, newPromise) => {
      queueMicrotask(() => {
        try {
          if (typeof onFulfilled !== 'function') {
            resolve(this.value)
          } else {
            const x = onFulfilled(this.value)
            this.resolvePromsie(x, newPromise, resolve, reject)
          }
        } catch (err) {
          reject(err)
        }
      })
    }

    const rejectedWithCatch = (resolve, reject, newPromise) => {
      queueMicrotask(() => {
        try {
          if (typeof onRejected !== 'function') {
            reject(this.reason)
          } else {
            const x = onRejected(this.reason)
            this.resolvePromsie(x, newPromise, resolve, reject)
          }
        } catch (err) {
          reject(err)
        }
      })
    }

    switch (this.status) {
      case FULFILLED: {
        const newPromise = new MyPromise((resolve, reject) => {
          queueMicrotask(() => {
            fulfilledWithCatch(resolve, reject, newPromise)
          })
        })
        return newPromise
      }
      case REJECTED: {
        const newPromise = new MyPromise((resolve, reject) => {
          queueMicrotask(() => {
            rejectedWithCatch(resolve, reject, newPromise)
          })
        })
        return newPromise
      }
      case PENDING: {
        const newPromise = new MyPromise((resolve, reject) => {
          queueMicrotask(() => {
            this.FULFILLED_CALLBACK_LIST.push(() => {
              fulfilledWithCatch(resolve, reject, newPromise)
            })
            this.REJECTED_CALLBACK_LIST.push(() => {
              rejectedWithCatch(resolve, reject, newPromise)
            })
          })
        })
        return newPromise
      }
    }
  }

  resolvePromsie(x, newPromise, resolve, reject) {
    if (x === newPromise) {
      return reject(new TypeError('xxx'))
    }

    if (x instanceof MyPromise) {
      x.then(resolve, reject)
    } else if (['object', 'function'].includes(typeof x)) {
      if (x === null) {
        return resolve()
      }

      let then
      try {
        then = x.then
      } catch (err) {
        return reject(err)
      }

      if (typeof then === 'function') {
        let called = false

        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            this.resolvePromsie(y, newPromise, resolve, reject)
          },
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        return resolve(x)
      }
    } else {
      return resolve(x)
    }
  }

  catch(onRejected) {
    this.then(null, onRejected)
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value
    }
    return new MyPromise((resolve) => resolve(value))
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason)
    })
  }

  static all(list) {
    return new MyPromise((resolve, reject) => {
      let count = 0
      let resArr = []
      let len = list.length

      if (len === 0) {
        return resolve([])
      }

      list.forEach((i, index) => {
        MyPromise.resolve(i).then(
          (value) => {
            count += 1
            resArr[index] = value
            if (count === len) return resolve(resArr)
          },
          (reason) => {
            return reject(reason)
          }
        )
      })
    })
  }

  static race(list) {
    return new MyPromise((resolve, reject) => {
      list.forEach((i) => {
        MyPromise.resolve(i).then(
          (value) => {
            return resolve(value)
          },
          (r) => {
            return reject(reason)
          }
        )
      })
    })
  }
}

const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 1000)
})

const p2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject(3)
  }, 3000)
})

MyPromise.race([p1, p2])
  .then((value) => {
    console.log(value)
  })
  .catch((reason) => {
    console.log(reason)
  })
