const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromsie {
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
      this.FULFILLED_CALLBACK_LIST.forEach((cb) => {
        cb(this.value)
      })
    }
  }

  reject(reason) {
    if (this.status === PENDING) {
      this.reason = reason
      this.status = REJECTED
      this.REJECTED_CALLBACK_LIST.forEach((cb) => {
        cb(this.reason)
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

    const onFulfilledWithCatch = (resolve, reject, newPromise) => {
      queueMicrotask(() => {
        try {
          if (typeof onFulfilled != 'function') {
            resolve(this.value)
          } else {
            const x = onFulfilled(this.value)
            this.resolvePromise(x, newPromise, resolve, reject)
          }
        } catch (err) {
          reject(err)
        }
      })
    }

    const onRejectedWithCatch = (resolve, reject, newPromise) => {
      queueMicrotask(() => {
        try {
          if (typeof onRejected != 'function') {
            reject(this.reason)
          } else {
            const x = onRejected(this.reason)
            this.resolvePromise(x, newPromise, resolve, reject)
          }
        } catch (err) {
          reject(err)
        }
      })
    }

    switch (this.status) {
      case FULFILLED: {
        const newPromise = new MyPromsie((resolve, reject) => {
          queueMicrotask(() => {
            onFulfilledWithCatch(resolve, reject, newPromise)
          })
        })
        return newPromise
      }
      case REJECTED: {
        const newPromise = new MyPromsie((resolve, reject) => {
          queueMicrotask(() => {
            onRejectedWithCatch(resolve, reject, newPromise)
          })
        })
        return newPromise
      }
      case PENDING: {
        const newPromise = new MyPromsie((resolve, reject) => {
          queueMicrotask(() => {
            this.FULFILLED_CALLBACK_LIST.push(() => {
              onFulfilledWithCatch(resolve, reject, newPromise)
            })
            this.REJECTED_CALLBACK_LIST.push(() => {
              onRejectedWithCatch(resolve, reject, newPromise)
            })
          })
        })
        return newPromise
      }
    }
  }

  resolvePromise(x, newPromise, resolve, reject) {
    if (x === newPromise) {
      return reject(new TypeError('xxxx'))
    }

    if (x instanceof MyPromsie) {
      x.then((y) => {
        this.resolvePromise(y, newPromise, resolve, reject)
      }, reject)
    } else if (['object', 'function'].includes(typeof x)) {
      if (x === null) {
        return resolve(x)
      }

      let then

      try {
        then = x.then
      } catch (err) {
        return reject(err)
      }
      let called = false
      if (typeof then === 'function') {
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            this.resolvePromise(y, newPromise, resolve, reject)
          },
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        if (called) return
        resolve(x)
      }
    } else {
      resolve(x)
    }
  }

  static resolve(value) {
    if (value instanceof MyPromsie) {
      return value
    }
    return new MyPromsie((resolve, reject) => {
      resolve(value)
    })
  }

  static reject(reason) {
    return new MyPromsie((resolve, reject) => {
      reject(reason)
    })
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }
}

const p = new MyPromsie((resolve, reject) => {
  reject(123)
})

p.then().catch((reason) => {
  console.log(p)
  console.log(reason)
})

// p.then(() => {
//   return 888
// }).then((value) => {
//   console.log(value)
// })
