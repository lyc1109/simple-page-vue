/**
 * 设备API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

export default {

  /**
   * 获取设备详情
   * @param deviceEntityId  设备实体ID
   */
  detail: function (deviceEntityId = "") {
    return http.get(App.apihost + "/devices/" + deviceEntityId);
  },

  /**
   * 获取设备二维码状态结果
   * @param deviceId  设备二维码
   */
  getDeviceQRCodeResult: function (deviceId = "") {
    return http.get(App.apihost + "/devices/" + deviceId + "/scan");
  },
}
