/**
 * 开发环境构建服务配置
 */
require('./check-versions')();

let opn = require('opn');
let path = require('path');
let express = require('express');
let webpack = require('webpack');
let proxyMiddleware = require('http-proxy-middleware');

// 环境信息配置
let envConfig = require('../config/local.env');

// 配置相关
const webpackConfig = require('./webpack.base4dev.conf');

// 处理过程可使用环境变量
// http://vuejs.github.io/vue-loader/en/workflow/production.html
webpackConfig.plugins.push(
  new webpack.DefinePlugin({
    'process.env': envConfig
  })
);

// 本地IP地址
let localHost = envConfig.LOCAL_HOST;
// 本地服务端口号，默认8000，也可通过 `--PORT`参数定义
const port = 8000;
// 是否默认打开浏览器
const autoOpenBrowser = false;
// API访问地址代理配置
// 参考：https://github.com/chimurai/http-proxy-middleware
const proxyTable = envConfig.proxyTable;

// node 网络框架
let app = express();
let compiler = webpack(webpackConfig);

// node 小型服务器，本地服务模拟资源访问
let devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
});

// 文件更新热替换服务
let hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
});

// 当html文件更新时，强制刷新页面
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({action: 'reload'});
    cb()
  });
});

// api代理访问配置
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context];
  if (typeof options === 'string') {
    options = {target: options}
  }
  app.use(proxyMiddleware(options.filter || context, options))
});

// 对HTML5历史记录的回退处理
app.use(require('connect-history-api-fallback')());

// 提供webpack包输出
app.use(devMiddleware);

// 启用热重新加载和状态保存，同时显示编译错误
app.use(hotMiddleware);

// 提供静态资源输出
const staticPath = path.posix.join("/", "static");
app.use(staticPath, express.static('./static'));

// 本地访问地址
const uri = localHost + ":" + port;

// Promise 定义
let _resolve;
let readyPromise = new Promise(resolve => {
  _resolve = resolve
});

// 启动本地服务
console.log('> Starting dev server...');
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n');
  // when env is testing, don't need open it
  if (autoOpenBrowser) {
    opn(uri)
  }
  _resolve()
});

// 导出模块
let server = app.listen(port);
module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
};
