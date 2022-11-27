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
