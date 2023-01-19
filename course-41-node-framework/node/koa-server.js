const Koa = require('koa')
const app = new Koa()

app.use((ctx) => {
  ctx.response = 123
})

app.listen(3000)
