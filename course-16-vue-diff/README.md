# vue.js 核心源码解析

## 算法基础

### 复杂度

遍历一个列表，长度为 n

// 1 + 2 + 3 +...+ n / (n + 1) // 1 表示没有找到
// (1 + n) /\* n / 2(n + 1) -> n O(n)

## 问题：

###### 为什么需要 diff

1. 本质上为了性能

###### 为什么 diff 是 O(n^3)

跨层级比较

先用字符比较的方式算出是 O(n^2)，还要去跟所有子节点比较，所以最后是 O(n^3)

###### 为什么 react 是 O(n)

因为同级比较，实际是 `O(m*n)`，m 是子节点的数目

```js
const arr = [1, 2, 3]
const newArr = [2, 3, 4]

for (let i = 0; i < arr.length; i++) {
  compare(arr[i], newArr[i])
  // 如果相同，还要遍历去比较子节点
}
```

###### key

- 使用 key 是为了组件复用，提高性能
- 不要用 index 下标作为 key 的原因：例如`[0,1,2]`作为 key，当删掉一个时，会变成`[0,1]`，无论删掉哪个都会这样，然后 vue 的 sameNode 判断会认为前两个是相同的，最后一个被删掉，造成了误删

react 的 key 使用下标的问题：造成所有组件重新渲染

## 虚拟 DOM

1. 什么是虚拟 DOM
   就是一个对象 {'div', props: {}, children}

2. 如何创建虚拟 DOM
   h,createElment
   `function h(type, props) {return {type, props}}`
3. 使用
   **jsx**

```jsx
<div>
  <ul>
    <li>this is li 0</li>
  </ul>
</div>
```

**经过工具转一下**

```js
createElement('div', {
  children: [
    createElement('ul', children: [

    ])
  ]
})
```

4. (mount/render)虚拟 DOM 的数据结构有了，然后就是渲染（先不管 diff，将老的树和新的树对比）
   f(vnode) -> view
   f(vnode) {
   document.createElment()
   ...
   parent.insert()
   }

   export const render = (vnode, parent) => {}
   通过原生的 js 将虚拟 DOM 的数据结构渲染出来，所以框架一般会暴露一个 render 方法，接收 vnode 和 parent，`<div id="app"></div>`

5. diff (patch)
   f(oldVnodtree, newVnodeTree, parent) -> 调度 -> view
   调度：不让每次遍历就更新 dom，防止界面阻塞


