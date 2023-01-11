import { mount } from './mount.js'
import { patch } from './patch.js'

export const diff = (prev, next, parent) => {
  let prevMap = {}
  let nextMap = {}

  // old tree children
  for (let i = 0; i < prev.length; i++) {
    let { key = i + '' } = prev[i]
    prevMap[key] = i
  }

  let lastIndex = 0
  for (let n = 0; n < next.length; n++) {
    let { key = n + '' } = next[n]
    let j = prevMap[key]
    let nextChild = next[n]
    nextMap[key] = n
    
    // {b: 0, a: 1}
    // 原children    新 children
    // [b, a]   ->   [c, d, a]  ::[c, b, a] 👉 c
    // [b, a]   ->   [c, d, a]  ::[c, d, b, a] 👉 d
    if (j == null) {
      let refNode = n === 0 ? prev[0].el : next[n - 1].el.nextSibling
      mount(nextChild, parent, refNode)
    }
    else {
      // [b, a] -> [c, d, a]  ::[c, d, a, b] 👉 a
      patch(prev[j], nextChild, parent)
      if (j < lastIndex) {
        let refNode = next[n - 1].el.nextSibling;
        parent.insertBefore(nextChild.el, refNode)
      }
      else {
        lastIndex = j
      }
    }
  }

  // [b, a] -> [c, d, a]  ::[c, d, a] 👉 b
  for (let i = 0; i < prev.length; i++) {
    let { key = '' + i } = prev[i]
    if (!nextMap.hasOwnProperty(key)) parent.removeChild(prev[i].el)
  }
}
