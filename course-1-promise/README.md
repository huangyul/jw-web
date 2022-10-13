# Promise

## Promise A+规范

### 术语

1. `promise` 有 `then` 方法的对象或函数
2. `thenable` 是一个有 `then` 方法的对象或者函数
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
   1.1 onFulfilled 必须是函数类型，如果传入的不是函数，应该被忽略  
   1.2 onRejected 必须是函数类型，如果传入的不是函数，应该被忽略

2. onFulfilled 特性  
   2.1 在 promise 变成 fulfilled 时，调用 onFulfilled，参数是 value（onFulfilled 的执行时机）  
   2.2 在 promise 变成 fulfilled 前，不应该被调用 onFulfilled
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
// promise2:当前promose的返回值
resolvePromise(promise2, x, resolve, reject)
```

7.1 如果 promise2 和 x 相等，reject typeError  
7.2 如果 x 是一个 promise  
如果 x pending，promise 必须要在 pending 状态，直到 x 的状态变更  
如果 x fulfilled， value -> fulfilled  
如果 x rejected，reason -> rejected  
7.3 如果 x 是一个 Object 或 Function  
获取 x.then 如果失败，reject reason  
then 是一个函数，then.call(x, resolvePromiseFn, rejectPromiseFn)

## 手写 Promise

1. const promise = new Promise()

2. 定义三种状态

3. 初始化状态 pending

4. resolve 和 reject 方法  
   4.1 在两个方法都要更改 status，一定是从 pending 才能改变  
   4.2 入参分别是 value 和 reason

5. 对于实例化的 promise 时的入参处理  
   5.1 入参是一个参数，接受 resolve 和 reject 两个参数  
   5.2 初始化 promise 时，会同步执行这个函数，并且有任何异常报错都通过 reject 抛出去

6. then 方法  
   6.1 then 接收两个参数，onFulfilled 和 onRejected 方法  
   6.2 检测是否为函数，如果不是函数，则让它转为函数  
   6.3 根据 promise 的状态，执行不同的回调函数  
   6.4 因为会有异步的情况，如果调用 then 的时候还是 pending，要将所有的回调以数组的方式存储起来  
   6.5 使用 getter，setter 监听 status 的变化，在发生变化时调用相应的回调数组

7. then 的返回值  
   7.1 如果 onFulfilled 或者 onRjected 抛出异常 e，那么新的 promise 必须 reject e。  
   7.2 返回值应该是一个 promise  
   7.3 如果 onFulfilled 不是函数，且 promise1 成功执行，那么 promsie2 必须返回同样的状态和 value  
   7.4 如果 onRjected 不是函数，且 promise1 拒绝执行，promise2 必须返回同样的状态和 reason  
   7.5 如果 onFulfilled 或者 onRejected 返回一个值 x，运行 resolvePromise 方法

8. resolvePromise  
   8.1 如果 x 和 promise2 相同，会互相调用，陷入死循环，所以要 reject typeError  
   8.2 如果 x 是一个 promise  
    8.2.1 如果 x pending，promise 必须要在 pending 状态，直到 x 的状态变更  
    8.2.2 如果 x fulfilled， value -> fulfilled  
    8.2.3 如果 x rejected ，reason -> rejected  
    8.3 如果 x 是一个 Object/Function

9. 其他拓展方法
   9.1 catch 实际上是调用了 then 的语法糖（this.then(null, onRjected)）

10. onFulfilled 和 OnRejected 应该在微任务里执行

### 课外拓展问题

###### 为什么 promsie resolve 了一个 value， 最后输出的 value 却是 undefined

```js
const p = new Promise((resolve) => {
  setTimeout(() => {
    resolve(111)
  }, 1000)
}).then((value) => {
  cosnle.log('then')
  // 此处没有返回一个值，就会默认返回undefined
})

setTimeout(() => {
  console.log(p) // undefined ?
}, 3000)
```

答：最后一个 then 里面没有显示的 return ， 相当于 return undefined

###### .then 返回是一个新的 promsie，那么为什么 Promise 实现的时候，要用数组来存 onFulfiled 的回调

答：在链式调用确实没问题，数组主要解决是同一个 promise 实例多次调用 then

```js
const test = new Promise((resolve) => {
  console.log(123)
})

test.then(() => {})
test.then(() => {})
test.then(() => {})
test.then(() => {})
test.then(() => {})
```

###### 为什么在 catch 的回调里，打印 promise ，显示状态是 pending

```js
const test = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(123)
  }, 1000)
}).catch((reason) => {
  consle.log(reason)
  consle.log(test) // Promise <pending>
})

setTimeout(() => {
  console.log(test) // Promise <undefined>
}, 10000)
```

答：

1. catch 返回一个新的 promise， 而 test 是这个新的 promise，就是整个代码的返回
2. catch 的回调里去打印，还没执行完，所以状态还是 pending，只有当回调执行完成了，无论是成功还是失败，才会改变状态

### 常见题目

1. 题目一

```js
Promise.resolve().then(() => {
  console.log('promise1')
  const timer2 = setTimeout(() => {
    console.log('timer2')
  }, 0)
})
const timer1 = setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(() => {
    console.log('promise2')
  })
}, 0)
console.log('start')
```
