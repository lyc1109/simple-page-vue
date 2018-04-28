/**
 * 租赁设备管理API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

export default {

  /**
   * 获取当前用户有效激活码列表
   * @param deviceId  设备二维码
   */
  getAvailableActiveCodes: function (deviceId = "") {
    return http.get(this._baseUrl() + "/activationcodes/available/" + deviceId);
  },

  /**
   * 激活个人租赁设备
   *
   * @param deviceEntityId 设备编码
   * @param activeCode     激活码
   */
  activeLeaseDevice: function (deviceEntityId="", activeCode="") {
    return http.post(this._baseUrl() + "/devices/" + deviceEntityId + "/activate", {
      activation_code: activeCode
    })
  },

  // ==================================================================
  // private methods ==========================================================
  _baseUrl: function () {
    return App.apihost + "/lease";
  }
}
