class Test {
  _name = ''
  constructor(name) {
    this.name = name
  }

  // 静态属性
  static getMyName() {
    return `${this.name}xxxx`
  }
  get name() {
    return this._name
  }

  set name(value) {
    console.log('检测到赋值')
    this._name = value
  }
}

const t = new Test('xxx')
console.log(Test.getMyName())