class BaseRouter {
  constructor() {
    this.routes = {}

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
