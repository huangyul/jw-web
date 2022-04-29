// 三种状态（常量使用大写
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  // 6.3 存储回调函数
  FULFILLED_CALLBACK_LIST = []
  REJECTED_CALLBACK_LIST = []
  // 6.4 私有的status
  _status = PENDING

  constructor(fn) {
    // 设置初始状态
    this.status = PENDING
    this.value = null
    this.reason = null

    // 传入的函数需要立即调用，并且函数执行时的错误需要使用reject抛出
    try {
      // 函数会去除resolve和reject，注意函数的this
      fn(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error)
    }
  }

  resolve(value) {
    // 一定要是pending才能修改
    if (this.status == PENDING) {
      this.status = FULFILLED
      this.value = value
    }
  }

  reject(reason) {
    // 也一定要pending才能修改
    if (this.status == PENDING) {
      this.status = REJECTED
      this.reason = reason
    }
  }

  // 6 实现then方法 6.1 接受两个参数，都要是方法
  then(onFulfilled, onRejected) {
    // 6.2 检查是否为函数，如果不是则转为函数
    onFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => value
    onRejected = this.isFunction(onRejected) ? onRejected : (reason) => reason

    // 6.3 判断不同的状态调用不同的函数
    switch (this.status) {
      case FULFILLED: {
        onFulfilled(this.value)
        break
      }
      case REJECTED: {
        onRejected(this.reason)
        break
      }
      // 6.4 如果还是pending时，则需要将回调存起来
      case PENDING: {
        this.FULFILLED_CALLBACK_LIST.push(onFulfilled)
        this.REJECTED_CALLBACK_LIST.push(onRejected)
        break
      }
    }
  }

  // 6.5 监听status的改变，做出相应的操作
  get status() {
    return this._status
  }

  set status(value) {
    this._status = value
    switch (value) {
      case 'fulfilled': {
        // 一个个执行回调
        this.FULFILLED_CALLBACK_LIST.forEach((callback) => {
          callback(this.value)
        })
        break
      }
      case 'rejected': {
        this.REJECTED_CALLBACK_LIST.forEach((callback) => {
          callback(this.reason)
        })
      }
    }
  }

  // 判断是否为函数的方法
  isFunction(param) {
    return typeof param === 'function'
  }
}
