<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .flipY-enter-active{
    @include flipInY();
  }
  .flipY-leave-active{
    @include flipOutY();
  }
</style>

<template>
  <v-app style="background: #fff;">
    <transition name="flipY" mode="out-in">
      <view-default :device="device" v-model="viewType" v-if="viewType === 'default'"></view-default>
      <view-detail :device="device" v-model="viewType" v-if="viewType === 'detail'"></view-detail>
    </transition>
  </v-app>
</template>

<script>
  import ViewDefault from "@/pages-member/idevices/iot-ifreshair/view-default";
  import ViewDetail from "@/pages-member/idevices/iot-ifreshair/view-detail";

  import freshairDeviceApi from "@/apis/api-iot-freshairdevice";
  import userDeviceApi from "@/apis/api-userdevices";

  import storeTypes from "@/store/types";

  export default {
    name: "ifreshair-view",
    components: {
      ViewDefault,
      ViewDetail
    },
    data: function () {
      return {
        viewType: "default",

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
      canLoadDetail: function () {
        return this.$store.getters[storeTypes.ifreshair.getCanLoadDetailFlag];
      }
    },
    mounted(){
      this.loadUserDevice();
      this.loopInterval = setInterval(this.loadDetail, 7000);
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

        freshairDeviceApi.detail(this.deviceEntityId)
          .then((resp) => {
            // 开发或测试环境模拟在线
            if(!this.$app.isProduct || this.$store.getters[storeTypes.oauth.getShopId] === "n6ZR6p") {
              resp.iotDevice.online = true;
            }
            this.device = Object.assign({}, this.device, resp);

            this.$store.commit(storeTypes.idevice.updateDevice, this.device);
          })
          .catch((err) => {
            this.$toast.warn("抱歉，设备信息加载失败。" + err);
          });
      },

      loadUserDevice: function () {
        this.$loading.show();
        userDeviceApi.detail(this.userDeviceEntityId)
          .then((userDevice) => {
            this.$loading.hide();

            this.userDevice = userDevice;
            this.device = Object.assign({}, this.device, userDevice.device);

            // 设置到状态管理中
            this.$store.commit(storeTypes.idevice.updateUserDevice, userDevice);
            this.$store.commit(storeTypes.idevice.updateDevice, this.device);
          })
      }
    }
  }
</script>
