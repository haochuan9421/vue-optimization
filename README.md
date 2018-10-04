# vue-optimization

> 本项目意在通过不同的分支展示不同的**优化**方式，对`vue`项目**性能**的影响，探索`vue`开发中有**显著效果**的**可行性**优化方案(尽可能不改动业务代码)。你可以切换分支，查看`git`历史，通过比对文件变化，来了解实现的具体细节。

### 当前分支 —— cdn

1. 在`base`分支的基础上，将原本依赖的`vue`、`vue-router`、`vuex`、`element-ui`和`axios`这五个库，全部改为通过`CDN`链接获取。
2. 相应的调整`webpack`配置
3. 卸载依赖的`npm`包，`npm uninstall axios element-ui vue vue-router vuex`
4. 删除`main.js`里`element-ui`相关代码

具体细节可以查看`git`的历史记录

### 重新构建后的文件说明：
1. `app.css`： 因为不再通过`import 'element-ui/lib/theme-chalk/index.css'`,而是直接通过`CDN`链接的方式引入`element-ui`样式，使得文件小到了`bytes`级别，因为它现在仅包含少量的项目的`css`。
2. `app.js`：几乎无变化，因为这里面主要还是自己项目的代码。
3. `vendor.js`：将5个依赖的`js`全部转为`CDN`链接后，已经小到了不足`1KB`，其实里面已经没有任何第三方库了。
4. `数字.js`和`mainfest.js`：这些文件本来就很小，变化几乎可以忽略。

优化后：
![](https://user-gold-cdn.xitu.io/2018/9/30/166261022f418776?w=1798&h=800&f=png&s=257093)
优化前：
![](https://user-gold-cdn.xitu.io/2018/9/29/16625d3c1cdfa267?w=1890&h=846&f=png&s=317765)

### 禁用缓存，限速为`Fast 3G`的`Network`图(运行在本地的`nginx`服务器上)

可以看出相同的网络环境下，加载从原来的7秒多，提速到现在的3秒多，提升非常明显。而且更重要的一点是原本的方式，所有
的`js`和`css`等静态资源都是请求的我们自己的`nginx`服务器，而现在大部分的静态资源都请求的是第三方的`CDN`资源，
这不仅可以带来速度上的提升，在高并发的时候，这无疑大大降低的自己服务器的带宽压力，想象一下原来首屏的900多KB的文件
现在仅剩20KB是请求自己服务器的！

![](https://user-gold-cdn.xitu.io/2018/9/30/166260f98a185bca?w=3276&h=1562&f=png&s=541284)
