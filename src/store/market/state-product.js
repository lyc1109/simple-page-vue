/**
 * 商品状态管理
 *
 * @author  hucw
 * @created 2018-01-02
 */

import types from './types-product'
import App from "@/assets/scripts/app";

const SKEY_PROUDCT = "product";

export default {
  state: {
    product: null
  },
  mutations: {
    [types.product.setProduct](state, product){
      state.product = product;
      App.sessionStorage.set(SKEY_PROUDCT, product);
    }
  },
  getters: {
    [types.product.getProduct]: function(state){
      if(state.product !== null) {
        return state.product;
      }
      return App.sessionStorage.get(SKEY_PROUDCT);
    }
  }
}
