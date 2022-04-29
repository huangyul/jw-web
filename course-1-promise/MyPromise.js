// 三种状态（常量使用大写
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor() {
    // 设置初始状态
    let status = PENDING
    let value = null
    let reason = null
  }
}
