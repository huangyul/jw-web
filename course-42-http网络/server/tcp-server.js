const net = require('net')

const HOST = '127.0.0.1'
const PORT = 7777

// 创建一个TCP服务器实例，调用listen函数监听指定端口和IP
// net.createServer()有一个参数，监听连接建立的回调
net
  .createServer((socket) => {
    const remoteName = `${socket.remoteAddress}:${socket.remotePort}`
    console.log(`${remoteName}连接到本服务器`)

    // 接收信息
    socket.on('data', (data) => {
      console.log(`${remoteName} - ${data}`)
      // 给客户端发送消息
      socket.write(`你发送的消息是 ${data}`)
    })

    // 关闭
    socket.on('close', (data) => {
      console.log(`${remoteName}连接关闭`)
    })
  })
  .listen(PORT, HOST)

console.log(`Server listening on ${HOST}:${PORT}`)
