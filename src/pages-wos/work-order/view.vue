<style lang="scss" type="text/scss">
  @import '~variables';
  .flex {
    align-items: initial;
    .flex-item-2 {
      flex: 0 0 20%;
      padding-top: 20%;
      position: relative;
    }
  }
  .logs-box .steptwo span {
    color: $white!important;
  }
  .openlogs {
    a.cell-item {
      padding: 0;
      min-height: 0;
      background: transparent;
      .mint-cell-title {
        flex: 0;
      }
      .mint-cell-value {
        color: rgba(255, 255, 255, .8);
        font-size: 12px;
        width: 100%;
        span {
          @extend %text-wrapper;
        }
      }
      .mint-cell-wrapper {
        min-height: initial;
        height: auto;
        padding: 0;
      }
      .mint-cell-allow-right:after {
        border: 2px solid rgba(255, 255, 255, .8);
        border-bottom-width: 0;
        border-left-width: 0;
        right: rem($m)!important;
      }
    }
  }
  .fee-detail {
    .mint-cell-wrapper {
      min-height: initial;
      line-height: inherit;
    }
  }
</style>
<style scoped lang="scss" type="text/scss">
  @import '~variables';
  .product-image {
    position: absolute;
    top: 0;
    max-height: rem(60px);
    width: 100%;
    overflow: hidden;
    justify-content: center;
    img {
      max-width: fit-content;
      width: 100%;
    }
  }
  .logs-timeline {
    width: 100%;
    height: 100%;
    background-color: $white;
  }
  .logs-box {
    height: auto;
    position: relative;
    .stepbar {
      height: rem(120px);
      &:before {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        top: 50px;
        left: 0;
        background: linear-gradient(left, rgba(255,255,255,.2), rgba(255,255,255,.6), rgba(255,255,255,1), rgba(255,255,255,.6), rgba(255,255,255,.2));
      }
      .stepone {
        position: absolute;
        top: 64px;
        left: 12%;
        font-size: 12px;
        color: rgba(255, 255, 255, .5);
        &:before {
          content: '';
          position: absolute;
          top: -15px;
          left: 17px;
          width: 3px;
          height: 3px;
          background: rgba(255,255,255,0.6);
          @include border-radius(50%);
        }
        &:after {
          content: '';
          position: absolute;
          top: -17px;
          left: 15px;
          width: 7px;
          height: 7px;
          background: rgba(255, 255, 255, .3);
          @include border-radius(50%);
        }
      }
      .steptwo {
        position: absolute;
        top: 62px;
        left: calc(50% - 24px);
        font-size: 16px;
        color: $white;
        span {
          color: $white!important;
        }
        &:before {
          content: '';
          position: absolute;
          top: -14px;
          left: calc(50% - 2.5px);
          width: 5px;
          height: 5px;
          background: rgba(255, 255, 255, 1);
          @include border-radius(50%);
        }
        &:after {
          content: '';
          position: absolute;
          top: -18px;
          left: calc(50% - 6.5px);
          width: 13px;
          height: 13px;
          background: rgba(255, 255, 255, .3);
          @include border-radius(50%);
        }
      }
      .stepthree {
        position: absolute;
        top: 64px;
        right: 12%;
        font-size: 12px;
        color: rgba(255, 255, 255, .7);
        &:before {
          content: '';
          position: absolute;
          top: -15px;
          right: 11px;
          width: 3px;
          height: 3px;
          background: rgba(255, 255, 255, 0.6);
          @include border-radius(50%);
        }
        &:after {
          content: '';
          position: absolute;
          top: -17px;
          right: 9px;
          width: 7px;
          height: 7px;
          background: rgba(255, 255, 255, .3);
          @include border-radius(50%);
        }
      }
    }
    .contact-info {
      background: $white;
      a:link,a:visited,a:hover {
        color: #444;
      }
      .location {
        font-size: 12px;
        .icon-dingwei {
          color: #2F8CFC;
        }
      }
    }
    .logs-box-status {
      background-color: $primary;
      background-image: -webkit-linear-gradient(top, $primary, $blue-1);        /* Chrome 10-25, iOS 5+, Safari 5.1+ */
      background-image:         linear-gradient(to bottom, $primary, $blue-1);  /* Chrome 26, Firefox 16+, IE 10+, Opera */
    }
  }
  .order-id-time {
    .orderId {
      margin-bottom: 5px;
    }
    .created {
      margin-bottom: 0;
    }
  }
  .order-info {
    .product-info {
      flex-direction: column;
    }
    .order-info-item {
      margin-left: rem($m);
      padding-left: 0!important;
      @extend %padding-m;
      @include border(bottom);
      &:first-child {
        margin-left: 0!important;
        padding-left: rem($m)!important;
      }
      .title-box {
        min-width: rem(55px);
        margin-right: rem($m);
      }
    }
  }
  .copy-tag {
    border: 1px solid $primary;
    padding: rem(1px) rem(3px);
    min-width: 20px;
    display: inline-block;
  }
  .device-page {
    width: 100%;
    height: 100%;
    background: $white;
  }
</style>
<template>
  <div>
    <app-view :hasFooter="true">
      <div class="logs-box">
        <div class="logs-box-status">
          <div class="stepbar">
            <div class="stepone">已分派</div>
            <div class="steptwo"><status :order="entity"></status></div>
            <div class="stepthree">完成</div>
          </div>
          <div @click="openLogs" class="openlogs">
            <mt-cell class="cell-item flex padding-m" is-link>
              <i class="fa fa-bell"></i> &nbsp;&nbsp;
              <span v-if="logs && logs.length > 0">{{ $filters.formatDate(logs[0].created,"YYYY-MM-DD HH:mm") }} {{ logs[0].log }}</span>
            </mt-cell>
          </div>
        </div>
        <div class="contact-info padding-m">
          <div class="title font-m margin-bottom-s font-bold-400">
            <span>{{ entity.contactName }}</span>
            <a v-if="entity.contactMobile" class="margin-left-m" :href="'tel:'+ entity.contactMobile">
              <i class="icon iconfont color-primary margin-right icon-IOT-dh"></i>{{ entity.contactMobile }}
            </a>
            <a v-else-if="entity.contactTelephone" class="margin-left-m" :href="'tel:'+ entity.contactTelephone">
              <i class="icon iconfont color-primary margin-right icon-IOT-dh"></i>{{ entity.contactTelephone }}
            </a>
          </div>
          <div class="location flex">
            <i class="iconfont icon-IOT-dz font-light"></i>
            <div class="flex-item text-wrapper-overline font-default">
              <span>{{ entity.serviceAddress }}</span></div>
            <div style="display: inline-block;">
              <actions type="copy-btn" :address="entity.serviceAddress" index="0"></actions>
            </div>
          </div>
        </div>
      </div>
      <!-- 工单详情 -->
      <div class="margin-top order-info bg-white">
        <div class="flex order-info-item">
          <div class="flex-item-2 margin-right-m">
            <div class="product-image valign-center">
              <img v-if="entity.productImage" v-lazy="$filters.img(entity.productImage,'!wh100')" class="border border-radius">
              <img v-else v-lazy="$filters.img((entity.product && entity.product.coverImage ? entity.product.coverImage : ''),'!wh100')" class="border border-radius">
            </div>
          </div>
          <div class="product-info flex-item flex">
              <div class="font-m font-title text-wrapper-overline">
                <!--v-if="entity.orderType === 'common'"-->
                <span class="order-productname font-bold-400">{{ entity.leaseProductName ? entity.leaseProductName : (entity.productName ? entity.productName : '无产品名称') }}</span>
                <!--<span v-else class="order-productname font-bold-400">{{ entity.product && entity.product.name }}</span>-->
              </div>
              <div v-if="entity.orderType === 'common'" class="font-s font-lighter margin-top">产品型号：{{ entity.productItemCode ? entity.productItemCode : '无' }}</div>
              <div v-else class="font-s font-lighter margin-top">产品代码：{{ entity.product && entity.product.itemCode ? entity.product.itemCode : '无' }}</div>
              <div class="flex-item"></div>
          </div>
        </div>
        <div v-if="entity.orderType === 'returnDeposit'"
             class="padding-m flex border-bottom"
             style="align-items: flex-start">
          <div class="font-light title-box" style="min-width: 70px">退租设备SN码</div>
          <div class="flex-item"></div>
          <div class="margin-left-l">
            <div v-if="entity.refundDeviceIds"
               v-for="item in entity.refundDeviceIds"
               class="text-wrapper-overline font-bold-500">{{ item }}</div>
            <span v-else>无</span>
          </div>
        </div>
        <div class="order-info-item flex">
          <div class="font-light title-box">服务类型</div>
          <div class="flex-item"></div>
          <div>
            <span v-if="entity.orderType === 'common'">{{ entity.shopServiceName}}</span>
            <span v-else-if="entity.orderType === 'lease'">
              <span v-if="entity.leaseFeature === 'personal'">个人租赁</span>
              <span v-else-if="entity.leaseFeature === 'company'">商务租赁</span>
            </span>
            <span v-else-if="entity.orderType === 'business'">租赁装机</span>
            <span v-else-if="entity.orderType === 'returnDeposit'">
              <span v-if="entity.leaseFeature === 'personal'">个人退租</span>
              <span v-else-if="entity.leaseFeature === 'company'">商务退租</span>
            </span>
            <span v-else-if="entity.orderType === 'install'">
              <span v-if="entity.leaseProduct">装机工单</span>
              <span v-else-if="!entity.leaseProduct">普通装机</span>
            </span>
            <span v-else>无</span>
          </div>
        </div>
        <div class="order-info-item flex">
          <div class="title-box font-light">预约时间</div>
          <div class="flex-item"></div>
          <div>
            <span>{{ $filters.formatDate(entity.serviceDate,'YYYY-MM-DD')+ '&nbsp;&nbsp;' + entity.serviceTime }}</span>
          </div>
        </div>
        <div class="order-info-item flex" v-if="entity.orderType === 'lease' || entity.orderType === 'install'">
          <div class="font-light title-box" v-if="entity.orderType === 'lease'">租赁数量</div>
          <div class="font-light title-box" v-else-if="entity.orderType === 'install'">装机数量</div>
          <div class="flex-item"></div>
          <div>
            <span>{{ entity.deviceCount }}</span>
          </div>
        </div>
        <!--设备列表-->
        <div v-if="entity.orderType !== 'returnDeposit' && entity.orderType !== 'common'">
          <div v-if="(entity.status > 20 && (entity.deviceType === 'L' || entity.orderType === 'lease' || entity.orderType === 'install')) || (entity.status >= 70 && deviceDataLen > 0)"
               class="order-info-item flex"
               @click.stop="lookDevice()">
            <div class="flex-item font-light title-box">设备列表</div>
            <span>{{ deviceDataLen ? deviceDataLen : '0'}}   个设备</span>
            <div class="valign-center">
              <i class="iconfont icon-iot-youjiantou1 font-light font-s"></i>
            </div>
          </div>
        </div>
        <!--商务租赁-->
        <div class="order-info-item flex" v-if="entity.leaseFeature === 'company'">
          <div class="font-light title-box">租赁公司</div>
          <div class="flex-item"></div>
          <div>
            <span>{{ entity.leaseCompany }}</span>
          </div>
        </div>
        <!-- 图片附件 -->
        <div v-if="entity.orderType === 'common'">
          <div class="padding-m padding-left-zero margin-left-m font-light title-box flex" :class="{ 'border-bottom': !hasImage }">
            图片附件
            <span v-if="!hasImage" class="align-right flex-item">无</span>
          </div>
          <div v-if="hasImage" class="margin-left-m square-uploadimg flex-item align-right">
            <v-image :imgShowList="entity.images" :isUpload="false" :imgRight="true"></v-image>
          </div>
        </div>
        <div class="order-info-item flex" v-if="entity.customerMemo !== null">
          <div class="font-light title-box">备注说明</div>
          <div class="flex-item"></div>
          <div>
            <span>{{ entity.customerMemo }}</span>
          </div>
        </div>
        <div class="order-id-time font-s font-light padding-m">
          <p class="orderId">工单编号：{{ entity.workOrderId }}</p>
          <p class="created" v-if="null !== entity.created">创建日期：{{ $filters.formatDate(entity.created,'YYYY-MM-DD HH:mm') }}</p>
        </div>
      </div>

      <!-- 费用合计 -->
      <div v-if="entity.status && feeData && feeData.length > 0"
           class="fee-detail bg-white margin-top">
        <div class="padding-m">费用</div>
        <div class="cell-group">
          <mt-cell class="cell-item padding-m padding-left-zero"
                   v-if="feeData && feeData.length > 0"
                   v-for="item in feeData"
                   :key="item.id"
                   :title="item.feeDefName">
            <span class="currency-rmb color-red-1">{{ $filters.formatCurrency(item.formatFeeItemPrice) }}</span>
            <span class="text-second" v-if="item.feeItemNum > 1">{{ '&nbsp;× ' + item.feeItemNum }}</span>
          </mt-cell>
          <mt-cell class="cell-item padding-m padding-left-zero" title="合计" v-if="entity.payment && entity.payment != ''">
            <!--<del v-if="entity.totalAmount != entity.payment"><span class="text-s currency-rmb text-second">{{ feeData.formatSubTotal }}</span></del>-->
            <del v-if="entity.totalAmount != entity.payment"><span>{{ $filters.formatCurrency(entity.totalAmount/100) }}</span></del>
            <span class="text-m currency-rmb color-red-1">&nbsp;{{ $filters.formatCurrency(entity.payment/100) }}</span>
          </mt-cell>
        </div>
      </div>

      <!-- 设备列表 -->
      <mt-popup v-model="devicePopup"
                popup-transition="popup-fade"
                class="device-page">
        <order-devicelist :status="entity.status"></order-devicelist>
      </mt-popup>

      <!-- 转单 -->
      <div v-if="transferData && transferData.status" @click.stop="">
        <mt-popup v-if="(transferData.status === 20 || transferData.status === 30)"
                  v-model="transferPopup"
                  popup-transition="popup-fade"
                  class="transfer-page">
          <transfer-page @cancel="transferPopup=false" type="view" :order="transferData"></transfer-page>
        </mt-popup>
      </div>

      <!-- 办理流程 -->
      <mt-popup v-model="popupVisible"
                popup-transition="popup-fade" class="logs-timeline">
        <logs-timeline @cancel="popupVisible=false" :logs="logs"></logs-timeline>
      </mt-popup>

      <!-- 按钮组 -->
      <div slot="footer" class="padding-right-m align-right border-top page-footer bg-white" style="height: 50px;line-height: 50px;">
        <actions type="view" :order="entity"
                 @transferModel="transferOrder(entity)"></actions>
      </div>
    </app-view>
  </div>
</template>

<script>
  import types from "@/store/types";
  import actions from "../tpl/tpl-actions.vue"
  import status from "../tpl/tpl-status.vue"
  import orderDevicelist from "./order-devicelist.vue"
  import logsTimeline from "./logs-timeline.vue"
  import transferPage from './transfer-page.vue';
  import VImage from '@/components/ui/v-image';

  export default{
    name: "wos-view",
    data() {
      return {
        // 工单id
        orderId: this.$route.params.id,
        // 工单对象数据载体
        entity: {},
        // 是否有图片附件
        hasImage: false,
        // 弹窗是否可视
        popupVisible: false,
        // 产品图片
        productImage: '',
        // 订单记录
        logs: '',
        // 费用数据
        feeData: {},
        // 费用总数
        totalFee: 0,
        // 转单数据
        transferData: {},
        // 是否显示转单弹窗
        transferPopup: false,
        // 是否显示设备列表弹窗
        devicePopup: false,
        // 设备数量
        deviceDataLen: 0
      }
    },
    created() {
      // 初始化
      this.$loading.hide();
      this.$store.showLoading = true;
      this.$store.commit(types.wos.setServiceData, null);

//      let _href = location.href.split('#')[0];
//      this.$store.commit(types.common.setEnterURL, _href);
      this.$http.get(`${this.$woshost}/workorders/${this.orderId}`)
        .then((resp) => {
          this.entity = resp;
          if (this.entity.images !== null && this.entity.images.length > 0) {
            this.hasImage = true;
          }
          this.productImage = this.entity.productImage;

          // 日志数据
          this.$http.get(`${this.$woshost}/workorders/${this.orderId}/logs`)
            .then((logs) => {
              this.logs = logs;
            });

          // 费用数据
          this.$http.get(`${this.$woshost}/workorders/${this.orderId}/fees`)
            .then((fee) => {
              this.feeData = fee;
            });
        });

      if(!window.location.hash) {
        this.devicePopup = false;
      } else {
        this.devicePopup = true;
      }
      this.$store.showLoading = false;
    },
    mounted() {
      this.$nextTick(() => {
        // 设备数据
        this.$http.get(`${this.$woshost}/workorders/${this.orderId}/devices`)
          .then((device) => {
            this.deviceDataLen = device.length;
          })

        window.onpopstate = () => {
          if(!window.location.hash) {
            this.devicePopup = false;
          } else {
            this.devicePopup = true;
          }
        }
        this.$loading.hide();
      })
    },
    methods: {
      /**
       * 查看工单操作日志
       */
      openLogs: function () {
        this.popupVisible = true;
      },
      /**
       * 转单
       * @param order
       */
      transferOrder(order) {
        this.transferData = order;
        this.transferPopup = true;
      },
      /**
       * 查看设备列表/添加设备
       */
      lookDevice() {
        if(this.deviceDataLen > 0) {
          this.devicePopup = true;
          window.location.hash = 'device';
        } else {
          if(this.entity && this.entity.status < 70) {
            this.$dlg.alert("暂无设备,快去扫码添加吧~");
          }
        }
      },
    },
    components: {
      actions,
      status,
      orderDevicelist,
      logsTimeline,
      transferPage,
      VImage
    }
  }
</script>
