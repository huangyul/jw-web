export class Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    this.$methods = options.methods
    this.$el =
      typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el

    this.proxy(this.$data)
    new Observer(this.$data)
    new Compiler(this)
  }

  proxy(data) {
    if (!data || typeof data !== 'object') return
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        get() {
          return data[key]
        },
        set(newValue) {
          if (data[key] === newValue) return
          data[key] = newValue
        },
      })
    })
  }
}

class Observer {
  constructor(data) {
    this.walk(data)
  }
  walk(data) {
    if (!data || typeof data != 'object') return
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key])
    })
  }
  defineReactive(obj, key, value) {
    let that = this
    this.walk(obj[key])
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      get() {
        Dep.target && dep.add(Dep.target)
        return value
      },
      set(newValue) {
        if (value === newValue) return
        value = newValue
        that.walk(newValue)
        dep.notify()
      },
    })
  }
}

class Dep {
  constructor() {
    this.deps = new Set()
  }
  add(dep) {
    if (dep && dep.update) this.deps.add(dep)
  }
  notify() {
    this.deps.forEach((dep) => dep.update())
  }
}

class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb

    Dep.target = this
    this.__old = this.vm[this.key]
    Dep.target = null
  }
  update() {
    let newValue = this.vm[this.key]
    if (newValue !== this.__old) {
      this.cb(newValue)
    }
  }
}

class Compiler {
  constructor(vm) {
    this.vm = vm

    this.compile(this.vm.$el)
  }
  compile(el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach((node) => {
      if (this.isTextNode(node)) {
        this.compileTextNode(node)
      } else if (this.isElementNode(node)) {
        this.compileElementNode(node)
      }

      if (node.childNodes && node.childNodes.length) this.compile(node)
    })
  }

  compileElementNode(node) {
    if (node.attributes.length) {
      Array.from(node.attributes).forEach((attr) => {
        let attrName = attr.name
        if (attrName.startsWith('v-')) {
          attrName =
            attrName.indexOf(':') > -1 ? attrName.substr(5) : attrName.substr(2)
          let key = attr.value
          this.update(node, key, attrName, this.vm[key])
        }
      })
    }
  }
  update(node, key, attrName, value) {
    if (attrName === 'model') {
      node.value = value
      new Watcher(this.vm, key, (val) => {
        node.value = val
      })
      node.addEventListener('input', () => {
        this.vm[key] = node.value
      })
    } else if (attrName === 'on') {
      node.addEventListener('click', this.vm.$methods[key].bind(this.vm))
    }
  }
  compileTextNode(node) {
    const reg = /\{\{(.*)\}\}/
    const value = node.textContent
    if (reg.test(value)) {
      const key = value.match(reg)[1]
      node.textContent = this.vm[key]
      new Watcher(this.vm, key, (value) => (node.textContent = value))
    }
  }
  isTextNode(node) {
    return node.nodeType === 3
  }
  isElementNode(node) {
    return node.nodeType === 1
  }
}
