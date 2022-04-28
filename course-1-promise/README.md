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

### then

promise 应该提供一个 then 方法，用来访问最终的结果，无论 value 还是 reason

```js
promise.then(onFulfilled, onRejected)
```

1. 参数规范
   1.1 onFulfilled 必须是函数类型，如果传入的不是函数，则忽略
   1.2 onRejected 必须是函数类型，如果传入的不是函数，则忽略

2. onFulfilled 特性
   2.1 在 promise 变成 fulfilled 时，调用 onFulfilled，参数是 value（onFulfilled 的调用时机）
   2.2 在 promise 变成 fulfilled 前，不应该被调用
   2.3 只能被调用一次

3. onRejected 特性
   3.1 在 promise 变成 rejected 时，调用 onRejected，参数是 reason
   3.2 在 promise 变成 rejected 前，不应该被调用
   3.3 只能被调用一次

4. onFulfilled 和 onRejected 应该是微任务阶段执行
   实现 promise 如何生成微任务

5. then 可以被调用多次
   5.1 promise 状态变成 fulfilled 后，所有的 onFulfilled 回调按注册顺序执行
   5.1 promise 状态变成 rejected 后，所有的 onRejected 回调按注册顺序执行

6. 返回值
   then 应该返回一个 promise

```js
const promise2 = promise1.then(onFulfilled, onRejected)
```

6.1 onFulfilled 或 onRejected 执行结果为 x(任何值)，调用 resolvePromise
6.2 onFulfilled 或 onRjected 执行过程中抛出异常 error，promise2 需要被 reject
6.3 onFulfilled 不是一个函数，promise2 以 promise1 的 value 触发 fulfilled
6.4 onRejected 不是一个函数，promise2 以 promise1 的 reason 触发 fulfilled

7. resolvePromise

```js
resolvePromise(promise2, x, resolve, reject)
```

7.1 如果 promise2 和 x 相等，reject typeError
7.2 如果 x 是一个 promise
如果 x pending，promise 必须要在 pending 状态，知道 x 的状态变更
如果 x fulfilled， value -> fulfilled
如果 x rejected，reason -> rejected
7.3 如果 x 是一个 Object 或 Function
获取 x.then 如果失败，reject reason
then 是一个函数，then.call(x, resolvePromiseFn, rejectPromiseFn)

## 手写 Promise

## generator 和 async
