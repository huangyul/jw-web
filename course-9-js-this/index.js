var name = 'the window'
var obj = {
  name: 'obj',
  getName: function () {
    return function () {
      console.log(this.name)
    }
  },
}
obj.getName()()