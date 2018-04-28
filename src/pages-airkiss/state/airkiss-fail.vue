<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .airkiss-pages-top {
    color: #ff3333;
    position: relative;
  }
  .airkiss-pages-top i {
    border: 2px solid #ff3333;
  }
  .airkiss-btn {
    border: 1px dashed #fff;
    position: static;
    display: block;
    margin: 0 auto;
  }
  .airkiss-border,
  .airkiss-border-deg {
    border: 1px dashed #ff3333;
  }
</style>

<template>
  <div class="bg-white full-height">
    <div class="airkiss">
      <div class="airkiss-pages-top airkiss-padding">
        <i class="airkiss-icon-pic iconfont icon-iot-jg"></i>
        <span>抱歉，设备未能配网成功！</span>
      </div>
      <div class="airkiss-pages-content airkiss-pages-border">
        <div class="airkiss-border-deg"></div>
        <div class="airkiss-border-deg01"></div>
        <div class="airkiss-border">
          <div class="airkiss-lists">
            <div class="text-title">可能原因</div>
            <ul class="airkiss-lists">
              <li>设备未处于等待配网状态</li>
              <li>周边存在其他同类型设备干扰配网</li>
              <li>wifi信号弱导致数据传输不稳定</li>
              <li>wifi连接的是5G网络</li>
            </ul>
          </div>
          <div class="airkiss-lists">
            <div class="text-title">建议操作</div>
            <ul class="airkiss-lists">
              <li>设备重新通电，手机重新启动配网工具，重新扫描配网</li>
              <li>尝试使用热点等其他wifi配网</li>
              <li>设备移动到wifi信号强的位置重新配网</li>
            </ul>
          </div>
          <button class="airkiss-btn" @click="nextStepFn">
            <span>再试一次</span>
            <i class="iconfont icon-iot-youjiantou1 "></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import App from "@/assets/scripts/app";

  export default {
    name: "airkiss-fail",
    data() {
      return {
        deviceId: ''
      }
    },

    methods: {
      nextStepFn: function () {
        window.location.href = `/airkiss/step02`;
      },
    }
  }
</script>
