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
      fn(this.resolve.bind(this), this.rejece.bind(this))
    } catch (err) {
      this.rejece(err)
    }
  }

  resolve(value) {
    if (this.status == PENDING) {
      this.value = value
      this.status = FULFILLED

      this.FULFILLED_CALLBACK_LIST.forEach((cb) => {
        cb(this.value)
      })
    }
  }

  rejece(reason) {
    if (this.status == PENDING) {
      this.reason = reason
      this.status = REJECTED

      this.REJECTED_CALLBACK_LIST.forEach((cb) => {
        cb(this.reason)
      })
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => value
    onRejected = this.isFunction(onRejected)
      ? onRejected
      : (reason) => {
          throw reason
        }

    const fulfilledWithCatch = (resolve, reject, newPromise) => {
      queueMicrotask(() => {
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
      })
    }

    const rejectedWithCatch = (resolve, reject, newPromise) => {
      queueMicrotask(() => {
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

  isFunction(params) {
    return typeof params == 'function'
  }

  resolvePromise(newPromise, x, resolve, reject) {
    if (x === newPromise) {
      return reject(new TypeError('this return value is same as newPromsie'))
    }

    if (x instanceof MyPromise) {
      x.then((y) => {
        this.resolvePromsie(newPromise, y, resolve, reject)
      }, reject)
    } else if (typeof x === 'object' || this.isFunction(x)) {
      if (x === null) {
        return resolve(x)
      }

      let then

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
              called = true
              this.resolvePromsie(newPromise, y, resolve, reject)
            },
            (r) => {
              if (called) return
              called = true
              reject(r)
            }
          )
        } catch (err) {
          if (called) return
          return reject
        }
      } else {
        resolve(x)
      }
    } else {
      resolve(x)
    }
  }

  catch(onRejected) {
    return this.then(null, onRejected)
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

  static race(promiseList) {
    return new MyPromise((resolve, reject) => {
      const len = promiseList.length
      if (len === 0) {
        return resolve()
      }

      promiseList.forEach((p) => {
        MyPromise.resolve(p).then(
          (value) => {
            return resolve(value)
          },
          (reason) => {
            return reject(reason)
          }
        )
      })
    })
  }

  static all(promiseList) {
    let count = 0,
      resArr = []
    return new MyPromise((resolve, reject) => {
      const len = promiseList.length

      promiseList.forEach((p) => {
        MyPromise.resolve(p).then(
          (value) => {
            resArr.push(value)
            count++
            if (count === len) return resolve(resArr)
          },
          (reason) => {
            return reject(reason)
          }
        )
      })
    })
  }
}

const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(111)
  }, 1000)
})

const p2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(222)
  }, 2000)
})

MyPromise.all([p1, p2]).then((value) => {
  console.log(value)
})
