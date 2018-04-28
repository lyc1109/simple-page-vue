/**
 * 服务订单状态管理
 *
 * @author luoyc
 * @date 2017/9/12
 */
import types from '../types'

export default {
  state: {
    pageData: [],
    tabVal: ''
  },
  mutations: {
    // 提交通用分页数据
    [types.serviceOrders.setPageData] (state,pageData){
      state.pageData = pageData
    },

    // 提交tab值
    [types.serviceOrders.setTabVal] (state,tabVal){
      state.tabVal = tabVal
    }
  },
  getters: {
    // 获取通用分页数据
    [types.serviceOrders.getPageData]: (state) => state.pageData,

    // 获取tab值
    [types.serviceOrders.getTabVal]: (state) => state.tabVal
  }
}
