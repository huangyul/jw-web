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

## 常见错误和性能问题

### 异步过程使用单例的 event 对象

```jsx
class App extends Component {
  render() {
    function handleBtn1(e) {
      setTimeout(() => {
        console.log('button1', e.currentTarget.innerText)
      }, 1000)
    }
    function handleBtn2(e) {
      console.log('button2', e.currentTarget.innerText)
    }
    return (
      <div className="App">
        <div className="App-header">
          <button onClick={handleBtn1}>button1</button>
          <button onClick={handleBtn2}>button1</button>
        </div>
      </div>
    )
  }
}
```

为什么点击 button1 会报错：

- 所有 react 的绑定事情都是通过 react 处理过的，返回的 evnet 是 react 处理过的 event，可能是单个实例上的，是共享的，会被改变
- 使用异步的时候，event 可能已经被上一个改变了，所以一般会保存一下当前的 event

### 重新渲染的情况

例如将事件传到子组件上时，一般需要使用 bind 绑定 this，使用父组件的 this，但是这样每次传到子组件都是一个新的实例，会造成重新渲染，有性能问题。

解决方法：

```jsx
// 父组件
class FatherComponent extends Component {
  constructor() {
    this.fun1 = this.fun1.bind(this)
  }
  fun1() {
    // do something
  }

  render() {
    return <ChildComponent fun1={this.fun1}></ChildComponent>
  }
}

// 子组件
class ChildComponent extends Component {
  shouldComponentUpdate(next) {
    const prev = this.props
    // 判断是否需要重新渲染
    if (next.fun1 === prev.fun1) {
      return false
    } else {
      return true
    }
  }
}
```

### immer 和 immutable

主要是为了切断变量值之间的互相引用，但是没有改变的变量保持引用，不重新渲染，提高性能

> 为什么不使用深拷贝；因为使用深拷贝断绝引用，就无法判断父组件和子组件之间的引用关系

使用 immer 和 immutable

```jsx
const { fromJS } = require('immutable')

const a = {
  key1: {
    key1key1: 'valuekey1',
  },
  key2: {
    key2key2: 'valuekey2',
  },
}

const a = fromJS(data)

b = a.set('key1', 123)

// 此时改变了key1的引用，但还是能保持key2的引用没有断掉
```

## 文档学习补充

### JSX

1. 表达式的使用：{变量}
2. 大括号（{}）是用来表达绑定的变量，引号是用来指定字符串字面量

### 元素渲染

react 元素是普通对象，react DOM 负责更新 DOM

react 只更新它需要更新的部分，并不会完全把 dom 更新

### 组件&Props

两种声明方式：

```jsx
// 函数组件
function Welcome() {
  return <h1>Hello</h1>
}

// class组件
class Welcome2 extends Component {
  render() {
    return <h1>Hello2</h1>
  }
}
```

Props 的只读性：  
无论使用函数声明或 class 声明，都不能改变自身的 props

### State & 生命周期

state 是组件私有的属性，等同于 vue 中的 data

使用方式：

```jsx
class ComponentA extends Component {
  constructor(props) {
    super(props)
    this.state = { time: 'xxx' }
  }
}
```

生命周期：

- componentDidMount：组件被挂载后
- componentWillUnmount：组件被销毁前

#### 关于 State

1. 不能直接修改 State

```jsx
// 此代码不会重新渲染组件
this.state.a = 'xxx'
// 正确的用法
this.setState({ a: 'xxx' })
```

#### 要根据 props 和 state 的值来更新状态

```jsx
this.setState((state, props) => ({
  counter: state.counter + props.increment,
}))
```

#### State 的更新

```jsx
constructor(props) {
  super(props)
  // 有两个值
  this.state = {
    a: 1,
    b: 2
  }
}

fun1( ){
  this.setState({
    a: 1 // 设置a，会完全替换了a，但b会完整保留
  })
}
```

### 事件处理

- 事件的命名采用小驼峰时
- 使用 `JSX` 语法时需要传入一个函数作为事件处理函数，而不是一个字符串

```jsx
fun1() {}

<div onClick={fun1}></div>
```

#### 注意 this

```jsx
class Todo extends Component {
  construtor(props) {
    super(props)
    // 方法1：
    this.fun1 = this.fun1.bind(this)
  }
  fun1() {
    // do something
  }

  // 方法2：实验性语法，需要借助插件
  fun2 = () => {
    // do something
  }
}
```

### 条件渲染

#### 可以使用 if 运算符去创建元素来表现状态

```jsx
function UserGreeting(props) {
  return <h1>Welcome back</h1>
}
function GuestGreeting(props) {
  return <h1>Please sign up</h1>
}
function Greeting(props) {
  const isLogin = props.isLogin
  if (isLogin) {
    return <UserGreeting />
  } else {
    return <GuestGreeting />
  }
}
```

#### 使用一个变量来进行条件渲染

```jsx
class LoginControl extends Component {
  constructor(props) {
    super(props)
    this.handlerLogin = this.handlerLogin.bind(this)
    this.handlerLogout = this.handlerLogout.bind(this)
    this.state = {
      isLogin: false,
    }
  }

  handlerLogin() {
    this.setState({
      isLogin: true,
    })
  }
  handlerLogout() {
    this.setState({
      isLogin: false,
    })
  }

  render() {
    const button = this.state.isLogin ? (
      <LogoutButton onClick={this.handlerLogout}></LogoutButton>
    ) : (
      <LoginButton onClick={this.handlerLogin}></LoginButton>
    )
    return button
  }
}
```

#### 阻止条件渲染

可以将 `render` 函数返回 `null`

### 列表和 key

#### 基础渲染多个组件

```jsx
const numbers = [1, 2, 3, 4]
const listItem = numbers.map((item) => <li>{item}</li>)
```

#### 封装

```jsx
function ItemList(props) {
  const listItem = props.numbers.map((item) => (
    <li key={item.toString()}>{item}</li>
  ))
}
```

#### Key

key 帮助 react 识别那些元素改变了，但最好不要使用 index，会导致性能变差和引起组件状态的问题
