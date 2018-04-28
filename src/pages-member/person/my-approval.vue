<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .ouath-box {
    width: 100%;
    overflow: auto;
    .btn-close {
      position: fixed;
      right: $m;
      top: $m;
    }
    .flex-item-2 {
      flex: 0 0 15%;
      padding-top: 15%;
      position: relative;
    }
    .text-wrapper-2line {
      white-space: initial;
    }
    .line-top {
      background: $page_bg;
    }
    .product-image {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      overflow: hidden;
      justify-content: center;

      img {
        height: 100%;
        width: auto;
        max-width: initial;
      }
    }
    .product-info {
      flex-direction: column;
    }
    .ouath-item {
      align-items: flex-start;
    }
    .page-footer {
      background: $primary;
    }
  }
</style>
<template>
  <div class="full-height">
    <div class="ouath-box bg full-height padding-bottom-xxl">
      <div v-if="approval && approval.length > 0"
           v-for="(item, index) in approval"
           class="ouath-item bg-white"
           :class="{ 'margin-top': index > 0 }">
        <div class="padding-top-m padding-bottom-m margin-left-m margin-right-m flex border-bottom">
          <div class="flex-item-2 margin-right-m">
            <div class="product-image valign-center border border-radius">
              <img v-lazy="$filters.img(item.device && item.device.productImage,'!q70')">
            </div>
          </div>
          <div class="product-info-box">
            <div class="product-info flex-item flex">
              <div class="font-m font-title text-wrapper">
                <span class="order-productname font-bold-400 text-wrapper-overline">{{ item.device && item.device.deviceName ? item.device.deviceName : '无产品名称' }}</span>
              </div>
              <div class="font-default font-light margin-top text-wrapper">{{ item.device && item.device.itemCode ? item.device.itemCode : '无产品型号' }}</div>
            </div>
          </div>
        </div>
        <div class="padding-m padding-top padding-bottom border-bottom">
          <div>申请人： <span class="color-orange-2">{{ item.userNick ? item.userNick : '无申请人姓名' }}  ({{ item.userMobile ? item.userMobile : '无申请人手机号' }})</span></div>
          <div class="margin-top-s">申请时间： <span class="font-family-num">{{ item.createdDate ? $filters.formatDate(item.createdDate) : '' }}</span></div>
        </div>
        <div class="flex padding-m padding-top">
          <div class="flex-item"></div>
          <actions :order="item" type="oauth"></actions>
        </div>
      </div>
      <app-empty-view v-if="!approval || approval.length === 0"></app-empty-view>
    </div>
    <!--<div class="device-page-box valign-center" style="justify-content: center" v-if="!deviceData || deviceData.length <= 0">暂无数据</div>-->
    <div class="page-footer align-center" @click="cancel()">
      <div class="padding-m btn-primary color-white">关闭</div>
    </div>
  </div>
</template>

<script>
  import actions from "../tpl/tpl-action.vue";
  import AppEmptyView from '@/components/layouts/app-empty-view';

  export default {
    name: "my-approval",
    data() {
      return {
        // 设备授权申请数据
        approval: {}
      }
    },
    created() {
      // 获取设备授权数据
      this.$http.get(`${this.$apihost}/userdevices/pending-approvals`)
        .then((data) => {
          this.approval = data;
        })
    },
    methods: {
      /**
       * 取消
       */
      cancel() {
        this.$router.go(-1);
      }
    },
    components: {
      actions,
      AppEmptyView
    }
  }
</script>

