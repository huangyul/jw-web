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
