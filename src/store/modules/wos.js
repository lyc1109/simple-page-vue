/**
 * 工单相关数据状态管理
 *
 * @author  huanglh
 * @created 2017-08-30
 */
import types from "../types";

export default {
  state: {
    pageData: {},
    device: {},
    valuationData: {},
    serviceData: {},
    scroll: ''
  },
  mutations: {
    // 工单首页数据
    [types.wos.setPageData]: function (state, pageData) {
      state.pageData = pageData;
    },
    // 工单关联设备数据
    [types.wos.setDeviceData]: function (state, device) {
      state.device = device;
    },
    // 工单计价
    [types.wos.setValuationData]: function (state, valuationData) {
      state.valuationData = valuationData;
    },
    // 工单计价详情
    [types.wos.setServiceData]: function (state, serviceData) {
      state.serviceData = serviceData;
    },
    // 工单首页滚动条位置
    [types.wos.setScroll]: function (state, _scroll) {
      state.scroll = _scroll;
    },
  },
  getters: {
    // 获取工单首页数据
    [types.wos.getPageData]: (state) => state.pageData,

    // 获取工单设备数据
    [types.wos.getDeviceData]: (state) => state.device,

    // 获取工单计价首页数据
    [types.wos.getValuationData]: (state) => state.valuationData,

    // 获取工单计价详细数据
    [types.wos.getServiceData]: (state) => state.serviceData,

    // 获取工单计价详细数据
    [types.wos.getScroll]: (state) => state.scroll
  }
}
