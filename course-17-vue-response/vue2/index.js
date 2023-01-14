export class Vue {
  constructor(options) {
    // 1. 收集options里面的东西
    this.$options = options
    this.$el =
      typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el
    this.$data = options.data
    this.$methods = options.methods

    // 2. 将data代理一下，方便使用
    // 代理一下data
    this.proxy(this.$data)

    // 3. 拦截data
    // 拦截this.$data
    new Observer(this.$data)
  }

  // 代理一下，可以直接使用data里面的值   this.$data.xx -> this.xxx
  proxy(data) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          // 如果等于本身，就不需要重新设置值了
          // 还要注意NaN不等于本身
          if (newValue === data[key] || __isNaN(newValue, data[key])) return
          data[key] = newValue
        },
      })
    })
  }
}

function __isNaN(a, b) {
  return Number.isNaN(a) && Number.isNaN(b)
}

// 响应式的意义
// 定义的东西被修改，页面也要自动改变
// 发布订阅模式
class Observer {
  constructor(data) {
    this.walk(data)
  }
  walk(data) {
    if (!data || typeof data !== 'object') return
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key])
    })
  }
  // 3.1 将data拦截
  defineReactive(obj, key, value) {
    let that = this
    this.walk(value) // 因为值也可能是对象，也需要变成响应式
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get() {
        // 收集依赖
        // target 是watcher实例
        Dep.target && dep.add(Dep.target)
        return value
      },
      set(newValue) {
        // 判断NaN
        if (__isNaN(value, newValue)) return
        if (newValue === value) return
        value = newValue
        // 新的值也可能是对象
        that.walk(newValue)
        // 发布，触发副作用
        dep.notify()
      },
    })
  }
}

// 4. 收集器
class Dep {
  constructor() {
    this.deps = new Set()
  }
  // 收集依赖
  add(dep) {
    // update是执行依赖，执行副作用
    if (dep && dep.update) this.deps.add(dep)
  }
  // 通知依赖
  notify() {
    this.deps.forEach((dep) => dep.update())
  }
}

// 5.
// 模板初始化的时候，分析模板，将有双大括号包裹起来的值收集起来
class Watcher {
  // vm是Vue的实例
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb

    Dep.target = this
    // 拿到当前的key，存下初始值；会触发一次getter，会收集一个依赖
    this.__old = vm[key]
    // 避免内存溢出
    Dep.target = null
  }
  update() {
    let newValue = this.vm[this.key]
    if (this.__old === newValue || __isNaN(newValue, this.__old)) return
    this.cb(newValue)
  }
}
