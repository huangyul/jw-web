# Promise

## Promise A+规范

### 术语

1. promise 有 then 方法的对象或函数
2. thenable 是一个有 then 方法的对象或者函数
3. value promise 成功状态的值，resolve(value)，可以是任何值，包括 promise
4. reason promise 失败状态的值，reject(reason)
5. exception 使用 throw 抛出的异常

### promise status

1. pending
   1.1 初始状态，可改变
   1.2 通过 resolve -> fulfilled 状态
   1.3 通过 reject -> rejected 状态

2. fulfilled
   2.1 最终状态，不可改变
   2.2 必须拥有一个 value

3. rejected
   3.1 最终状态，不可改变
   3.2 必须拥有一个 reason

总结：

pending -> resolve(value) -> fulfilled
pending -> reject(reason) -> rejected

## 手写 Promise

## generator 和 async
