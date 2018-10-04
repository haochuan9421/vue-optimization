# vue-optimization

> 本项目意在通过不同的分支展示不同的**优化**方式，对`vue`项目**性能**的影响，探索`vue`开发中有**显著效果**的**可行性**优化方案(尽可能不改动业务代码)。你可以切换分支，查看`git`历史，通过比对文件变化，来了解实现的具体细节。

### 当前分支 —— gzip

### 1. 如何开启`gzip`压缩
开启`gzip`的方式主要是通过修改服务器配置，以`nginx`服务器为例，下图是，使用同一套代码，在仅改变服务器的`gzip`开关状态的情况下的`Network`对比图

未开启`gzip`压缩：

![](https://user-gold-cdn.xitu.io/2018/10/3/16639bde96df90f7?w=3276&h=1562&f=png&s=460674)

开启`gzip`压缩：

![](https://user-gold-cdn.xitu.io/2018/10/3/16639be02f49a749?w=3276&h=1562&f=png&s=459676)

开启`gzip`压缩后的响应头

![](https://user-gold-cdn.xitu.io/2018/10/3/16639be18727ed8c?w=3276&h=1562&f=png&s=535866)

从上图可以明显看出开启`gzip`前后，文件大小有三四倍的差距，加载速度也从原来的7秒多，提升到3秒多

附上`nginx`的配置方式
```bash
http {
  gzip on;
  gzip_static on;
  gzip_min_length 1024;
  gzip_buffers 4 16k;
  gzip_comp_level 2;
  gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php application/vnd.ms-fontobject font/ttf font/opentype font/x-woff image/svg+xml;
  gzip_vary off;
  gzip_disable "MSIE [1-6]\.";
}
```

### 2. 前端能为gzip做点什么

我们都知道`config/index.js`里有一个`productionGzip`的选项，那么它是做什么用的？我们尝试执行`npm install --save-dev compression-webpack-plugin@1.x`,并把`productionGzip`设置为`true`，重新`build`，放在`nginx`服务器下，看看有什么区别：

![](https://user-gold-cdn.xitu.io/2018/10/3/16639be2f23b2880?w=1858&h=810&f=png&s=567648)

![](https://user-gold-cdn.xitu.io/2018/10/3/16639be47d87b613?w=3276&h=1562&f=png&s=456291)

我们会发现构建之后的文件多了一些`js.gz`和`css.gz`的文件，而且`vendor.js`变得更小了，这其实是因为我们开启了`nginx`的`gzip_static on;`选项，
如果`gzip_static`设置为`on`,那么就会使用同名的`.gz`文件，不会占用服务器的CPU资源去压缩。

### 3. 前端快速搭建基于`node`的`gzip`服务

无法搭建`nginx`环境的前端小伙伴也可以按如下步骤快速启动一个带`gzip`的`express`服务器

1. 执行`npm i express compression`
2. 在项目根目录下新建一个`serve.js`,并粘贴如下代码
  ```js
    var express = require('express')
    var app = express()

    // 开启gzip压缩,如果你想关闭gzip,注释掉下面两行代码，重新执行`node server.js`
    var compression = require('compression')
    app.use(compression())

    app.use(express.static('dist'))
    app.listen(3000,function () {
      console.log('server is runing on http://localhost:3000')
    })
  ```
3. 执行`node server.js`

`express`开启`gzip`的响应头：

![](https://user-gold-cdn.xitu.io/2018/10/3/16639be5c4964fca?w=1460&h=854&f=png&s=161059)
