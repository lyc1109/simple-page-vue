/**
 * 销售订单API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

export default {

  /**
   * 提交销售订单
   * @param orderForm
   * @returns {*}
   */
  submit: function (orderForm) {
    return http.postJson(this._baseUrl() + "/submit", orderForm);
  },

  /**
   * 获取订单详情
   * @param id 订单ID
   * @returns {*}
   */
  detail: function (id) {
    return http.get(this._baseUrl() + "/" + id);
  },

  /**
   * 支付统一下单
   * @param id 订单ID
   * @returns {*}
   */
  unifiedorder: function (id, payType, isPayRemainder) {
    return http.post(this._baseUrl() + "/" + id + "/unifiedorder", {
      pay_type: payType,
      is_pay_remainder: isPayRemainder
    });
  },

  /**
   * 取消订单
   * @param id     订单ID
   * @param reason 取消原因
   * @returns {*}
   */
  cancel: function (id, reason = "") {
    return http.post(this._baseUrl() + "/" + id + "/cancel", {
      cancelInfo: reason
    });
  },

  /**
   * 完成订单
   * @param id     订单ID
   * @returns {*}
   */
  finished: function (id) {
    return http.post(this._baseUrl() + "/" + id + "/finished");
  },

  /**
   * 获取备注信息
   * @param id    订单ID
   * @returns {*}
   */
  getMemos: function (id) {
    return new Promise((resolve) => {
      http.get(this._baseUrl() + "/" + id + "/memo")
        .then((resp) => {
          resolve(resp.fileList);
        })
        .catch(() => {
          resolve([]);
        })
    });
  },

  /**
   * 提交备注
   * @param id    订单ID
   * @param memo  备注内容
   * @returns {*}
   */
  submitMemo: function (id, memo) {
    return http.post(this._baseUrl() + "/" + id + "/memo", {
      type: "memo_user",
      is_private: false,
      memo: memo
    });
  },

  /**
   * 提交退换货申请
   * @param id         订单ID
   * @param defendType 退换货类型
   * @param reason     原因
   * @returns {*}
   */
  submitReturnChange: function (id, defendType = "", reason = "") {
    return http.post(this._baseUrl() + "/" + id + "/return-change", {
      defend_type: defendType,
      reason: reason
    });
  },

  /**
   * 获取物流公司信息
   * @returns {*}
   */
  logistics: function () {
    return new Promise((resolve) => {
      let fileList = [];
      http.get(this._baseUrl() + "/logistics", {
        page_no: 1,                    // 页面数, 默认从1开始
        page_size: 100,                 // 每页条数, 每页返回最多返回100条, 默认值为20
        page_sort: "",                 // 排序方式, 格式为: 排序字段_排序方向, 如: created_desc
        q: "",                         // 搜索关键字
      })
        .then((resp) => {
          if (resp.totalElements > 0) {
            for(let item of resp.fileList){
              fileList.push(item.name)
            }
          }
          fileList.push("其它");
          resolve(fileList);
        })
        .catch((resp) => {
          resolve(fileList);
        });
    });
  },

  /**
   * 提交退换货物流信息
   * @param id                订单id
   * @param shippingType      物流类型
   * @param logisticsCompany  物流公司
   * @param invoiceNo         物流单号
   * @returns {*}
   */
  submitLogistics: function (id, shippingType, logisticsCompany, invoiceNo) {
    return http.post(this._baseUrl() + "/" + id + "/return-change/logistics", {
      shipping_type: shippingType,
      logistics_company: logisticsCompany,
      invoice_no: invoiceNo
    });
  },

  /**
   * 获取维权订单信息列表
   * @param id    订单ID
   * @returns {*}
   */
  getDefendOrders: function (id) {
    return http.get(this._baseUrl() + "/" + id + "/defend-orders");
  },

  /**
   * 获取购物车信息
   */
  getShopCart: function () {
    return http.get(this._baseUrl2())
  },

  /**
   * 获取购物车信息
   */
  getShopCartNum: function () {
    return http.get(this._baseUrl2() + '/info')
  },

  /**
   * 添加购物车
   * @param shoppingCartForm 商品数据
   */
  addInShopCart: function (shoppingCartForm = '') {
    return http.postJson(this._baseUrl2() + '/-1', shoppingCartForm)
  },

  /**
   * 添加购物车
   * @param id 
   * @param shoppingCartForm 商品数据
   */
  editInShopCart: function (id, shoppingCartForm) {
    return http.postJson(this._baseUrl2() + '/' + id, shoppingCartForm)
  },

  /**
   * 删除购物车指定商品
   * @param id 商品id
   */
  deleteGood: function (id) {
    return http.del(this._baseUrl2() + '/' + id)
  },

  _baseUrl: function () {
    return App.basehost + "/oms/order";
  },

  _baseUrl2: function () {
    return App.basehost + "/oms/shoppingcart"
  }
}
