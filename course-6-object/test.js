function Parent(name, age) {
  this.name = name
  this.age = age
  Parent.prototype.say = function () {
    console.log(this.name)
  }
}

function Child(id) {
  Parent.apply(this, Array.from(arguments).slice(1)) // 构造函数继承
  this.id = id
}

// 原型链继承
// 使用中间的桥梁，使用空函数调用就不会有关系
function TempFunction() {}
TempFunction.prototype = Parent.prototype
Child.prototype = new TempFunction()

// es 6的写法
// Child.prototype = Object.create(Parent.prototype)

Child.prototype.construtor = Child
