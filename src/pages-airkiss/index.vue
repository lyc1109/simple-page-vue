<style scoped lang="scss" type="text/scss">
  .airkiss-pages-top {
    padding-top: 20px;
  }
</style>

<template>
  <div class="bg-white full-height">
    <div class="airkiss">
      <div class="airkiss-pages-top">
        <!--<img :src="$filters.staticImg('/static/images/airkiss/iot-pwbg.png')"/>-->
        <img src="/static/images/airkiss/iot-pwbg.png"/>
      </div>
      <div class="airkiss-pages-content">
        <div class="text-title">
          <b>即刻开启智能生活</b>
        </div>
        <ul class="airkiss-lists">
          <li>请确认手机已经连接至Wi-Fi网络</li>
          <li>暂不支持5G Wi-Fi</li>
        </ul>
      </div>
      <button class="airkiss-btn" @click="nextStep">
        <span>现在开始</span>
        <i class="iconfont icon-iot-youjiantou1 "></i>
      </button>
    </div>
  </div>
</template>

<script>
  import App from "@/assets/scripts/app";
  import devices from "@/apis/api-devices";

  export default {
    name: "airkiss",
    data() {
      return {
        deviceId: ''
      }
    },

    methods: {
      //下一步
      nextStep: function() {
        const that = this;
        let curUrl = App.accessTokenHost + "/airkiss";
        if(that.$wechat.isInWechat()) {
          that.$wechat.init(curUrl, () => {
            that.$wechat.getNetworkType((res) => {
              alert('isWifi = ' + res)
              if(res === "wifi") {
                that.$wechat.scanQRCode((resp) => {
                  that.deviceId = resp;
                  that.searchDevice();
                })
              } else {
                that.$toast.warn("请确认手机已经连接至Wi-Fi网络");
              }
            })
          })
        } else {
          that.$toast.warn("未知环境需要手动输入");
        }
      },

      //判断设备编号是否为空
      searchDevice: function () {
        if(this.deviceId === "") {
          this.$toast.warn("请输入设备编码");
          return;
        }
        this.scanQRCodeMsg();
      },

      //扫码结果获取设备信息
      scanQRCodeMsg: function() {
        const that = this;
        let deviceId = that.deviceId;
        alert('扫码结果获取设备信息 = ' + deviceId);
        that.$loading.show();
        devices.getDeviceQRCodeResult(deviceId)
          .then((res) => {
            that.$loading.hide();
            let deviceEntityId = res.deviceEntityId;
            alert('deviceEntityId = ' + deviceEntityId);
            if(deviceEntityId !== '') {
              that.$router.push("/airkiss/step01/" + deviceEntityId);
            } else {
              that.$toast.error("编码格式有误");
            }
          })
          .catch(() => {
            that.$loading.hide();
            that.$toast.error("设备信息加载失败");
          })
      }
    }
  }
</script>
