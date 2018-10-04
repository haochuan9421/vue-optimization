var express = require('express')
var app = express()

// 开启gzip压缩,如果你想关闭gzip,注释掉下面两行代码，重新执行`node server.js`
var compression = require('compression')
app.use(compression())

app.use(express.static('dist'))
app.listen(3000,function () {
  console.log('server is runing on http://localhost:3000')
})