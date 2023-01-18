const fs = require('fs')
const path = require('path')

const res = fs.createReadStream(path.resolve(__dirname, './index.txt'), {
  highWaterMark: 11,
})
res.setEncoding('utf8')
let data = ''
res.on('data', function (chunk) {
  console.log(chunk) // <Buffer e6 9d 8e e7 bb 85 e3 80 8a e6 82>
  data += chunk
})
res.on('end', function () {
  console.log(data)
})
