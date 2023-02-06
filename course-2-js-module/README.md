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

ES6 提出的一套模块标准，使用 `import` 声明依赖，使用 `export` 声明接口

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

### 手写 mini 版

###### 实现 config

config 方法就是拿到调用时候的配置，并存好

```js
rj = {}
const defaultOptions = { paths: '' }
rj.config = (options) => Object.assign(defaultOptions, options)
```

###### 实现 define

定义模块，触发的机制在 require 的时候，所以此时的作用仅仅是收集

```js
const def = new Map()
define = (name, deps, factory) => {
  def.set(name, { name, deps, factory })
}
```

###### 实现 require

require 函数做了几件事

1. 加载 cdn 地址的文件内容或通过 script 加载本地文件
2. 通过 script 加载本地文件的时候，要注意可能也会引用了其他文件，需要递归加载
3. 加载完成后，将获取到的函数，传入 factory 函数即可

```js
/* 加载函数的方法 */
// 使用cdn的方式加载
const __import = (url) => {
  return new Promise((resolve, reject) => {
    System.import(url).then(resolve, reject)
  })
}
// 使用script标签
const __load = (url) => {
  return new Promise((resolve, reject) => {
    const head = document.getElementsByTagName('head')[0]
    const node = document.createElement('script')
    node.type = 'text/javascript'
    node.src = url
    node.async = true
    node.onload = resolve
    node.onerror = reject
    head.appendChild(node)
  })
}

// 获取url
const __getUrl = (dep) => {
  const p = location.pathname
  return p.slice(0, p.lastIndexOf('/')) + '/' + dep + '.js'
}

// require
// 使用模块，这里才是加载模块的地方
require = (deps, factory) => {
  // 异步加载，需要使用promise
  return new Promise((resolve, reject) => {
    Promise.all(
      deps.map((dep) => {
        // 加载模块
        if (defaultOptions.paths[dep])
          return __import(defaultOptions.paths[dep])

        return __load(__getUrl(dep)).then(() => {
          const { deps, factory } = def.get(dep)
          // 判断如果依赖里面有其他依赖，就要递归去找
          if (deps.length === 0) return factory(null)
          return require(deps, factory)
        })
      })
    ).then(resolve, reject)
  }).then((instances) => {
    // 拿到异步加载的内容，传给factory函数
    return factory(...instances)
  })
}
```
