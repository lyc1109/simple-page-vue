/**
 * 用户管理API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

export default {
  /**
   * 获取当前用户信息
   */
  curUser: function () {
    return http.get(App.apihost + "/user");
  }
};
