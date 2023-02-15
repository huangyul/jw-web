import { mount } from './mount.js'
import { patch } from './patch.js'

/**
 * step3. 渲染 f(vnode, parent)
 */
export const render = (vnode, parent) => {
  let prev = parent._vnode

  if (!prev) {
    mount(vnode, parent)
    parent._vnode = vnode
  }
  else {
    if (vnode) { // 新旧两个 vnodeTree 都存在
      patch(prev, vnode, parent)
      parent._vnode = vnode
    }
    else {
      parent.removeChild(prev.$$.el)
    }
  }
}
