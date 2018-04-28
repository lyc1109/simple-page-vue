/**
 * 强消息提示
 *
 * @author  hucw
 * @created 2017-06-16
 */

import { Toast } from 'mint-ui';

export default {
  alert (msg, duration = 2000,position = 'middle',className) {
    Toast({
      message: msg,
      duration: duration,
      position: position,
      className: className
    });
  },

  success (msg = '操作成功',duration = 2000,position = 'middle',className) {
    Toast({
      message: msg,
      duration: duration,
      iconClass: 'fa fa-check fa-2x color-success',
      position: position,
      className: className
    });
  },

  error (msg = '操作失败',duration = 2000,position = 'middle',className) {
    Toast({
      message: msg,
      duration: duration,
      iconClass: 'fa fa-times fa-2x color-danger',
      position: position,
      className: className
    });
  }
}
