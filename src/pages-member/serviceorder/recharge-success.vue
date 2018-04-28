<style scoped type="text/scss" lang="scss">
  @import "~variables";

  .recharge-success {
    background: #fff;
    position: absolute;
    width: 100%;
    height: 100%;

    .recharge-success-main {
      width: 100%;
      text-align: center;
      padding-top: 20%;

      .icon-iot-xiaolian {
        font-size: rem(150px);
        color: $green-5;
      }
      &>span{
        color: $green-5;
        font-size: $font-size-l;
        display: inline-block;
        width: 100%;
      }
      .backBtn {
        margin-top: 20%;

        .btn {
          margin-left: 0!important;
        }
      }
    }
  }
  .copy-btn {
    @include border-radius(3px);
  }
  .tips-box {
    justify-content: center;

    .tips-content {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
<template>
  <app-view>
    <div class="recharge-success-bg"></div>
    <div class="recharge-success">
      <div class="recharge-success-main">
        <i class="iconfont icon-iot-xiaolian"></i>
        <span class="margin-top-xl">付款成功</span>
        <span class="color-primary margin-top" v-if="activeCode">
          激活码：{{ activeCode }}
          <button type="button"
                  class="btn btn-primary-outline btn-xs copy-btn"
                  v-if="activeCode !== ''"
                  @click="copyCode(activeCode)">复制</button>
        </span>

        <div class="backBtn">
          <button type="button" class="btn btn-round btn-primary-outline margin-m" @click="backHome()">回到首页</button>
          <!--<button type="button" class="btn btn-round btn-primary-outline margin-m" @click="showOrder()" v-if="payType === 'order'">查看订单</button>-->
          <!--<button type="button" class="btn btn-round btn-primary-outline margin-m" @click="checkDevice()" v-else-if="payType !== 'order'">查看设备</button>-->
        </div>
        <div class="tips margin-top-xxl bg-white">
          <h4>温馨提示</h4>
          <div class="valign-center tips-box margin-top">
            <div class="align-left tips-content">
              <p>1、给您发送退款链接的都是骗子</p>
              <p>2、所有要您提供密码的都是耍流氓</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </app-view>
</template>
<script>
  import types from '@/store/types'
  import Vue from 'vue'
  import VueClipboard from 'v-clipboard'
  Vue.use(VueClipboard)

  export default {
    name: 'recharge-success',
    data() {
      return {
        activeCode: this.$route.query.code,
        orderId: this.$route.query.leaseOrderId,
        deviceId: this.$route.query && this.$route.query.deviceId,
        payType: this.$route.query && this.$route.query.payType,
        isCheck: false
      }
    },
    methods: {
      /**
       * 返回首页
       */
      backHome() {
        this.$router.push(`/home`)
      },
      /**
       * 查看设备
       */
      checkDevice() {
        if(this.payType !== 'order') {
          this.$router.push(`/devices/${this.deviceId}/view`);
        }
      },
      /**
       * 复制激活码
       * @param val
       */
      copyCode(val) {
        this.$nextTick(() => {
          this.$clipboard(val);
          this.$messenger.success('复制成功');
        })
      },
      /**
       * 查看订单
       */
      showOrder() {
        if(this.payType === 'order') {
          this.$router.push(`/serviceorder/${this.orderId}/view`)
        }
      }
    }
  }
</script>
