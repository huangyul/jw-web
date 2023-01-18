const fs = require('fs')
const zlib = require('zlib')
const path = require('path')

fs.createReadStream(path.resolve(__dirname), './index.txt')
  .pipe(zlib.createGzip()) // 使用管道可以对流进行处理
  .pipe(fs.createWriteStream('index.txt.gz'))
