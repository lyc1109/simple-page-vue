/**
 * 系统通用处理API
 *
 * @author  hucw
 * @created 2017-07-07
 */

import App from "scripts/app";
import http from '@/http';

export default {
  /**
   * 校验短信验证码
   *
   * @param mobile
   * @param smsCode
   */
  validateSmsCode: function (mobile, smsCode) {
    return http.post(App.apihost + "/sms/validate", {
      mobile: mobile,
      code: smsCode
    });
  },

  /**
   * 获取微信签名信息
   *
   * @param curUrl 当前页面URL
   */
  getWechatPaySign: function (curUrl) {
    return http.get(App.apihost + "/wechat/jssdk/config", {
      url: curUrl
    }, false);
  },

  /**
   * 查询是否符合信用免押租赁条件
   *
   * @param userCertNo 身份照
   * @param userName   真实姓名
   * @param score      信用分
   */
  isCreditRentAccord: function (userCertNo, userName, score) {
    return http.get(App.apihost + "/zhima/isaccord", {
      cert_no: userCertNo,
      name: userName,
      credit_score: score
    });
  },

  /**
   * 获取城市天气
   *
   * @param province 省份
   * @param city     城市
   */
  getWeather: function (province, city) {
    return http.get(App.basehost + "/api/v1/weather/" + province + "/" + city)
  },

  /**
   * 获取城市TDS
   * @param province 省份
   * @param city     城市
   */
  getCityTDS: function (province, city) {
    return http.get(App.basehost + "/api/v1/water/tds/" + province + "/" + city)
  },

  /**
   * 获取TDS数据
   * @param mapLevel 地图级别
   */
  getTDS: function (mapLevel) {
    return http.get(App.basehost + "/api/v1/water/tds/" + mapLevel)
  }
};
