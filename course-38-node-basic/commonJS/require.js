const vm = require('vm')
const path = require('path')
const fs = require('fs')

// 自定义require函数
function r(filename) {
  // 获取文件路径
  const fileToFile = path.resolve(__dirname, filename)

  // 获取文件内容
  const content = fs.readFileSync(fileToFile, 'utf-8')
 
  const wrapper = ['(function(require, module, exports, testparams) {', '})']

  const wrapperContent = wrapper[0] + content + wrapper[1]

  // 执行文件内容里的可执行代码，将字符串变成可执行代码
  const script = new vm.Script(wrapperContent, {
    filename: 'index.js',
  })
  const module = {
    exports: {},
  }

  const result = script.runInThisContext()
  // 因为文件里面也会有require
  result(r, module, module.exports, '你好')
  return module.exports
}

global.r = r
