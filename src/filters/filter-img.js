/**
 * 图标过滤器
 *
 * @author  hucw
 * @created 2017-12-25
 */

import App from '@/assets/scripts/app';
import StringUtil from './filter-string';

export default (function(){

  const DEFUALT_IMG = "/assets-h5/static/images/placeholder.png";
  const OSS_HOST = App.ossHost;

  let parseImgUrl = function (url) {
    let imgUrl = url;
    if (StringUtil.isNullStr(url)) {
      return OSS_HOST + DEFUALT_IMG;
    }
    if (imgUrl.startsWith("http")) {
      return imgUrl;
    }
    imgUrl = OSS_HOST + imgUrl;
    return imgUrl;
  };

  return {
    /**
     * OSS图片缩放处理
     * 文档参考：https://help.aliyun.com/document_detail/44688.html?spm=a2c4g.11186623.6.971.PeQjbq
     *
     * @param url    图片路径
     * @param params 处理参数，如 'm_fill,h_100,w_100'
     */
    resizeImg: function (url, params = "") {
      let ossProcess = "";
      if (!StringUtil.isNullStr(params)) {
        ossProcess = "/resize," + params;
      }
      return this.processImg(url, ossProcess);
    },

    /**
     * OSS图片裁剪处理
     * 文档参考：https://help.aliyun.com/document_detail/44693.html?spm=a2c4g.11186623.6.974.7NSxh5
     *
     * @param url    图片路径
     * @param params 处理参数，如 'h_100,w_100'
     */
    cropImg: function (url, params = "") {
      let ossProcess = "";
      if (!StringUtil.isNullStr(params)) {
        ossProcess = "/crop," + params;
      }
      return this.processImg(url, ossProcess);
    },

    /**
     * OSS图片质量转换处理
     * 文档参考：https://help.aliyun.com/document_detail/44705.html?spm=a2c4g.11186623.6.988.EenmBi
     *
     * @param url    图片路径
     * @param params 处理参数，如 'q_80'，'Q_80'
     */
    qualityImg: function (url, params = "") {
      let ossProcess = "";
      if (!StringUtil.isNullStr(params)) {
        ossProcess = "/quality," + params;
      }
      return this.processImg(url, ossProcess);
    },

    /**
     * OSS图片处理
     * 文档参考：https://help.aliyun.com/document_detail/44705.html?spm=a2c4g.11186623.6.988.EenmBi
     *
     * @param url    图片路径
     * @param params 处理参数，如 "/resize,m_fill,h_100,w_100/quality,q_80"
     */
    processImg: function (url, params = "") {
      let imgUrl = parseImgUrl(url);
      if(params) {
        if (params.startsWith("?x-oss-process")) {
          imgUrl += params
        } else {
          imgUrl += "?x-oss-process=image";
          imgUrl += params;
        }
      }
      return imgUrl;
    },

    /**
     * 静态图片过滤器
     * 主要用于将本地/static/images上传到oss后，对URL进行解析处理
     *
     * @param url     图片地址
     * @param process 阿里云oss图片处理，例如：'/resize,m_fixed,h_400/quality,q_80'， 详细请参考：https://help.aliyun.com/document_detail/44705.html?spm=a2c4g.11186623.6.988.OMmJs3
     */
    staticImg: function (url, process = "") {
      let baseUrl = App.ossHost + "/assets-h5";
      if (url === null || url === "" || typeof url === "undefined") {
        return baseUrl + DEFUALT_IMG;
      }
      // http开头或非/static/images开头不处理
      if(url.startsWith("http") || !url.startsWith("/static/images")) {
        return url;
      }

      url = baseUrl + url;

      if(process !== "") {
        if (process.startsWith("?x-oss-process=image")) {
          return url + process;
        } else {
          return url + "?x-oss-process=image" + process;
        }
      } else {
        return url;
      }
    },

    // ========================================================================================================================
    /**
     * @deprecated
     * 请使用 processImg 方法
     *
     * @param url 图片地址
     * @param wh  阿里云OSS图片处理样式，支持：
     *   w100, w200, w300, w400
     *   wh100, wh200, wh300, wh400
     *   q70
     */
    img: function (url, wh = "") {
      if (url === null || url === "" || url === undefined) {
        if(wh === '!wh100' || wh === '!wh200' || wh === '') {
          return "/static/images/placeholder.png";
        }else{
          return '/static/images/placeholder.png'
        }
      } else {
        if (url.indexOf("http") > -1) {
          if (url.indexOf("assets.xohaa.net") > -1 || url.indexOf("shmedias.oss-cn-shenzhen.aliyuncs.com") > -1 || url.indexOf('jbr-app-main.oss-cn-shenzhen.aliyuncs.com') > -1) {
            return url + wh;
          }
        }
      }
      return url;
    },

    /**
     * 头像图片过滤器
     *
     * @param url 图片地址
     */
    avatar: function (url) {
      if (url === null || url === "" || url === "undefined") {
        return "/static/images/avatar.png";
      }
      if (url.indexOf("http") > -1) {
        if (url.indexOf("assets.xohaa.net") > -1 || url.indexOf("shmedias.oss-cn-shenzhen.aliyuncs.com") > -1) {
          return url + '!wh100';
        }
      }
      return url;
    },


  }
}())

