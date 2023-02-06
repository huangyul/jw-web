// AMD 迷你实现

const defaultOptions = {
  paths: '',
}

// 为啥不写let const var？为了能挂载到全局
// 正确的写法 window.rj = {}
rj = {}

// config的时候获取到options的配置
rj.config = (options) => Object.assign(defaultOptions, options)

// 定义模块，触发的时机其实是在require的时候，所以这里是收集依赖
const def = new Map()
define = (name, deps, factory) => {
  // todo参数的判断，互换
  def.set(name, { name, deps, factory })
}

// 使用cdn的方式加载
const __import = (url) => {
  return new Promise((resolve, reject) => {
    System.import(url).then(resolve, reject)
  })
}
// 使用script标签
const __load = (url) => {
  return new Promise((resolve, reject) => {
    const head = document.getElementsByTagName('head')[0]
    const node = document.createElement('script')
    node.type = 'text/javascript'
    node.src = url
    node.async = true
    node.onload = resolve
    node.onerror = reject
    head.appendChild(node)
  })
}

// 获取url
const __getUrl = (dep) => {
  const p = location.pathname
  return p.slice(0, p.lastIndexOf('/')) + '/' + dep + '.js'
}

// 使用模块，这里才是加载模块的地方
require = (deps, factory) => {
  // 异步加载，需要使用promise
  return new Promise((resolve, reject) => {
    Promise.all(
      deps.map((dep) => {
        // 加载模块
        if (defaultOptions.paths[dep])
          return __import(defaultOptions.paths[dep])

        return __load(__getUrl(dep)).then(() => {
          const { deps, factory } = def.get(dep)
          // 判断如果依赖里面有其他依赖，就要递归去找
          if (deps.length === 0) return factory(null)
          return require(deps, factory)
        })
      })
    ).then(resolve, reject)
  }).then((instances) => {
    // 拿到异步加载的内容，传给factory函数
    return factory(...instances)
  })
}
