<style scoped lang="scss" type="text/scss">
  .airkiss-pages-top {
    padding-top: 30px;
  }
  .airkiss-pages-top > img {
    width: 60%;
  }
  .text-title {
    text-align: center;
    font-size: 12pt;
  }
  .airkiss-device-msgs {
    margin: 20px 0 0 0;
    border-top: 1px dashed rgba(153, 204, 255, 0.4);
    border-bottom:  1px dashed rgba(153, 204, 255, 0.4);
  }
  .airkiss-lists li:first-child {
    font-size: 9pt;
    color: #000;
    padding-bottom: 2px;
    display: flex;
    justify-content: space-between;
  }
  .airkiss-lists li:first-child i {
    float: right;
    width: 18px;
    height: 18px;
    line-height: 18px;
    border-radius: 50%;
    background-color: #66cc00;
    color: #fff;
    text-align: center;
  }
  .airkiss-lists li:first-child:before {
    color: #66cc00 !important;
  }
  .airkiss-lists li:last-child {
    color: #666;
    font-size: 7pt;
  }
  .airkiss-lists li:last-child:before {
    content: '';
  }
</style>

<template>
  <div class="bg-white full-height" :isOnline="isOnline">
    <div class="airkiss-step01">
      <div class="airkiss-pages-top">
        <img :src="productImage"/>
      </div>
      <div class="airkiss-pages-content">
        <div class="text-title">{{deviceName}}&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <div class="airkiss-device-msgs">
          <div class="airkiss-device-msg">
            <span>设备型号</span>
            <span>{{iotDeviceModel}}</span>
          </div>
          <div class="airkiss-device-msg">
            <span>设备编号</span>
            <span>{{deviceId}}</span>
          </div>
          <div class="airkiss-device-msg">
            <span>设备状态</span>
            <span v-if="isOnline">在线</span>
            <span v-else>离线</span>
          </div>
        </div>
        <ul class="airkiss-lists">
          <li>
            <span>接通电源，确认Wi-Fi指示灯处于闪烁中</span>
            <i class="iconfont icon-iot-dg"></i>
          </li>
          <li>部分机型可能没有指示灯，确保接通电源即可</li>
        </ul>
      </div>
      <button class="airkiss-btn" @click="nextStep">
        <span>下一步</span>
        <i class="iconfont icon-iot-youjiantou1"></i>
      </button>
    </div>
  </div>
</template>

<script>
  import App from "@/assets/scripts/app";
  import devices from "@/apis/api-devices";
  import freshairApis from "@/apis/api-t-ifreshair";

  export default {
    name: "airkiss-step01",
    data() {
      return {
        deviceName: '',
        productImage: '/static/images/airkiss/iot-pro.png',
        iotDeviceModel: '',
        deviceId: ''
      }
    },

    computed: {
      //获取扫码后的设备id
      deviceEntityId: function () {
        return this.$route.params.deviceEntityId;
      },
      //判断设备是否在线
//      isOnline: function () {
//        return freshairApis.online(this.deviceId);
//      },
    },

    //
    mounted(){
      this.loadDeviceDetail(true);
    },

    methods: {
      // 加载设备详情
      loadDeviceDetail: function () {
        const that = this;
        let deviceEntityId = this.deviceEntityId;
        that.$loading.show();
        devices.detail(deviceEntityId)
          .then((res) => {
            that.$loading.hide();
            that.deviceName = res.deviceName;
            that.deviceId = res.deviceId;
            that.iotDeviceModel = res.iotDeviceModel;
            if(res.productImage !== "") {
              that.productImage = res.productImage;
            }
          })
          .catch(() => {
            that.$loading.hide();
            that.$toast.error("设备信息加载失败");
          })
      },
      //下一步
      nextStep: function () {
        let that = this;
        let deviceId = this.deviceId;
        if(deviceId) {
          window.location.href = `/airkiss/step02/` + this.deviceId;
        } else {
          that.$toast.error("设备不存在，无法进行下一步");
        }

      }
    }
  }
</script>
