/**
 * 根据掘金教程手写promise
 * https://juejin.cn/post/6945319439772434469
 */

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromsie2 {
  FULFILLED_CALLBACK_LIST = []
  REJECTED_CALLBACK_LIST = []
  _status = PENDING
  constructor(fn) {
    this.status = PENDING
    this.value = null
    this.reason = null
    try {
      fn(this.resolve.bind(this), this.reject.bind(this))
    } catch (e) {
      this.reject(this.reason)
    }
  }

  resolve(value) {
    if (this.status == PENDING) {
      this.value = value
      this.status = FULFILLED
    }
  }
  reject(reason) {
    if (this.status == PENDING) {
      this.reason = reason
      this.status = REJECTED
    }
  }

  then(onFulfilled, onRejected) {
    const promise2 = new MyPromsie2((resolve, reject) => {
      onFulfilled = this.isFunction(onFulfilled)
        ? onFulfilled
        : (value) => value
      onRejected = this.isFunction(onRejected)
        ? onRejected
        : (reason) => {
            throw reason
          }

      switch (this.status) {
        case FULFILLED: {
          const x = onFulfilled(this.value)
          this.resolvePromise(x, resolve, reject)
          break
        }
        case REJECTED: {
          onRejected(this.reason)
          break
        }
        case PENDING: {
          this.FULFILLED_CALLBACK_LIST.push(onFulfilled)
          this.REJECTED_CALLBACK_LIST.push(onRejected)
          break
        }
      }
    })
    return promise2
  }

  resolvePromise(x, resolve, reject) {
    // 判断是否是MyPromsie2实例对象
    if (x instanceof MyPromsie2) {
      x.then(resolve, reject)
    } else {
      resolve(x)
    }
  }

  get status() {
    return this._status
  }
  set status(value) {
    this._status = value
    switch (value) {
      case FULFILLED: {
        this.FULFILLED_CALLBACK_LIST.forEach((cb) => {
          cb(this.value)
        })
        break
      }
      case REJECTED: {
        this.REJECTED_CALLBACK_LIST.forEach((cb) => {
          cb(this.reason)
        })
      }
    }
  }

  isFunction(param) {
    return typeof param == 'function'
  }
}

module.exports = MyPromsie2
