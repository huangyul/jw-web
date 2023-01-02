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

- 当 `React` 元素为用户自定义组件时，它会将 `JSX` 所接收的属性（attributes）以及子组件（children）转换为单个对象传递给组件，这个对象就是 `props`
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

一般都是使用 if 或运算符进行判断

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

### 列表 & Key

使用函数遍历生成标签

```jsx
function ItemList(props) {
  const numbers = [1, 2, 3, 4]
  const liList = numbers.map((i) => <li>{i}</li>)
  return <ul>{liList}</ul>
}
```

#### Key

- 使用 `Key` 可以帮助 `React` 识别哪些元素改变了
- 一般使用数据中的 `id`，万不得已才使用 `index`，因为使用 `index` 会导致性能变差，还会引起组件状态的问题
- `key` 在兄弟节点必须唯一，其他情况可以不唯一，也就是每次遍历保证唯一即可

### 表单

#### 受控组件和非受控组件

- 受控组件：表单的 `value` 通过 `state` 来维护，统一使用 `setState（）`来更新
- 非受控组件：`value` 通过 `input` 标签自己维护，使用 re`f 来获取

### 状态提升

将子组件中的 `state` 和方法都移到父组件上，进行统一管理

```jsx
// 子组件中
class ComA extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(event) {
    this.props.onSomethingChange(e.target.value)
  }
}
// 父组件中
class ComB extends Component {
  constructor(props) {
    super(props)
    this.state = {value: ''}
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(value) {
    // doSomething
    this.setState({
      value: value
    })
  }
  render() {
    return (
      <ComA value={this.state.value} onSomethingChange={this.handleChange}>
    )
  }
}
```

### 组合 vs 继承

#### 包含关系（相当于插槽）

```jsx
function WelcomeDialog(props) {
  return (
    <div>
      {/* 默认插槽 */}
      {props.children}
      {/* 具名插槽 */}
      {props.scopeName}
    </div>
  )
}

;<WelcomeDialog scopeName={<div>具名插槽</div>}>
  <div>默认插槽</div>
</WelcomeDialog>
```

#### 使用 Props 和组合定制组件

```jsx
// 开发一个通用的组件
class ComA extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div>
        <div className="title">{this.props.title}</div>
        <div className="content">{this.props.children}</div>
      </div>
    )
  }
}
```

## HOOK

Hook 是一些可以让你在函数组件中钩入 React State 及生命周期的函数

### 基本使用

```jsx
function Com() {
  // 定义一个变量count，初始值为0，定义一个方法修改它
  const [count, setCount] = useState(0)
  return (
    <div>
      {count}
      <button
        onClick={() => {
          setCount(count++)
        }}
      ></button>
    </div>
  )
}
```

### Effect Hook

useEffect 就是给函数组件增加操作副作用的能力（就是 vue 中的 watch）

```jsx
function Com() {
  const [count, setCount] = useState()

  useEffect(() => {
    document.title = `点击了${count}次`

    // 使用return函数消除副作用
    return () => {
      // dosomething
    }
  }, [count])
}
```

### HOOK 使用规则

- 只能在函数最外层调用Hook，不要在循环、条件判断或者子函数中调用
- 只能在React的函数组件中调用Hook

### 自定义hook

要实现组件之间的复用逻辑，可以自定义hook，将共用的逻辑抽离出来
