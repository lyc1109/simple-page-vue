<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .workorders {
    li {
      border-bottom: 1px solid $border;
      margin-bottom: 0 !important;
      @extend %margin-top;
      &:first-child {
        margin-top: 0 !important;
      }
      &:last-child {
        border-bottom: 0;
      }
    }
  }
  .order-foot {
    @extend %padding-m;
    overflow: hidden;
    line-height: 30px;
  }
  .order-status {
    position: relative;
    min-width: rem(46px);
    .order-status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(236, 77, 77, 0.5);
      position: relative;
      &:before {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 4px;
        height: 4px;
        background: red;
        border-radius: 50%;
      }
    }
    .order-status-text {
      display: inline-block;
      padding-left: 2px;
    }
  }
  .contact-info {
    .text-s {
      @extend %padding-top;
    }
    .address-info {
      width: 100%;
      word-wrap:break-word;
      word-break:break-all;
      white-space: normal;
    }
  }
  .bg-light {
    background: lighten($page_bg, 0.1);
  }
  .order-info-item {
    .order-type {
      justify-content: center;
      padding: rem(1px) rem(3px);
      color: $white;
      background: $primary;
      @include border-radius();
      @extend %valign-center;

      &.type-1 {
        background: $success;
      }
      &.type-2 {
        background: $red-1;
      }
      &.type-3 {
        background: $info;
      }
      &.type-4 {
        background: $danger-light;
      }
      &.type-5 {
        background: $warning;
      }
    }
    .image-product {
      width: rem(50px);
      height: rem(50px);
      justify-content: center;
      overflow: hidden;
      img {
        height: 100%;
        width: auto;
        max-width: fit-content;
      }
    }
    .product-detail {
      white-space: inherit;
      flex-direction: column;
      align-items: flex-start;
      height: rem(50px);
    }
    .copy-tag {
      border: 1px solid $primary;
      padding: rem(1px) rem(3px);
      min-width: 20px;
      display: inline-block;
    }
  }
  .has-no-more {
    color: $font-lighter;
    text-align: center;
    @extend %padding-m;
    display: flex;

    .hr,.last-tips {
      position: relative;
      width: 100%;
      display: inline-block;
      vertical-align: middle;
      flex: 1;
    }

    .hr {
      content: '';
      display: inline-block;
      height: 1px;
      background-color: $gray-light;
      flex: 1;
      position: relative;
      top: rem(10px);
    }
  }
</style>
<template>
  <div :class="type !== 'list' ? 'margin-top' : ''">
    <ul v-if="workOrder && workOrder.length > 0" class="workorders" id="container">
      <li v-for="(order, index) in workOrder">
        <div class="bg-white order-info-item" @click="view(order.id)">
          <div class="order-title padding-m flex valign-center border-bottom">
              <span class="font-s">
                <span v-if="order.orderType === 'lease'">
                  <span class="order-type type-1" v-if="order.leaseFeature === 'personal'">租</span>
                  <span class="order-type type-2" v-else-if="order.leaseFeature === 'company'">租</span>
                </span>
                <span v-else-if="order.orderType === 'business'" class="order-type type-3">装</span>
                <span v-else-if="order.orderType === 'install'" class="order-type type-3">装</span>
                <span v-else-if="order.orderType === 'common'" class="order-type type-4">修</span>
                <span v-else-if="order.orderType === 'returnDeposit'" class="order-type type-5">退</span>
                <span v-else class="order-type type-6">无</span>
              </span>
            <div class="valign-center margin-left-s font-light margin-right-m flex-item">
              <div class="text-wrapper">
                工单号：<span class="font-family-num">{{ order.workOrderId }}</span>
              </div>
            </div>
            <div class="pull-right order-status valign-center">
              <i class="order-status-dot"></i>
              <div class="text-s order-status-text font-default margin-left-s">
                <status class="color-red-1" :order="order"></status>
              </div>
            </div>
          </div>
          <div class="order-content padding-m">
            <div class="font-bold-400 font-m flex font-family-num">
              <span class="font-bold-500">{{ order.contactName }}</span>
              <div class="margin-left-l color-primary">
                <i class="iconfont icon-IOT-dh margin-right-s font-default"></i>
                <span class="color-blue-2 font-bold-400" @click.stop="phoneCall(order.contactMobile)">{{ order.contactMobile }}</span>
              </div>
            </div>
            <div class="font-bold-400 padding-top-m">
              <div class="font-family-num">
                <i class="iconfont icon-IOT-time font-s font-light"></i>
                <span class="margin-left-s">{{ $filters.formatDate(order.serviceDate) }}</span><span class="margin-left-l">{{ order.serviceTime }}</span>
              </div>
              <div class="margin-top-m flex">
                <div class="flex-item text-wrapper-overline">
                  <i class="iconfont icon-IOT-dz font-s font-light"></i>
                  <span class="margin-left-s" v-if="order.newAddress === null">{{ order.serviceAddress }}</span>
                  <span class="margin-left-s" v-else-if="order.newAddress !== null">{{ order.newAddress }}</span>
                </div>
                <div style="display: inline-block;">
                  <actions type="copy-btn" :address="order.serviceAddress || order.newAddress" :index="index"></actions>
                </div>
              </div>
            </div>
            <div class="bg-light margin-top-m border-radius padding flex">
              <div class="image-product border-radius border valign-center bg-white">
                <img v-lazy.container="$filters.img(order.productImage,'!wh100')" :src="$filters.img(order.productImage,'!wh100')" alt="">
              </div>
              <div class="flex-item flex margin-left-m product-detail">
                <div class="text-title font-default text-wrapper-2line">
                  <span v-if="order.orderType === 'lease'">{{ (order.leaseProduct && order.leaseProduct.name) ? order.leaseProduct.name : '无' }}</span>
                  <span v-else>{{ order.productName }}</span>
                </div>
                <div class="flex-item"></div>
                <div class="font-light font-s font-family-num">
                  <span v-if="order.orderType === 'lease'">产品代码：{{ (order.leaseProduct && order.leaseProduct.code) ? order.leaseProduct.code : '无' }}</span>
                  <span v-else-if="order.orderType === 'common'">型号：{{ (order.leaseProduct && order.leaseProduct.code) ? order.leaseProduct.code : '无' }}</span>
                  <span v-else>型号：{{ order.leaseProduct && order.leaseProduct.productItemCode ? order.leaseProduct.productItemCode : '无' }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="order-footer padding-m padding-top-zero flex">
            <div class="flex-item"></div>
            <actions type="list" :order="order"
                     @transferModel="transferOrder(order)"></actions>
          </div>
        </div>
      </li>
      <li>
        <div class="has-no-more">
          <div class="hr margin-right-s"></div>
          <div class="last-tips">我也是有底线的</div>
          <div class="hr margin-left-s"></div>
        </div>
      </li>
    </ul>
    <div v-if="!workOrder || workOrder.length === 0">
      <div class="padding-l align-center text-second bg-white">暂无{{ title }}</div>
    </div>
    <!-- 转单 -->
    <div v-if="transferData && transferData.status">
      <mt-popup v-if="(transferData.status === 20 || transferData.status === 30)"
                v-model="transferPopup"
                popup-transition="popup-fade"
                class="transfer-page" style="height: 60%">
        <transfer-page type="list" :order="transferData"
                       @cancel="transferPopup = false"></transfer-page>
      </mt-popup>
    </div>
  </div>
</template>

<script>
  import actions from "./tpl/tpl-actions.vue";
  import status from "./tpl/tpl-status.vue";
  import types from "@/store/types";
  import transferPage from './work-order/transfer-page.vue';

  export default {
    name: "index-order",
    props: [
      "workOrder",
      "type"
    ],
    data() {
      return {
        // 要复制的数据
        clipboardData: [],
        // 转单数据
        transferData: {},
        // 转单弹窗
        transferPopup: false,
      }
    },
    components: {
      actions,
      status,
      transferPage
    },
    created() {
      let _temp = this.workOrder;
      let _data = this.clipboardData;
      for(let i=0,len=_temp; i<len; i++) {
        _data[_temp[i]] = false;
      }
    },
    mounted() {
      // 记录滚动条位置
      this.$nextTick(() => {
        let _position = this.$store.getters[types.wos.getScroll];
        window.scroll(0, _position);
      })
    },
    computed: {
      // 工单列表标题
      title() {
        return this.type === 'processing' ? "进行中工单" : "全部工单";
      }
    },
    methods: {
      /**
       * 拨打电话
       * @param _phone 电话
       */
      phoneCall(_phone) {
        window.location.href = 'tel:' + _phone;
      },
      /**
       * 工单详情
       * @param id
       */
      view(id) {
        let _position = window.scrollY;
        this.$store.commit(types.wos.setScroll, _position);

//        this.$router.push(`/wos/workOrder/${id}`);
        window.location.href = `/wos/workOrder/${id}`;
      },
      /**
       * 转单
       * @param order
       */
      transferOrder(order) {
        this.transferData = order;
        this.transferPopup = true;
      }
    }
  }
</script>

