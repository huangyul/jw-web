const fs = require('fs')
const path = require('path')
function promisify(func) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      args.push(function (err, result) {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
      return func.apply(func, args)
    })
  }
}

const readFileAsync = promisify(fs.readFile)

readFileAsync(path.resolve(__dirname, 'README.md'), 'utf-8')
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })
