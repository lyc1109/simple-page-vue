/**
 * 服务订单API
 *
 * @author  huanglh
 * @created 2018-01-18
 */

import App from "scripts/app";
import http from '@/http';

export default {

  /**
   * 提交个人租赁订单
   * @param formData 租赁订单数据
   */
  submitLeaseOrder(formData = {}) {
    return http.postJson(this._baseUrl() + "submit-lease", formData)
  },

  /**
   * 提交企业租赁预约订单
   * @param formData 租赁订单数据
   */
  submitLeaseBusinessOrder(formData = {}) {
    return http.postJson(this._baseUrl() + "submit-business-lease", formData)
  },

  /**
   * 获取订单费用
   * @param serviceOrderId 订单ID
   */
  fees(serviceOrderId = "") {
    return http.get(this._baseUrl() + serviceOrderId + "/fees")
  },

  /**
   * 获取订单详情
   * @param serviceOrderId 订单ID
   */
  getOrder(serviceOrderId = '') {
    return http.get(this._baseUrl() + serviceOrderId)
  },

  /**
   * 获取订单状态值对
   */
  getOrderStatus() {
    return http.get(this._baseUrl() + "const/status")
  },

  /**
   * 获取订单日志
   * @param serviceOrderId 订单ID
   */
  logs(serviceOrderId = '') {
    return http.get(this._baseUrl() + serviceOrderId + "/logs")
  },

  _baseUrl(){
    return App.apihost + "/serviceorders/";
  },
}
