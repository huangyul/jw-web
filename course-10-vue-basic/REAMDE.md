# webpack

## 常见名词解释

- module：各个依赖的子文件
- package：由 `module` 构成的东西，比如有独立的 package.json 的文件夹，一个整体的项目
- bundle：webpack 打包的结果，将所有文件打包成一个文件
- chunk：打包的结果，`bundle` 就是典型的 `chunk`，由主 `bandle` 获取的其他 `bundle` 也是 `chunk`

## 打包基础

### 简单分包原理

#### require

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

#### import

常见的 import 使用方法

```js
import module from './module'
```

当 import 作为函数使用时，表示异步加载，也会打包成两个文件

```js
import('./module').then((result) => {
  console.log('result:', result)
})
// vue-route中的异步组件
```

#### webpack 代码分离

`webpack`（> 4）中有一个配置，可以自动去找出入口文件中的相同依赖，并抽离出来打包到一个 `chunk` 文件里

```js
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all', // 全部分离
      miniSize: 0, // 最小包的大小为多少时才分离
    },
  },
}
```

❗❗❗ 要注意，虽然这种方式也实现了分包和异步加载，但是此时主包并不会主动引用分离出的 `chunk` 文件，需要使用插件或手动引用
