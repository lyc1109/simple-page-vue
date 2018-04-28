/**
 * 环境变量定义: 开发
 * @type {{NODE_ENV: string}}
 */
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

// 本地IP地址
let localHost = "http://localhost";
try{
  const localConf = require("../local.conf");
  if(localConf) {
    localHost = localConf;
  }
} catch(e) {
  // do nothing
}

module.exports = merge(prodEnv, {
  NODE_ENV: '"local"',
  LOCAL_HOST: localHost,

  HOST_BASE: '"/baseUrl"',
  API_HOST_BASE: '"/api"',
  API_HOST_WOS: '"/api/wos"',

  // 授权登录地址, apisvr-h5地址
  AUTH_HOST: '"'+ localHost +':8310"',

  // 授权回调地址, h5本身地址
  ACCESS_TOKEN_HOST: '"'+ localHost +':8000"',

  // 微服务访问地址
  MS_PRODUCT_HOST: '"/ms/product"',

  // 跨域代理
  proxyTable: {
    "/baseUrl": {
      target: localHost + ":8310",
      changeOrigin: true,
      pathRewrite: {
        '^/baseUrl': ''
      }
    },
    "/api": {
      target: localHost + ":8310/api/v3",
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    },
    "/api/wos": {
      target: localHost + ":8310/api/v3/wos",
      changeOrigin: true,
      pathRewrite: {
        '^/api/wos': ''
      }
    },
    "/map": {
      target: localHost + ":8310/api/v1",
      changeOrigin: true,
      pathRewrite: {
        '^/map': ''
      }
    },
    "/ms/product": {
      target: "http://192.168.0.26:8600",
      changeOrigin: true,
      pathRewrite: {
        '^/ms/product': ''
      }
    },
  },
});
