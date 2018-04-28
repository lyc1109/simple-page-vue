/**
 * 统一授权登录相关状态处理动作
 *
 * @author  hucw
 * @created 2018-01-02
 */
export default {
  oauth: {
    getAuthToken: "getAuthToken",
    updateAuthToken: "updateAuthToken",

    getCurUser: "getCurUser",
    updateCurUser: "updateCurUser",

    getCurShop: "getCurShop",
    updateCurShop: "updateCurShop",

    getRole: "getRole",
    updateRole: "updateRole",

    setShopId: "setShopId",
    getShopId: "getShopId",

    setRedirectUrl: "setRedirectUrl",
    getRedirectUrl: "getRedirectUrl",
  }
};
