import { NODE_FLAG } from './h.js'
import { patchProps } from './patch.js'

export const mount = (vnode, parent, refNode) => {
  if (!parent) throw new Error('你可能忘了点啥')
  const $$ = vnode.$$

  // if ($$.flag === NODE_FLAG.TEXT)
  if ($$.flag & NODE_FLAG.TEXT) {
    const el = document.createTextNode(vnode.props.nodeValue)
    vnode.el = el
    parent.appendChild(el)
  }
  else if ($$.flag & NODE_FLAG.EL) {
    const { type, props } = vnode
    // 先不考虑 type 是一个组件的情况 ⚠️
    const el = document.createElement(type)
    vnode.el = el

    const { children, ...rest } = props
    if (Object.keys(rest).length) {
      for (let key of Object.keys(rest)) {
        patchProps(key, null, rest[key], el)
      }
    }

    if (children) {
      const __children = Array.isArray(children) ? children : [children]
      for (let child of __children) {
        mount(child, el)
      }
    }

    refNode ? parent.insertBefore(el, refNode) : parent.appendChild(el)
  }
}
