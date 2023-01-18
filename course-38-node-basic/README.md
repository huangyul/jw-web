# Node 介绍

node.js 是 JS 的服务端运行环境。**就是基于 js 语法增加与操作系统之间的交互**

## node.js 安装

- 直接下载可执行文件 exe
- 下载源码，通过编译源码（实际很少用）

## 版本管理

**nvm**
简单原理是通过将多个 node 版本安装在指定路径，然后通过 nvm 命令切换时，就会切换我们环境变量中 node 命令指定的实际执行的软件路径。

## npm

**npx**

可以在不安装模块到当前环境的前提下，使用一些 cli 功能

```bash
# 实际上还是安装了，但表现像没有安装
npx create-react-app react-demo
```

## 底层介绍

- v8 引擎：主要是 JS 语法解析
- libuv：c 语言实现的一个高性能异步非阻塞 IO 库，用来实现 node 的事件循环
- http-parse/llhttp：底层处理 http 请求
- openssl：处理加密算法
- zlib：处理解压

## node 常见内置模块

- fs：文件系统，能够读写入当前安装系统环境中硬盘的数据
- path：路径系统，处理路径之间的问题
- crypto：加密相关模块，以标准的加密方式对我们的内容进行加解密
- dns：处理 dns 相关内容
- http：设置一个 http 服务器，发送请求，监听响应
- os：操作系统层面的 api
- vm：一个专门处理沙盒的模拟机模块，底层主要调用 v8 相关 api 进行代码解析

###### path.resolve()和 path.join()

- 可以解析不同系统中的文件路径系统
- 前者会返回绝对路径，后者是简单拼接
- 都支持".",".."的解析
- 带有斜杠的情况，`path.resolve('a','b/')`：会分析，如果是文件夹，就会自动处理不显示；`path.join('b/')`：就是简单的字符串拼接，会显示

###### `__dirname` 和 `__filename`

- 前者是当前的绝对路径，后者是当前的绝对路径加文件名称

```js
console.log(path.extname(__filename)) // 返回文件后缀名
console.log(path.basename(__filename)) // 返回文件名
console.log(path.dirname(__filename)) // 返回文件目录
```

###### fs

```js
// 异步
const fs = require('fs')
const path = require('path')
// error first
fs.readFile(
  path.resolve(__dirname, 'README.md'),
  'utf-8',
  // err永远是第一个参数
  function (err, result) {
    if (err) {
      console.log('error')
      return err
    }
    console.log(result)
  }
)
// 同步
const ctx = fs.readFileSync(path.resolve(__dirname, 'README.md'), 'utf-8')
console.log(ctx)
```

###### 通过 promise 封住 node api

```js
function promisify(func) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      args.push(function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
      return func.apply(func, args)
    })
  }
}

const readFileAsync = promisify(fs.readFile)

readFileAsync(path.resolve(__dirname, 'README.md'), 'utf-8')
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })
```

###### http

- 当使用 http 发送请求，就当爬虫使用
- 当使用 http 接收请求，就当服务器使用

```js
const http = require('http')

const proxy = http.createServer((req, res) => {
  res.end('hello world')
})
proxy.listen(8888, '127.0.0.1', () => {
  console.log('serve start')
})
```

## commonJs

`module.export = {}    const xx = require('./xxx.js')`

###### 常见面试题

```js
exports.key = 'xxx' // 可以导出
module.exports = 'xxx' // 可以导出
expports = 'xxx' // 不能导出，是因为切断了引用
```

## node周边