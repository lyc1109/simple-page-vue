/**
 * 微信基础配置
 *
 * @author  hucw
 * @created 2017-09-05
 */
import toast from '@/assets/scripts-component/iotp-toast';
import sysApi from "@/apis/api-sys";

export default {

  /**
   * 微信JSSDK初始化
   *
   * @param curUrl     当前页面URL
   * @param callBackFn 回调函数
   */
  init: function (curUrl = "", callBackFn = null) {
    if(!this.isInWechat()) {
      toast.warn("请在微信内部打开哦!");
      return;
    }
    if(curUrl === ""){
      toast.warn("请传入当前页面URL");
      return;
    }

    // 初始化所需要参数
    let DEFAULTS = {
      debug: true,           // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: '',             // 必填，公众号的唯一标识
      timestamp: null,       // 必填，生成签名的时间戳
      nonceStr: '',          // 必填，生成签名的随机串
      signature: '',         // 必填，签名，见附录1
      jsApiList: []          // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    };

    sysApi.getWechatPaySign(curUrl)
      .then((signInfo) => {
        let wechatConfig = Object.assign(DEFAULTS, signInfo);
        console.log("当前URL："+ curUrl +"，微信签名信息。" + JSON.stringify(wechatConfig));

        this._getWx().config(wechatConfig);
        this._getWx().ready(function(){
          console.log("微信JSSDK初始化成功。");
          if(callBackFn !== null && typeof  callBackFn === "function") {
            callBackFn.call(this)
          }
        });
        this._getWx().error(function(res){
          console.log("微信JSSDK初始化失败：" + JSON.stringify(res));
          toast.error("微信JSSDK初始化失败：" + JSON.stringify(res));
        });
      })
      .catch((errMsg) => {
        toast.error("微信初始化失败。" + errMsg);
      });
  },

  /**
   * 微信扫一扫
   *
   * @param callBackFn 回调函数
   */
  scanQRCode: function (callBackFn = null) {
    if(!this.isInWechat()) {
      toast.warn("请在微信内部打开哦!");
      return;
    }

    this._getWx().scanQRCode({
      needResult: 1,                        // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["qrCode","barCode"],       // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        const result = res.resultStr;       // 当needResult 为 1 时，扫码返回的结果
        if(callBackFn !== null && typeof  callBackFn === "function") {
          callBackFn.call(this, result)
        }
      }
    });
  },

  /**
   * 微信支付
   *
   * @param paySign    支付签名信息
   * @param callBackFn 回调函数
   */
  pay: function (paySign = {}, callBackFn = null) {
    if(!this.isInWechat()) {
      toast.warn("请在微信内部打开哦!");
      return;
    }

    console.log("发起微信支付..." + JSON.stringify(paySign));
    this._getWx().chooseWXPay({
      appId: paySign.appId,
      timestamp: paySign.timeStamp,     // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: paySign.nonceStr,       // 支付签名随机串，不长于 32 位
      package: paySign.package,         // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: paySign.signType,       // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: paySign.paySign,          // 支付签名
      success: function (res) {
        callBackFn && callBackFn.call(this, res)
      },
      fail: function (errMsg) {
        console.log("调起微信支付失败..." + JSON.stringify(errMsg));
      }
    });
  },

  getLocation: function (callbackFn) {
    if(!this.isInWechat()) {
      toast.warn("请在微信内部打开哦!");
      return;
    }
    console.log("获取位置...");
    this._getWx().getLocation({
      type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function (res) {
        callbackFn && callbackFn.call(this, res);
      }
    });
  },

  isInWechat: function () {
    return (/MicroMessenger/i).test(window.navigator.userAgent);
  },

  _getWx: function () {
    if(wx) {
      return wx;
    }
    return window.wx;
  },

  //
  //
  //
  //
  //
  //
  //
  //
  /**
   * 拍照或从手机相册中选图接口
   * @param count
   * @param sizeType         可以指定是原图还是压缩图，默认二者都有   ['original', 'compressed']
   * @param sourceType       可以指定来源是相册还是相机，默认二者都有 ['album', 'camera']
   * @param success          回调函数
   */
  chooseImage: function (_data) {
    this._getWx().chooseImage({
      count: _data.count,
      sizeType: _data.sizeType,
      sourceType: _data.sourceType,
      success: function (res) {
        _data.success && _data.success(res);
      }
    });
  },


  /**
   * 调起原生AirKiss界面
   * @param callBackFn 回调函数
   */
  airkiss: function(callBackFn) {
    if(!this.isInWechat()) {
      toast.warn("请在微信内部打开哦!");
      return;
    }
    this._getWx().checkJsApi({
      jsApiList: ['configWXDeviceWiFi'],
      success: function() {
        WeixinJSBridge.invoke('configWXDeviceWiFi', {}, function(res){
          callbackFn && callbackFn.call(this, res);
        })
      }
    })

  },

  /**
   * 获取网络状态
   * @param callBackFn 回调函数
   */
  getNetworkType: function(callbackFn) {
    if(!this.isInWechat()) {
      toast.warn("请在微信内部打开哦!");
      return;
    }
    this._getWx().getNetworkType({
      success: function (res) {
        let networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
        callbackFn && callbackFn.call(this, networkType);
      }
    });

  }
}
