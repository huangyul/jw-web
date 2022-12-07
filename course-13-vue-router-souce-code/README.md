# Vue 路由及异步组件

## 前端路由

特点：

- 页面的交互不会刷新页面
- 加载过的公共资源，无需重复加载

## 前端路由原理及其表现

vue -> hash, history
react -> hase, history

1. 页面间的交互不会刷新页面
2. 不同 url/路径/路由，会渲染不同的内容

Hash 和 history 的区别

- hash 有#，history 没有
- hash 的#部分不会传给服务端，history 所有的 url 内容服务的都可以获取到
- history 路由，应用部署的时候，需要注意 html 文件的访问
- hash 通过 hashchange 监听变化，history 通过 popstate 监听变化

### Hash

#### 特性

1. url 中带有一个#，#只是客户端的状态，不会传递给服务器端
2. hash 值的改变，不会刷新页面
3. hash 值的更改，会在浏览器访问历史中添加一条记录
4. hash 值的更改，会触发 hashchange

```js
location.hash = '#aaa'

window.addEventListener('hashchange', () => {})
```

5. 如何更改 hash
   5.1 location.href = '#aaa'
   5.2 <a href="#user"></a>

### History

常见 api

```js
window.history.back() // 后退
window.history.forward() // 前进
window.history.go(n) // 前进或后端n步
window.history.pushState() // location.href  页面的浏览记录里会添加一个历史记录
window.history.replaceState() // location.replace 替换当前的历史记录
```

#### pushState / replaceState 的参数

window.history.pushState(null, null, path)

1. state，是一个对象，是一个与指定网址相关的对象，一般不会用
2. title，新页面的标题。
3. url 页面的新地址

#### 面试题

1. pushState 时，会触发 popState 事件吗

答案：不会，pushState 和 replaceState 都不会触发，需要手动触发页面的重新渲染
popState 的触发情况

- 点击浏览器的后退按钮
- 点击前进
- js back
- js forward
- js go

#### nginx 配置

1. index.html 存在服务器本地

www.xxx.com/main/

无论
www.xxx.com/main/a
www.xxx.com/main/b
都指向 index.html

```nginx
location /main/ {
  try_files $uri $uri/ /home/dist/index.html
}
```

2. index.html 存在于远程地址 即 index.html 不在服务器上

www.xxx.com/main/a

// 存到
www.bbb.com/file/index.html

```nginx
location /main/ {
  rewrite ^ /file/index.html break;
  proxy_pass https://www.bbb.com;
}
```

## 实现 hash 路由跳转

```js
class BaseRouter {
  constructor() {
    this.routes = {}
    this.initPath(location.pathname)
    this.bindPopState()
  }

  route(path, callback) {
    this.routes[path] = callback || function () {}
  }

  initPath(path) {
    // 初始化的时候也要执行一下方法，但是不应该使用pushstate，因为不应该再推入一个
    window.history.replaceState(null, null, path)

    const cb = this.routes[path]
    if (cb) cb()
  }

  go(path) {
    window.history.pushState(null, null, path)
    const cb = this.routes[path]
    if (cb) {
      cb()
    }
  }

  // 首次加载时
  bindPopState() {
    window.addEventListener('popState', (e) => {
      const path = e.state && e.state.path
      this.routes[path] && this.routes[path]()
    })
  }
}

const router = new BaseRouter()

const body = document.querySelector('body')

function changeBgColor(color) {
  body.style.backgroundColor = color
}

router.route('/', () => {
  changeBgColor('white')
})

router.route('/gray', () => {
  changeBgColor('gray')
})

router.route('/green', () => {
  changeBgColor('green')
})

// 1. 阻止a标签的默认行为,因为a标签的默认点击相当于 location.href
const container = document.querySelector('.container')
container.addEventListener('click', (e) => {
  if (e.target.tagName == 'A') {
    e.preventDefault()
    // 2. 使用自己的方法去跳转
    router.go(e.target.getAttribute('href'))
  }
})

```

## 实现history路由