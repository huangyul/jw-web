
const normalize = (children = []) => children.map(child => typeof child === 'string' ? createText(child) : child)

const createVnode = (type, props, key, $$) => {

  // step1. 定义虚拟 DOM 的数据结构
  return {
    type, // div / CompoentA / ''(文本)
    props,
    key,
    $$
  }
}

export const NODE_FLAG = {
  EL: 1, // 元素 element
  TEXT: 1 << 1
}

const  createText = (text) => {
  return {
    type: '',
    props: {
      nodeValue: text + ''
    },
    $$: { flag: NODE_FLAG.TEXT }
  }
}

/**
 * step2. 定义生成虚拟DOM对象的方法
 * h('div', { className: 'padding20'}, 'hello world!')
 */
export const h = (type, props, ...kids) => {
  props = props || {}
  let key = props.key || void 0
  kids = normalize(props.children || kids)

  // props.children
  // void 0
  // { type: 'div', ... }
  // [{xx}, {xxx}]
  if (kids.length) props.children = kids.length === 1 ? kids[0] : kids

  const $$ = {}
  $$.el = null
  $$.flag = type === '' ? NODE_FLAG.TEXT : NODE_FLAG.EL

  return createVnode(type, props, key, $$)
}
