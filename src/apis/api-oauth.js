/**
 * 统一授权管理API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

export default {

  /**
   * 获取Token
   * @param accessTokenCode token授权码
   */
  getToken: function (accessTokenCode) {
    return http.post(App.basehost + "/oauth2/token", {
      "client_id": App.appId,
      "client_secret": App.appSecret,
      "code": accessTokenCode
    });
  },

  logout: function () {
    return http.post(App.basehost + "/login?logout");
  },


  bindCurShop: function (shopId) {
    //
  }
}
