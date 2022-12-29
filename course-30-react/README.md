# react

## 安装

创建一个 react 应用

`npx create-react-app app-name`

## 核心概念

### JSX 简介

简单来说就是 javascript 的语法拓展

- 变量的使用：{}

```jsx
const msg = 'hello react'
// 使用大括号表示变量，使用双引号表示字面量
const element = <h1>{msg}</h1>
```

### 组件&Props

#### 函数组件与 class 组件

```jsx
// 函数式组件
function Welcome(props) {
  return <h1>hello, {props.msg}</h1>
}
;<Welcome msg="react" />

// class组件
class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.msg}</h1>
  }
}
```

#### props

- 当 `React` 元素为用户自定义组件时，它会将 `JSX` 所接收的属性（attributes）以及子组件（children）转换为单个对象传递给组件，这个对象就是 props
- `props` 对于子组件是只读的，不能修改自身的 `props`

### State & 生命周期

```jsx
class Clock extends Component {
  constructor(props) {
    super(props)
    // state
    this.state = { date: new Date() }
  }
  // 生命周期
  componentDidMount() {
    this.timerID = setInterval(() => {
      this.setState({
        date: new Date(),
      })
    }, 1000)
  }
  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  render() {
    ...
  }
}
```

#### 正确使用 state

- 不能直接修改 `State`，否则不会重新渲染组件，要使用 `this.setState`
- 不能直接依赖 this.props 和 this.state 来更新状态，因为他们的更新可能会异步；如果非要这样做，要使用函数的形式

```jsx
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
})
// Correct
this.setState((state, props) => ({
  counter: state.counter + 1,
}))
```
