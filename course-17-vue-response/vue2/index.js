// html -> <h1>{{ count }}</h1> -> compiler 发现有 {{ count }}
// -> new Watcher(vm, 'count', () => renderToView(count)) -> count getter 被触发
// -> dep.add(watcher实例) -> this.count++ -> count setter -> dep.notify
// -> () => renderToView(count) -> 页面就变了
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

    new Compiler(this)
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

// 5
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

// 6
// 模板解析
class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.methods = vm.methods

    this.compile(vm.$el)
  }

  compile(el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach((node) => {
      if (this.isTextNode(node)) {
        // 如果是文本节点
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        // 如果是元素节点
        this.compileElement(node)
      }

      if (node.childNodes && node.childNodes.length) this.compile(node)
    })
  }
  isTextNode(node) {
    return node.nodeType === 3
  }
  isElementNode(node) {
    return node.nodeType === 1
  }
  compileElement(node) {
    // <input v-model="msg">  主要是处理v-指令
    if (node.attributes.length) {
      Array.from(node.attributes).forEach((attr) => {
        let attrName = attr.name
        if (this.isDirective(attrName)) {
          // 如果是指令
          // v-on:click=""   v-model=""
          attrName =
            attrName.indexOf(':') > -1 ? attrName.substr(5) : attrName.substr(2)
          let key = attr.value
          this.update(node, key, attrName, this.vm[key])
        }
      })
    }
  }
  update(node, key, attrName, value) {
    if (attrName === 'text') {
      // 如果是v-text
      node.textContent = value
      new Watcher(this.vm, key, (val) => (node.textContent = val))
    } else if (attrName === 'model') {
      // v-model
      node.value = value
      new Watcher(this.vm, key, (val) => (node.value = val))
      node.addEventListener('input', () => {
        this.vm[key] = node.value
      })
    } else if (attrName === 'click') {
      node.addEventListener(attrName, this.methods[key].binds(this.vm))
    }
  }
  compileText(node) {
    // 比如要解析 this is {{ count }}
    // 找出两个花括号的值
    let reg = /\{\{(.+?)\}\}/
    // 获取node的textcontent
    let value = node.textContent
    if (reg.test(value)) {
      // 根据正则匹配出双花括号里的值，并去掉前后空格
      let key = RegExp.$1.trim()
      // 重新将node里面的textContent替换一下，将花括号的值改为this.data里的值
      node.textContent = value.replace(reg, this.vm[key])
      // 定义一个watcher，以后遇到setter的时候，修改textContent
      new Watcher(this.vm, key, (val) => {
        node.textContent = val
      })
    }
  }
  isDirective(str) {
    return str.startsWith('v-')
  }
}
