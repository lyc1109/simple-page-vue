/**
 * 统一授权状态管理
 *
 * @author hucw
 * @date   2017/12/26
 */
import types from '../types'
import App from "@/assets/scripts/app";

const TOKEN_KEY = "authToken";
const USER_KEY = "curUser";
const SHOP_KEY = "curShop";
const SHOP_ID_KEY = "shopId";
const REDIRECT_URL_KEY = "redirectUrl";

export default {
  state: {
    authToken: App.storage.get(TOKEN_KEY),
    userRole: "USER",
    curUser: App.storage.get(USER_KEY),
    curShop: App.storage.get(SHOP_KEY),

    shopId: "",
    redirectUrl: "",
  },
  mutations: {
    /**
     * 更新授权token
     *
     * @param state 状态对象
     * @param token auth token
     */
    [types.oauth.updateAuthToken]: (state, token) => {
      state.authToken = token;
      let storageToken = App.storage.get(TOKEN_KEY);
      if (storageToken === null || storageToken !== token) {
        App.storage.set(TOKEN_KEY, token);
      }
    },

    /**
     * 更新当前用户
     *
     * @param state  状态对象
     * @param curUsr 当前用户信息
     */
    [types.oauth.updateCurUser]: (state, curUsr) => {
      state.curUser = curUsr;
      App.storage.set(USER_KEY, curUsr);
    },

    /**
     * 更新当前店铺信息
     *
     * @param state   状态对象
     * @param curShop 当前店铺
     */
    [types.oauth.updateCurShop]: (state, curShop) => {
      state.curShop = curShop;
      App.storage.set(SHOP_KEY, curShop);
    },

    /**
     * 更新当前用户角色
     *
     * @param state   状态对象
     * @param role 当前店铺
     */
    [types.oauth.updateRole]: (state, role) => {
      state.userRole = role;
    },

    /**
     * 更新当前店铺ID
     * @param state  状态对象
     * @param shopId 店铺ID
     */
    [types.oauth.setShopId]: (state, shopId) => {
      // 若已存在店铺ID存储时间不超过10秒，则不再更新
      let existShopId = App.storage.get(SHOP_ID_KEY);
      if(existShopId !== null){
        let storeTime = existShopId.time;
        if(new Date().getTime() - storeTime <= 10000) {
          state.shopId = existShopId.shopId;
          return ;
        }
      }

      state.shopId = shopId;
      App.storage.set(SHOP_ID_KEY, {
        shopId: shopId,
        time: new Date().getTime()
      });
    },

    /**
     * 更新重定向路径
     * @param state       状态对象
     * @param redirectUrl 重定向路径
     */
    [types.oauth.setRedirectUrl]: (state, redirectUrl) => {
      // 若已存在重定向路径存储时间不超过10秒，则不再更新
      let existRedirectUrl = App.storage.get(REDIRECT_URL_KEY);
      if(existRedirectUrl !== null){
        let storeTime = existRedirectUrl.time;
        if(new Date().getTime() - storeTime <= 10000) {
          state.redirectUrl = existRedirectUrl.redirectUrl;
          return ;
        }
      }

      state.redirectUrl = redirectUrl;
      App.storage.set(REDIRECT_URL_KEY, {
        redirectUrl: redirectUrl,
        time: new Date().getTime()
      });
    }
  },
  getters: {
    /**
     * 获取授权token
     *
     * @param state 状态对象
     * @returns 返回token
     */
    [types.oauth.getAuthToken]: (state) => state.authToken,

    /**
     * 获取当前用户
     *
     * @param state 状态对象
     * @returns 返回当前用户
     */
    [types.oauth.getCurUser]: (state) => state.curUser,

    /**
     * 获取当前店铺
     *
     * @param state 状态对象
     * @returns 返回当前店铺
     */
    [types.oauth.getCurShop]: (state) => state.curShop,

    /**
     * 获取当前用户角色
     *
     * @param state 状态对象
     * @returns 返回当前角色
     */
    [types.oauth.getRole]: (state) => state.userRole,

    /**
     * 获取当前店铺ID
     *
     * @param state 状态对象
     * @returns 返回当前店铺ID
     */
    [types.oauth.getShopId]: (state) => {
      if(state.shopId !== "") {
        return state.shopId;
      }
      let shop = App.storage.get(SHOP_ID_KEY);
      return shop !== null ? shop.shopId : "";
    },

    /**
     * 获取重定向路径
     *
     * @param state 状态对象
     * @returns 返回重定向路径
     */
    [types.oauth.getRedirectUrl]: (state) => {
      if(state.redirectUrl === "") {
        let redirect = App.storage.get(REDIRECT_URL_KEY);
        return redirect.redirectUrl;
      }
      return state.redirectUrl;
    }
  }
}
