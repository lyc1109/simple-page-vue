/**
 * 社区帖子管理API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

export default {

  /**
   * 获取指定数量社区帖子
   * @param limit 指定数量
   */
  findTop: function (limit) {
    return http.get(App.apihost + "/community/topic", {
      page_size: limit,
      view_type: "LAST"
    });
  },

  /**
   * 获取设备二维码状态结果
   * @param deviceId  设备二维码
   */
  getDeviceQRCodeResult: function (deviceId = "") {
    return http.get(App.apihost + "/devices/" + deviceId + "/scan");
  },
}
