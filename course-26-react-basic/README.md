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

- 加载 props 的方式不同，函数组件通过 props 参数获取
- 函数式组件无法维护状态，class 形式可以通过 this.state 和 this.setState 方法更新内部 state
- class 组件内部可以定义更多的方法在实例

受控和非受控

```jsx
// 受控 input的值给input组件内部维护
<input></input>
// 受控 input的值，保存到state中
<input value={inputValue}></input>
```

## 组件生命周期

componentWillMount -> render -> componentDidMount -> componentWillReceiveProps -> componentWillUpdate -> render -> componentDidUpdate

最好在 componentDidMount
发送请求
