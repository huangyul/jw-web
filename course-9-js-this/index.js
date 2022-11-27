const obj = {
  a: 1,
  fn: function () {
    console.log(this.a)
  },
}

obj.fn()
const f = obj.fn
f()
