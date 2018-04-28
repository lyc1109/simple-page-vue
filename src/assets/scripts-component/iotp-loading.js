/**
 * IOTP UI - Loading
 *
 * 注：暂时基于mint-ui中的Indicator组件封装
 *
 * @author  hucw
 * @created 2017-12-29
 */
import {Indicator} from "mint-ui";

export default (function () {
  let _isLoading = false;
  let _timeoutFlag = 0;

  return {
    show: function (msg = "") {
      if (_isLoading === true) {
        return;
      }

      _isLoading = true;
      clearTimeout(_timeoutFlag);
      Indicator.open({
        text: msg,
        spinnerType: 'fading-circle'
      });
      this._autoHide();
    },

    hide: function () {
      _isLoading = false;
      Indicator.close();
      clearTimeout(_timeoutFlag);
    },

    _autoHide: function () {
      // 避免出错未隐藏loading，超时15秒自动隐藏
      _timeoutFlag = setTimeout(() => {
        this.hide();
      }, 35000);
    }
  }
})()

