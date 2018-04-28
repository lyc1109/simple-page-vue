/**
 * 店铺会员管理
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

export default {
  findAllAddress: function () {
    return http.get(App.apihost + "/user/addresses");
  },

  findDefaultAddress: function () {
    return new Promise((resolved) => {
      this.findAllAddress()
        .then((data) => {
          let hasDefault = false;
          if(data !== null && data.length > 0) {
            for(let address of data) {
              if(address.defaultAddress) {
                hasDefault = true;
                resolved(address);
                break;
              }
            }
            if(!hasDefault) {
              for(let address of data) {
                if(address.fullAddress) {
                  resolved(address);
                  break;
                }
              }
            }
          }
          resolved(null)
        })
    })
  }
}
