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
