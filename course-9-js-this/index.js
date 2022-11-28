var a = 15,
  b = 15

with ({ a: 20 }) {
  var a = 30,
    b = 30
  console.log(a)
  console.log(b)
}

console.log(a)
console.log(b)
