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

### 演变历史

##### 一、使用对象去存储变量

```js
const p = {
  a: 1,
}

p.a // 1
```

**问题点：**外界可以直接获取甚至修改其中的变量

##### 二、IIFE（使用立即执行函数）

```JS
const m = (function ( ) {
  const a = 1
  const func = () => {
    console.log(a)
  }
  return {
    func
  }
})()

m.func() // 1
```

问题点：

1. 至少有一个变量污染全局
2. 加载顺序无法保证

##### CommonJs

2009 年提出的一个模块标准，主要用于`node.js`，服务器端；要使用在浏览器端，需要使用`babel`转换为`es5`

```js
// a.js
module.exports = {
  a: 1,
}

// b.js
const { a } = require('a.js')

a // 1
```

##### AMD

因为 `CommonJS` 设计初衷是应用在服务端的，所以模块的加载执行也都是同步的（因为本地文件的 `IO` 很快）。但是同步的方式运用到浏览器就不友好了，因为在浏览器中模块文件都是通过网络加载的，单线程阻塞在模块加载上，这是不可接受的。所以在 2011 年有人提出了 `AMD，对` `CommonJS` 兼容的同时支持异步加载

```js
// define(id, deps, factory)
define('xxxModule', ['module1', 'module2'], function(module1, module2) {
  ...
})
```

##### UMD

通过对环境的判断，对三种模式同时兼容

```js
// UMD
;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery', 'underscore'], factory)
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory(require('jquery'), require('underscore'))
  } else {
    // Browser globals (root is window)
    root.returnExports = factory(root.jQuery, root._)
  }
})(this, function ($, _) {
  //    methods
  function a() {} //    private because it's not returned (see below)
  function b() {} //    public because it's returned
  function c() {} //    public because it's returned
  //    exposed public methods
  return {
    b: b,
    c: c,
  }
})
```

##### ESM (ES Module)

ES6提出的一套模块标准，使用 `import` 声明依赖，使用 `export` 声明接口

```js
// a.js
export default const a = 1

// b.js
import a from 'a.js'

a // 1
```

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
