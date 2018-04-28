/**
 * 通用数据状态管理
 *
 * @author  huanglh
 * @created 2017-08-30
 */
import types from "../types";

export default {
  state: {
    errorCode: '',
    activeCode: '',
    // 入口地址
    enterURL: '',
  },
  mutations: {
    // 设置错误码数据
    [types.common.setErrorCode]: function (state, errorCode) {
      state.errorCode = errorCode;
    },
    // 设置激活码
    [types.common.setActiveCode]: function (state, code) {
      state.activeCode = code;
    },
    // 保存入口地址
    [types.common.setEnterURL]: function (state, enterURL) {
      state.enterURL = enterURL;
    },
  },
  getters: {
    // 获取错误码
    [types.common.getErrorCode]: (state) => state.errorCode,
    // 获取激活码
    [types.common.getActiveCode]: (state) => state.activeCode,
    // 获取入口地址
    [types.common.getEnterURL]: (state) => state.enterURL,
  }
}
