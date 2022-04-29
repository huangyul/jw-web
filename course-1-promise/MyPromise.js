// 三种状态（常量使用大写
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
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
}
