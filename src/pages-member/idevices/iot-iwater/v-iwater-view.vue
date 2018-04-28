<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .iwater-view{
    position: relative;
  }
  .iwater-view__head,
  .iwater-view__foot{
    position: absolute;
    left: 0;
    width: 100%;
  }
  .iwater-view__head{
    top: 0;
    padding-top: rem(25px);
    text-align: center;

    .iwater-view__status{
      font-size: 20px;
      width: 100%;
    }
  }
  .iwater-view__leasehead{
    padding-top: rem(65px);
  }
  .iwater-view__foot {
    bottom: 0;
  }

  .iwater-recharge{
    background: rgba(0,0,0,0.2);
    padding: rem(7px) rem(2px) rem(7px) rem(12px);
    border-top-left-radius: rem(25px);
    border-bottom-left-radius: rem(25px);
    position: fixed;
    right: 0;
    top: 15px;
  }

  .iwater-view__foot {
    color: $white;
    text-align: center;
  }
</style>

<template>
  <div class="iwater-view bg-box valign-center" :style="bgStyle">
    <div class="iwater-view__head" :class="{'iwater-view__leasehead': isLeaseDevice}">
      <div class="iwater-view__status" v-html="iwaterStatusText"></div>

      <div class="iwater-recharge align-left" @click="recharge" v-if="isLeaseDevice">
        <div class="font-white font-bold-300 font-m"><span class="valign-middle">续费</span> <i class="fa fa-angle-right icon-m"></i></div>
        <div class="font-s" style="color: #95B8E1">到期: {{$filters.formatDate(device.leaseDueDate)}}</div>
      </div>
    </div>

    <div class="full-width">
      <div style="height: 50px" v-if="isLeaseDevice"></div>
      <v-iwater-tds :iwater="iwater"></v-iwater-tds>
    </div>

    <div class="iwater-view__foot" v-if="iwater.waterDeviceType > 0">
      <!-- 加热型水机 -->
      <div class="flex" v-show="iwater.waterDeviceType === 1">
        <div class="flex-item padding">
          <i class="iconfont icon-paocha font-l valign-middle"></i>
          <div class="inline-block align-left">
            <div>{{iwater.temperatureForTea}}℃</div>
            <div>{{iwater.maxOutFlowForTea}}ml</div>
          </div>
        </div>
        <div class="flex-item padding">
          <i class="iconfont icon-iot-cn font-l valign-middle"></i>
          <div class="inline-block align-left">
            <div>{{iwater.temperatureForMilk}}℃</div>
            <div>{{iwater.maxOutFlowForMilk}}ml</div>
          </div>
        </div>
        <div class="flex-item padding">
          <i class="iconfont icon-iot-jr font-l valign-middle"></i>
          <span class="valign-middle">{{iwater.maxOutFlowForHot}}ml</span>
        </div>
        <div class="flex-item padding">
          <i class="iconfont icon-iot-cs font-l valign-middle"></i>
          <span class="valign-middle">{{iwater.maxOutFlow}}ml</span>
        </div>
      </div>

      <!-- 制冷型水机 -->
      <div class="flex" v-show="iwater.waterDeviceType === 2">
        <div class="flex-item padding">
          <i class="iconfont icon-iot-jrwd font-l valign-middle"></i>
          <span class="valign-middle">{{iwater.temperatureForHot}}  ℃</span>
        </div>
        <div class="flex-item padding" >
          <i class="iconfont icon-iot-zlwd font-l valign-middle"></i>
          <span class="valign-middle">{{iwater.temperatureForCold}}  ℃</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VIwaterTds from "@/pages-member/idevices/iot-iwater/v-iwater-tds.vue";
  export default {
    name: "v-iwater-view",
    desc: "水机主要信息查看页面小组件",
    components: {VIwaterTds},
    props: {
      device: Object
    },
    computed: {
      iwater: function () {
        return this.device.iotDevice || {};
      },
      isOnline: function () {
        return this.iwater.online === true;
      },

      bgStyle: function () {
        let screenHeight = this.$utils.getScreenHeight();
        let iwaterHeight =  Math.floor(screenHeight * 0.6);
        return {
          'background-image': 'url(' + this.$filters.staticImg("/static/images/iwater/iwater-bg.png", '/resize,h_' + iwaterHeight) + ")",
          width: "100%",
          height: iwaterHeight + "px"
        }
      },

      // 水机状态信息
      iwaterStatusText: function () {
        const tds = this.iwater.outWaterTds;
        let tdsText = "<span class='font-white'>水质极好</span>";

        // 优先显示离线提示
        if(!this.isOnline) {
          return "<span class='color-danger'>设备离线</span>";
        }
        if(!this.iwater.powerOn) {
          return "<span class='color-danger'>设备关机</span>";
        }

        if(tds > 60 && tds <= 100) {
          tdsText = "<span class='font-white'>水质很好</span>";
        } else if(tds > 100 && tds <= 300) {
          tdsText = "<span class='color-orange-4'>水质一般</span>";
        } else if(tds > 300) {
          tdsText = "<span class='color-danger'>水质污染</span>";
        }
        return tdsText;
      },

      // 是否租赁设备
      isLeaseDevice: function () {
        return this.device.deviceType === "L";
      },
      // 是否加热型水机
      isHeatDevice: function () {
        return this.device.waterDeviceType === 1;
      }
    },
    methods: {
      recharge: function () {
        if(this.$filters.isNullStr(this.device.company)) {
          let rechargeUrl = "/devices/" + this.device.id + "/recharge";
          rechargeUrl += "?leaseProductId=" + this.device.leaseProductId;
          rechargeUrl += "&deviceName=" + this.device.deviceName;
          rechargeUrl += "&leaseDueDate=" + this.$filters.formatDate(this.device.leaseDueDate);
          this.$router.push(encodeURI(rechargeUrl));
        } else {
          this.$dlg.alert("企业租赁请联系商家进行续费。");
        }
      }
    }
  }
</script>

