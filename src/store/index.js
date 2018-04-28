/**
 * Vuex状态管理入口
 *
 * @author  hucw
 * @created 2017-06-05
 */

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import OAuth from "./common/state-oauth";
import common from "./modules/common";
import shopMember from "./modules/shop-member";
import userDevices from "./modules/user-devices";
import leaseProducts from "./modules/lease-products";
import wosData from "./modules/wos";
import serviceOrder from './modules/service-order'
import jbrMember from './modules/jbr-member'


import AppPayStore from './common/state-app-pay';
import CommonStore from './common/state-common';
import LeaseOrderStore from './lease/state-leaseorder';

import IDeviceStore from './iot/state-idevice';
import IfreshairStore from './iot/state-ifreshair';
import ProductStore from './market/state-product';
import TradeorderStore from './market/state-tradeorder';

let StoreModules = {
  OAuth,
  common,
  CommonStore,
  shopMember,
  userDevices,
  leaseProducts,
  wosData,
  serviceOrder,
  jbrMember,
  AppPayStore,
  LeaseOrderStore,
  IDeviceStore,
  IfreshairStore,
  ProductStore,
  TradeorderStore
};

export default new Vuex.Store({
  state: {
    showLoading: false,
    showEmptyView: false,
    refresh: false,
    serviceOrder_position: 0,
    market_position: 0,
    device_position: 0
  },
  mutations: {
    showLoading: function (state) {
      state.showLoading = true;
    },
    hideLoading: function (state) {
      state.showLoading = false;
    },
    showEmptyView: function (state) {
      state.showEmptyView = true
    },
    hideEmptyView: function (state) {
      state.showEmptyView = false
    },
    isRefresh(state, n) {
      state.refresh = n
    },
    saveServiceOrderPosition(state, n) {
      state.serviceOrder_position = n
    },
    saveMarketPosition(state, n) {
      state.market_position = n
    },
    saveDevicePosition(state, n) {
      state.device_position = n
    }
  },

  modules: StoreModules
});
