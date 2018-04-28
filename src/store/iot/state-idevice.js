/**
 * 设备信息状态管理
 *
 * @author hucw
 * @date   2017/12/26
 */
import types from '../types'
import App from "@/assets/scripts/app";

const USER_DEVICE_KEY = "UserDevice";
const DEVICE_KEY = "IotDevice";

export default {
  state: {
    // 用户设备
    userDevice: App.sessionStorage.get(USER_DEVICE_KEY),
    // 设备详情
    device: App.sessionStorage.get(DEVICE_KEY),

    // 是否可以加载详情标识
    canLoadDetail: true
  },
  mutations: {
    // 更新用户设备
    [types.idevice.updateUserDevice]: (state, userDevice) => {
      state.userDevice = userDevice;
      App.sessionStorage.set(USER_DEVICE_KEY, userDevice);
    },
    // 更新设备
    [types.idevice.updateDevice]: (state, device) => {
      state.device = device;
      App.sessionStorage.set(DEVICE_KEY, device);
    },

    // 更新是否可以加载详情标识
    [types.ifreshair.updateCanLoadDetailFlag]: (state, flag) => {
      state.canLoadDetail = flag;
    },
  },
  getters: {
    // 获取用户设备
    [types.idevice.getUserDevice]: (state) => {
      if(state.userDevice === null) {
        return App.sessionStorage.get(USER_DEVICE_KEY);
      }
      return state.userDevice;
    },
    // 获取设备
    [types.idevice.getDevice]: (state) => {
      if(state.device === null) {
        return App.sessionStorage.get(DEVICE_KEY);
      }
      return state.device;
    },
    // 获取是否可以加载详情标识
    [types.ifreshair.getCanLoadDetailFlag]: (state) => state.canLoadDetail,
  }
}
