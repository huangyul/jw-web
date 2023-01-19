const net = require('net')

// 要连接到哪里
const HOST = '127.0.0.1'
const PORT = 7777

const client = new net.Socket()
const SERVER_NAME = `${HOST}:${PORT}`

let count = 0
client.connect(PORT, HOST, () => {
  console.log(`成功连接到${SERVER_NAME}`)

  // 向服务器发送数据
  const timer = setInterval(() => {
    if (count > 10) {
      client.write('我没事了，告辞')
      clearInterval(timer)
      return
    }
    client.write('客户端发送消息' + count++)
  }, 1000)
})

// 接收信息
client.on('data', (data) => {
  console.log(`${SERVER_NAME} - ${data}`)
})

// 关闭事件
client.on('close', () => {
  console.log('客户端关闭')
})

client.on('error', (error) => {
  console.log(error)
})
