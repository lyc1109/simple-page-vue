/**
 * 租赁产品管理API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

export default {

  /**
   * 获取租赁产品详情
   * @param leaseProductId 租赁产品ID
   */
  detail: function (leaseProductId = "") {
    return http.get(this._baseUrl() + "/products/" + leaseProductId);
  },

  /**
   * 获取租赁产品对应租赁场景信息配置
   * @param leaseProductId 租赁产品ID
   */
  scenario: function (leaseProductId="") {
    return http.get(this._baseUrl()  + "/products/" + leaseProductId + "/scenario");
  },

  /**
   * 获取租赁产品相关协议
   * @param leaseProductId 租赁产品ID
   */
  agreements: function (leaseProductId="") {
    return http.get(this._baseUrl()  + "/products/" + leaseProductId + "/agreements");
  },

  /**
   * 判断是否能够使用体验卡
   * @param leaseProductId 租赁产品ID
   */
  canUsedFeePackage: function (leaseProductId="") {
    return http.get(this._baseUrl()  + "/rechargeorders/freepackage/used", {
      leaseProductId: leaseProductId
    });
  },

  /**
   * 获取租赁产品信息、租赁场景、协议信息
   * @param leaseProductId 租赁产品ID
   * @param callbackFn     回调函数
   */
  detailInfos: function (leaseProductId="", callbackFn = null) {
    let detailInfo = {};
    // 获取租赁产品
    this.detail(leaseProductId)
      .then((leaseProduct) => {
        detailInfo.leaseProduct = leaseProduct;

        // 获取租赁场景
        this.scenario(leaseProductId)
          .then((leaseScenario) => {
            detailInfo.leaseScenario = leaseScenario;

            // 获取协议
            this.agreements(leaseProductId)
              .then((agreements) => {
                if(agreements !== null && agreements.length > 0) {
                  for(const item of agreements) {
                    if(item.type === "lease") {
                      detailInfo.leaseAgreement = item.agreement;
                    } else if(item.type === "refund") {
                      detailInfo.refundAgreement = item.agreement;
                    }
                  }
                }

                callbackFn.call(this, detailInfo);
              })
          })
      })
  },

  // ==================================================================
  // private methods ==========================================================
  _baseUrl: function () {
    return App.apihost + "/lease";
  }
}
