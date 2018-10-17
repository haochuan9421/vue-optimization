# vue-optimization

> 本项目意在通过不同的分支展示不同的**优化**方式，对`vue`项目**性能**的影响，探索`vue`开发中有**显著效果**的**可行性**优化方案(尽可能不改动业务代码)。你可以切换分支，查看`git`历史，通过比对文件变化，来了解实现的具体细节。

> 注意！！！预渲染需要下载 `Chromium` ，而由于你懂的原因，谷歌的东西在国内无法下载，所以在根目录添加了`.npmrc`文件，来使用淘宝镜像下载。[参考链接](https://github.com/cnpm/cnpmjs.org/issues/1246)。如果你的终端可以翻到国外，直接忽略这一步,你也许会喜欢[小飞机](https://juejin.im/post/5b6852b1f265da0fb0189174)

### 当前分支 —— prerender(预渲染)

大家都是知道：常见的`vue`单页应用构建之后的`index.html`只是简单一个空白页面，当所以需要的`js`下载完毕之后，才会开始解析并创建`vnode`,然后再渲染出真实的`DOM`。当这些`js`文件过大而网速又很慢或者出现意料之外的报错时，就会出现所谓的白屏，相信做`vue`开发的小伙伴们一定都遇到过这种情况。而且单页应用还有一个很大的弊端就是对`SEO`很不友好。那么如何解决这些问题呢？—— `SSR`当然是很好的解决的方案，但这也意为着一定的学习成本和运维成本，而如果你已经有了一个现成的`vue`单页应用，转向`SSR`也并不是一个无缝的过程。那么[预渲染](https://github.com/chrisvfritz/prerender-spa-plugin)就显得更加合适了。它只是一个`webpack`的插件，它并不需要你对代码做大量修改，你只需要少量的代码改动 + 一些简单的`webpack`配置就可以解决上述的两个问题。

### 如何将单页应用转为预渲染

1. 你需要将`router`设为`history`模式，并相应的调整服务器配置，[并不复杂](https://router.vuejs.org/zh/guide/essentials/history-mode.html)。
2. `npm i prerender-spa-plugin --save-dev`
3. 在`build/webpack.prod.conf.js`下添加如下配置(没有路由懒加载的情况)
  ```js
    const PrerenderSPAPlugin = require('prerender-spa-plugin')
    ...
    new PrerenderSPAPlugin({
      staticDir: config.build.assetsRoot,
      routes: [ '/', '/Contacts' ], // 需要预渲染的路由（视你的项目而定）
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        keepClosingSlash: true,
        sortAttributes: true
      }
    })
  ```
4. `config/index.js`里`build`中的`assetsPublicPath`字段设置为`'/'`，这是因为当你使用预渲染时,路由组件会编译成相应文件夹下的`index.html`，它会依赖`static`目录下的文件，而如果使用相对路径则会导致依赖的路径错误，这也要求预渲染的项目最好是放在网站的根目录下。
5. 调整`main.js`
  ```js
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app', true) // https://ssr.vuejs.org/zh/guide/hydration.html
  ```


执行`npm run build`，你会发现，`dist`目录和以往不太一样，不仅多了与指定路由同名的文件夹而且`index.html`早已渲染好了静态页面。

![](https://user-gold-cdn.xitu.io/2018/10/4/1663af644b1d8aaf?w=2388&h=1382&f=png&s=628004)

### 效果如何？

和之前一样，我们依然禁用缓存，将网速限定为`Fast 3G`(运行在本地的`nginx`服务器上)。可以看到，在`vendor.js`还没有加载完毕的时候（大概有700多kB），页面已经完整的呈现出来了。事实上，只需要`index.html`和`app.css`加载完毕，页面的静态内容就可以很好的呈现了。预渲染对于这些有大量静态内容的页面，无疑是很好的选择。

![](https://user-gold-cdn.xitu.io/2018/10/4/1663affd8ffe23da?w=3190&h=1592&f=png&s=419806)

### 路由懒加载带来的坑

如果你的项目没有做[路由懒加载](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html),那么你大可放心的按上面所说的去实践了。但如果你的项目里用了，你会发现有`webpackJsonp is not defined`的报错。这个因为`prerender-spa-plugin`渲染静态页面时，也会将类似于`<script src="/static/js/0.9231fc498af773fb2628.js" type="text/javascript" async charset="utf-8"></script>`这样的异步`script`标签添加到生成的`html`的`head`标签内。这会导致它先于`app.js`,`vendor.js`,`manifest.js`（位于`body`底部）执行。（`async`只是不会阻塞后面的`DOM`解析，这并不意味这它最后执行）。而且当这些`js`加载完毕后，又会在`head`标签重复创建这个异步的`script`标签。虽然这个报错不会对程序造成影响，但是最好的方式，还是不要把这些异步组件直接渲染到最终的`html`中。好在`prerender-spa-plugin`提供了`postProcess`选项，可以在真在生成`html`文件之前做一次处理，这里我使用一个简单的正则表达式，将这些异步的`script`标签剔除。本分支已经使用了**路由懒加载**，你可以直接查看`git`历史，比对文件和`base`分支的变化来对你的项目进行相应调整。
```js
  postProcess (renderedRoute) {
    renderedRoute.html = renderedRoute.html.replace(/<script[^<]*src="[^<]*[0-9]+\.[0-9a-z]{20}\.js"><\/script>/g,function (target) {
      console.log(chalk.bgRed('\n\n剔除的懒加载标签:'), chalk.magenta(target))
      return ''
    })
    return renderedRoute
  }
```
除了这种解决方案，还有两种不推荐的解决方案：
1. 索性不使用路由懒加载。
2. 将`HtmlWebpackPlugin`的`inject`字段设置为`'head'`，这样`app.js,vendor.js,manifest.js`就会插入到`head`里，并在异步的`script`标签上面。
但由于普通的`script`是同步的，在他们全部加载完毕之前，页面是无法渲染的，也就违背了`prerender`的初衷，而且你还需要对`main.js`作如下修改，以确保`Vue`在实例化的时候可以找到`<div id="app"></div>`，并正确挂载。
```js
    const app = new Vue({
      // ...
    })
    document.addEventListener('DOMContentLoaded', function () {
      app.$mount('#app')
    })
```
