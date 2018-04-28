<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .cur-day{
    font-size: 70px;
    font-weight: bold;
  }
  .smart-live{
    height: rem(150px);
    position: relative;
  }
  .community-live{
    .flex-item{
      height: rem(80px);
    }
    .flex-item:first-child{
      margin-right: rem(10px);
    }
  }
  .smart-live .live-title,
  .community-live .live-title{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 5px;
    background-color: rgba(0,0,0,0.3);
    color: $white;
    font-size: $font-size-s;
    @extend %text-wrapper;
  }
</style>
<template>
  <div class="has-nav">
    <div class="bg-box padding-m font-white font-m" style="background-image: url('/static/images/home/home_bg.png')">
      <!--日期、定位-->
      <div class="padding-left-s" @click="getLocation(true)">
        <!--<i class="iconfont icon-iot-dingwei color-white icon-m valign-middle"></i>-->
        <span class="valign-middle fadeIn">{{curPosition.city}}</span>
        <i class="fa fa-refresh color-white valign-middle margin-left-s"></i>
      </div>
      <div class="flex">
        <div class="flex-item">
          <div class="cur-day">{{curDate.curDay}}</div>
          <span>「{{curDate.curMonth}}」</span>
          <span>{{curDate.curWeek}}</span>
        </div>
        <!--天气、TDS -->
        <div class="flex-item align-right">
          <router-link class="font-white" :to="{path: '/tdsmap'}">
            <div class="margin-bottom-l"></div>
            <div class="label label-round padding-left-m padding-right-m" :style="envData.qualityStyle">
              {{envData.quality}}
            </div>
            <div class="margin-top">
              <i class="iconfont icon-iot-tianqi"></i> {{ envData.weather }}
            </div>
            <div class="margin-top">
              <i class="iconfont icon-iot-shuizhi"></i> TDS {{ envData.tds }}
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 滚动公告 -->
    <bulletin-loop class="padding"></bulletin-loop>

    <!-- 品智生活 -->
    <router-link :to="{ path: `/community/shop_${this.curShop.id}/article_undefined/view`, query: { type: `notice` } }">
      <div class="margin-top-m bg-white padding">
        <div class="margin-bottom">
          <span class="font-bold-400">品智生活</span>
          <span class="float-right"><i class="fa fa-angle-right font-lighter icon-m" style="margin-top: -2px"></i></span>
        </div>
        <div class="bg-box smart-live"
             style="background-image: url('/static/images/home/smart-live2.png')">
          <div class="live-title">每天四个时刻必须喝水，如何喝水最养生?</div>
        </div>
      </div>
    </router-link>

    <!-- 社区生活 -->
    <div class="margin-top-m bg-white padding community-live" v-if="communities.length > 0">
      <router-link :to="'/community/shop_' + this.curShop.id + '/index'">
        <div class="margin-bottom">
          <span class="font-bold-400">社区生活</span>
          <span class="float-right"><i class="fa fa-angle-right font-lighter icon-m" style="margin-top: -2px"></i></span>
        </div>
      </router-link>
      <div class="flex">
        <div class="flex-item bg-box" v-for="item in communities"
             :style="{ 'background-image': 'url(' + $filters.img(item.coverImage, '!q70') + ')' }"
             @click.stop="viewTopic(item.id)">
          <div class="live-title">{{item.title}}</div>
        </div>
      </div>
    </div>
    <div style="height: 70px;"></div>
    <app-nav navId="home"></app-nav>
  </div>
</template>

<script>
  import AppNav from '@/pages-member/nav';
  import BulletinLoop from '@/pages-member/bulletin/bulletin-loop';

  import types from "@/store/types";

  import SysApi from '@/apis/api-sys';
  import CommunityApi from '@/apis/api-community';
  import BaiduMap from '@/assets/scripts/baidu-map';

  export default {
    name: 'member',
    components: {
      AppNav,
      BulletinLoop
    },
    data: function () {
      return {
        curPosition: {
          province: "广东省",
          city: "广州市"
        },
        envData: {
          tds: 0,
          quality: "优",
          qualityStyle: {
            'background-color': "#18BA1D"
          },
          weather: "0℃"
        },
        // 公告列表
        bullets: [],
        // 社区帖子列表
        communities: []
      };
    },
    computed: {
      curDate: function(){
        let now = new Date();
        const curDay = this.$filters.formatDate(now, 'DD');
        const curMonth = this.$filters.formatDate(now, 'MMMM');
        const curWeek = this.$filters.formatDate(now, 'dddd');
        return {
          curDay: curDay,
          curMonth: curMonth,
          curWeek: curWeek
        };
      },
      curShop() {
        return this.$store.getters[types.oauth.getCurShop];
      }
    },
    mounted(){
      this.findTopics();
      this.getLocation();
    },
    methods: {
      // 查询最新社区帖子
      findTopics: function () {
        CommunityApi.findTop(2)
          .then((page) => {
            this.communities = page.fileList;
          });
      },

      /**
       * 获取用户定位
       */
      getLocation: function (refresh = false) {
        // 百度地图定位
        this.curPosition.city = "定位中..."
        setTimeout(() => {
          BaiduMap.init()
            .then(() => {
              BaiduMap.geolocation((resp) => {
                this.curPosition = resp;
                this.findEnvData();
              }, refresh);
            });
        }, 1000);
      },

      // 查询水质天气
      findEnvData: function () {
        SysApi.getWeather(this.curPosition.province, this.curPosition.city)
          .then((data) => {
            this.envData.weather = data.lowTemperature + "℃ ~ " + data.highTemperature + "℃ " + data.weatherSituation;
            this.envData.quality = data.weatherQuality;

            let qualityStyle = {'background-color': "#18BA1D"};
            let weatherQuality = data.weatherQuality;
            if (weatherQuality.indexOf("良") > -1) {
              qualityStyle = {'background-color': "#3BC9B0"};
            } else if (weatherQuality.indexOf("轻度") > -1 || weatherQuality.indexOf("中度") > -1) {
              qualityStyle = {'background-color': "#f0ad4e"};
            } else if (weatherQuality.indexOf("重度") > -1 || weatherQuality.indexOf("严重") > -1) {
              qualityStyle = {'background-color': "#FF9933"};
            }
            this.envData.qualityStyle = qualityStyle;
          });

        SysApi.getCityTDS(this.curPosition.province, this.curPosition.city)
          .then((data) => {
            this.envData.tds = data.tds;
          })
      },

      viewTopic: function (id) {
        this.$router.push('/community/shop_'+ this.curShop.id + '/article_' + id +'/view');
      }
    }
  }
</script>
