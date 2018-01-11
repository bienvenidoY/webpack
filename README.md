## 前言
> forked from [vuejs-templates/webpack](https://github.com/vuejs-templates/webpack)

- [x] 新增buildtest构建环境，打包后的文件含有map文件
- [x] 添加vuex安装提示
- [x] 添加vuex个人习惯的src/store文件
- [x] 根据使用习惯配置项目结构
- [ ] webpack打包忽略公共依赖包（自行配置 ）
## Usage

This is a project template for [vue-cli](https://github.com/vuejs/vue-cli). **It is recommended to use npm 3+ for a more efficient dependency tree.**

``` bash
$ npm install -g vue-cli
$ vue init webpack my-project
$ cd my-project
$ npm install
$ npm run dev
```
### Fork It And Make Your Own

You can fork this repo to create your own boilerplate, and use it with `vue-cli`:

**自己模板使用这条命令来构建自己的项目**
``` bash
vue init username/repo my-project
```
## 说明

> vue-cli 默认只提供了dev和prod两种构建环境。但真实的开发流程还会多test(测试环境)。所以就要简单的修改一下模板。

开发环境与生产环境分离的原因如下：

- 在开发时，不可避免会产生大量debug又或是测试的代码，这些代码不应出现在生产环境中（也即不应提供给用户）。
- 在把页面部署到服务器时，为了追求极致的技术指标，我们会对代码进行各种各样的优化，比如说混淆、压缩，这些手段往往会彻底破坏代码本身的可读性，不利于我们进行debug等工作。
- 数据源的差异化，比如说在本地开发时，读取的往往是本地mock出来的数据，而正式上线后读取的自然是API提供的数据了。

如果同时把一份完整的开发环境配置文件和一份完整的生产环境配置文件列在一起进行比较，那么会出现以下三种情况：

- 开发环境有的配置，生产环境不一定有，比如说开发时需要生成`sourcemap`来帮助debug，又或是热更新时使用到的`HotModuleReplacementPlugin`。
- 生产环境有的配置，开发环境不一定有，比如说用来混淆压缩js用的`UglifyJsPlugin`。
开发环境和生产环境都拥有的配置，但在细节上有所不同，比如说`output.publicPath`，又比如说`css-loader`中的`minimize`和`autoprefixer`参数。

更重要的是，实际上开发环境和生产环境的配置文件的绝大部分都是一致的，对于这一致的部分来说，我们坚决要消除冗余，否则后续维护起来不仅麻烦，而且还容易出错。

## 模板改造

- 说明
1. `npm run  dev`         开发环境
 2. `npm run  build:test` 测试环境，打包文件需要生成sourcemap来帮助debug
 3. ` npm run  build:prod`生产环境，关闭调试信息 如console.*、vue-devtool、js.map
 4. `npm run  build:test-preview` vue-cli内置的webpack-bundle-analyzer 一个模块分析的东西 （可以不用，不去配置npm script）
-  npm scripts
```
// template/src/pageage.json
"dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
"build:prod": "cross-env NODE_ENV=production node build/build.js",
"build:test": "cross-env NODE_ENV=test node build/build.js"
"build:test-preview": "cross-env NODE_ENV=test npm_config_preview=true  npm_config_report=true node build/build.js"
```
- 新建test环境
```
//新建buildtest.env.js
module.exports = {
  NODE_ENV: '"test"'
}
//index.js
build: {
    //env
    testEnv: require('./test.env'),
    prodEnv: require('./prod.env'),
...
    //判断打包是否构建.map文件
    /* .map文件作用
     *索引控制台错误的位置，如果没有.map文件，不会出现报错信息
     */
    productionSourceMap: process.env.NODE_ENV === 'test',
}
```
- 根据环境不同决定是否有debug
```
//template/build/webpack.prod.conf.js
const env = {{#if_or unit e2e}}process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : {{/if_or}}process.env.NODE_ENV === 'production' ? require('../config/prod.env') : require('../config/buildtest.env')

//根据环境关闭debug
plugins: [
...
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false, // 去除warning警告
          pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log'] : [], // 配置发布时，不被打包的函数
          // drop_debugger: true, // 发布时去除debugger
          // drop_console: true // 发布时去除console
      },
      sourceMap: true
    }),
//template/src/main.js
if(process.env.NODE_ENV === 'production'){
  //生产环境 关闭警告 vue-devtools
  Vue.config.productionTip = false
  Vue.config.devtools = false
}
```
- 打包进程loading 根据环境显示相应的打包文案
```
//build.js
var spinner = ora('building for '+ process.env.NODE_ENV +'...')
//35行
console.log(chalk.cyan('  Build complete.\n' + process.env.NODE_ENV))
```
- 文件夹索引
```
//webpack.base.conf.js
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),
      'views': path.resolve(__dirname, '../src/views'),
      'styles': path.resolve(__dirname, '../src/styles'),
      'api': path.resolve(__dirname, '../src/api'),
      'utils': path.resolve(__dirname, '../src/utils'),
      'store': path.resolve(__dirname, '../src/store'),
      'router': path.resolve(__dirname, '../src/router'),
      'vendor': path.resolve(__dirname, '../src/vendor'),
      'static': path.resolve(__dirname, '../static')
...
    }
  },
```
- 网站图标(未配置)
```
//webpack.prod.conf.js && webpack.dev.conf.js
var path = require('path')
...
function resolveApp(relativePath) {
  return path.resolve(relativePath);
}
...
new HtmlWebpackPlugin({
//使用
 favicon: resolveApp('favicon.ico')
})
]
```
- vuex安装提示
 ```
//meta.js
 "vuex":{
      "type": "confirm",
      "message": "Install vuex?"
    },
```
配置之后就会有安装提示
- 其他
`template` 目录下的所有文件将会用 `Handlebars`（[了解相关的语法点这里](http://handlebarsjs.com/)） 进行渲染. 用户输入的数据会作为模板渲染时的使用数据,例如，在`cmd`确认使用`router`后，那么`main.js`就会`import router，main.js`中源码：
```
{#router}}
import router from './router'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
//类似 {{#if_eq lintConfig "airbnb"}};{{/if_eq}}是启用lint后一些语法的检查
{{/router}}
```

- 问题
1. vue  init username/webpack <project> fail 404 ?
注意查看分支 vue-cli 使用的是master
