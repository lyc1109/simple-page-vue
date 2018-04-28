<style scoped lang="scss" type="text/scss">
  @import "~variables";

</style>

<template>
  <v-app>
    <div class="margin-bottom-m">
      <v-iwater-view :device="device"></v-iwater-view>
    </div>

    <!-- 普通智能水机操作 -->
    <div v-if="iwater.waterDeviceType === 0">
      <v-iwater-actions-common :device="device"></v-iwater-actions-common>
    </div>

    <!-- 智能加热水机操作 -->
    <div v-if="iwater.waterDeviceType === 1">
      <v-iwater-actions-heat :device="device"></v-iwater-actions-heat>
    </div>

    <!-- 智能加热制冷水机操作 -->
    <div v-if="iwater.waterDeviceType === 2">
      <v-iwater-actions-cold :device="device"></v-iwater-actions-cold>
    </div>
  </v-app>
</template>

<script>
  import VIwaterView from "@/pages-member/idevices/iot-iwater/v-iwater-view.vue";
  import VIwaterActionsCommon from "@/pages-member/idevices/iot-iwater/v-iwater-actions-common.vue";
  import VIwaterActionsHeat from "@/pages-member/idevices/iot-iwater/v-iwater-actions-heat.vue";
  import VIwaterActionsCold from "@/pages-member/idevices/iot-iwater/v-iwater-actions-cold.vue";

  import storeTypes from "@/store/types";

  import waterdevicesApis from "@/apis/api-iot-waterdevices";
  import userDeviceApi from "@/apis/api-userdevices";

  export default {
    name: "iwater-view",
    desc: "普通智能净水器详情界面",
    components: {VIwaterView, VIwaterActionsCommon, VIwaterActionsHeat, VIwaterActionsCold},
    data: function () {
      return {
        // 路由参数
        userDeviceEntityId: this.$route.query.userDeviceEntityId,
        deviceEntityId: this.$route.params.deviceEntityId,
        deviceId: this.$route.query.deviceId,

        // 设备信息
        userDevice: {},
        device: {},

        // 轮询标识
        loopInterval: 0,
      }
    },
    computed: {
      iwater: function () {
        return this.device.iotDevice || {
          waterDeviceType: 0,
          inWaterTds: 0,
          outWaterTds: 0,
          online: true,
          powerOn: false
        };
      },
      isOnline: function () {
        return this.iwater.online === true;
      },
      canLoadDetail: function () {
        return this.$store.getters[storeTypes.idevice.getCanLoadDetailFlag];
      }
    },
    mounted(){
      let storeDevice = this.$store.getters[storeTypes.idevice.getDevice];
      if(storeDevice !== null) {
        this.device = storeDevice;
      }

      this.loadUserDevice();
      this.loopInterval = setInterval(this.loadDetail, 5000);
    },
    beforeRouteLeave(to, from, next) {
      clearInterval(this.loopInterval);
      next();
    },
    methods: {
      loadDetail: function () {
        if(!this.canLoadDetail) {
          console.log("设置更新中，暂停加载详情...");
          return;
        }

        waterdevicesApis.detail(this.deviceEntityId)
          .then((resp) => {
            resp.iotDevice = this.parseIwaterData(resp.iotDevice);

            //console.log(resp.iotDevice);

            this.device = Object.assign({}, this.device, resp);

            // 设置到状态管理中
            this.$store.commit(storeTypes.idevice.updateDevice, this.device);
          })
          .catch((err) => {
            this.$toast.warn("抱歉，设备信息加载失败。" + err);
          });
      },

      loadUserDevice: function () {
        //this.$loading.show();
        userDeviceApi.detail(this.userDeviceEntityId)
          .then((userDevice) => {
            this.userDevice = userDevice;

            let device = userDevice.device;
            device.iotDevice = this.parseIwaterData(device.iotDevice);
            this.device = Object.assign({}, this.device, device);

            // 设置到状态管理中
            this.$store.commit(storeTypes.idevice.updateUserDevice, userDevice);
            this.$store.commit(storeTypes.idevice.updateDevice, this.device);
          })
      },

      // 解析水机数据，主要是初始化某些数据
      parseIwaterData: function (iotDevice) {
        // 开发或测试环境模拟在线
        if(!this.$app.isProduct || this.$store.getters[storeTypes.oauth.getShopId] === "n6ZR6p") {
          iotDevice.online = true;
          iotDevice.inWaterTds = 128;
          //iotDevice.outWaterTds = 11;

          iotDevice.outWaterTds = Math.ceil(Math.random()*10);
        }

        // 最小加热温度限制(20~100)
        if(iotDevice.temperatureForHot < 20) {
          iotDevice.temperatureForHot = 20;
        }
        if(iotDevice.temperatureForTea < 20) {
          iotDevice.temperatureForTea = 20;
        }
        if(iotDevice.temperatureForMilk < 20) {
          iotDevice.temperatureForMilk = 20;
        }

        // 最小出水量限制（120~2000））
        if(iotDevice.maxOutFlow < 120) {
          iotDevice.maxOutFlow = 120;
        }
        if(iotDevice.maxOutFlowForHot < 120) {
          iotDevice.maxOutFlowForHot = 120;
        }
        if(iotDevice.maxOutFlowForTea < 120) {
          iotDevice.maxOutFlowForTea = 120;
        }
        if(iotDevice.maxOutFlowForMilk < 120) {
          iotDevice.maxOutFlowForMilk = 120;
        }

        return iotDevice;
      }
    }
  }
</script>

