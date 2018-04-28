/**
 * 环境变量定义: 仿真测试环境
 * @type {{NODE_ENV: string}}
 */
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"stage"',

  // 测试服务器内网IP
  HOST_BASE: '"https://tapih5.xohaa.net"',
  API_HOST_BASE: '"https://tapih5.xohaa.net/api/v3"',
  API_HOST_WOS: '"https://tapih5.xohaa.net/api/v3/wos"',

  // 授权登录地址, apisvr-h5地址
  AUTH_HOST: '"https://tapih5.xohaa.net"',

  // 授权回调地址, h5本身地址
  ACCESS_TOKEN_HOST: '"https://tm.xohaa.net"',

  // 微服务访问地址（内网）
  // 产品管理微服务
  MS_PRODUCT_HOST: '"http://10.26.117.32:8600"',
});
