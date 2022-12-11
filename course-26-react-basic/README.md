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

可以通过 React.isValidElement 来判断一个内容元素是否是合法的元素

### class 和 for 要使用 className 和 htmlFor 代替

### JSX 并不能直接使用，要编译成 React.createElement 的形式

## create-react-app 的使用

[官方](https://react.docschina.org/docs/create-a-new-react-app.html#create-react-app)

## 函数组件和 class 组件/受控组件和非受控组件

函数式组件

```jsx
function Foo(props) {
  return <div>{props.text || 'Foo'}</div>
}
```

class 组件

```jsx
class Bar extends React.Component {
  render() {
    return <div>{this.props.text || 'Bar'}</div>
  }
}
```

区别：

- 加载props的方式不同