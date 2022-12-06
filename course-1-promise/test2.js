const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  FULFILLED_CALL_BACK_LIST = []
  REJECTED_CALL_BACK_LIST = []
  constructor(fn) {
    this.status = PENDING
    this.value = null
    this.reason = null
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  resole(value) {
    if (this.status === PENDING) {
      this.value = value
      this.status = FULFILLED
    }
  }
  rejeject(reason) {
    if (this.status === PENDING) {
      this.reaon = reason
      this.status = REJECTED
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
    const fulfilledWithCatch = (resolve, reject, newP) => {
      try {
        if (typeof onFulfilled !== 'function') {
          resolve(this.value)
        } else {
          const x = onFulfilled(this.value)
          this.resolvePromise(newP, x, resolve, reject)
        }
      } catch (err) {
        reject(err)
      }
    }
    const rejectedWithCatch = (resolve, reject, newP) => {
      try {
        if (typeof onRejected !== 'function') {
          reject(this.reason)
        } else {
          const x = onRejected(this.reason)
          this.resolvePromise(newP, x, resolve, reject)
        }
      } catch (err) {
        reject(err)
      }
    }

    switch (this.status) {
      case FULFILLED: {
        const newP = new MyPromise((resolve, reject) => {
          queueMicrotask(() => {
            fulfilledWithCatch(resolve, reject, newP)
          })
        })
        return newP
      }
      case REJECTED: {
        const newP = new MyPromise((resolve, reject) => {
          queueMicrotask(() => {
            rejectedWithCatch(resolve, reject, newP)
          })
        })
        return newP
      }
    }
  }

  resolvePromise(newP, x, resolve, reject) {
    if (newP === x) {
      return reject(new TypeError('xxxx'))
    }
    if(x instanceof MyPromise) {
      x.then()
    } else {
      if(x.then) {

      }
    }
  }
}

const p = new MyPromise((resolve, reject) => {})
