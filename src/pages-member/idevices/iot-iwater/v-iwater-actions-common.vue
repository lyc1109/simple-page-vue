<style scoped lang="scss" type="text/scss">
  @import "~variables";
</style>

<template>
  <div class="align-center">
    <div class="flex padding">
      <div class="flex-item" @click="onoff">
        <div v-show="iwater.powerOn === false">
          <div class="iconbox iconbox-orange" :class="{'disabled': !isOnline}"><i class="iconfont icon-iot-guanji"></i></div>
          <div class="font-s margin-top-s font-lighter">开机</div>
        </div>
        <div v-show="iwater.powerOn === true">
          <div class="iconbox iconbox-orange" :class="{'disabled': !isOnline}"><i class="iconfont icon-iot-guanji"></i></div>
          <div class="font-s margin-top-s font-lighter">关机</div>
        </div>
      </div>
      <div class="flex-item" @click="viewCharts">
        <div class="iconbox iconbox-yellow"><i class="iconfont icon-iot-jstj"></i></div>
        <div class="font-s margin-top-s font-lighter">净水统计</div>
      </div>
      <div class="flex-item" @click="viewParts">
        <div class="iconbox iconbox-blue-light"><i class="iconfont icon-iot-lxsm"></i></div>
        <div class="font-s margin-top-s font-lighter">滤芯寿命</div>
      </div>
    </div>
    <div class="flex padding">
      <div class="flex-item" @click="createServiceOrder">
        <div class="iconbox iconbox-blue-light"><i class="iconfont icon-iot-edit"></i></div>
        <div class="font-s margin-top-s font-lighter">服务预约</div>
      </div>
      <div class="flex-item" @click="viewAuth">
        <div class="iconbox"><i class="iconfont icon-iot-sq"></i></div>
        <div class="font-s margin-top-s font-lighter">授权管理</div>
      </div>
      <div class="flex-item" @click="viewDetail">
        <div class="iconbox iconbox-cyan"><i class="iconfont icon-iot-sbxq"></i></div>
        <div class="font-s margin-top-s font-lighter">设备详情</div>
      </div>
    </div>

  </div>
</template>

<script>
  import IotIwater from "@/assets/scripts-page/iot-iwater.js";

  export default {
    name: "v-iwater-actions-common",
    desc: "普通智能水机操作小组件",
    props: {
      device: {
        type: Object,
        default: {
          id: "",
          iotDevice: {}
        }
      }
    },
    data: function () {
      return {
        isShowTemperaturePopup: false,
      }
    },
    computed: {
      iwater: function () {
        return this.device.iotDevice || {};
      },

      isOnline: function () {
        return this.iwater.online === true;
      }
    },
    methods: {
      // 开关机
      onoff: function () {
        if (!this.isOnline) {
          return;
        }
        IotIwater.onoff(this.device.id, this.iwater.powerOn);
      },
      // 查看授权
      viewAuth: function () {
        IotIwater.viewAuth(this.$router, this.device.id);
      },
      // 创建服务预约订单
      createServiceOrder: function () {
        IotIwater.createServiceOrder(this.$router, this.device);
      },
      viewDetail: function () {
        IotIwater.viewDetail(this.$router, this.device.id);
      },
      viewParts: function () {
        IotIwater.viewParts(this.$router, this.device.id);
      },
      viewCharts: function () {
        IotIwater.viewCharts(this.$router, this.device.id);
      }
    }
  }
</script>

