const fs = require('fs')
const path = require('path')

function base64_encode(file) {
  let bitmap = fs.readFileSync(file)
  return Buffer.from(bitmap).toString('base64')
}

function base64_decode(base64Str, file) {
  let bitmap = Buffer.from(base64Str, 'base64')
  fs.writeFileSync(file, bitmap)
}

let base64str = base64_encode(path.join(__dirname, './README.md'))
console.log(base64str)

base64_decode(base64str, path.resolve(__dirname, 'copy.md'))
