const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  fulfilledCallbackList = []
  rejectedCallbackList = []

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

      this.fulfilledCallbackList.forEach((cb) => {
        cb(this.value)
      })
    }
  }

  reject(reason) {
    if (this.status === PENDING) {
      this.reason = reason
      this.status = REJECTED

      this.rejectedCallbackList.forEach((cb) => {
        cb(this.reason)
      })
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled == 'function' ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected == 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }

    const fulfilledWithCatch = (resolve, reject, newPromsie) => {
      queueMicrotask(() => {
        try {
          if (typeof onFulfilled != 'function') {
            resolve(this.value)
          } else {
            const x = onFulfilled(this.value)
            this.resolvePromsie(x, newPromsie, resolve, reject)
          }
        } catch (err) {
          reject(err)
        }
      })
    }

    const rejectedWithCatch = (resolve, reject, newPromise) => {
      try {
        if (typeof onRejected != 'function') {
          reject(this.reason)
        } else {
          const x = onRejected(this.reason)
          this.resolvePromsie(x, newPromise, resolve, reject)
        }
      } catch (err) {
        reject(err)
      }
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
            this.fulfilledCallbackList.push(() => {
              fulfilledWithCatch(resolve, reject, newPromise)
            })
            this.rejectedCallbackList.push(() => {
              rejectedWithCatch(resolve, reject, newPromise)
            })
          })
        })
        return newPromise
      }
    }
  }

  resolvePromsie(x, p2, resolve, reject) {
    if (x === p2) {
      return reject(new TypeError('xxx'))
    }

    if (x instanceof MyPromise) {
      x.then(
        (y) => {
          this.resolvePromsie(y, p2, resolve, reject)
        },
        (r) => {
          reject(r)
        }
      )
    } else if (typeof x === 'object' || typeof x === 'function') {
      if (x === null) {
        return resolve(x)
      }

      let then = null

      try {
        then = x.then
      } catch (err) {
        return reject(err)
      }

      if (typeof then === 'function') {
        let called = false
        try {
          then.call(
            x,
            (y) => {
              if (called) return
              called = true
              this.resolvePromsie(y, p2, resolve, reject)
            },
            (r) => {
              if (called) return
              called = true
              reject(r)
            }
          )
        } catch (err) {
          if (called) return
          reject(err)
        }
      } else {
        if (called) return
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

    return new MyPromise((resolve, reject) => {
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
      const length = promiseList.length

      if (length === 0) {
        return resolve()
      } else {
        for (let i = 0; i < length; i++) {
          MyPromise.resolve(promiseList[i]).then(
            (value) => {
              return resolve(value)
            },
            (reason) => {
              reject(reason)
            }
          )
        }
      }
    })
  }

  static all(promiseList) {
    let count = 0,
      resArr = []
    return new MyPromise((resolve, reject) => {
      const len = promiseList.length
      if (len === 0) {
        return resolve()
      }
      promiseList.forEach((p) => {
        MyPromise.resolve(p).then(
          (value) => {
            resArr.push(value)
            count++
            if (count == len) resolve(resArr)
          },
          (reason) => {
            reject(reason)
          }
        )
      })
    })
  }
}

const p1 = new MyPromise((resolve) => {
  setTimeout(() => {
    resolve(2)
  }, 2000)
})

const p2 = new MyPromise((resolve) => {
  setTimeout(() => {
    resolve(1)
  }, 1)
})

MyPromise.all([p1, p2]).then((value) => {
  console.log(123)
  console.log(value)
})
