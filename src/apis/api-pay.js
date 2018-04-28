/**
 * 支付下单相关API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

import deviceApis from "@/apis/api-devices";
import TradeOrderApi from "@/apis/api-tradeorder";
import moment from "moment";

export default {

  timeout: 0,

  /**
   * 订单支付
   *
   * @param orderEntityId 订单ID（混淆后）
   * @param payType       支付方式
   */
  payOrder: function (orderEntityId = "", payType = "wepay") {
    return http.post(App.apihost + "/serviceorders/" + orderEntityId + "/pay/unifiedorder", {
      'pay_type': payType
    });
  },

  /**
   * 获取订单支付结果
   *
   * @param orderEntityId 订单ID（混淆后）
   * @param callbackFn    回调
   */
  payOrderResult: function (orderEntityId = "", callbackFn = null) {
    if(this.timeout >= 15) {
      this.timeout = 0;
      if(callbackFn !== null && typeof callbackFn === "function") {
        callbackFn.call(this, false, null);
      }
      return;
    }

    http.get(App.apihost + "/serviceorders/" + orderEntityId)
      .then((order) => {
        if(order !== null && order.paidTime !== null && order.paidTime > 0) {
          this.timeout = 0;
          if(callbackFn !== null && typeof callbackFn === "function") {
            callbackFn.call(this, true, order);
          }
        } else {
          setTimeout(() => {
            this.timeout += 1;
            this.payOrderResult(orderEntityId, callbackFn);
          }, 1000);
        }
      });
  },

  /**
   * 设备充值支付
   *
   * @param deviceEntityId 设备实体ID（混淆后）
   * @param rentalPackage  充值套餐
   */
  payRecharge: function (deviceEntityId = "", rentalPackage = "", payType = "wechat") {
    return http.post(App.apihost + "/lease/devices/" + deviceEntityId + "/recharge", {
      rental_package: rentalPackage,
      pay_type: payType
    }, false);
  },

  /**
   * 获取扫码租赁支付
   *
   * @param deviceEntityId 设备实体ID
   * @param leaseDueDate   原租赁到期日
   * @param callbackFn     回调
   */
  payRechargeResult: function (deviceEntityId = "", leaseDueDate = "", callbackFn = null) {
    console.log("获取充值支付结果..." + this.timeout);

    if(this.timeout >= 15) {
      this.timeout = 0;
      if(callbackFn !== null && typeof callbackFn === "function") {
        callbackFn.call(this, false, null);
      }
      return;
    }

    // 自轮询15秒获取设备激活结果
    deviceApis.detail(deviceEntityId)
      .then((device) => {
        let newLeaseDueDate = moment(device.leaseDueDate).format("YYYY-MM-DD");
        if(leaseDueDate !== newLeaseDueDate) {
          this.timeout = 0;
          if(callbackFn !== null && typeof callbackFn === "function") {
            callbackFn.call(this, true, device);
          }
        } else {
          setTimeout(() => {
            this.timeout += 1;
            this.payRechargeResult(deviceEntityId, callbackFn);
          }, 1000);
        }
      });
  },

  /**
   * 扫码租赁支付
   *
   * @param deviceEntityId 设备实体ID
   * @param deviceId       设备编码
   * @param rentalPackage  租赁套餐
   * @param creditRent     是否信用免押金租赁
   * @param payType       支付方式
   */
  payScanLease: function (deviceEntityId = "", deviceId = "", rentalPackage = "", creditRent = false, payType = "wechat") {
    return http.post(App.apihost + "/lease/devices/" + deviceEntityId + "/scan-pay", {
      deviceId: deviceId,
      rental_package: rentalPackage,
      credit_rent: creditRent,
      pay_type: payType
    }, false);
  },

  /**
   * 获取扫码租赁支付
   *
   * @param deviceEntityId 设备实体ID
   * @param callbackFn     回调
   */
  payScanLeaseResult: function (deviceEntityId = "", callbackFn = null) {
    console.log("获取扫码租赁支付结果..." + this.timeout);

    if(this.timeout >= 15) {
      this.timeout = 0;
      if(callbackFn !== null && typeof callbackFn === "function") {
        callbackFn.call(this, false, null);
      }
      return;
    }

    // 自轮询15秒获取设备激活结果
    deviceApis.detail(deviceEntityId)
      .then((device) => {
        if(device !== null && device.activedAt !== null && device.activedAt > 0) {
          this.timeout = 0;
          if(callbackFn !== null && typeof callbackFn === "function") {
            callbackFn.call(this, true, device);
          }
        } else {
          setTimeout(() => {
            this.timeout += 1;
            this.payScanLeaseResult(deviceEntityId, callbackFn);
          }, 1000);
        }
      });
  },

  /**
   * 销售订单支付
   *
   * @param orderEntityId  订单ID（混淆后）
   * @param payType        支付方式
   * @param isPayRemainder 是否支付尾款
   */
  payTradeOrder: function (orderEntityId = "", payType = "wepay", isPayRemainder = false) {
    return TradeOrderApi.unifiedorder(orderEntityId, payType, isPayRemainder);
  },

  /**
   * 获取销售订单支付结果
   *
   * @param orderEntityId  设备实体ID
   * @param isPayRemainder 是否支付尾款
   * @param callbackFn     回调
   */
  payTradeOrderResult: function (orderEntityId = "", isPayRemainder = false, callbackFn = null) {
    console.log("获取销售订单支付结果..." + this.timeout);

    if(this.timeout >= 15) {
      this.timeout = 0;
      if(callbackFn !== null && typeof callbackFn === "function") {
        callbackFn.call(this, false, null);
      }
      return;
    }

    // 自轮询15秒获取销售订单支付结果
    TradeOrderApi.detail(orderEntityId)
      .then((order) => {
        let isPaid = false;
        if (order !== null) {
          if (isPayRemainder) {
            isPaid = order.remainderPayTime !== null && order.remainderPayTime > 0;
          } else {
            isPaid = order.payTime !== null && order.payTime > 0;
          }
        }
        if(isPaid) {
          this.timeout = 0;
          if(callbackFn !== null && typeof callbackFn === "function") {
            callbackFn.call(this, true, order);
          }
        } else {
          setTimeout(() => {
            this.timeout += 1;
            this.payTradeOrderResult(orderEntityId, callbackFn);
          }, 1000);
        }
      });
  },
}
