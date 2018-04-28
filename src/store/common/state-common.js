/**
 * APP通用状态存储管理
 *
 * @author hucw
 * @date   2017/12/26
 */
import types from '../types'

export default {
  state: {
    // 滚动位置
    scrollPosition: {
      page: "",
      x: 0,
      y: 0
    }
  },
  mutations: {
    // 设置支付信息
    [types.scroll.setScrollPosition] (state, position){
      state.scrollPosition = Object.assign(state.scrollPosition, position);
    }
  },
  getters: {
    // 获取支付信息
    [types.scroll.getScrollPosition]: (state) => state.scrollPosition,
  }
}
