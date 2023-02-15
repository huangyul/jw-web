import { mount } from './mount.js'
import { diff } from './diff.js'
import { odiff } from './optimization-diff.js'

const patchChildren = (prev, next, parent) => {
  // diff 比较耗性能，可以前置做一些处理，提升效率
  if (!prev) {
    if (!next) {
      // do nothing
    }
    else {
      next = Array.isArray(next) ? next : [next]

      for (const c of next) {
        mount(c, parent)
      }
    }
  }

  else if (prev && !Array.isArray(prev)) { // 只有一个 children
    if (!next) parent.removeChild(prev.el)
    else if (next && !Array.isArray(next)) {
      patch(prev, next, parent)
    }
    else {
      parent.removeChild(prev.el)
      for (const c of next) {
        mount(c, parent)
      } 
    }
  }

  else odiff(prev, next, parent)
}

export const patch = (prev, next, parent) => {

  // type: 'div' -> type: 'p'
  if (prev.type !== next.type) {
    parent.removeChild(prev.el)
    mount(next, parent)
    return
  }

  // type 一样，diff props（先不看 children）
  const { props: { children: prevChildren, ...prevProps } } = prev
  const { props: { children: nextChildren, ...nextProps } } = next
  // patchProps
  const el = (next.el = prev.el)
  for (let key of Object.keys(nextProps)) {
    let prev = prevProps[key],
      next = nextProps[key]
      patchProps(key, prev, next, el)
  }

  for (let key of Object.keys(prevProps)) {
    if (!nextProps.hasOwnProperty(key)) patchProps(key, prevProps[key], null, el)
  }

  // patch children ⚠️
  patchChildren(
    prevChildren,
    nextChildren,
    el
  )
}

export const patchProps = (key, prev, next, el) => {

  // style
  if (key === 'style') {

    // { style: { margin: '0px', padding: '10px' }}
    if (next)
      for (let k in next) {
        el.style[k] = next[k]
      }

    // { style: { padding: '0px', color: 'red' } }
    if (prev)
      for (let k in prev) {
        if (!next.hasOwnProperty(k)) {
          el.style[k] = ''
        }
      }
  }

  // class
  else if (key === 'className') {
    if (!el.classList.contains(next)) {
      el.classList.add(next)
    }
  }

  // events
  else if (key[0] === 'o' && key[1] === 'n') {
    prev && el.removeEventListener(key.slice(2).toLowerCase(), prev)
    next && el.addEventListener(key.slice(2).toLowerCase(), next)
  }

  else if (/\[A-Z]|^(?:value|checked|selected|muted)$/.test(key)) {
    el[key] = next
  }

  else {
    el.setAttribute && el.setAttribute(key, next)
  }
}
