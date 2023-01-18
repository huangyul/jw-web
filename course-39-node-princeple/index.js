const fs = require('fs')
const path = require('path')

const res = fs.createReadStream(path.resolve(__dirname, './README.md'))
let data = ''
res.on('data', function (chunk) {
  data += chunk
})
res.on('end', function () {
  console.log(data)
})
