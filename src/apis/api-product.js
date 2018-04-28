/**
 * 产品管理API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

export default {

  /**
   * 获取产品详情
   * @param productEntityId 产品ID
   */
  detail: function (productEntityId = "") {
    return http.get(this._baseUrl() + "/" + productEntityId);
  },

  /**
   * 根据设备编码获取产品信息
   * @param deviceId 设备编码
   */
  findByDeviceId: function (deviceId) {
    return http.get(this._baseUrl() + "/find/" + deviceId);
  },

  _baseUrl(){
    return App.apihost + "/products"
  }
}
