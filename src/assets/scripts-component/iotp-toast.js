/**
 * IOTP组件 - 弱消息提示
 *
 * 注：基于开源组件Toasted：https://github.com/shakee93/vue-toasted二次封装
 *
 * @author  hucw
 * @created 2017-12-28
 */
import Vue from 'vue';
import Toasted from "vue-toasted";

Vue.use(Toasted);

let DEFAULTS = {
  position: "bottom-center",
  duration: 5000,
  singleton: true,
  theme: "primary",
  iconPack: "fontawesome",
  containerClass: "iotp-toasted",
};

export default {
  /**
   * 成功消息提示
   *
   * @param msg     消息内容
   * @param options 配置选项，参考：https://github.com/shakee93/vue-toasted#api
   */
  success: function (msg = "", options = {}) {
    this.clear();
    Vue.toasted.success(msg, Object.assign(DEFAULTS, {
      icon: "check-circle"
    }, options));
  },

  /**
   * 错误消息提示
   *
   * @param msg     消息内容
   * @param options 配置选项，参考：https://github.com/shakee93/vue-toasted#api
   */
  error: function (msg, options = {}) {
    this.clear();
    Vue.toasted.show(msg, Object.assign(DEFAULTS, {
      icon: "exclamation-circle",
      theme: "bubble",
    }, options));
  },

  /**
   * 警示消息提示
   *
   * @param msg     消息内容
   * @param options 配置选项，参考：https://github.com/shakee93/vue-toasted#api
   */
  warn: function (msg, options = {}) {
    this.clear();
    this.error(msg, options);
  },

  /**
   * 重要消息提示
   *
   * @param msg     消息内容
   * @param options 配置选项，参考：https://github.com/shakee93/vue-toasted#api
   */
  info: function (msg, options = {}) {
    this.clear();
    Vue.toasted.info(msg, Object.assign(DEFAULTS, {
      icon: "lightbulb-o",
    }, options));
  },

  /**
   * 普通消息提示
   *
   * @param msg     消息内容
   * @param options 配置选项，参考：https://github.com/shakee93/vue-toasted#api
   */
  show: function (msg, options = {}) {
    this.clear();
    Vue.toasted.show(msg, Object.assign(DEFAULTS, options));
  },

  clear: function () {
    Vue.toasted.clear();
  }
}
