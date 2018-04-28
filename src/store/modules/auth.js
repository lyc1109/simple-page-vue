/**
 * 授权验证状态管理
 *
 * @author  hucw
 * @created 2017-06-13
 */
import types from "../types";
import App from "scripts/app";

const TOKEN_KEY = "authToken";
const USER_KEY = "curUser";
const SHOP_KEY = "curShop";

export default {
  state: {
    authToken: App.storage.get(TOKEN_KEY),
    curUser: App.storage.get(USER_KEY),
    curShop: App.storage.get(SHOP_KEY),
    userRole: "USER"
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
    [types.oauth.getRole]: (state) => state.userRole
  }
}
