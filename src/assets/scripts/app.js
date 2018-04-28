/**
 * APP通用辅助函数
 *
 * @author  hucw
 * @created 2017-06-05
 */
export default {
  appId: "iotqqdm3z2gqbajlvko",
  appSecret: "ebfa41c55ec74f2c8706309a68c695b1",

  // 环境变量
  isLocal: process.env.NODE_ENV === "local",
  isDev: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",
  isStage: process.env.NODE_ENV === "stage",
  isProduct: process.env.NODE_ENV === "production",
  isJbrEvn: process.env.NODE_ENV === "jbr",

  // 授权登录地址, apisvr-h5地址
  authHost: process.env.AUTH_HOST,
  // 授权回调地址, h5本身地址
  accessTokenHost: process.env.ACCESS_TOKEN_HOST,

  // API地址信息
  // 基本api地址，如 http://api.xohaa.net
  basehost: process.env.HOST_BASE,
  // 通用api地址，如 http://api.xohaa.net/api/v1
  apihost: process.env.API_HOST_BASE,
  // 工单专用api地址，如 http://api.xohaa.net/api/v1/wos
  woshost: process.env.API_HOST_WOS,

  // 阿里云oss访问地址
  ossHost: process.env.OSS_HOST,

  // localStorage封装
  storage: (function() {
    const namespace = "iotph5";
    const localStorage = window.localStorage;

    let getStorage = function () {
      if(localStorage.getItem(namespace) === null) {
        localStorage.setItem(namespace,'{}');
      }
      return JSON.parse(localStorage.getItem(namespace));
    };

    return {
      set: function (key, val) {
        const storage = getStorage();
        storage[key] = val;
        localStorage.setItem(namespace, JSON.stringify(storage));
      },

      get: function (key) {
        const storage = getStorage();
        return storage[key] !== undefined ? storage[key] : null;
      },

      remove: function (key) {
        const storage = getStorage();
        delete storage[key];
        localStorage.setItem(namespace, JSON.stringify(storage));
      },

      hasKey: function (key) {
        const item = this.get(key);
        return item !== null && typeof item !== undefined;
      }
    }
  }()),

  // localStorage封装
  sessionStorage: (function() {
    const namespace = "iotph5";
    const storageHandler = window.sessionStorage;

    let getStorage = function () {
      if(storageHandler.getItem(namespace) === null) {
        storageHandler.setItem(namespace,'{}');
      }
      return JSON.parse(storageHandler.getItem(namespace));
    };

    return {
      set: function (key, val) {
        const storage = getStorage();
        storage[key] = val;
        storageHandler.setItem(namespace, JSON.stringify(storage));
      },

      get: function (key) {
        const storage = getStorage();
        return storage[key] !== undefined ? storage[key] : null;
      },

      remove: function (key) {
        const storage = getStorage();
        delete storage[key];
        storageHandler.setItem(namespace, JSON.stringify(storage));
      },

      hasKey: function (key) {
        const item = this.get(key);
        return item !== null && typeof item !== undefined;
      }
    }
  }())
};
