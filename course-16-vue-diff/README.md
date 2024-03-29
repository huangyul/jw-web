# Vue 核心源码分析

> 带着问题学习？
>
> 1. react 和 vue 的 diff 算法有什么区别
> 2. 传统的 diff O(n^3)，react O(n)？怎么来的，还可以优化吗？

## 几个常见问题

###### 1. 为什么要 diff

1. 本质上就是为了性能！！
2. 简化操作 dom 的方式（数据的双向绑定），通过数据影响视图

MVVM 的本质： **数据模型** -> **virtual dom** -> **视图(dom)**，通过虚拟 dom 去关联数据模型和视图

虚拟 Dom 本质就是一个对象

```js
{
  type: 'div',
  props: {...}
}
```

注意：真实 dom 操作并不慢，不一定真实 dom 就是慢！！

但是真实操作 dom，会容易引起重绘和回流

###### 2. 为什么是 O(n^3)？怎么来的？

字符串的最小编辑距离需要`O(n^2)`，树的最小编辑距离需要`O(n^3)`

###### 3. react 为什么是 O(n)？

因为使用了同层比较
其实真实是 `O(mn)`，经过优化可以达到 `O(n)`

```js
for(let i = 0; i < oldArr.length; i++) {
  if(old[i].type !== new[i].type) {
    replace()
  } else (old[i].children && old[i].children.length) {
    // 假如没有这里，就是最优解
  }
}
```

###### 4. 如何做到 O(n)

1. 同层比较，通过 type 类型来判断，如果不同，直接删掉**原节点**；如果相同，就递归遍历**children**
2. 同一层级的子元素，可以通过**key**来缓存实例
3. 完全相同的节点，其虚拟 dom 也是一致的

###### 5. 为什么不建议用下标（index）作为 key？

`key` 的作用：在虚拟 `dom` 算法中，在新旧 `nodes` 对比时辨识虚拟 `dom`，尽可能减少修改相同类型元素，提高复用的可能性

**在 vue 中**

例如存在数组[1,2,3]，使用 `splice(0,1)`删掉第一个，因为用了索引作为 `key`，所以由原来的[0,1,2]变成了[0,1]，实际删掉了最后一个

**在 react 中**

使用下标作为 `key`，进行数组的删除操作时，会造成所有 `dom` 重新渲染

## 虚拟 DOM

### 什么是虚拟 DOM

本质是一个嵌套对象，描述节点的结构

### 如何创建虚拟 DOM

`h()`和`createElement()`

```js
function h(type, props) {
  return { type, props }
}
```

### 使用虚拟 DOM

通过一些工具，将代码中的某些东西提取出来，然后调用 createElement 方法

### 渲染(mount)

就是虚拟 DOM 到真实 DOM 的过程

```js
function(node) {
  document.createElement()
  parent.insert()
}
```

### diff 相关(patch)

```js
f(oldVnode, newVnode, parent)
```

## 手写

1. 定义虚拟 DOM 的结构
2. 创建虚拟 DOM 的方法`h()`
3. 渲染函数`render()`

### 定义虚拟 DOM 的方法

```js
// h.js
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
  let key = props.key || void 0
  // 处理children，因为可能放到props里，也可能直接传进来
  kids = normalize(props.children || kids)
  // props.children
  if (kids.length) props.children = kids.length === 1 ? kids[0] : kids

  const $$ = {}
  $$.el = null
  $$.flag = type === '' ? NODE_FLAG.TEXT : NODE_FLAG.EL

  return createVnode(type, props, key, $$)
}
```
