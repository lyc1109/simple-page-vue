<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .airkiss-pages-top {
    color: #66cc00;
    position: relative;
  }
  .airkiss-pages-top i {
    border: 2px solid #66cc00;
  }
  .airkiss-border,
  .airkiss-border-deg {
    border: 1px dashed #66cc00;
  }
</style>

<template>
  <div class="bg-white full-height">
    <div class="airkiss">
      <div class="airkiss-pages-top airkiss-padding">
        <i class="airkiss-icon-pic iconfont icon-iot-dg"></i>
        <span>恭喜您，设备配网成功！</span>
      </div>
      <div class="airkiss-pages-content airkiss-pages-border">
        <div class="airkiss-border-deg"></div>
        <div class="airkiss-border-deg01"></div>
        <div class="airkiss-border">
          <div class="airkiss-device-msgs">
            <div class="airkiss-device-msg">
              <span>设备IP地址</span>
              <span>{{deviceIP}}</span>
            </div>
            <div class="airkiss-device-msg">
              <span>设备mac地址</span>
              <span>{{deviceMAC}}</span>
            </div>
            <div class="airkiss-device-msg">
              <span>设备编号</span>
              <span>{{deviceNum}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "airkiss-success",
    data() {
      return {
        deviceIP: '202.202.020.200',
        deviceMAC: 'Z60D8925DMI15',
        deviceNum: 'KZWVDV05XW9G'
      }
    },

    methods: {

    }
  }
</script>
