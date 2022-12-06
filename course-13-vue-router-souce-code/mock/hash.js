class BaseRouter {
  constructor() {
    this.routes = {} // 1. 存储path以及callback的对应关系

    this.refresh = this.refresh.bind(this)
    // 2. 首次进入也会加载路由的，也要渲染路由
    window.addEventListener('load', this.refresh)
    // 3. 通过hashchange监听路由的改变
    window.addEventListener('hashchange', this.refresh)
  }

  // 4. 只是存储
  route(path, callback) {
    this.routes[path] = callback || function () {}
  }

  // 刷新页面
  refresh() {
    // 5. 获取当前hash
    const path = `/${location.hash.slice(1)}` || ''
    this.routes[path]()
  }
}

const body = document.querySelector('body')

function changeBgColor(color) {
  body.style.backgroundColor = color
}

const router = new BaseRouter()

router.route('/', function () {
  changeBgColor('white')
})

router.route('/gray', function () {
  changeBgColor('gray')
})

router.route('/green', function () {
  changeBgColor('green')
})
