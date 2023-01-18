# node 原理解析

## Buffer/Stream/Events

### Buffer

是 node api 的一部分，主要用来处理二进制文件流和 TCP 流的文件缓存区

优势：使用堆外空间

#### api

```js
import Buffer from 'Buffer'
Buffer.alloc(size)

// 默认使用
const buf1 = Buffer.alloc(10)

// 不预设初始值
const buf2 = Buffer.alllocUnsafe(10) // 不安全，但速度快
```

##### 使用 buffer base64 读取文件

```js
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
```

##### 可读流

```js
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
```

###### 乱码的产生

```js
const fs = require('fs')
const path = require('path')

const res = fs.createReadStream(path.resolve(__dirname, './index.txt'), {
  highWaterMark: 11,
})
let data = ''
res.on('data', function (chunk) {
  console.log(chunk) // <Buffer e6 9d 8e e7 bb 85 e3 80 8a e6 82>
  data += chunk
})
res.on('end', function () {
  console.log(data)
})
```

上面使用了 highWaterMark 限定了最大的字节为 11，然后汉字的是 3 位一个汉字，造成了第四个汉字截断的时候，会出现乱码

解决方法：

1. 设定编码方式：setEnCoding()

```js
res.setEncoding('utf8')
```

### Stream 流

#### 类型

- 可读流
- 可写流
- duplex：可读可写
- transform：可以是可读可写

#### 在管道中间对流进行处理

```js
const fs = require('fs')
const zlib = require('zlib')
const path = require('path')

fs.createReadStream(path.resolve(__dirname), './index.txt')
  .pipe(zlib.createGzip()) // 使用管道可以对流进行处理
  .pipe(fs.createWriteStream('index.txt.gz'))
```

#### 优势

- 使用流就是使用堆外空间
- 不会被垃圾回收
