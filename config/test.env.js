/**
 * 环境变量定义: 本地测试环境
 * @type {{NODE_ENV: string}}
 */
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"test"',

  HOST_BASE: '"http://192.168.0.26:8310"',
  API_HOST_BASE: '"http://192.168.0.26:8310/api/v3"',
  API_HOST_WOS: '"http://192.168.0.26:8310/api/v3/wos"',

  // 授权登录地址, apisvr-h5地址
  AUTH_HOST: '"http://192.168.0.26:8310"',

  // 授权回调地址, h5本身地址
  ACCESS_TOKEN_HOST: '"http://192.168.0.26:8000"',

  // 微服务访问地址
  // 产品管理微服务
  MS_PRODUCT_HOST: '"http://192.168.0.26:8600"',
});
