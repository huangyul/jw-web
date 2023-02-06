define('a', ['lodash'], function (__) {
  console.log('module a load')

  return {
    str: function () {
      console.log('a module run')
      return __.repeat('>>>>>>>', 20)
    },
  }
})
