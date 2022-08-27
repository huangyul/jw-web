/* 手写promise */

// 1. 定义三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

// 2. promise的定义
module.exports = class MyPromise {
  // 5.3.1 用两组数组来存储如果是还在pending时的方法， 等状态改变了再去执行
  FULFILLED_CALLBACK_LIST = []
  REJECTED_CALLBACK_LIST = []
  _status = PENDING
  // 2.1 定义初始状态
  constructor(fn) {
    this.status = PENDING
    this.value = null
    this.reason = null
    // 4 new的时候会同步执行里面的函数，在执行过程中如果遇到错误立马reject
    try {
      fn(this.resolve.bind(this), this.reject.bind(this))
    } catch (err) {
      this.reject(err)
    }
  }

  // 3.1 resolve
  resolve(value) {
    if (this.status == PENDING) {
      this.value = value
      this.status = FULFILLED
    }
  }

  // 3.2 reject
  reject(reason) {
    if (this.status == PENDING) {
      this.reason = reason
      this.status = REJECTED
    }
  }

  // 5 then
  then(onFulfilled, onRejected) {
    // 5.1 判断这两个是不是函数，如果不是，则直接返回
    onFulfilled =
      typeof onFulfilled == 'function' ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected == 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }

    // 5.2 通过promise的状态执行不同的方法
    switch (this.status) {
      case FULFILLED: {
        onFulfilled(this.value)
        break
      }
      case REJECTED: {
        onRejected(this.reason)
        break
      }
      // 5.3 当状态还是pending时，将回调函数存起来
      case PENDING: {
        this.FULFILLED_CALLBACK_LIST.push(onFulfilled)
        this.REJECTED_CALLBACK_LIST.push(onRejected)
        break
      }
    }
  }

  // 5.4 当状态发生改变时，再去执行
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
        break
      }
    }
  }
}
