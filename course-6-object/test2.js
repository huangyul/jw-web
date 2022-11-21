function Parent(name) {
  this.name = name
}

Parent.prototype.say = function () {
  console.log(this.name)
}

function Child() {
  Parent.apply(this, Array.from(arguments))
}

Child.prototype = new Parent()
Child.prototype.constructor = Child

const c = new Child('xxx')
const c2 = new Child('xxx')
console.log(c.say)
