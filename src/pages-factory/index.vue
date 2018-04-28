<style scoped lang="scss" type="text/scss">
  @import '~variables';
  .form-search{
    border-radius: 10px;
  }
</style>

<template>
  <div class="bg-white full-height">
    <div class="padding-m bg-gray-1">
      <v-input class="form-search" name="deviceId" placeholder="请输入设备编码" v-model="deviceId"></v-input>
    </div>

    <div class="padding-top-m padding-bottom-m margin-left-m margin-right-m flex">
      <div><button type="button" class="btn btn-round btn-primary-outline" @click="scanQRCode">二维码扫描</button></div>
      <div class="flex-item"></div>
      <div><button type="button" class="btn btn-round btn-primary" @click="searchDevice">确定</button></div>
    </div>
  </div>
</template>
<script>
  import App from "@/assets/scripts/app";

  export default {
    name: "factory-index",
    data() {
      return {
        deviceId: ''
      }
    },

    methods: {
      scanQRCode: function () {
        const that = this;
        let curUrl = App.accessTokenHost + "/t/factory";
        if(that.$wechat.isInWechat()) {
          that.$wechat.init(curUrl, () => {
            that.$wechat.scanQRCode((resp) => {
              that.deviceId = resp;
              that.searchDevice();
            })
          })
        } else if(that.$alipay.isInAlipay()){
          that.$alipay.init(() => {
            that.$alipay.scanQRCode((resp) => {
              that.deviceId = resp;
              that.searchDevice();
            })
          })
        } else {
          that.$toast.warn("未知环境需要手动输入");
        }
      },
      searchDevice: function () {
         if(this.deviceId === "") {
          this.$toast.warn("请输入设备编码");
          return;
        }
        this.$router.push("/t/ifreshair/" + this.deviceId);
      },

      /**
       * 搜索设备
       */
      /*searchDevice() {
        let that = this;
        that.$http.get(`${that.$apihost}/admin/tools/devices/find`,{
          'q': that.keywords && that.keywords.toUpperCase(),
        })
          .then((data) => {
            that.deviceList = data;
            that.$store.state.showLoading = false;
          });
      },*/
    }
  }
</script>
