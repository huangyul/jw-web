export class Vue {
  constructor(options) {
    this.$options = options
    this.$el =
      typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el
    this.$data = options.data
    this.$methods = options.methods

    this.proxy(this.$data)
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
          if (newValue === data[key] || (isNaN(newValue) && isNaN(data[key])))
            return
          data[key] = newValue
        },
      })
    })
  }
}
