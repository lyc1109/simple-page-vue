/**
 * 店铺会员管理
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

export default {
  findAllShopServices: function () {
    return http.get(App.apihost + '/shopServiceDefs/list/options')
  }
}
