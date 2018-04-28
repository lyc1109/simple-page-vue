/**
 * APP支付状态存储管理
 *
 * @author hucw
 * @date   2017/12/26
 */
import types from '../types'
import App from "@/assets/scripts/app";

const PAYINFO_KEY = "payInfo";

export default {
  state: {
    payInfo: {
      // 支付类型：order(订单支付) | recharge(设备充值) | scan(扫码租赁)
      type: "order",
      // 首要标题
      subject: "",
      // 次要标题：产品名称 | 租赁产品名称 | 设备名称
      payTitle: "",
      // 费用明细: [{name: "", amount: 0}]
      fees: [],
      // 实际支付总金额
      totalAmount: 0,

      // 订单支付必需
      orderInfo: {
        orderType: "",
        orderEntityId: "",
        // 是否支付尾款，销售订单有效
        isPayRemainder: false
      },

      // 设备充值必需
      rechargeInfo: {
        deviceEntityId: "",
        leaseDueDate: "",
        rentalPackage: ""
      },

      // 扫码租赁必需
      scanLeaseInfo: {
        deviceId: "",
        deviceEntityId: "",
        rentalPackage: "",
        isCreditRent: false,
      }
    }
  },
  mutations: {
    // 设置支付信息
    [types.appPay.setPayInfo] (state, payInfo){
      state.payInfo = payInfo;
      App.sessionStorage.set(PAYINFO_KEY, payInfo);
    }
  },
  getters: {
    // 获取支付信息
    [types.appPay.getPayInfo]: function(){
      return App.sessionStorage.get(PAYINFO_KEY);
    }
  }
}
