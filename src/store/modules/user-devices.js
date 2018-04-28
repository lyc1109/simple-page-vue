/**
 * 会员相关数据状态管理
 *
 * @author  hucw
 * @created 2017-06-13
 */
import types from "../types";

export default {
  state: {
    pageData: {},
    bindData: {}
  },
  mutations: {
    // 提交通用分页数据
    [types.userDevices.setPageData]: function (state, pageData) {
      state.pageData = pageData;
    },

    // 提交手工录入数据
    [types.userDevices.setBindData]: function (state, device) {
      state.bindData = device;
    }
  },
  getters: {
    // 获取通用分页数据
    [types.userDevices.getPageData]: (state) => state.pageData,

    // 获取手工录入数据
    [types.userDevices.getBindData]: (state) => state.bindData
  }
}
