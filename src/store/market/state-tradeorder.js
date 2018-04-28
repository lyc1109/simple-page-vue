/**
 * 商品状态管理
 *
 * @author  hucw
 * @created 2018-01-02
 */

import types from './types-tradeorder'
import App from "@/assets/scripts/app";

const SKEY_TRADEORDER_PROUDCTS = "tradeorder-products";
const SKEY_TRADEORDER_CARTPROUDCTS = "tradeorder-cartProducts";
export default {
  state: {

    // 需包含字段
    /*{
      productId: 产品ID,
      productName: 产品名称,
      productSpecId: 规格ID，如无规格则空,
      productItemCode: 规格型号，默认产品本身型号，有规格则是规格型号,
      primaryMedia: 产品主图,
      price: 产品价格,
      prepaidAmount: 试用预付款,
      productNum: 购买数量,
      isOnTrial: 是否试用,
      isGift: 是否赠品
    }*/
    products: null
  },
  mutations: {
    [types.tradeorder.setProducts](state, products){
      state.products = products;
      App.sessionStorage.set(SKEY_TRADEORDER_PROUDCTS, products);
    },
    [types.tradeorder.setCartProducts](state, products){
      state.cartProducts = products;
      App.sessionStorage.set(SKEY_TRADEORDER_CARTPROUDCTS, products);
    }
  },
  getters: {
    [types.tradeorder.getProducts]: function(state){
      if(state.products !== null) {
        return state.products;
      }
      return App.sessionStorage.get(SKEY_TRADEORDER_PROUDCTS);
    },
    [types.tradeorder.getCartProducts]: function(state){
      if(state.cartProducts !== null) {
        return state.cartProducts;
      }
      return App.sessionStorage.get(SKEY_TRADEORDER_CARTPROUDCTS);
    }
  }
}
