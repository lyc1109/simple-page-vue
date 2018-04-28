/**
 * 空净机状态管理
 *
 * @author hucw
 * @date   2017/12/26
 */
import types from '../types'

export default {
  state: {
    // 是否可以加载详情标识
    canLoadDetail: true
  },
  mutations: {
    // 更新是否可以加载详情标识
    [types.ifreshair.updateCanLoadDetailFlag]: (state, flag) => {
      state.canLoadDetail = flag;
    },
  },
  getters: {
    // 获取是否可以加载详情标识
    [types.ifreshair.getCanLoadDetailFlag]: (state) => state.canLoadDetail,
  }
}
