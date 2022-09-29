// AMD 手撸

// 实现config
const defaultOptions = {
  paths: ''
}
window.rj.config = (options) => Object.assign(defaultOptions, options)

// 定义模块 define
/**
 * 定义模块，本质上是收集，等require才调用
 * @param {*} moduleName 模块名
 * @param {*} deps 相关依赖
 * @param {*} factory 模块具体执行的内容
 */
const def = new Map()
window.define = function (moduleName, deps, factory) {
  // 参数判断等行为先忽略

  // 先把模块的方法存起来
  def.set(moduleName, { moduleName, deps, factory })
}

// 这里才是触发加载依赖的方法
window.require = (deps, factory) => {
  // 会接受两个参数，第一个是依赖，第二个是要执行的方法
  // 因为会先执行依赖，再执行方法，所以需要用到promise
  return new Promise((resolve, reject) => {
    // 执行每个依赖的方法
    Promise.all(deps.map((dep) => {})).then(resolve, reject)
  }).then((instances) => factory(...instances))
}
