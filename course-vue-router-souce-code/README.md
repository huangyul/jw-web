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
