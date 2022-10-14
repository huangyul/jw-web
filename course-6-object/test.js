function Person(name) {
  this.name = name
}

Person.prototype.say = function () {
  console.log(this.name)
}

function Kobe() {}

// 继承
Kobe.prototype = new Person()
