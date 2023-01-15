// 通用判断对象的方法
function isObject(data) {
  return data && typeof data === 'object'
}

let targetMap = new WeakMap()
let activeEffect
/**
 * 2. 收集依赖
 */
function track(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))
  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set()))
  if (!dep.has(activeEffect)) dep.add(activeEffect)
}

/**
 * 3. 通知
 */
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  depsMap.get(key).forEach((e) => e && e())
}

/**
 * 5. effect
 * 收集副作用 compiler + watcher
 * effect 执行 -> activeEffect 就有值了（更新页面）->触发getter->trach()->activeEffect存起来了->setter(count.value++)->trigger->activeEffect()->页面更新
 */
function effect(fn, options = {}) {
  const __effect = function (...args) {
    activeEffect = __effect
    return fn(...args)
  }
  if (!options.lazy) {
    __effect()
  }
  return __effect
}

/**
 * 1. reactive
 * const state = reactive({count: 0})
 * state.a++
 */
export function reactive(data) {
  if (!isObject) return

  return new Proxy(data, {
    get(target, key, receiver) {
      // 反射  target[key] 在继承的关系情况下有坑
      const ret = Reflect.get(target, key, receiver)
      // 收集
      track(target, key)
      return isObject(ret) ? reactive(ret) : ret
    },
    set(target, key, val, receiver) {
      Reflect.set(target, key, val, receiver)
      // 通知
      trigger(target, key)
      return true
    },
    defineProperty(target, key) {
      const ret = Reflect.deleteProperty(target, key, receiver)
      // 通知
      trigger(target, key)
      return ret
    },
  })
}

/**
 * 4. ref
 * 对于基本类型的响应式处理
 * const count = ref(0)
 * count.value++
 */
export function ref(target) {
  let value = target
  const obj = {
    get value() {
      // 收集
      track(obj, 'value')
      return value
    },
    set value(newValue) {
      if (value === newValue) return
      value = newValue
      // 通知
      trigger(obj, 'value')
    },
  }

  return obj
}

/**
 * 6. computed
 * computed(() => {return count.value + 1})
 */
export function computed(fn) {
  // 只考虑函数的情况
  // 延迟计算
  // const c = computed(() => count.value++) 只有调用c.value才会计算，其实也是先收集依赖，等需要取值的时候再执行副作用方法
  let __computed
  const run = effect(fn, { lazy: true })
  __computed = {
    get value() {
      return run()
    },
  }
  return __computed
}

/**
 * 7. 渲染
 */
export function mount(instance, el) {
  effect(function () {
    instance.$data && update(instance, el)
  })

  instance.$data = instance.setup()
  update(instance, el)

  function update(instance, el) {
    el.innerHTML = instance.render()
  }
}

/**
 * 终结一下
 * 收集副作用->收集时间（getter）->触发副作用执行（setter）
 */
