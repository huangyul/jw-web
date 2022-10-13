function Person(name) {
  this.name = name
}

function _new() {
  const obj = new Object()

  let FunctionConstructor = [].shift.call(arguments) // 取出第一个参数，即构造函数
  obj.__proto__ = FunctionConstructor.prototype

  let resultObj = FunctionConstructor.apply(obj, arguments)

  return typeof resultObj === 'object' ? resultObj : obj
}

const p1 = _new(Person, 'xxx')
console.log(p1)
