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
    tabVal: '',
    sceneType: 'LeaseScanQRCode'
  },
  mutations: {
    // 提交通用分页数据
    [types.leaseProducts.setPageData]: function (state, pageData) {
      state.pageData = pageData;
    },

    // 提交tab值
    [types.leaseProducts.setTabVal] (state,tabVal){
      state.tabVal = tabVal
    },

    // 提交租赁方式
    [types.leaseProducts.setSceneType] (state,sceneType){
      state.sceneType = sceneType
    }
  },
  getters: {
    // 获取通用分页数据
    [types.leaseProducts.getPageData]: (state) => state.pageData,

    // 获取tab值
    [types.leaseProducts.getTabVal]: (state) => state.tabVal,

    // 获取租赁方式
    [types.leaseProducts.getSceneType]: (state) => state.sceneType
  }
}
