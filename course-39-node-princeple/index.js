class MyEventEmitter {
  constructor() {
    this.events = {}
  }

  // 绑定事件
  on(event, cbFn) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(cbFn)
    return this
  }

  // 解绑事件
  off(event, cbFn) {
    if (this._events[type]) {
      this._events[type] = this._events[type].filter((fn) => {
        return fn != cbFn
      })
    }
  }
}
