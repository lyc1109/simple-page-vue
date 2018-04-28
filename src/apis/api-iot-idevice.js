/**
 * 智能设备通用API
 *
 * @author  huanglh
 * @created 2018-02-01
 */

import App from "scripts/app";
import http from '@/http';

export default {
  /**
   * 获取设备充值订单记录
   * @param deviceEntityId
   */
  getRechargeOrders: function (deviceEntityId) {
    return http.get(App.apihost + "/lease/devices/" + deviceEntityId + "/rechargeorders");
  }
}
