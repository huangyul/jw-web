const http = require('http')

const proxy = http.createServer((req, res) => {
  res.end('hello world')
})
proxy.listen(8888, '127.0.0.1', () => {
  console.log('serve start')
})
