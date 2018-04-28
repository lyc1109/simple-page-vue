/**
 * 租赁订单状态管理
 *
 * @author  hucw
 * @created 2018-01-02
 */

import types from './types-leaseorder'
import App from "@/assets/scripts/app";

const LEASE_PARAMS_KEY = "leaseParams";

export default {
  state: {
    leaseParams: {
      // 租赁产品
      leaseProduct: {},
      // 押金
      deviceDeposit: 0,
      // 租赁金额
      rentalAmount: 0,
      // 租赁套餐
      rentalPackage: "",
    }
  },
  mutations: {
    [types.leaseorder.setLeaseParams](state, leaseParams){
      state.leaseParams = leaseParams;
      App.sessionStorage.set(LEASE_PARAMS_KEY, leaseParams);
    }
  },
  getters: {
    // 获取租赁订单参数
    [types.leaseorder.getLeaseParams]: function(state){
      if(state.leaseParams.rentalPackage !== "") {
        return state.leaseParams;
      }
      return App.sessionStorage.get(LEASE_PARAMS_KEY);
    }
  }
}
