# Vuex && SSR

## 状态管理

本质就是将项目中的状态用对象保存处理，用规范的约束去同一获取和操作

## Vuex

[源代码地址](https://github.com/vuejs/vuex/tree/dev/src)

[vue-vuex 最佳实践](https://github.com/weipxiu/Vue-vuex)

[vuex 最佳实践](https://bigdata.bihell.com/language/javascript/vue/vuex.html#%E4%B8%80%E3%80%81vuex%E5%88%B0%E5%BA%95%E6%98%AF%E4%B8%AA%E4%BB%80%E4%B9%88%E9%AC%BC)

核心想法：

- 集中管理：消除重复的状态问题，避免不对等的风险；代码更好维护；编译测试；
- 单一原则，约定的方式去使用共享状态：可预测状态的变化

**如何和 vue 集成？**

使用插件的模式，通过 mixin 将$store 快速访问 store 属性

**如何让 vuex 是响应式的？**

利用 vue 的 data 是响应式

### 源码编写

#### store 注册

> [开发 vue 插件](https://cn.vuejs.org/v2/guide/plugins.html)

```js
let Vue

// vue 插件必须有install函数
export function install(_Vue) {
  let Vue = _Vue
  // 通过mixin注入到每一个vue使用，因为mixin中有生命周期
  Vue.mixin({ beforeCreate: vuexInit })

  function vuexInit() {
    const options = this.$options
    if (options.store) {
      this.$store =
        typeof options.store === 'function' ? options.store() : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
```

#### 响应式

使用 `vue` 的 `data` 自带响应式的原理

```js
export class Store() {
  constuctor(options) {
    resetStoreVM(this, options.state)
  }

  get state() {
    return this._vm._data.$$state
  }
}

function resetStoreVM(store, state) {
  // 直接利用vue中的data是响应式的
  store._vm = new Vue({
    data: {
      $$state: state
    }
  })
}
```

#### 衍生数据（getter）

1. 收集 getters 的依赖
2. 使用拦截器，执行 getters 依赖的方法

```js
class Store {
  constructor(options) {
    const state = options

    resetStoreVM(this, state)

    // 实现getter
    /**
     * getter 的简单使用
     * {a: (state) => return state.b * 2}
     */
    this.getters = {}
    _.forEach(this.getters, (name, getterFn) => {
      Object.defineProperty(this.getters, name, {
        get: () => getterFn(this.state),
      })
    })
  }

  get state() {
    this._vm.data.$$state
  }
}

function resetStoreVM(store, state) {
  store._vm = new Vue({
    data: {
      $$state: state,
    },
  })
}
```

#### actions/mutations

```js
class Store {

  // 定义行为，分别对应异步和同步行为处理
  this.actions = {}
  this.mutations = {}
  _.forEach(options.mutations, (name, mutation) => {
    this.mutations[name] = palyed => {
      // 最终执行的就是 this._vm_data.$$state.xxx = xxx
      mutation(this.state, payload)
    }
  })

  _.forEach(options.actions, (name, action) => {
    this.actions[name] = payload => {
      // action，在这里传入this，这样就可以在异步里面通过commit触发mutation同步数据变化
      action(this, payload)
    }
  })

  // 触发mutations的方式固定是commit
  commit(type, payload) {
    this.mutations[type](payload)
  }

  dispatch(type, payload) {
    this.actions[type](payload)
  }
}

```

#### 多个 module

```js
// module 可以对状态模型进行分层，每个 module 又含有自己的 state、getters、actions 等

// 定义一个 module 基类
class Module {
  constructor(rawModule) {
    this.state = rawModule || {}
    this._rawModule = rawModule
    this._children = {}
  }

  getChild(key) {
    return this._children[key]
  }

  addChild(key, module) {
    this._children[key] = module
  }
}

// module-collection.js 把 module 收集起来
class ModuleCollection {
  constructor(options = {}) {
    this.register([], options)
  }

  register(path, rawModule) {
    const newModule = new Module(rawModule)
    if (path.length === 0) {
      // 如果是根模块 将这个模块挂在到根实例上
      this.root = newModule
    } else {
      const parent = path.slice(0, -1).reduce((module, key) => {
        return module.getChild(key)
      }, this.root)

      parent.addChild(path[path.length - 1], newModule)
    }

    // 如果有 modules，开始递归注册一波
    if (rawModule.modules) {
      _.forEach(rawModule.modules, (key, rawChildModule) => {
        this.register(path.concat(key), rawChildModule)
      })
    }
  }
}

// store.js 中
export class Store {
  constructor(options = {}) {
    // 其余代码...

    // 所有的 modules 注册进来
    this._modules = new ModuleCollection(options)

    // 但是这些 modules 中的 actions, mutations, getters 都没有注册，所以我们原来的方法要重新写一下
    // 递归的去注册一下就行了，这里抽离一个方法出来实现
    installModule(this, this.state, [], this._modules.root)
  }
}

function installModule(store, state, path, root) {
  // getters
  const getters = root._rawModule.getters
  if (getters) {
    _.forEach(getters, (name, getterFn) => {
      Object.defineProperty(store.getters, name, {
        get: () => getterFn(root.state),
      })
    })
  }

  // mutations
  const mutations = root._rawModule.mutations
  if (mutations) {
    _.forEach(mutations, (name, mutation) => {
      let _mutations = store.mutations[name] || (store.mutations[name] = [])
      _mutations.push((payload) => {
        mutation(root.state, payload)
      })

      store.mutations[name] = _mutations
    })
  }

  // actions
  const actions = root._rawModule.actions
  if (actions) {
    _.forEach(actions, (name, action) => {
      let _actions = store.actions[name] || (store.actions[name] = [])
      _actions.push((payload) => {
        action(store, payload)
      })

      store.actions[name] = _actions
    })
  }

  // 递归
  _.forEach(root._children, (name, childModule) => {
    installModule(this, this.state, path.concat(name), childModule)
  })
}
```

## SSR

服务的渲染

#### CSR VS SSR

首先让我们看看 CSR 的过程（划重点，浏览器渲染原理基本流程）

![csr](https://raw.githubusercontent.com/yacan8/blog/master/images/%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86/image-20200730191954015.png)

过程如下：

1. 浏览器通过请求得到一个`HTML`文本
2. 渲染进程解析`HTML`文本，构建`DOM`树
3. 解析`HTML`的同时，如果遇到内联样式或者样式脚本，则下载并构建样式规则（`stytle rules`），若遇到`JavaScrip`t 脚本，则会下载执行脚本。
4. `DOM`树和样式规则构建完成之后，渲染进程将两者合并成渲染树（`render tree`）
5. 渲染进程开始对渲染树进行布局，生成布局树（`layout tree`）
6. 渲染进程对布局树进行绘制，生成绘制记录
7. 渲染进程的对布局树进行分层，分别栅格化每一层，并得到合成帧
8. 渲染进程将合成帧信息发送给`GPU`进程显示到页面中

很容易发现，`CSR` 的特点就是会在浏览器端的运行时去动态的渲染、更新 `DOM` 节点，特别是 `SPA` 应用来说，其模版 `HTML` 只有一个 `DIV`，然后是运行时（`React`，`Vue`，`Svelte` 等）动态的往里插入内容，这样的话各种 `BaiduSpider` 拿不到啥有效信息，自然 `SEO` 就不好了，项目一旦复杂起来， `bundle` 可能超乎寻常的大...这也是一个开销

那么`SSR` 呢，则是是服务端完成了渲染过程，将渲染完成的 `HTML` 字符串或者流返回给浏览器，就少了脚本解析、运行这一环节，理论上 `FP` 表现的更佳，`SEO` 同样

![csr vs ssr](https://raw.githubusercontent.com/yacan8/blog/master/images/%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86/image-20200731165404271.png)

但其实，现在 `SSR` 也并没有大行其道，凡事有利有弊，`SSR` 也是有缺点的

1.  复杂，同构项目的代码复杂度直线上升，因为要兼容两种环境
2.  对服务端的开销大，既然 `HTML` 都是拼接好的，那么传输的数据肯定就大多了，同时，拿 `Node` 举例，在处理 `Computed` 密集型逻辑的时候是阻塞的，不得不上负载均衡、缓存策略等来提升
3.  CI/CD 更麻烦了，需要在一个 `Server` 环境，比如 `Node`

> 一般来说，ToB 的业务场景基本不需要 SSR，需要 SSR 的一定是对首屏或者 SEO 有强诉求的，不然没必要搞那么麻烦，简洁是避免麻烦的最佳实践，同时，随着浏览器发展，越来越快，爬虫也越来越智能，SSR 的场景在被压缩

彩蛋，这里说到了 `CSR` 和 `SSR` ，其实我们现今常见的渲染方案有 6-7 种吧！

![render](https://image-static.segmentfault.com/324/269/3242695953-5c7c0095b3cf5_fix732)

注意，这里提到了 `hydration` 这个词，这是一个很棒的思路，对 `FP` 有帮助，但是不能提升 `TTI`

> 补充资料，务必精读
>
> [VUE SSR 指南（动手操练一下最佳）](https://ssr.vuejs.org/zh/#%E4%BB%80%E4%B9%88%E6%98%AF%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E6%B8%B2%E6%9F%93-ssr-%EF%BC%9F)

#### 同构应用

我们以上面的指南为基础讲讲同构应用（因为同构应用算是比较复杂的了），通过同构应用让大家对 `SSR` 有一个更直观、立体的认识

首先需要了解什么是同构应用

> 一份代码，既可以客户端渲染，也可以服务端渲染

看看客户端渲染，对我们而言，基本可以这样概括：页面 = 模版 + 数据，应用 = 路由 + 页面

所以，同构，我们需要注意的是构了个啥？，就是 **路由**、**模版**、**数据**

![同构](https://raw.githubusercontent.com/yacan8/blog/master/images/%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%B8%B2%E6%9F%93%E5%8E%9F%E7%90%86/vue%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%B8%B2%E6%9F%93%E6%9E%84%E5%BB%BA.png)

假定大家已经认真阅读并实际操练了 `VUE SSR` 指南，

现在就一些实践经验做一些补充：

1. 服务端的 `webpack` 不用关注 `CSS`，客户端会打包出来的，到时候推 `CDN`，然后改一下 `public path` 就好了

2. 服务端的代码不需要分 `chunk`，`Node` 基于内存一次性读取反而更高效

3. 如果有一些方法需要在特定的环境执行，比如客户端环境中上报日志，可以利用 `beforeMouted` 之后的生命周期都不会在服务端执行这一特点，当然也可以使用 `isBrowser` 这种判断

4. `CSR` 和 `SSR` 的切换和降级

   ```js
   // 总有一些奇奇怪怪的场景，比如就只需要 CSR，不需要 SSR
   // 或者在 SSR 渲染的时候出错了，页面最好不要崩溃啊，可以降级成 CSR 渲染，保证页面能够出来

   // 互相切换的话，总得有个标识是吧，告诉我用 CSR 还是 SSR
   // search 就不错，/demo?ssr=true
   module.exports = function (req, res) {
     if (req.query.ssr === 'true') {
       const context = { url: req.url }
       renderer.renderToString(context, (err, html) => {
         if (err) {
           res.render('demo') // views 文件下的 demo.html
         }
         res.end(html)
       })
     } else {
       res.render('demo')
     }
   }
   ```

5. `Axios` 封装，至少区分环境，在客户端环境是需要做代理的

> 这里的最佳实践知识抛砖引玉，还是得自己去踩坑总结

`VUE-SSR` 优化方案：

1. 页面级别的缓存，比如 `nginx` `micro-caching`
2. 设置 `serverCacheKey`，如果相同，将使用缓存，组件级别的缓存
3. `CGI` 缓存，通过 `memcache` 等，将相同的数据返回缓存一下，注意设置缓存更新机制
4. 流式传输，但是必须在` asyncData` 之后，否则没有数据，说明也可能会被 `CGI` 耗时阻塞
5. 分块传输，这样前置的 `CGI` 完成就会渲染输出，但是这个方案难啊
6. [JSC](https://juejin.cn/post/6844903476120518670)，就是不用 `vue-loader`
