# webpack

## 常见名词解释

- module：各个依赖的子文件
- package：由 module 构成的东西，比如有独立的 package.json 的文件夹，一个整体的项目
- bundle：webpack 打包的结果，将所有文件打包成一个文件
- chunk：打包的结果，`bundle` 就是典型的 `chunk`

## 简单分包原理

例如在项目内 index.js 和 module.js，index 依赖 module

```js
// module.js
exports.var = 'this is module.js'
```

情况一：

```js
// index.js
const module = require('./module.js')
console.log(module.var) // this is module.js
```

如果是这样引入 module，那么最终只会打包成一个文件（较大）

情况二：

```js
// index.js
// 此方法是webpack拓展require的方法
require.ensure(['./module.js'], function (require) => {
  const module = require('./module.js')
  console.log(module.var) // this is module.js
})
```

此时打包结果会有两个文件，实现了异步加载
