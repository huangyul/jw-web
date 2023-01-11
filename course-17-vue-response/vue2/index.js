export class Vue {
  constructor(options) {
    this.$options = options
    this.$el =
      typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el
    this.$data = options.data
    this.$methods = options.methods

    // 代理一下data
    this.proxy(this.$data)

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
  defineReactive(obj, key, value) {
    let that = this
    this.walk(value) // 因为值也可能是对象，也需要变成响应式

    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get() {
        return value
      },
      set(newValue) {
        // 判断NaN
        if (__isNaN(value, newValue)) return
        if (newValue === value) return
        value = newValue
        // 新的值也可能是对象
        this.walk(newValue)
      },
    })
  }
}
