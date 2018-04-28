/**
 * 日期时间格式化过滤器
 *
 * @author  hucw
 * @created 2017-12-25
 */

import moment from "moment";

export default {
  /**
   * 格式化日期
   *
   * @param date    时间
   * @param format  时间格式，默认格式化为 YYYY-MM-DD
   * @returns {string}
   */
  formatDate: function (date, format = "YYYY-MM-DD") {
    return (date === null || date === "") ? "" : moment(date).format(format);
  },

  /**
   * 格式化时间
   *
   * @param date    时间
   * @param format  时间格式，默认格式化为 YYYY-MM-DD  HH:mm
   * @returns {string}
   */
  formatTime: function (date, format = "YYYY-MM-DD HH:mm") {
    return (date === null || date === "") ? "" : moment(date).format(format);
  },

  /**
   * 格式化时间，到秒
   *
   * @param date    时间
   * @param format  时间格式，默认格式化为 YYYY-MM-DD  HH:mm:ss
   * @returns {string}
   */
  formatTimeSec: function (date, format = "YYYY-MM-DD HH:mm:ss") {
    return (date === null || date === "") ? "" : moment(date).format(format);
  },

  /**
   * 判断是否空时间
   * @param date
   * @returns {boolean}
   */
  isNullTime: function (date) {
    return typeof date === "undefined" || date === null || date <= 0;
  }
}
