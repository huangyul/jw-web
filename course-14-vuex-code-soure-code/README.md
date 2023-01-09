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
