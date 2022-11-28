# this 问题总结

## this 绑定的几种形式

###### 默认绑定（函数直接调用）

```js
function fn() {
  console.log(this)
}

fn()
```

> 👉 在非严格模式下，默认绑定的 `this` 指向全局（`brower` 中的 `window`，`node` 中的 `global`）

- 题目一：

```js
var a = 1
function fn() {
  var a = 2
  console.log(this.a)
}

fn()
```

题解：在非严格模式下，这样的默认绑定 `this` 会指向 `window`，所有会输出 1

- 题目二

```js
var b = 1
function outer() {
  var b = 2
  function inner() {
    console.log(this.b)
  }
  inner()
}

outer()
```

解析：虽然多了一个 `inner`，但是在 `inner` 执行的时候，还是默认绑定，没有显式指定 `this`，所以此时 `this` 还是 `windonw`，所以最后返回 1

- 题目三

```js
const obj = {
  a: 1,
  fn: function () {
    console.log(this.a)
  },
}
obj.fn() // 1
const f = obj.fn
f()
```

解析：当方法赋值使用后，`this` 会丢失，等于还是默认绑定，还是指向全局

###### 隐式绑定（属性访问调用）

```js
function fn() {
  console.log(this.a)
}

const obj = {
  a: 1,
}

obj.fn = fn
obj.fn() // 1F
```

隐式绑定的 `this` 指的是调用堆栈的**上一级**

- 题目一

```js
function fn() {
  console.log(this.a)
}
const obj1 = {
  a: 1,
  fn,
}
const obj2 = {
  a: 2,
  obj1,
}
obj2.obj1.fn()
```

解析：会返回 1，因为 `this` 指向调用堆栈的上一级，即 `obj1`

- 题目二

```js
const obj = {
  a: 1,
  fn: function () {
    console.log(this.a)
  },
}

setTimeout(obj.fn, 1000)
```

解析：此时的堆栈是不同的堆栈了，执行环境变成了全局，所以此时会返回 `undefined`

- 题目三
  函数作为参数传递

```js
function run(fn) {
  fn()
}
run(obj.fn)
```

解析：此时实际上就是直接调用 ` fn``，等于显示绑定，this ` 指向全局

- 题目四

匿名函数

```js
var name = 'the window'
var obj = {
  name: 'obj',
  getName: function () {
    return function () {
      console.log(this.name)
    }
  },
}
obj.getName()()
```

解析：一般匿名函数也是会指向全局

###### 显式绑定（call，bind，apply）

```js
function fn() {
  console.log(this.a)
}
const obj = {
  a: 1,
}
fn.call(obj) // 1
```

显式绑定一般看第一参数，如果第一个参数为 `null`，则还是会绑定到全局

- 题目一

```js
function fn() {
  console.log(this)
}

// 为啥可以绑定基本类型
// 1 --> Number(1)
fn.bind(1).bind(2)()
```

解析：`bind` 只看第一个 `bind`（堆栈的上下文，上一个，看的顺序的第一个）

```js
// bind的实现
//  Yes, it does work with `new (funcA.bind(thisArg, args))`
if (!Function.prototype.bind)
  (function () {
    var ArrayPrototypeSlice = Array.prototype.slice // 为了 this
    Function.prototype.bind = function (otherThis) {
      // 调用者必须是函数，这里的 this 指向调用者：fn.bind(ctx, ...args) / fn
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError(
          'Function.prototype.bind - what is trying to be bound is not callable'
        )
      }

      var baseArgs = ArrayPrototypeSlice.call(arguments, 1), // 取余下的参数
        baseArgsLength = baseArgs.length,
        fToBind = this, // 调用者
        fNOP = function () {}, // 寄生组合集成需要一个中间函数，避免两次构造
        fBound = function () {
          // const newFn = fn.bind(ctx, 1); newFn(2) -> arguments: [1, 2]
          baseArgs.length = baseArgsLength // reset to default base arguments
          baseArgs.push.apply(baseArgs, arguments) // 参数收集
          return fToBind.apply(
            // apply 显示绑定 this
            // 判断是不是 new 调用的情况，这里也说明了后边要讲的优先级问题
            fNOP.prototype.isPrototypeOf(this) ? this : otherThis,
            baseArgs
          )
        }
      // 下边是为了实现原型继承
      if (this.prototype) {
        // 函数的原型指向其构造函数，构造函数的原型指向函数
        // Function.prototype doesn't have a prototype property
        fNOP.prototype = this.prototype // 就是让中间函数的构造函数指向调用者的构造
      }
      fBound.prototype = new fNOP() // 继承中间函数，其实这里也继承了调用者了

      return fBound // new fn()
    }
  })()
```

- 题目二

使用了 `new`，`new` 的优先级比 `bind` 高

```js
function foo(a) {
  this.a = a
}

const f = new foo(2)
f.a // console what?

// ------------------------- 变 ---------------------------
function bar(a) {
  this.a = a
  return {
    a: 100,
  }
}
const b = new bar(3)
b.a // console what ?
```

- 题目三

箭头函数：箭头函数本身是没有 `this` 的，继承的是外层的

```js
function fn() {
  return {
    b: () => {
      console.log(this)
    },
  }
}

fn().b() // console what?
fn().b.bind(1)() // console what?
fn.bind(2)().b.bind(3)() // console what?
```

解析：箭头函数没有 `this`，所以哪里定义指向谁，`bind` 对其也不起作用，即无法使用显式绑定改变函数的 `this`，所以答案分别是 `window`，`window`， 1

### 优先级

1. 隐式优先于默认
2. 显式优先于隐式
3. `new` 优先于显式

> TIP 👉 优先级「new 绑」 > 「显绑」 > 「隐绑」 > 「默认绑定」

###### 实战

```js
// 1.
function foo() {
  console.log(this.a) // console what
}
var a = 2
;(function () {
  'use strict' // 迷惑大家的
  foo()
})()

// ‘use strict’在函数内不影响

// 2.
var name = 'the window'

var object = {
  name: 'My Object',
  getName: function () {
    return this.name
  },
}
object.getName() // console what ?
object.getName() // console what ?
;(object.getName = object.getName)() // console what ?
;(object.getName, object.getName)() // console what ?

// 使用了赋值符号，就会丢失this

// 3.
var x = 3
var obj3 = {
  x: 1,
  getX: function () {
    var x = 5
    return (function () {
      return this.x
    })() // ⚠️
  },
}
console.log(obj3.getX()) // console what?

// 这里立即执行函数，丢失了this
```
