/**
 * 支付宝基础配置
 *
 * @author  huanglh
 * @created 2017-11-04
 */

import toast from '@/assets/scripts-component/iotp-toast';

export default {

  /**
   * 支付宝初始化
   *
   * @param callbackFn 回调
   */
  init: function (callbackFn = null) {
    if(!this.isInAlipay()) {
      toast.warn("请在支付宝内部打开哦!");
      return;
    }

    // 如果jsbridge已经注入则直接调用
    if (window.AlipayJSBridge) {
      if(callbackFn !== null && typeof callbackFn === "function") {
        callbackFn.call(this);
      }
    } else {
      // 如果没有注入则监听注入的事件
      document.addEventListener('AlipayJSBridgeReady', callbackFn, false);
    }
  },

  /**
   * 支付宝扫一扫
   * @param callbackFn 回调函数
   */
  scanQRCode: function (callbackFn = null) {
    if(!this.isInAlipay()) {
      toast.warn("请在支付宝内部打开哦!");
      return;
    }
    let _scanType = 'qr';  //扫描目标类型，支持 qr / bar，相应扫码选框会不同，默认 qr
    this._getAliPay().scan({
      type: _scanType
    },function (resp) {
      if(callbackFn !== null && typeof callbackFn === "function") {
        callbackFn.call(this, resp.code);
      }
    })
  },

  /**
   * 是否支付宝内部
   *
   * @returns {boolean} true | false
   */
  isInAlipay: function () {
    return (/Alipay/i).test(window.navigator.userAgent);
  },

  _getAliPay: function () {
    return window.ap;
  }
}
