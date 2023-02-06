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
