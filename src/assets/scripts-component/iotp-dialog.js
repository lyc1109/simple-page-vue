/**
 * IOTP UI - 对话框组件
 *
 * 注：暂时基于mint-ui中的MessageBox组件封装
 *
 * @author  hucw
 * @created 2017-12-27
 */

import {MessageBox} from 'mint-ui';

let DEFAULT = {
  title: "",
  message: "",
  confirmButtonText: "确定",
  showCancelButton: false,
  cancelButtonText: "取消",
  closeOnClickModal: false,
  showInput: false,
  inputType: "text",
  inputValue: "",
  inputPlaceholder: ""
};

export default {
  /**
   * 弹出提示
   * @param msg 消息内容
   */
  alert: function (msg) {
    MessageBox(Object.assign(DEFAULT,{
      title: "提示",
      message: msg
    }))
  },

  /**
   * 确认提示
   * @param msg              消息内容
   * @param callbackFn       回调函数
   * @param cancelCallbackFn 取消回调
   */
  confirm: function (msg, callbackFn, cancelCallbackFn) {
    MessageBox(Object.assign(DEFAULT,{
      title: "确认提示",
      message: msg,
      showCancelButton: true
    }))
      .then((action) => {
        if(action === "confirm") {
          callbackFn && callbackFn.call();
        } else {
          cancelCallbackFn && cancelCallbackFn.call();
        }
      })
      .catch(() => {
        cancelCallbackFn && cancelCallbackFn.call();
      })
  },

  /**
   * 输入确认框
   *
   * @param msg        提示输入内容
   * @param callbackFn 回调函数
   */
  prompt: function (msg = "请输入内容", callbackFn) {
    MessageBox.prompt(' ', msg, {
      closeOnClickModal: false,
      inputValidator: (val) => val !== "" && val !== null,
      inputErrorMessage: "请输入内容"
    })
      .then(({value, action}) => {
        if(action === "confirm") {
          callbackFn && callbackFn.call(this, value);
        }
      })
      .catch(() => {
        //do nothing
      });
  },

  show: function (options, callbackFn) {
    MessageBox(Object.assign(DEFAULT, options))
      .then((action) => {
        if(action === "confirm") {
          callbackFn && callbackFn.call();
        }
      });
  }
}
