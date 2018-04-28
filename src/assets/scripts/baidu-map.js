/**
 * 百度地图API相关
 *
 * 调用前请在页面引入百度地图API：<v-script src="http://api.map.baidu.com/api?v=3.0&ak=oF3MZ1MtGp72onWyvos7YPVWG57TsMSH&callback=onBaiduMapLoaded"></v-script>
 * 注：其中callback为加载回调函数，相关处理可通过此回调方法处理
 *
 * @author  hucw
 * @created 2018-01-10
 */

import toast from '@/assets/scripts-component/iotp-toast';
import App from '@/assets/scripts/app';

export default {
  init: function (){
    //console.log("初始化百度地图脚本...");
    const AK = "oF3MZ1MtGp72onWyvos7YPVWG57TsMSH";
    const apiVersion = "2.0";
    const BMap_URL = "https://api.map.baidu.com/api?v="+ apiVersion +"&ak="+ AK +"&s=1&callback=onBMapCallback";
    //const BMap_URL = "/static/js/baidumap/bmap.js";
    return new Promise((resolve, reject) => {
      // 如果已加载直接返回
      if(typeof BMap !== "undefined") {
        resolve(BMap);
        return true;
      }
      // 百度地图异步加载回调处理
      window.onBMapCallback = function () {
        console.log("百度地图脚本初始化成功...");
        resolve(BMap);
      };

      // 插入script脚本
      let scriptNode = document.createElement("script");
      scriptNode.setAttribute("type", "text/javascript");
      scriptNode.setAttribute("src", BMap_URL);
      document.body.appendChild(scriptNode);

      // 等待页面加载完毕回调
      /*let timeout = 0;
      let interval = setInterval(() => {
        if(timeout >= 20) {
          reject();
          clearInterval(interval);
          console.error("百度地图脚本初始化失败...");
        }
        if(typeof BMap !== "undefined") {
          resolve(BMap);
          clearInterval(interval);
          console.log("百度地图脚本初始化成功...");
        }
        timeout += 1;
      }, 500);*/
    });
  },

  /**
   * 浏览器定位
   * @param callbackFn 定位成功回调函数
   * @param isRefresh  是否强制刷新定位：
   *
   * 回传数据：
   * {
   *  province: ""
   *  city: ""
   *  latitude: ""
   *  longitude: ""
   * }
   */
  geolocation: function (callbackFn, isRefresh = false) {
    // 百度地图定位
    let position = App.storage.get("BMapPosition");
    if(isRefresh === false && position !== null) {
      callbackFn && callbackFn.call(this, position);
    } else {
      let geolocation = new BMap.Geolocation();
      const options = {
        enableHighAccuracy: true
      };
      geolocation.getCurrentPosition(function (resp) {
        if (this.getStatus() === BMAP_STATUS_SUCCESS) {
          position = {
            province: resp.address.province,
            city: resp.address.city,
            latitude: resp.latitude,
            longitude: resp.longitude,
          };
          App.storage.set("BMapPosition", position);
          callbackFn && callbackFn.call(this, position);
        } else {
          toast.warn("定位失败");
        }
      }, function(resp){
        console.log("定位失败" + JSON.stringify(resp));
      }, options);
    }
  },

  getMapDefaultTheme: function () {
    return [
      {
        "featureType": "land",
        "elementType": "geometry",
        "stylers": {
          "color": "#e7f7fc"
        }
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": {
          // "color": "#96b5d6"
          "color": "#d2e5ee"
        }
      },
      {
        "featureType": "green",
        "elementType": "all",
        "stylers": {
          "color": "#b0d3dd",
          "visibility": "off"
        }
      },
      {
        "featureType": "highway",
        "elementType": "geometry.fill",
        "stylers": {
          "color": "#a6cfcf"
        }
      },
      {
        "featureType": "highway",
        "elementType": "geometry.stroke",
        "stylers": {
          "color": "#7dabb3"
        }
      },
      {
        "featureType": "arterial",
        "elementType": "geometry.fill",
        "stylers": {
          "color": "#e7f7fc"
        }
      },
      {
        "featureType": "arterial",
        "elementType": "geometry.stroke",
        "stylers": {
          "color": "#b0d5d4"
        }
      },
      {
        "featureType": "local",
        "elementType": "labels.text.fill",
        "stylers": {
          "color": "#7a959a"
        }
      },
      {
        "featureType": "local",
        "elementType": "labels.text.stroke",
        "stylers": {
          "color": "#d6e4e5"
        }
      },
      {
        "featureType": "arterial",
        "elementType": "labels.text.fill",
        "stylers": {
          "color": "#374a46"
        }
      },
      {
        "featureType": "highway",
        "elementType": "labels.text.fill",
        "stylers": {
          "color": "#374a46"
        }
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": {
          "color": "#e9eeed",
          "visibility": "off"
        }
      },
      {
        "featureType": "building",
        "elementType": "all",
        "stylers": {
          "color": "#e9eeed",
          "visibility": "off"
        }
      },
      {
        "featureType": "manmade",
        "elementType": "all",
        "stylers": {
          "color": "#cfe2f3"
        }
      }
    ]
  }
}


