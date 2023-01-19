const http = require('http')
const fs = require('fs')

http
  .createServer((req, res) => {
    // res.writeHead(200, { 'Content-Type': 'Text/plain' })
    // res.end('http response success')
    fs.readFile('./index.html', (err, data) => {
      if (err) {
        console.log(err)
      } else {
        res.writeHead(200, { 'Content-Typ': 'text/html' })
        res.end(data, 'binary')
      }
    })
  })
  .listen(9000)

console.log('http server start')
