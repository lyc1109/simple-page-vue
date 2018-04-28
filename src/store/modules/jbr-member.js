/**
 * jbr会员相关数据状态管理
 *
 * @author  luoyc
 * @created 2017-12-27
 */

import types from "../types";

export default {
  state: {
    serviceOrder: ''
  },
  mutations: {
    [types.jbr.getServiceOrderQuery]: (state,query) => {
      state.serviceOrder = query
    }
  }
}
