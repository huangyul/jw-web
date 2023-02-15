const createVnode = (type, props, key, $$) => {
  // 定义虚拟DOM的数据结构
  return {
    type,
    props,
    key,
    $$,
  }
}

const normalize = (child) =>
  child.map((node) => (typeof node === 'string' ? createText(node) : node))

export const NODE_FLAG = {
  EL: 1, // 元素 Element
  TEXT: 1 << 1,
}

// 文本节点
const createText = (text) => {
  return {
    type: '',
    props: {
      nodeValue: text + '',
    },
    $$: { flag: NODE_FLAG.TEXT }, // 定义节点的类型就是文本节点
  }
}

// 生成虚拟DOM对象的方法
export const h = (type, props, ...kids) => {
  props = props || {}
  let key = props.key || void 0 // void 0 是undefined
  // 处理children，因为可能放到props里，也可能直接传进来
  kids = normalize(props.children || kids)
  // props.children
  if (kids.length) props.children = kids.length === 1 ? kids[0] : kids

  const $$ = {}
  $$.el = null
  $$.flag = type === '' ? NODE_FLAG.TEXT : NODE_FLAG.EL

  return createVnode(type, props, key, $$)
}
