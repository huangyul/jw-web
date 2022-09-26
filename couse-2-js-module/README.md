# JS 模块化详解

## 模块化的历史

### 什么是模块化

> 写代码的本质就是管理变量（包括方法，类），在写代码时难免会遇到变量冲突等，需要某些方式去解决这些问题

本质上模块就是一种提供对外通信接口，进行代码切分/组合的管理方式。

### 为什么要模块化

1. 把复杂问题分解成多个子问题
2. 更优雅的代码管理
3. 高内聚、低耦合
4. 方便多人协同，面向过程开发

## AMD

> AMD 的代表肯定是大名鼎鼎的 RequireJS

CommonJs 是 node 基于服务器开发的模块规范，因为在浏览器端使用有差异，所以提出了 AMD

### AMD Usage

```js
// 基本使用的方式
// id:模块id depencies:相关的依赖 factory:模块实现的本身
define(id?, depencies?, factory)

define('aa', ['bb', 'cc'], function(bb, cc) {
  // 函数接受执行依赖后返回的内容，并可以执行依赖暴露的方法
  bb.xxx()
  cc.jjj()
  return {
    name: 'foo'
  }
})
```

### 基于 AMD 的 RequerJs

###### 自定义加载路径

```js
rj.config({
  path: {
    jquery: 'xxx-cdn-url', // 模块名：cdn的地址
  },
})
```

###### 使用模块

```js
rj(['module-name'], function (moduleName) {
  // ...
})

// 例如
rj(['jquery'], function (jquery) {
  // ...
})
```

###### 定义模块

```js
rj('module-name', ['depencies'], function (depencies) {
  return {
    name: 'foo',
  }
})
```

###### 具体执行的行为

```js
// 定义一个模块a
define('a', function () {
  console.log('module a')
  return {
    run: function () {
      console.log('a run')
    },
  }
})

// 定义一个模块b
define('b', function () {
  console.log('module b')
  return {
    run: function () {
      console.log('b run')
    },
  }
})

// 调用这两个依赖
require(['a', 'b'], function (a, b) {
  console.log('main run')
  a.run()
  b.run()
})

// 执行结果
// module a
// module b
// main run
// a run
// b run
```

小结：

1. 在**config**时已经开始加载或下载依赖
2. 是基于 promise 实现的
