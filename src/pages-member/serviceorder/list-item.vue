<style scoped lang="scss" type="text/scss">
  @import '~variables';
  .serviceOrder {
    .list-item {
      .orderState {

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
            background: $primary;
          }
        }
      }
      .order-status {
        position: relative;
        min-width: rem(46px);
      }
      .orderInfos {
        display: flex;

        .orderImg {
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

        .orderInfoBox {
          white-space: inherit;
          flex-direction: column;
          align-items: flex-start;
          min-height: rem(50px);

          .deposit,.rent {
            background: $yellow-3;
            border: 1px solid rgba($yellow-3,.4);

            .tag-name {
              color: $white;
              background: $yellow-3;
              text-align:center;
              padding: 0 rem(3px);
              border-radius: 3px 0 0 3px;
            }

            .tag-value {
              font-weight: 100;
              background: $white;
              color: $yellow-3;
              padding: rem(1px) rem(5px);
              border-left: none;
              border-radius: 0 3px 3px 0;
            }
          }
        }
      }
    }
  }
  .orderbasicInfo {
    &>span{
      width: 100%;
      line-height: rem(25px);
      display: inline-block;
      height: rem(25px);

      .iconfont{
        color: $font-light;
      }
      .btn{
        @include border-radius(3px);
      }
    }
  }
  .orderOperate {
    justify-content: flex-end;
    display: flex;
  }
</style>
<template>
  <ul class="serviceOrder" v-if="orderData !== null && orderData.length > 0">
    <li class="bg-white ripple list-item margin-bottom-m border-top" v-for="item in orderData" @click="detail(item)">
      <!-- 非销售订单 -->
      <div v-if="item.orderType !== 'trade'">
        <div class="orderState padding-m valign-center flex border-bottom">
          <div class="flex-item flex">
          <span class="border-radius font-s color-white">
            <span class="order-type type-1" v-if="item.orderType && item.orderType === 'common'">修</span>
            <span class="order-type type-2" v-else-if="item.orderType && item.orderType === 'business'">商</span>
            <span v-else-if="item.orderType && item.orderType === 'lease'">
              <span class="order-type type-3" v-if="item.leaseFeature === 'company'">商</span>
              <span class="order-type type-4" v-if="item.leaseFeature === 'personal'">个</span>
            </span>
            <span class="order-type type-5" v-else-if="item.orderType && item.orderType === 'returnDeposit'">退</span>
          </span>

            <div class="valign-center margin-left-s font-light margin-right-m flex-item">
              <span class="text-wrapper" v-if="item.orderType && item.orderType === 'install'">装机订单</span>
              <span class="text-wrapper" v-else-if="item.orderType && item.orderType === 'common'">服务预约订单</span>
              <span class="text-wrapper" v-else-if="item.orderType && item.orderType === 'business'">商务租赁申请订单</span>
              <span class="text-wrapper" v-else-if="item.orderType && item.orderType === 'lease'">
              <span v-if="item.leaseFeature === 'company'">商务租赁订单</span>
              <span v-if="item.leaseFeature === 'personal'">个人租赁订单</span>
            </span>
              <span class="text-wrapper" v-else-if="item.orderType && item.orderType === 'returnDeposit'">{{ item.shopServiceName }}</span>
            </div>
          </div>
          <div class="order-status">
            <tpl-status :order="item" type="list" :statusList="statusList"></tpl-status>
          </div>
        </div>
        <div class="orderbasicInfo padding-m">
          <div v-if="item.assignee"
               class="font-bold-400 font-m flex font-family-num margin-bottom-m"
               @click.stop="phoneCall(item.assignee.mobile)">
            <div class="flex" style="align-items: flex-end">
              <span class="font-bold-500">{{ item.assignee ? item.assignee.name : '无联系人名称' }}</span>
              <span class="font-light font-s padding-left-s">师傅</span>
            </div>
            <div class="margin-left-l color-primary">
              <i class="iconfont icon-IOT-dh margin-right-s font-default"></i>
              <span class="color-blue-2 font-bold-400">{{ item.assignee ? item.assignee.mobile : '' }}</span>
            </div>
          </div>
          <div class="font-family-num">
            <i class="iconfont icon-IOT-time font-s font-light"></i>
            <span class="margin-left-s">{{ $filters.formatDate(item.serviceDate) }}</span>
            <span class="margin-left-l">{{ item.serviceTime }}</span>
          </div>
          <div class="margin-top-m flex" v-if="item.serviceAddress">
            <div class="flex-item text-wrapper">
              <i class="iconfont icon-IOT-dz font-s"></i>
              <span class="margin-left-s font-bold-400">{{ item.serviceAddress }}</span>
            </div>
            <div style="display: none;">
              <!--<actions type="copy-btn" :address="order.serviceAddress || order.newAddress"></actions>-->
            </div>
          </div>
        </div>
        <div class="padding-m padding-top-zero">
          <div class="orderInfos bg-light padding flex">
            <div class="orderImg flex margin-right-m bg-white border-radius">
              <img v-lazy="$filters.img(item.productImage,'!wh100')">
            </div>
            <div class="orderInfoBox flex-item flex">
              <div class="orderInfo text-title font-default text-wrapper">
                {{ item.productName ? item.productName : '无产品名称' }}
              </div>
              <div class="flex-item"></div>
              <div class="font-light font-s font-family-num flex" v-if="item.orderType !== 'returnDeposit'">
                <div class="deposit border-radius font-s border-radius flex" v-if="item.orderType === 'lease' || item.orderType === 'business'">
                  <span class="tag-name font-s">押</span>
                  <span class="tag-value font-s font-bold-500">{{ (item.leaseProduct && item.leaseProduct.deviceDeposit ? $filters.formatCurrency(item.leaseProduct.deviceDeposit/100) : '￥ 0' ) }}</span>
                </div>
                <div class="rent border-radius font-s border-radius margin-left flex"
                     v-if="(item.leaseProduct || item.leaseRentalAmount) && item.leasePackage !== null && item.leasePackage !== '' && item.leasePackage !== undefined && (item.orderType === 'lease' || item.orderType === 'business')">
                <span class="tag-name font-s">
                  <span v-if="item.leasePackage === '0'">体验</span>
                  <span v-else-if="item.leasePackage === '1'">月</span>
                  <span v-else-if="item.leasePackage === '3'">季</span>
                  <span v-else-if="item.leasePackage === '6'">半年</span>
                  <span v-else-if="item.leasePackage === '12'">年</span>
                </span>
                  <span class="tag-value font-s font-bold-500">
                  <span v-if="item.leaseProduct">
                    <span v-if="item.leasePackage === '0'">{{ $filters.formatCurrency(0) }}</span>
                    <span v-else-if="item.leasePackage === '1'">{{ $filters.formatCurrency(item.leaseProduct.monthlyRental/100) }}</span>
                    <span v-else-if="item.leasePackage === '3'">{{ $filters.formatCurrency(item.leaseProduct.quarterlyRental/100) }}</span>
                    <span v-else-if="item.leasePackage === '6'">{{ $filters.formatCurrency(item.leaseProduct.halfyearlyRental/100) }}</span>
                    <span v-else-if="item.leasePackage === '12'">{{ $filters.formatCurrency(item.leaseProduct.yearlyRental/100) }}</span>
                  </span>
                  <span v-else-if="item.leaseRentalAmount">(item.leaseRentalAmount ? $filters.formatCurrency(item.leaseRentalAmount/100) : '￥ 0')</span>
                </span>
                </div>
              </div>
              <div v-if="item.orderType === 'returnDeposit'">产品型号：{{ item.product && item.product.itemCode ? item.product.itemCode : '无产品型号' }}</div>
            </div>
          </div>
        </div>
        <div class="orderOperate padding-left-m padding-right-m padding-bottom bg-white"
             v-if="((Number(item.status) === 40 || Number(item.status) === 60) && item.orderType === 'lease' && item.paidTime === null) || (Number(item.status) === 70)">
          <action :order="item" type="list" :statusList="statusList" :isBack="true"></action>
        </div>
      </div>

      <!-- 销售订单 -->
      <div v-if="item.orderType === 'trade'">
        <div class="orderState padding-m valign-center flex border-bottom">
          <div>
            <!--<span class="order-type font-s type-1" style="display: inline-block">销</span>-->
            <span class="font-light font-s font-bold-400">{{item.orderId}}</span>
          </div>
          <div class="flex-item align-right order-status">
            <span class="color-danger" v-if="item.paidTime <= 0 && item.status === 0">待付款</span>
            <span class="color-warning" v-show="item.status === 10">待发货</span>
            <span class="color-primary-light" v-show="item.status === 20">已发货</span>
            <span class="color-cyan" v-show="item.status === 30">试用中</span>
            <span class="color-danger" v-show="item.status === 85">取消中</span>
            <span class="font-light" v-show="item.status === 80 || item.status > 85">已关闭</span>
          </div>
        </div>

        <div class="orderbasicInfo padding-m">
          <div class="margin-bottom-s">{{item.contactName}} &nbsp;&nbsp; {{item.contactMobile}}</div>
          <i class="iconfont icon-IOT-dz font-s"></i> <span class="margin-left-s " style="width: auto">{{ item.serviceAddress }}</span>
        </div>

        <!--<div class="border-top align-right padding-m">
          <div v-if="item.paidTime > 0">
            已付款：{{$filters.formatCurrency(item.payment/100.0)}}
          </div>
          <div class="color-danger" v-if="item.paidTime <= 0">
            待付款：{{$filters.formatCurrency(item.adjustFee > 0 ? item.adjustFee/100.0 : item.totalAmount/100.0)}}
          </div>
        </div>-->
      </div>
    </li>
  </ul>
</template>

<script>
  import types from '@/store/types'
  import Action from '@/pages-member/tpl/tpl-action'
  import TplStatus from '@/pages-member/tpl/tpl-status'

  export default {
    name: "list-item",
    props: ['orderData','statusList'],
    components: {
      Action,
      TplStatus
    },
    data() {
      return {
        pathName: ''
      }
    },
    methods: {
      /**
       * 跳转到详情页面
       * @param order
       */
      detail(order) {
        if (order.orderType === "trade") {
          this.$router.push(`/tradeorder/${order.orderId}`);
        } else if (order.orderType === "lease" || order.orderType === "business") {
          this.$router.push(`/lease/order/${order.id}/view`)
        } else {
          this.$router.push(`/serviceorder/${order.id}/view`);
        }
      },
      /**
       * 跳转到充值页面
       * @param id
       */
      recharge(id,type) {
        this.$utils.loctnHref(`/serviceorders/pay/deposit/${id}`);
//      this.$router.push(`/serviceorders/pay/deposit/${id}`);
      },
      /**
       * 跳转到评价页面
       * @param order
       */
      evaluating(order) {
        let _params = {
          type: this.$route.query.id,
          productImage: order.productImage,
          productName: order.productName,
          shopServiceName: order.shopServiceName,
          orderId: order.orderId
        };
        this.$utils.loctnHref(`/serviceorder/${order.id}/evaluate`,_params);
      },
      /**
       * 拨打电话
       * @param _phone 电话
       */
      phoneCall(_phone) {
        window.location.href = 'tel: ' + _phone;
      },
    }
  }
</script>
