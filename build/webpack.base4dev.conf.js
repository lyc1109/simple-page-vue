/**
 * webpack 开发环境配置
 * @type {webpack}
 */
let webpack = require('webpack');
let merge = require('webpack-merge');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

// 相关配置
let baseWebpackConfig = require('./webpack.base.conf');
let utils = require('./utils');

// 热更新相关入口文件配置
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
});

/**
 * 导出开发环境构建配置，与webpack基本配置合并
 */
module.exports = merge(baseWebpackConfig, {
  /**
   * css文件规则
   */
  module: {
    rules: utils.styleLoaders({sourceMap: false})
  },

  // 在开发环境使用开发工具 cheap-module-eval-source-map 效率更高
  devtool: '#cheap-module-eval-source-map',

  // 插件配置
  plugins: [

    // 热更新插件
    // see https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),

    // 开发过程忽略错误，避免中断服务
    new webpack.NoEmitOnErrorsPlugin(),

    // 在 index.html 中注入静态资源引用
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),

    // 友好的错误输出插件
    new FriendlyErrorsPlugin()
  ]
});
