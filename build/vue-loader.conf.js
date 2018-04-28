/**
 * vue-loader 配置
 */
let utils = require('./utils');
let isProduction = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'stage');

/**
 * 导出配置模块
 *
 * @type {{loaders: 返回css的loader}}
 */
module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction ? true : false,
    extract: isProduction
  })
};
