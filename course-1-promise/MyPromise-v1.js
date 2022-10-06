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
        const newPromise = new MyPromise((resolve, reject) => {
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
    } else {
      resolve(x)
    }
  }



  isFunction(params) {
    return typeof params === 'function'
  }
}
