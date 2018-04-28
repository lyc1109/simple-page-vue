<style scoped lang="scss" type="text/scss">
  @import "~@assets/scss/pages/iot-ifreshair/ifreshair-view.scss";
</style>

<template>
  <div content="full-height">
    <div class="bg-box valign-center" :style="bgStyle">
      <div class="full-width">
        <div class="align-center color-danger font-l margin-bottom-l" v-show="ifreshair.online === false">设备离线</div>

        <!-- 空气质量图 -->
        <v-air-quality :pm25="ifreshair.pm25"
                       :quality="ifreshair.airQuality"
                       :qualityText="ifreshair.airQualityText"
                       :freshState="ifreshair.freshState"
                       :bacteriostaticState="ifreshair.bacteriostaticState"></v-air-quality>

        <div style="height: 100px;"></div>
      </div>

      <div class="iair-infos flex">
        <div class="flex-item">
          {{ifreshair.temperatureActual}}
          <div class="iair-infos__text">温度(℃)</div>
        </div>
        <div class="flex-item">
          {{ifreshair.humidityActual}}
          <div class="iair-infos__text">湿度(%RH)</div>
        </div>
        <div class="flex-item">
          <div style="font-size: 14px;">
            <span v-show="ifreshair.runMode < 1 || ifreshair.runMode > 5">未知</span>
            <span v-show="ifreshair.runMode === 1">自动</span>
            <span v-show="ifreshair.runMode === 2">手动</span>
            <span v-show="ifreshair.runMode === 3">睡眠</span>
            <span v-show="ifreshair.runMode === 4">定时</span>
            <span v-show="ifreshair.runMode === 5">内循环</span>
          </div>
          <div class="iair-infos__text">运行模式</div>
        </div>
        <div class="flex-item">
          {{ifreshair.inWindSpeed}}|{{ifreshair.outWindSpeed}}
          <div class="iair-infos__text">风速(进|出)</div>
        </div>
      </div>
    </div>
    <div class="padding-top-m margin-top-m align-center">
      <div class="flex" style="align-items: normal">
        <div class="flex-item">
          <div class="iair-actions "
               :class="{'iair-actions-pink': !ifreshair.powerOn && ifreshair.online, 'iair-actions-green': ifreshair.powerOn && ifreshair.online}"
               @click="onoff">
            <i class="iconfont icon-iot-guanji"></i></div>
          <div class="font-lighter font-s margin-top-s">{{ifreshair.powerOn ? '关机' : '开机'}}</div>
        </div>
        <div class="flex-item" @click="linkSetTime">
          <div class="iair-actions iair-actions-cyan"><i class="iconfont icon-iot-ds"></i></div>
          <div class="font-lighter font-s margin-top-s">定时</div>
        </div>
        <div class="flex-item" @click="isShowSettingPopup = true">
          <div class="iair-actions-setting"><div>设置</div></div>
        </div>
        <div class="flex-item" @click="viewAuthorizations">
          <div class="iair-actions iair-actions-red"><i class="iconfont icon-iot-shouquan"></i></div>
          <div class="font-lighter font-s margin-top-s">授权</div>
        </div>
        <div class="flex-item ripple" @click="toggleViewType">
          <div class="iair-actions iair-actions-yellow"><i class="iconfont icon-iot-sbxq"></i></div>
          <div class="font-lighter font-s margin-top-s">更多</div>
        </div>
      </div>
    </div>

    <!-- 设置popup -->
    <v-setting-popup v-model="isShowSettingPopup" :device="device"></v-setting-popup>
    <!-- 设置定时 -->
    <!-- <v-set-time-default v-model="isShowSetTimePopup" ></v-set-time-default> -->
  </div>
</template>

<script>
  import VAirQuality from "@/pages-member/idevices/iot-ifreshair/v-air-quality";
  import VSettingPopup from "@/pages-member/idevices/iot-ifreshair/v-setting-popup";
  import ifreshairApi from "@/apis/api-iot-freshairdevice.js";
  // import VSetTimeDefault from "@/pages-member/idevices/iot-ifreshair/v-set-time-default"
  export default {
    name: "ifreshair-view-default",
    components: {
      VAirQuality,
      VSettingPopup
      // VSetTimeDefault
    },
    props: {
      // 设备信息
      device: {
        type: Object,
        default: {}
      },
      // 用于控制切换主视图与详情页
      value: String
    },
    data: function () {
      return {
        isShowSettingPopup: false,
        isShowSetTimePopup: false
      }
    },
    computed: {
      ifreshair: function(){
        return this.device.iotDevice || {};
      },

      deviceEntityId: function () {
        return this.device.id || "";
      },

      ifreshairHeight: function () {
        let screenHeight = this.$utils.getScreenHeight();
        return Math.floor(screenHeight * 0.8);
      },

      bgStyle: function () {
        let bg = "/static/images/ifreshair/iair-bg-a.jpg";
        let airQuality = this.ifreshair.airQuality || 0;
        if (airQuality === 3 || airQuality === 4) {
          bg = "/static/images/ifreshair/iair-bg-b.jpg";
        } else if (airQuality === 5 || airQuality === 6) {
          bg = "/static/images/ifreshair/iair-bg-c.jpg";
        }

        const ifreshairHeight = this.ifreshairHeight;
        return {
          'background-image': 'url(' + this.$filters.staticImg(bg, '?x-oss-process=image/resize,h_' + ifreshairHeight) + ")",
          width: "100%",
          height: ifreshairHeight + "px"
        }
      }
    },
    mounted () {
      console.log(this.$route.params.deviceEntityId)
    },
    methods: {
      toggleViewType() {
        this.$emit("input", "detail");
      },
      linkSetTime () {
        this.$router.push({
          path: "/iot/ifreshair/settime/" + this.$route.params.deviceEntityId,
        })
      },
      /**
       * 开关机
       */
      onoff: function () {
        let msg = this.ifreshair.powerOn ? "关机" : "开机";
        this.$dlg.confirm("是否确定" + msg, () => {
          this.$loading.show("正在" + msg + "...");
          ifreshairApi.onoff(this.deviceEntityId)
            .then((resp) => {
              this.$loading.hide();
              msg += resp ? "成功" : "失败";
              this.showToastMsg(msg, resp);
            })
        })
      },

      showToastMsg: function (msg = "", success = true) {
        if(success) {
          this.$toast.success(msg);
        } else {
          this.$toast.error(msg);
        }
      },

      // 跳转查看设备授权列表
      viewAuthorizations: function () {
        this.$router.push(`/devices/${this.deviceEntityId}/oauth`);
      },

      setTiming: function () {
        this.$toast.show("功能完善中...")
      }
    }
  }
</script>
