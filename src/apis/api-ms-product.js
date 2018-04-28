/**
 * 产品管理微服务API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

export default (function () {

  //const MS_PRODUCT_HOST = process.env.MS_PRODUCT_HOST;

  return {
    page: function (params = {}) {
      let _params = Object.assign({
        page_no: 1,                    // 页面数, 默认从1开始
        page_size: 20,                 // 每页条数, 每页返回最多返回100条, 默认值为20
        page_sort: "",                 // 排序方式, 格式为: 排序字段_排序方向, 如: created_desc
        q: "",                         // 搜索关键字
      }, params);
      return http.get(this._baseUrl() + "/pms/page", _params);
    },

    /**
     * 获取商品详情
     * @param productEntityId 商品ID
     */
    detail: function (productEntityId) {
      return http.get(this._baseUrl() + "/pms/product/" + productEntityId)
    },

    _baseUrl(){
      return App.basehost;
    }
  }
}());
