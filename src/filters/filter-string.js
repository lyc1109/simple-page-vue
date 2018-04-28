/**
 * 字符串过滤器
 *
 * @author  hucw
 * @created 2018-01-02
 */

export default {
  isNullStr: function (str) {
    return this.isUndefined(str) || (str === null || str === "" || str.length === 0)
  },

  isUndefined: function (str) {
    return typeof str === "undefined" || str === "undefined";
  },

  isNullHtml: function (str) {
    if(str === null || typeof str === 'undefined') {
      return true;
    }
    if(str.indexOf("<img") > -1) {
      return false;
    }

    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str=str.replace(/ /ig,'');//去掉
    return this.isNullStr(str);
  }
}
