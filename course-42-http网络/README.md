# Node 网络 & HTTP & 部署

## 网络

### TCP/IP 网络协议

第七层：应用层：为操作系统或网络应用程序提供访问网络服务的接口。协议：HTTP，hTTPS，SMTP（邮件），POP3，SSH（服务器登陆）
第六层：表示层：把数据转换为接收者能接收的内容，比如加密，压缩，格式转换等等
第五层：会话层：负责数据传输中维持网络设备之间的通信连接
第四层：传输层：把传输表头加到数据上形成数据包，完成到端的数据传输，协议：TCP UDP
第三层：网络层 负责对子网间的数据包进行寻址和路由先择 协议：IP
第二层：数据链路层（平时基本基础不到）：物理地址寻址
第一层：物理层（平时基本基础不到）在局域网上进行数据传输，电脑通信设备与网络媒体之间的互通

1. 牛客网视频面试采用什么协议？TCP？UDP？
   答：UDP，因为对校验性底，速度更快
2. 路由器在哪一层？
   答：网络层（交换机在数据链路层）
3. html 在哪一层
   答：应用层
4. 协议是什么？
   答：定义了每一层的作用是什么，职责是什么，类似与规范和约束
5. TCP/IP 协议具体是什么？
   答：大多数指的是互联网通信所需的协议，是一个以 TCP、IP 协议为核心的协议族，包括 HTTP、SMTP、等
6. TCP/IP 参考模型（4 层）
   答：一共 4 层， 是一个抽象分层模型
7. 我们常说的数据包是什么？
   答：网络层及以上分层中包的单位
   每个分层都会对发送的数据添加一个首部，首部包含该层协议相关的信息，而真正要发送的内容称之为数据
   也就是每个数据包都有**首部+数据**组成
   而对于下层来说，上层发送过来的全部内容，都会当作本层的数据
8. 每层在接收到数据后除了添加⾸部, 还要做什么呢?
   答：
   用户 1

   - 传输层：通过添加 TCP 首部，保证数据的可靠传输
   - 网络层：参考路由控制表，决定接收此 IP 包的路由和主机
   - 数据链路层：将生成的包通过物理层传输到接收端
     用户 2
   - 数据链路层：接收到数据后，判断数据是否发给自己，MAC 地址
   - 网络层：从首部里判断 IP 是否和自己当前 IP 匹配
   - 传输层：检查端口，一台主机可以通过端口起很多个服务，通过这个来看是哪个服务接收

   总结一下

   - 数据链路层的 MAC 地址，是用来识别同一链路中不同计算机
   - 网络层的 IP 地址，用来识别 TCP/IP 网络中互连的主机和路由器
   - 传输层的端口号，用来识别同一台计算机中进行通信的不同应用程序

9. 通过上面三个地址可以识别一次通信吗？
   答：不可以。
   需要以下的几个数据
   - IP 首部：源 IP 地址
   - IP 首部：目标 IP 地址
   - 协议号：TCP 或者 UDP
   - TCP 首部：源端口号
   - TCP 首部：目标端口号
10. 我们常说的 TCP/UDP 的区别是什么？分别适合用在什么场景

    - UDP 是无连接的，TCP 必须三次握手
    - UDP 是面向报文的，没有拥塞控制，速度快，适合多媒体通信要求，比如即时聊天，一对一，一对多，多对一，多对多等等
    - TCP 只能是一对一的可靠性传输

    常见的直播，其实是基于 TCP，希望能提供稳定可靠的直播环境

11. TCP 通过什么方式提供可靠性
    - 超时重发，发出报文段要是没有收到及时的确认，就重发
    - 数据包的校验，也就是校验首部数据和
    - 对失序的数据重新排序
    - 进行流量控制，防止缓冲区溢出
    - 快重传和快恢复
    - TCP 会将数据截断为合理的长度
12. TCP 如何控制拥塞
    防止过多数据涌入造成路由器或链路过载
    发送方要维持一个拥塞窗口，就是一个状态变量
    ssthresh 慢开始门限

### IP

#### IP 地址

IP 地址（IPv4 地址）由 32 位正整数来表示，在计算机内部以⼆进制⽅式被处理。⽇常⽣活中，我们将 32 位的 IP 地址以每 8 位为⼀组，分成 4 组，每组以 “.” 隔开，再将每组数转换成⼗进
制数
IP 地址包含⽹络标识和主机标识, ⽐如 172.112.110.11
172.112.110 就是⽹络标识, 同⼀⽹段内⽹络标识必须相同
11 就是主机标识, 同⼀⽹段内主机标识不能重复

#### DNS

domain name system

客户端发送查询报⽂”query zh.wikipedia.org”⾄ DNS 服务器，DNS 服务器⾸先检查⾃身缓
存，如果存在记录则直接返回结果。
如果记录⽼化或不存在，则：
DNS 服务器向根域名服务器发送查询报⽂”query zh.wikipedia.org”，根域名服务器返回顶级
域 .org 的顶级域名服务器地址。
DNS 服务器向 .org 域的顶级域名服务器发送查询报⽂”query zh.wikipedia.org”，得到⼆级
域 .wikipedia.org 的权威域名服务器地址。
DNS 服务器向 .wikipedia.org 域的权威域名服务器发送查询报⽂”query zh.wikipedia.org”，
得到主机 zh 的 A 记录，存⼊⾃身缓存并返回给客户端。

### 通过 node 创建 TCP 服务

Socket，套接字，是应用层和传输层之间的抽象层，把 TCP/IP 复杂的操作抽象位几个简单的接口，供应用层调用，比如：create，listen，coonnect，read，write

- http：应用层模块，主要按照特定协议编码解码数据
- net：传输层模块，主要负责传输编码后的应用层数据
- https：是个综合模块（涵盖了 http/tls/crypto），主要用于确保数据安全性

1. 创建 TCP 服务端

```js
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
```

2. 创建 TCP 客户端

```js
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
```
