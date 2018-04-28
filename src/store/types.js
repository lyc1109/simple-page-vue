/**
 * store的动作处理
 *
 * @author  hucw
 * @created 2017-06-12
 */

import CommonTypes from "./common/types-common";
import AppPayTypes from "./common/types-app-pay";
import OAuthTypes from "./common/types-oauth";

import leaseOrderTypes from "./lease/types-leaseorder";
import IDeviceTypes from "./iot/types-idevice";
import IFreshairTypes from "./iot/types-ifreshair";
import ProductTypes from "./market/types-product";
import TradeorderTypes from "./market/types-tradeorder";

let types = {};
Object.assign(types, CommonTypes);
Object.assign(types, OAuthTypes);
Object.assign(types, leaseOrderTypes);
Object.assign(types, AppPayTypes);
Object.assign(types, IDeviceTypes);
Object.assign(types, IFreshairTypes);
Object.assign(types, ProductTypes);
Object.assign(types, TradeorderTypes);
Object.assign(types, {
  // 通用状态管理
  common: {
    // 分页数据set/get
    getPageData: "getPageData",
    setPageData: "setPageData",
    //错误码set/get
    setErrorCode: "setErrorCode",
    getErrorCode: "getErrorCode",
    //扫码激活码set/get
    setActiveCode: "setActiveCode",
    getActiveCode: "getActiveCode",
    // 保存初次进入的页面路径，兼容ios和微信
    setEnterURL: "setEnterURL",
    getEnterURL: "getEnterURL",
  },

  // 店铺会员相关
  shopMember: {
    setAddressList: "setAddressList",
    getAddressList: "getAddressList",

    setAddressSelected: "setAddressSelected",
    getAddressSelected: "getAddressSelected",

    setShowAddressSelector: "setShowAddressSelector",
    isShowAddressSelector: "isShowAddressSelector",
  },

  // 用户设备管理
  userDevices: {
    // 分页数据set/get
    getPageData: "getUserDevicePageData",
    setPageData: "setUserDevicePageData",

    // 手工录入数据set/get
    setBindData: "setBindData",
    getBindData: "getBindData"
  },

  // 租赁产品管理
  leaseProducts: {
    // 分页数据set/get
    getPageData: "getLeaseProductPageData",
    setPageData: "setLeaseProductPageData",

    // tab值set/get
    getTabVal: "getLeaseProductTabVal",
    setTabVal: "setLeaseProductTabVal",

    // 租赁方式set/get
    getSceneType: "getLeaseProductSceneType",
    setSceneType: "setLeaseProductSceneType"
  },

  // 服务订单管理
  serviceOrders: {
    // 分页数据set/get
    getPageData: "getServiceOrderPageData",
    setPageData: "setServiceOrderPageData",

    // tab切换
    getTabVal: "getServiceOrderTabVal",
    setTabVal: "setServiceOrderTabVal"
  },

  // 服务订单管理
  memberCommunity: {
    // 分页数据set/get
    getPageData: "getCommunityPageData",
    setPageData: "setCommunityPageData"
  },

  // 工单数据管理
  wos: {
    // 首页数据set/get
    getPageData: "getPageData",
    setPageData: "setPageData",

    //工单计价数据
    setDeviceData: "setDeviceData",
    getDeviceData: "getDeviceData",

    //工单计价数据
    setValuationData: "setValuationData",
    getValuationData: "getValuationData",

    //工单计价数据
    setServiceData: "setServiceData",
    getServiceData: "getServiceData",

    //工单首页滚动条位置
    setScroll: "setScroll",
    getScroll: "getScroll"
  },

  // jbr状态管理
  jbr: {
    getServiceOrderQuery: "getServiceOrderQuery"
  },
});

export default types;
