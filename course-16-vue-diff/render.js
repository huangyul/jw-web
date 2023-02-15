// 渲染相关

/**
 * 拿到虚拟DOM的结构，把虚拟dom节点挂到根节点上
 */
export const render = (vnode, parent) => {
  let prev = parent._vnode
  // 之前没有挂载过节点
  if (!prev) {
    mount(vnode, parent)
    parent._vnode = vnode
  }
}
