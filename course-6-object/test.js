function Parent(name, age) {
  this.name = name
  this.age = age
  Parent.prototype.say = function () {
    console.log(this.name)
  }
}

function Child(id) {
  Parent.apply(this, Array.from(arguments).slice(1)) // 构造函数继承
  this.id= id
}

// 原型链继承
Child.prototype = new Parent()
Child.prototype.construtor = Child