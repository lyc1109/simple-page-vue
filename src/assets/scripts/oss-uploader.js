/**
 * 阿里OSS文件上传
 *
 * @author  hucw
 * @created 2017-06-16
 */
import http from '../../http';
import OSS from "../../../static/js/aliyun/aliyun-oss-sdk-4.3.0.min.js";
import moment from 'moment';
import md5 from 'js-md5';

import App from "scripts/app";

const ossTokenKey = "ossToken";
const ossTokenApi = process.env.API_HOST_BASE + "/ali/stssign";

/**
 * 判断是否失效
 *
 * @param expireTime   超时时间
 * @returns {boolean}  返回true表示失效，需要获取
 */
let isExpire = function (expireTime) {
  if (expireTime === 0 || expireTime.length === 0) {
    return true;
  }

  let now = new Date().getTime();
  return now > parseInt(expireTime);
};

/**
 * 获取OSS客户端实例
 *
 * @param stsToken STS授权凭证
 */
let getOssClient = function (stsToken) {
  return new OSS.Wrapper({
    region: stsToken.region,
    accessKeyId: stsToken.accessKeyId,
    accessKeySecret: stsToken.accessSecret,
    stsToken: stsToken.token,
    endpoint: stsToken.endpoint,
    bucket: stsToken.bucket
  })
};

/**
 * 构建存储路径
 *
 * @param file            存储文件
 * @param uploadStartPath 存储开始目录
 * @param storePath       目标目录
 */
let buildStorePath = function (file, uploadStartPath, storePath = "") {
  let storeAs = uploadStartPath;
  if (!storePath.startsWith("/")) {
    storePath = "/" + storePath;
  }
  storeAs += storePath + "/";

  let now = moment();
  storeAs += now.format("YYYYMMDD") + "/" + now.format("HHmm") + "/";

  let fileName = file.name;
  let extension = fileName.substr(fileName.lastIndexOf("."));
  storeAs += md5(fileName) + extension;
  return storeAs;
};

/**
 * 构建Base64图片存储路径
 *
 * @param uploadStartPath 存储开始目录
 * @param storePath       目标目录
 */
let buildBase64Path = function (uploadStartPath, storePath = "") {
  let storeAs = uploadStartPath;
  if (!storePath.startsWith("/")) {
    storePath = "/" + storePath;
  }
  storeAs += storePath + "/";

  let now = moment();
  storeAs += now.format("YYYYMMDD") + "/" + now.format("HHmm") + "/";

  storeAs += new Date().getTime();
  return storeAs;
};

export default {
  /**
   * 获取STS授权凭证
   *
   * @param callbackFn 请求成功回调
   * @returns {*}
   */
  getStsToken(){
    return new Promise(function (resolve, reject) {
      let ossToken = App.storage.get(ossTokenKey);
      if(ossToken !== null && !isExpire(ossToken.expiration)) {
        resolve(ossToken);
      } else {
        http.get(ossTokenApi)
          .then(function (resp) {
            console.log("OSS授权凭证刷新成功：" + JSON.stringify(resp));
            App.storage.set(ossTokenKey, {
              // Bucket数据存储区域，目前仅cn-hangzhou可用
              region: resp.region,
              // RAM子账户accessKeyId
              accessKeyId: resp.accessKeyId,
              // RAM子账户accessSecret
              accessSecret: resp.accessSecret,
              // 授权凭证
              token: resp.token,
              // 凭证失效时间
              expiration: resp.expiration,
              // oss访问地址: https://assets.xohaa.net
              ossHost: resp.ossHost,
              // bucket endpoint：oss-cn-shenzhen.aliyuncs.com
              endpoint: resp.endpoint,
              // oss buket定义：shmedias
              bucket: resp.bucket,
              // bucket上传起始路径，生产环境：product-medias，测试环境：dev-medias
              uploadStartPath: resp.uploadStartPath
            });

            resolve(resp);
          })
          .catch((e) => {
            console.log("请求授权凭证异常");
            reject(e);
          });
      }
    });
  },

  /**
   * 上传文件
   *
   * @param file        传文件
   * @param uploadPath  文件存储目录，必须以/开头
   * @param onProgress  上传进度回调
   * @returns {Promise}
   */
  upload(file = null, uploadPath = "", onProgress = null){
    let that = this;

    if(file === null) {
      console.log("请选择需要上传的文件");
      return;
    }

    // 上传进度回调
    let progress = function (p) {
      return function (done) {
        //console.log(p);
        if(p > 0 && p <= 100) {
          p = p * 100;
        }
        if(onProgress !== null && typeof onProgress === "function") {
          onProgress.call(this, p);
        }
        done();
      }
    };

    return new Promise((resolve, reject) => {
      that.getStsToken().then((resp) => {
        // 初始化oss实例
        let ossClient = getOssClient(resp);

        // 构建存储路径
        let storeAs = buildStorePath(file, resp.uploadStartPath, uploadPath);

        ossClient.multipartUpload(storeAs, file, {
          progress: progress
        })
          .then(function() {
            //console.log("文件上传成功：" + storeAs);
            resolve({
              filePath: storeAs,
              fileObj: file
            });
          })
          .catch(function(e) {
            console.log("文件上传失败...");
            reject(e);
          })
      })
        .catch((e) => {
          reject(e);
        });
    });
  },

  uploadBase64: function (base64Content = "", uploadPath = "", onProgress = null) {
    // 解析文件名
    let fileName = new Date().getTime();
    let extension = base64Content.substring(0, base64Content.indexOf(";"));
    extension = extension.substring(extension.indexOf("/")+1);
    if(extension !== "") {
      fileName += "." + extension;
    }

    // base64转文件
    let arr = base64Content.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    let file = new File([u8arr], fileName, {type: mime});

    return this.upload(file, uploadPath, onProgress);
  }
}
