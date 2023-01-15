const fs = require('fs')
const path = require('path')
// error first
fs.readFile(
  path.resolve(__dirname, 'README.md'),
  'utf-8',
  // err永远是第一个参数
  function (err, result) {
    if (err) {
      console.log('error')
      return err
    }
    console.log('1')
    console.log(result)
  }
)

const ctx = fs.readFileSync(path.resolve(__dirname, 'README.md'), 'utf-8')
console.log(ctx)
