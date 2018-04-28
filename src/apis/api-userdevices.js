/**
 * 用户设备API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

export default {
  /**
   * 获取指定用户设备的详细数据
   * @param userDeviceEntityId 用户设备id
   */
  detail: function (userDeviceEntityId = "") {
    return http.get(this._baseUrl() + userDeviceEntityId);
  },

  /**
   * 绑定智能设备
   * @param deviceId
   */
  bindDevice: function (deviceId = "") {
    return http.post(App.apihost + "/userdevices/"+ deviceId +"/bind");
  },

  /**
   * 申请授权使用设备
   * @param deviceId 设备编码
   */
  applyAuthDevice: function (deviceId = "") {
    return http.post(App.apihost + "/userdevices/"+ deviceId +"/submit-authorization");
  },

  /**
   * 修改用户设备数据
   * @param userDeviceEntityId 用户设备ID
   * @param device_name   设备别名
   * @param invoice_date  发票日期(yyyy-MM-dd), 租赁设备无
   * @param invoice_image 发票图片的Id(混淆后), 租赁设备无
   */
  edit: function (userDeviceEntityId = "", device_name = "", invoice_date = "", invoice_image = "") {
    return http.post(this._baseUrl() + userDeviceEntityId, {
      device_name: device_name,
      invoice_date: invoice_date,
      invoice_image: invoice_image
    });
  },

  /**
   * 解绑用户设备
   * @param userDeviceEntityId  用户设备ID
   */
  unbind: function (userDeviceEntityId) {
    return http.post(this._baseUrl() + userDeviceEntityId + "/unbind");
  },

  _baseUrl: function () {
    return App.apihost + "/userdevices/"
  }
}
