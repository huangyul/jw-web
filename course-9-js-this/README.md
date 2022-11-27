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
