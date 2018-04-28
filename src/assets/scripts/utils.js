/**
 * 辅助工具类函数
 *
 * @author  hucw
 * @created 2017-06-13
 */
export default {
  /**
   * 解析浏览器URL上的参数
   * @param key 参数名称s
   */
  parseUrlParam: function (key) {
    const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
    let result = null;
    // vue hash模式
    let hashParams = window.location.hash.split("?")[1];
    if(hashParams) {
      result = hashParams.match(reg);
    } else {
      result = window.location.search.substr(1).match(reg);
    }
    return result !== null ? result[2] : null;
  },

  /**
   * 解析浏览器URL上的参数
   * @param url 指定URL
   * @param key 参数名称s
   */
  getParamsFromUrl: function (url, key) {
    let result = null;
    const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
    if(url.indexOf("?") > -1) {
      url = url.split("?")[1];
      result = url.match(reg);
    }
    return result !== null ? result[2] : null;
  },

  /**
   * 获取屏幕宽度
    * @param type 类型：client(可视区) | offset(包括边框可视区) | scroll(正文区域)
   */
  getScreenWidth: function (type = "client") {
    let width = 0;
    if(type === "offset") {
      width =  document.body.offsetWidth;
    } else if(type === "scroll") {
      width =  document.body.scrollWidth;
    } else {
      width =  document.body.clientWidth;
    }
    return width;
  },

  /**
   * 获取屏幕高度
   * @param type 类型：client(可视区) | offset(包括边框可视区) | scroll(正文区域)
   */
  getScreenHeight: function (type = "client") {
    let height = 0;
    if(type === "offset") {
      height =  document.body.offsetHeight;
    } else if(type === "scroll") {
      height =  document.body.scrollHeight;
    } else {
      height =  document.body.clientHeight;
    }
    return height;
  },

  // ----------------------------------------------------------
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  /**
   * @deprecated
   * 已废弃，请使用$router相关方法处理
   *
   *
   * 使用原生代替$router.push跳转界面,以便兼容支付宝和ios微信
   * @param _url
   * @param _params
   */
  loctnHref(_url,_params) {
    let _query = '';
    if(_params) {
      let _flag = true;
      for(let i in _params) {
        if(_flag) {
          _query += `?${i}=${_params[i]}`;
          _flag = false;
        } else {
          _query += `&${i}=${_params[i]}`;
        }
      }
      window.location.href = `${_url}${_query}`;
    } else {
      window.location.href = `${_url}`;
    }
  },
}
