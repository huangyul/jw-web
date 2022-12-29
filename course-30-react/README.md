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

### 事件处理

语法：

- `React` 事件的命名采用小驼峰，而不是纯小写
- 使用 `JSX` 语法时需要传入一个函数作为事件处理函数

```jsx
<button onClick={handleClick}>button</button>
```

#### this

在使用 class 语法定义一个组件时，默认不会绑定 this，需要在构造函数绑定一下，也可以使用箭头函数

```jsx
class Toggle extends Component {
  constructor(props) {
    super(props)
    this.state = { isToggleOn: true }
    // 绑定一下方法
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    this.setState((state) => ({
      isToggleOn: !state.isToggleOn,
    }))
  }
  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    )
  }
}
```

#### 向事件处理程序传递参数

- 使用箭头函数，必须要显示传递事件对象 `e`
- 使用 `bind` 的方式，事件对象以及更多的参数将会被隐式进行传递

```jsx
<button onClick={(e) => this.deleteRow(id, e)}></button>
<button onClick={this.deleteRow.bind(this, id)}></button>
```

### 条件渲染

一般都是使用 if 或运算符进行判断 z

```jsx
// 第一种方式
if (this.xxx) {
  return <h1>xxx</h1>
} else {
  return <h1>aaaa</h1>
}

// 第二种
this.xxx > 0 && <h2>xxxx</h2>

// 第三种
this.xxx ? <h1>xxx</h1> : <h2>xxxx</h2>
```

如果需要不渲染组件，可以返回 `null`

```jsx
function ComponentA(props) {
  if (!props.xxx) {
    return null
  }
}
```
