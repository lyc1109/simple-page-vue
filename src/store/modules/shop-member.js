/**
 * 会员相关数据状态管理
 *
 * @author  hucw
 * @created 2017-06-13
 */
import types from "../types";

export default {
  state: {
    addressList: [],
    selectedAddress: null,
    isShowAddressSelector: false
  },
  mutations: {
    /**
     * 暂存店铺会员地址列表
     *
     * @param state       状态对象
     * @param addressList 店铺地址列表
     */
    [types.shopMember.setAddressList]: (state, addressList) => {
      state.addressList = addressList;
    },

    /**
     * 暂存选择的地址
     *
     * @param state       状态对象
     * @param selectedAddress 店铺地址列表
     */
    [types.shopMember.setAddressSelected]: (state, selectedAddress) => {
      state.selectedAddress = selectedAddress;
    },

    /**
     * 设置是否显示地址选择器
     *
     * @param state
     * @param isShow 是否显示地址选择器
     */
    [types.shopMember.setShowAddressSelector]: (state, isShow) => {
      state.isShowAddressSelector = isShow;
    },
  },
  getters: {
    /**
     * 获取店铺会员地址列表
     *
     * @param state 状态对象
     * @returns 返回会员地址列表
     */
    [types.shopMember.getAddressList]: (state) => state.addressList,

    /**
     * 获取已选择的店铺会员地址
     *
     * @param state 状态对象
     * @returns 返回会员地址列表
     */
    [types.shopMember.getAddressSelected]: (state) => state.selectedAddress,

    /**
     * 获取显示是否显示地址选择器
     *
     * @param state 状态对象
     * @returns 返回会员地址列表
     */
    [types.shopMember.isShowAddressSelector]: (state) => state.isShowAddressSelector,
  }
}
