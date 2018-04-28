/**
 * 社区相关数据状态管理
 *
 * @author  huanglh
 * @created 2017-09-18
 */
import types from "../types";

export default {
  state: {
    pageData: {}
  },
  mutations: {
    // 提交通用分页数据
    [types.memberCommunity.setPageData]: function (state, pageData) {
      state.pageData = pageData;
    }
  },
  getters: {
    // 获取通用分页数据
    [types.memberCommunity.getPageData]: (state) => state.pageData
  }
}
