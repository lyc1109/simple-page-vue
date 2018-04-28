/**
 * 厂测工具通用API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

export default {

  /**
   * 获取iotDevice信息
   * @param deviceId  设备编码
   */
  findDevice: function (deviceId) {
    return http.get(this._baseUrl() + deviceId);
  },

  /**
   * 厂测完成 / 清理异常设备
   *
   * @param deviceId  设备编码
   * @param renew     是否重建设备
   */
  finish: function (deviceId, renew = true) {
    return http.post(this._baseUrl() + deviceId + "/deregister", {
      renew: renew
    });
  },

  _baseUrl: function () {
    return App.apihost + "/test/devices/";
  }
}
