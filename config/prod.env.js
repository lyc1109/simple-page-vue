/**
 * 环境变量定义: 生产环境
 * @type {{NODE_ENV: string}}
 */
module.exports = {
  NODE_ENV: '"production"',
  REQUEST_TIME_OUT: '5000',

  HOST_BASE: '"https://apih5.xohaa.net"',
  API_HOST_BASE: '"https://apih5.xohaa.net/api/v3"',
  API_HOST_WOS: '"https://apih5.xohaa.net/api/v3/wos"',

  // 阿里云OSS访问域名
  OSS_HOST: '"https://assets.xohaa.net"',

  // 授权登录地址, apisvr-h5地址
  AUTH_HOST: '"https://apih5.xohaa.net"',

  // 授权回调地址, h5本身地址
  ACCESS_TOKEN_HOST: '"https://m.xohaa.net"',

  // 微服务访问地址（内网）
  // 产品管理微服务
  MS_PRODUCT_HOST: '"http://10.31.76.127:8600"',
};
