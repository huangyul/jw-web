// 通用判断对象的方法
function isObject(data) {
  return data && typeof data === 'object'
}

/**
 * const state = reactive({count: 0})
 * state.a++
 */
export function reactive(data) {
  if (!isObject) return

  return new Proxy(data, {
    get(target, key, receiver) {
      // 反射  target[key] 在继承的关系情况下有坑
      const ret = Reflect.get(target, key, receiver)
      // TODO 依赖收集
      return isObject(ret) ? reactive(ret) : ret
    },
    set(target, key, val, receiver) {
      Reflect.set(target, key, val, receiver)
      // TODO 通知
      return true
    },
    defineProperty(target, key) {
      const ret = Reflect.deleteProperty(target, key, receiver)
      // TODO 通知
      return ret
    },
  })
}
