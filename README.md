# vue-optimization

> 本项目意在通过不同的分支展示不同的**优化**方式，对`vue`项目**性能**的影响，探索`vue`开发中有**显著效果**的**可行性**优化方案(尽可能不改动业务代码)。你可以切换分支，查看`git`历史，通过比对文件变化，来了解实现的具体细节。

> `VUE CLI 3` 的优化配置请移步[这里](https://github.com/HaoChuan9421/vue-cli3-optimization)

### 当前分支 —— base(基础版本)

通过`vue-cli@2`生成，只包含最基础的`Vue`三件套 ———— `vue`、`vue-router`、`vuex`以及常用的`element-ui`和`axios`，且只进行简单的使用。直接`build`，不做任何优化处理，作为参考系。

### 构建后文件说明：
1. `app.css`： 压缩合并后的样式文件。
2. `app.js`：主要包含项目中的`App.vue`、`main.js`、`router`、`store`等基础代码。
3. `vendor.js`：主要包含项目依赖的诸如`vuex`，`axios`等第三方库的源码，这也是为什么这个文件如此之大的原因，下一步将探索如何优化这一块，毕竟随着项目的开发，依赖的库也能会越来越多。
4. `数字.js`：以0、1、2、3等数字开头的`js`文件，这些文件是各个路由切分出的代码块，因为我拆分了两个路由，并做了[路由懒加载](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)，所以出现了0和1两个`js`文件。
5. `mainfest.js`：`mainfest`的英文有*清单、名单的意思*，该文件包含了加载和处理路由模块的逻辑

![](https://user-gold-cdn.xitu.io/2018/9/29/16625d3c1cdfa267?w=1890&h=846&f=png&s=317765)

### 禁用缓存，限速为`Fast 3G`的`Network`图(运行在本地的`nginx`服务器上)

可以看到未经优化的`base`版本在`Fast 3G`的网络下大概需要7秒多的时间才加载完毕

![](https://user-gold-cdn.xitu.io/2018/9/29/16625d34818e42f0?w=3276&h=1562&f=png&s=449063)
