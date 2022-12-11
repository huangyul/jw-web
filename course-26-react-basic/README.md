# react

## JSX

JSX 是将 UI 元素和 js 逻辑代码写在一起的 Javascript 语法拓展

### 使用表达式

在 JSX 中要使用变量，可以用大括号括起来

```jsx
const name = 'xxx'
const element = <h1>hello, {name}</h1>

ReactDOM.render(element, document.getElementById('root'))
```

在大括号中可以使用任何 Jacascript 表达式，如 2+2，等等，甚至三目运算符，但是注意，不能使用 if else

### 特定的属性

类似于 vue 中的属性绑定 v-bind

```jsx
const element = <img src={user.avatarUrl}></img>
```

### 合法的元素

- 普通的 DOM，比如 div 等等
- 声明的 react 组件
- null（最终会渲染一个空元素）
- 字符串（渲染一个 text 节点）
