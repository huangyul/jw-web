# ES 6 和

## ES 6

### 历史

2015 年 6 月发布的就是 ES6
ESNext 指下一年的版

### 常用 API 解析

#### let 和 const

```js
for (var i = 0; i <= 3; i++) {
  setTimeout(() => {
    console.log(i)
  }, 10)
}
```

运行这个会输出什么?

会输出 4 4 4 4

原因：

1. var 定义的变量是全局的，并且可以重复定义的，所以全局只有一个变量 i
2. setTimeout，在下一轮事件循环的时候执行，而 for 循环时同步执行的

```js
for (let i = 0; i <= 3; i++) {
  setTimeout(() => {
    console.log(i)
  }, 10)
}
```

输出： 0 1 2 3

原因：

1. let 引入了块级作用域的概念，创建 setTimeout 的时候，i 只在作用域内生效

其他解决方法：

```js
for (var i = 0; i <= 3; i++) {
  ;(function (i) {
    setTimeout(() => {
      console.log(i)
    }, 10)
  })(i)
}
```

###### 变量提升的问题

var 有变量提升，let 和 const 没有

```js
console.log(i)

var i = 1 // undefined

console.log(a)

let a = 1 // error
```

###### const 声明后不能改变（引用值可以）

```js
const arr = []

arr.push(1) // OK
```

#### 箭头函数

1. this 是在定义的时候决定的，而 function 是在使用的时候决定的
   
// TODO 26:00
