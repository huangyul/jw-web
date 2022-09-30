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
    const fulfilledCatch = (resolve, reject) => {
      try {
        if (!this.isFunction(onFulfilled)) {
          resolve(this.value)
        } else {
          const x = onFulfilled(this.value)
          this.resolvePromise(x, resolve, reject)
        }
      } catch (err) {
        reject(err)
      }
    }
    const rejectedCatch = (resolve, reject) => {
      try {
        onRejected(this.reason)
      } catch (err) {
        reject(err)
      }
    }
    switch (this.status) {
      case FULFILLED: {
        return new MyPromise((resolve, reject) => {
          fulfilledCatch(resolve, reject)
        })
      }
      case REJECTED: {
        return new MyPromise((resovle, reject) => {
          rejectedCatch(resolve, reject)
        })
      }
      case PENDING: {
        return new MyPromise((resolve, reject) => {
          this.fulfilledFnList.push(() => {
            fulfilledCatch(resolve, reject)
          })
          this.rejectedFnList.push(() => {
            rejectedCatch(resolve, reject)
          })
        })
      }
    }
  }

  resolvePromise(x, resolve, reject) {
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

const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(123)
  }, 100)
})

p.then(
  (value) => {
    console.log('p1 success')
    console.log(value)
    return 88
  },
  (reason) => {
    console.log('p1 fail')
    console.log(reason)
  }
).then(
  (value) => {
    console.log('p2 success')
    console.log(value)
  },
  (reason) => {
    console.log('p2 fail')
    console.log(reason)
  }
)
