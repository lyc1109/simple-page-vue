<style scoped lang="scss" type="text/scss">
  @import "~variables";
  html{height:100%}
  body{height:100%;margin:0px;padding:0px}

  %scren{
    width: 100%;
    height: 100%;
  }
  %fixed{
    position: fixed;
    @extend %scren
  }
  .wrapper {
    @extend %fixed;

    max-width: 768px;
    margin: 0 auto;
    #allmap {
      @extend  %scren
    }
    .modal{
      @extend %fixed;
      bottom: 0;
      width: 100%;
      background:$transparent;
      z-index:2;
      .tip{
        position: absolute;
        box-sizing: border-box;
        align-items: flex-start;
        /*height: 300px;*/
        width: 100%;
        background-color: $white;
        bottom: 0;
        padding:rem(20px) rem(15px) rem(50px) rem(15px);
        .left{
          width: 30px;
          height: 30px;
          font-size: $font-size-m;
          padding-top: 3px;
          /*background-color: green;*/
        }
        .right{
          /*height: 300px;*/
          width: 100%;
          .location{
            padding-bottom:rem(35px);
            font-size: $font-size-m;
          }
          .flex{
            .flex-left{
              text-align: center;
              padding-right:rem(50px);
              .title{
                margin-bottom:rem(5px);
                color: #888;
                font-size: $font-size;
              }
              .word{
                font-size: 28px;
                color: $primary;
              }
            }
            .flex-right{
              text-align: center;
              padding-right:rem(28px);
              .title{
                margin-bottom:rem(5px);
                color: #888;
                font-size: $font-size;
              }
              .word{
                font-size: 26px;
                color: $primary;
                /*font-family: "Microsoft YaHei";*/
              }
            }
          }
        }
      }
    }
    .Anchor{
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 30px;
      height: 30px;
      background:url("../../../static/images/map/location.png");
      background-size: contain;
      border-radius: 50%;
      text-align: center;
      z-index:1;
    }
  }
</style>

<template>
  <div class='wrapper full-screen'>
    <div class='full-screen' id="tdsmap"></div>

    <!--<baidu-map id="allmap" MapType="BMAP_SATELLITE_MAP" :min-zoom=3 :max-zoom=19  @ready="handler">
    </baidu-map>-->
    <div v-show='modalShow' @click.stop="closeModal" class='modal'>
      <div  class="tip flex">
        <div class="left iconfont icon-iot-dingwei "></div>
        <div class="right">
          <div class="location">{{location}}</div>
          <div class="flex">
            <div class="flex-item flex-left">
              <p class="title">TDS</p>
              <p class="word">{{TDS}}</p>
            </div>
            <div class="flex-item flex-right">
              <p class="title">等级</p>
              <p class="word">{{waterRank}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div @click="Anchor" class="Anchor"></div>
  </div>
</template>

<script>
  import BaiduMap from '@/assets/scripts/baidu-map';

  export default {
    data() {
      return {
        $BMap: {},
        $map: {},
        clickFlag: true,
        modalShow: false,
        anchorFlag: false,
        address: '',
        location: '',
        TDS: '',
        waterRank: '',
        styleTuBiao: ''
      }
    },
    mounted(){
      BaiduMap.init()
        .then((BMap) => {
          // 创建地图实例
          let map = new BMap.Map("tdsmap");
          BaiduMap.geolocation((resp) => {
            // 创建点坐标
            let point = new BMap.Point(resp.longitude, resp.latitude);
            // 初始化地图，设置中心点坐标和地图级别
            map.centerAndZoom(point, 5);
            // 添加标记
            let mk = new BMap.Marker({
              lat: resp.latitude,
              lng: resp.longitude
            });
            map.addOverlay(mk);
            // 地图处理
            this.handler({BMap, map});
          });
        });
    },
    methods: {
      handler({BMap, map}) {
        this.$BMap = BMap;
        this.$map = map;
        let that = this;

        map.enableScrollWheelZoom(); // 鼠标滚轮放大缩小地图

        // 地图风格 mapStyleJson为自定义风格，在单独的js文件
        map.setMapStyle(BaiduMap.getMapDefaultTheme());

        // ---------------- 放大缩小控件
        var top_right_navigation = new BMap.NavigationControl({
          anchor: BMAP_ANCHOR_TOP_RIGHT,
          type: BMAP_NAVIGATION_CONTROL_SMALL
        });
        map.addControl(top_right_navigation);

        // ------
        function ComplexCustomOverlay(point,rank,text,location,imgUrl) {
          this._point = point;
          this._rank = rank;
          this._text = text;
          this._location = location;
          this.imgUrl = imgUrl;
        }
        ComplexCustomOverlay.prototype = new BMap.Overlay()
        ComplexCustomOverlay.prototype.initialize = function (map) {
          this._map = map
          var div = this._div = document.createElement('div')
          div.style.position = 'absolute'
          div.style.color = 'white'
          div.style.fontSize = '12px'
          div.style.fontWeight = '600'

          var arrow = this._arrow = document.createElement('div')
          arrow.style.background = this.imgUrl
          arrow.style.backgroundSize = 'contain'
          arrow.style.position = 'absolute'
          arrow.style.width = '40px'
          arrow.style.height = '45px'
          arrow.style.lineHeight = '66px'
          arrow.style.textAlign = 'center'
          arrow.style.top = '-35px'
          arrow.style.left = '0px'
          arrow.style.marginLeft = '-20px'
          arrow.style.overflow = 'hidden'

          arrow.setAttribute('location', this._location)

          var span = this._span = document.createElement('span')
          arrow.appendChild(span)
          span.appendChild(document.createTextNode(this._text))

          var span2 = this._span = document.createElement('span')
          arrow.appendChild(span2)
          span2.appendChild(document.createTextNode(this._rank))
          span2.style.position = 'absolute'
          span2.style.width = '40px'
          span2.style.lineHeight = '20px'
          span2.style.height = '20px'
          span2.style.top = '10px'
          span2.style.left = '0px'
          span2.style.fontSize = '10px'
//          span2.style.display = 'none'
          div.appendChild(arrow)

          map.getPanes().labelPane.appendChild(div)

          // 点击覆盖物
          let startX, startY,X,Y,moveEndX,moveEndY;
          let flag = true;
          div.addEventListener('touchstart', function (e) {
            this.children[0].style.transform = 'scale(1.5)'
            that.styleTuBiao = this.children[0]
            that.location=this.children[0].getAttribute('location');
            that.TDS=this.children[0].children[0].innerText;
            that.waterRank=this.children[0].children[1].innerText;
            e.preventDefault();
            startX = e.changedTouches[0].pageX;
            startY = e.changedTouches[0].pageY;
          })
          div.addEventListener('touchmove', function (e) {
            e.preventDefault();
            this.children[0].style.transform = 'scale(1)'
            moveEndX = e.changedTouches[0].pageX;
            moveEndY = e.changedTouches[0].pageY;
            X = moveEndX - startX;
            Y = moveEndY - startY;
            // 判断是单指点击还是双指缩放
            if (Math.abs(X) > Math.abs(Y) && X > 0) {
              flag = false
            } else if (Math.abs(X) > Math.abs(Y) && X < 0) {
              flag = false
            } else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
              flag = false
            } else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
              flag = false
            }
          })
          div.addEventListener('touchend', function (e) {
            e.preventDefault();
            if(flag) {
              // 单指点击
              that.modalShow = true
              this.children[0].style.transform = 'scale(1.5)'
            }else{
              flag = true
            }
          })
          return div
        }
        ComplexCustomOverlay.prototype.draw = function () {
          var map = this._map
          var pixel = map.pointToOverlayPixel(this._point)
          this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + 'px'
          this._div.style.top = pixel.y - 30 + 'px'
        }

        const url1 = 'url(../../static/images/map/01.png) no-repeat'
        const url2 = 'url(../../static/images/map/02.png) no-repeat'
        const url3 = 'url(../../static/images/map/03.png) no-repeat'
        const url4 = 'url(../../static/images/map/04.png) no-repeat'
        const url5 = 'url(../../static/images/map/05.png) no-repeat'

        // 添加覆盖物
        function loadMarker(data) {
          data.forEach(function(element,i){
            if(element.tdsLevel){
              if (data[i].tdsLevel === 'A') {
                // let tds = data[i].TDS.replace(/[^0-9]/ig, '')
                let waterAddr = addressInit(data[i].province,data[i].city,data[i].county,data[i].community)
                let myCompOverlay = new ComplexCustomOverlay(new BMap.Point(data[i].lng, data[i].lat),'极佳',data[i].tds,waterAddr, url1)
                map.addOverlay(myCompOverlay)
              } else if (data[i].tdsLevel === 'B') {
                let waterAddr = addressInit(data[i].province,data[i].city,data[i].county,data[i].community)
                let myCompOverlay = new ComplexCustomOverlay(new BMap.Point(data[i].lng, data[i].lat), '优质',data[i].tds,waterAddr, url2)
                map.addOverlay(myCompOverlay)
              } else if (data[i].tdsLevel === 'C') {
                let waterAddr = addressInit(data[i].province,data[i].city,data[i].county,data[i].community)
                let myCompOverlay = new ComplexCustomOverlay(new BMap.Point(data[i].lng, data[i].lat),'一般',data[i].tds,waterAddr, url3)
                map.addOverlay(myCompOverlay)
              } else if (data[i].tdsLevel === 'D') {
                let waterAddr = addressInit(data[i].province,data[i].city,data[i].county,data[i].community)
                let myCompOverlay = new ComplexCustomOverlay(new BMap.Point(data[i].lng, data[i].lat),'较差', data[i].tds,waterAddr, url4)
                map.addOverlay(myCompOverlay)
              } else {
                let waterAddr = addressInit(data[i].province,data[i].city,data[i].county,data[i].community)
                let myCompOverlay = new ComplexCustomOverlay(new BMap.Point(data[i].lng, data[i].lat),'极差', data[i].tds,waterAddr, url5)
                map.addOverlay(myCompOverlay)
              }
            }
          })
        }

        // 处理地址
        function addressInit(province,city,county,community) {
          if (!city) {
            return province
          }else if(city && !county){
            return province + city
          }else if(county && !community){
            return province + city + county
          }else if(community){
            return province + city + county + community
          }
        }

        // 当前地图的显示位置 --------------
        function getShowData() {
          var mapLevel = that.getrank() // 等级
          var bs = map.getBounds()  // 获取可视区域
          var bssw = bs.getSouthWest()   // 可视区域左下角经纬度
          var bsne = bs.getNorthEast()   // 可视区域右上角经纬度
          // 发送后台数据格式处理
          that.$http.get(`${that.$basehost}/api/v1/water/tds/${mapLevel}`,{
            leftBottomLongitude: bssw.lng,
            rightTopLongitude: bsne.lng,
            leftBottomLatitude: bssw.lat,
            rightTopLatitude: bsne.lat,
            mapLevel: mapLevel
          }).then((res) => {
            loadMarker(res) // 加载覆盖物数据
          }).catch(() => {
            console.log('水质地图页面http请求有错')
          })
        }

        // 地图加载完成后再加载覆盖物
        map.addEventListener('tilesloaded', function () {
          if (document.querySelector('.anchorBL')) {
            document.querySelector('.anchorBL a').style.display = 'none'
          }
          getShowData()
        })

        // 监听地图放大缩小 -------------
        map.addEventListener('zoomend', function () {
       //   var zoom = map.getZoom() // 获取等级
          if(!that.anchorFlag){
            map.clearOverlays() // 先清除覆盖物
          }
          map.setMinZoom(4);
        })
        map.disableDoubleClickZoom(); // 禁用双击放大
        map.addEventListener('zoomend', function(){
          this.clickFlag = false
        })
      },

      closeModal(){
        this.styleTuBiao.style.transform = 'scale(1)'
        this.modalShow = false
      },
      // 获取地图等级 -------------------
      getrank() {
        var rank = ''
        var zoom = this.$map.getZoom() // 获取等级
        if (zoom > 3 && zoom <= 8) {
          rank = 'prov' // 省
        } else if (zoom > 8 && zoom <= 12) {
          rank = 'city' // 市
        } else if (zoom > 12 && zoom <= 14) {
          rank = 'county' // 县 、区
        } else if (zoom > 14 && zoom <= 19) {
          rank = 'house' // 村、小区
        } else {
          rank = 'prov'
        }
        return rank
      },
      // 定位
      Anchor() {
        BaiduMap.geolocation((resp) => {
          this.$map.clearOverlays(); // 先清除覆盖物
          let point = new this.$BMap.Point(resp.longitude, resp.latitude);
          let marker = new this.$BMap.Marker(point);
          this.$map.addOverlay(marker);
          this.$map.centerAndZoom(point, 17);
        }, true);
      }
    }

  }
</script>
