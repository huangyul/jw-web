# React 路由

## 底层核心原理

### history

`html5` 新增的 `api`，主要有两个

- `history.pushState(state, title, url)` 推入一个
- `history.replaceState(state, title, url)` 替换一个，没有返回

三个参数：

- `state`：新地址的状态对象（刷新页面不会丢失）
- `title`：新页面的 `title`，但很多浏览器都忽略这个值，一般用 `null`
- `url`：要跳转的 `url`

相同点：都不会刷新页面，也不会发生真正的跳转

### hash

基于 location.hash = pathString 来更新网站路径，pathString 就是#后面直到 search 的部分

## vue-router

### vue.use

要通过 `vue.use` 注册的插件，必须暴露一个 `install` 方法

```js
import Modal from './modal.vue'
class MyModal = {
  install(vue) {
    // 全局注册一个自定义组件（通过相同原理可注册routerview和routerlink）
    vue.component('ModalView', Modal)
  }
}
```

### install

vue-router 主要做了下列的事

```js
class router {
  // 1. 暴露install方法
  static install(Vue) {
    // 2. install接收vue作为参数
    // 3. install只执行一次
    if(install.installed && _Vue = Vue) return
  }

  // 4. 使用vue.mixin(因为这样可以使用到vue的生命周期)，完成router的配置
  Vue.mixin({
    beforeCreate() {},
    destroyed() {}
  })

  // 5. 定义全局$router和$route方法
  Object.defineProperty(Vue.prototype, '$router', {
    get() {return this._routerRoot._router}
  })
  Object.defineProperty(Vue.prototype, '$router', {
    get() {return ...}
  })

  // 6. 注册routerview和routerlink组件
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

}
```
