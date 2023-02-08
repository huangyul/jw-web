let a = 1
let b = { num: 1 }

setTimeout(() => {
  a = 2
  b = { num: 2 }
}, 200)

module.exports = {
  a,
  b,
}
