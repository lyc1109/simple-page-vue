/**
 * 用于生存环境的构建脚本
 */
require('./check-versions')();

let ora = require('ora');
let rm = require('rimraf');
let path = require('path');
let chalk = require('chalk');
let webpack = require('webpack');

// 环境信息配置
let envConfig = require('../config/stage.env');

// 引入 webpack 生成环境配置文件
let webpackConfig = require('./webpack.base4pro.conf');

// 处理过程可使用环境变量
// http://vuejs.github.io/vue-loader/en/workflow/production.html
webpackConfig.plugins.push(
  new webpack.DefinePlugin({
    'process.env': envConfig
  })
);

console.log("\n构建发布系统 - 测试环境(Stage)\n");
let spinner = ora('');
spinner.start();

// 先清除/dist/static目录
rm(path.join(path.resolve(__dirname, '../dist'), "static"), err => {
  if (err) throw err;

  let startTime = new Date().getTime();

  // webpack 执行构建任务
  webpack(webpackConfig, function (err, stats) {
    spinner.stop();
    if (err) throw err;

    // 输出状态信息
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n');

    let endTime = (new Date().getTime() - startTime) / 1000;
    let costMsg = endTime + "秒";
    if(endTime > 60) {
      costMsg = endTime/60 + "分"
    }
    console.log(chalk.cyan('构建完毕. 耗时：'+ costMsg +'\n'));

    /*console.log(chalk.yellow(
      '  提示: 构建的文件只能在服务器上运行访问，\n' +
      '  不能在本地浏览器直接打开 index.html。\n'
    ))*/
  })
});
