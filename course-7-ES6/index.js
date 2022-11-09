const person = {
  name: 'xxx',
  getName: function () {
    return this.name
  },
  say: () => {
    return this.name
  },
}
const person2 = {
  name: 'yyy',
}
console.log(person.getName()) // xxx
console.log(person.getName.apply(person2)) // yyy

console.log(person.say()) // undefined window.name
console.log(person.say.apply(person2))
