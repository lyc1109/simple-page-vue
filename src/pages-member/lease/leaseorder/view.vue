<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .detailStatus{
    background: $primary;

    .status{
      height: 120px;
      position: relative;
      display: flex;

      &>div{
        flex: 1;
        text-align: center;
      }
      &:before {
        content: '';
        display: inline-block;
        width: 100%;
        height: 1px;
        background: linear-gradient(left,rgba(255,255,255,.2),rgba(255,255,255,.6),#fff,rgba(255,255,255,.6),rgba(255,255,255,.2));
        position: absolute;
        top: 50px;
        left: 0;
      }
      .prevStatus,.nextStatus{
        position: relative;
        &:before{
          width: 5px;
          height: 5px;
          content: '';
          display: inline-block;
          background: rgba(255,255,255,.6);
          @include border-radius(50%);
          position: absolute;
          top: 48px;
          margin-left: -2px;
        }
        &:after{
          width: 12px;
          height: 12px;
          content: '';
          display: inline-block;
          background: rgba(255,255,255,.2);
          @include border-radius(50%);
          position: absolute;
          top: 45px;
          margin-left: -6px;
        }
      }
      .doingStatus{
        position: relative;
        .status-name {
          position: absolute;
          left: -100%;
          right: -100%;
        }
        div,span{
          color: #fff;
          font-size: $font-size-l;
          display: block;
        }
        &:before{
          width: 8px;
          height: 8px;
          content: '';
          display: inline-block;
          background: #fff;
          @include border-radius(50%);
          position: absolute;
          top: 46.5px;
          margin-left: -2px;
        }
        &:after{
          width: 20px;
          height: 20px;
          content: '';
          display: inline-block;
          background: rgba(255,255,255,.3);
          @include border-radius(50%);
          position: absolute;
          top: 41px;
          margin-left: -8px;
        }
      }
    }
    .statusInfo {
      i,span {
        color: #fff;
      }
      span {
        width: 81%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .clientInfo{
    p{
      margin-bottom: 0;
      /*line-height: rem(25px);*/

      span{
        font-size: $font-size-m;
        color: #333;
        font-weight: normal;
      }
      &.clientAddress{
        i{
          color: $primary;
          margin-right: rem(3px);
          position: relative;
          top: rem(-2px);
        }
        span{
          font-size: $font-size;
          font-weight: 100;
          width: 100%;
        }
      }
    }
  }
  .orderInfo{
    .basicInfo{
      display: flex;
      @include border(bottom);

      .orderImg{
        flex:0 0 20%;
        height: 20%;

        &>div{
          width: 100%;
          height: 0;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          padding-bottom: 100%;
        }
      }
      .bacsicInfoText{
        flex: 2;
        overflow: hidden;

        .active-code{
          font-size: rem(14px);
        }
      }
    }
  }
  .operateBtn{
    text-align: right;
    @include border(top);
  }
</style>

<template>
  <div>
    <app-view :hasFooter="true">
      <div class="detailStatus">
        <div class="status">
          <div class="prevStatus padding-top-xxl" v-if="prevStatus">
            <span class="margin-top-m">{{ statusList.prev }}</span>
          </div>
          <div class="doingStatus padding-top-xxl">
            <span class="margin-top-m status-name">{{ nowStatus }}</span>
          </div>
          <div class="nextStatus padding-top-xxl" v-show="nextStatus">
            <span class="margin-top-m">{{ statusList.next }}</span>
          </div>
        </div>
        <div class="statusInfo padding-m valign-center flex" @click="orderOpen()">
          <div class="flex-item padding-right-m">
            <i class="iconfont icon-iot-tongzhi1 font-s"></i>
            <span>{{ $filters.formatTime(orderState.created, 'MM-DD HH:mm') }}&nbsp;&nbsp;{{ orderState.log }}</span>
          </div>
          <i class="iconfont icon-iot-youjiantou1 font-s"></i>
        </div>
      </div>
      <div class="bg-white clientInfo padding-m">
        <p>
          <span>{{ orderDetail.contactName }}</span>
          <!--<span>{{ orderDetail.contactMobile}}</span>-->
          <span>
            <a v-if="orderDetail.contactMobile" class="margin-left-m" :href="'tel:'+ orderDetail.contactMobile">
              <i class="icon iconfont color-primary margin-right icon-IOT-dh"></i>{{ orderDetail.contactMobile }}
            </a>
            <a v-else-if="orderDetail.contactTelephone" class="margin-left-m" :href="'tel:'+ orderDetail.contactTelephone">
              <i class="icon iconfont color-primary margin-right icon-IOT-dh"></i>{{ orderDetail.contactTelephone }}</a>
          </span>
        </p>
        <p class="clientAddress margin-top-s"><i class="iconfont icon-IOT-dz"></i><span>{{ orderDetail.serviceAddress }}</span></p>
      </div>
      <div class="margin-top bg-white orderInfo">
        <div class="basicInfo padding-m">
          <div class="orderImg border border-radius margin-right-m">
            <div class="border-radius" :style="{ 'background-image': `url(${$filters.img(orderDetail.productImage,'!wh100')})` }" v-lazy="$filters.img(orderDetail.productImage,'!wh100')"></div>
          </div>
          <div class="bacsicInfoText">
            <div class="text-title text-wrapper">{{ orderDetail.leaseProductName ? orderDetail.leaseProductName : (orderDetail.productName ? orderDetail.productName : '无产品名称') }}</div>
            <p v-if="orderDetail.itemCode">{{ orderDetail.itemCode }}</p>
            <div class="valign-center">
              <span v-if="isActiveCode" class="color-primary active-code">激活码：{{ activeCode }}</span>
            </div>
            <div class="font-light margin-top">产品型号：{{ orderDetail.leaseProduct && orderDetail.leaseProduct.productItemCode ? orderDetail.leaseProduct.productItemCode : '无产品型号' }}</div>
          </div>
        </div>
        <v-cell title="服务类型" :value="orderDetail.shopServiceName"></v-cell>

        <v-cell title="退租设备编码" v-if="orderDetail.orderType === 'returnDeposit'">
          <div slot="value">
            <div  v-for="item in orderDetail.refundDeviceIds" class="text-wrapper font-bold-500" v-if="orderDetail.refundDeviceIds">
              {{ item }}
            </div>
          </div>
        </v-cell>

        <!--个人租赁-->
        <v-cell title="预约时间" :value="`${$filters.formatDate(orderDetail.serviceDate)} ${orderDetail.serviceTime}`" v-if="!orderDetail.leaseCompany"></v-cell>
        <div v-if="orderDetail.images && orderDetail.images.length > 0">
          <div class="flex padding-m padding-left-zero margin-left-m border-bottom">
            <div class="title">问题图片</div>
          </div>
          <div class="flex padding-left-m padding-right-m border-bottom">
            <div class="square-uploadimg">
              <v-image :imgShowList="orderDetail.images" :isUpload="false" :imgRight="true"></v-image>
            </div>
          </div>
        </div>

        <!--企业租赁-->
        <v-cell title="租赁数量" :value="orderDetail.leaseCount" class="v-cell-sm" v-if="orderDetail.orderType !== 'returnDeposit' && orderDetail.leaseCompany !== null"></v-cell>
        <v-cell title="退租数量" :value="(orderDetail.refundDeviceIds && orderDetail.refundDeviceIds.length) || 0" class="v-cell-sm" v-if="orderDetail.orderType === 'returnDeposit'"></v-cell>
        <v-cell title="租赁公司" :value="orderDetail.leaseCompany" class="v-cell-sm" v-if="orderDetail.leaseCompany !== null"></v-cell>
        <v-cell title="租赁协议" value="查看协议" isLink="true" class="v-cell-sm" v-if="ifLease" @click.native="leasesOpen()" ></v-cell>

        <!--个人租赁-->
        <v-cell title="备注说明" :value="orderDetail.customerMemo" v-if="orderDetail.customerMemo !== ''">
          <div slot="value">{{orderDetail.customerMemo}}</div>
        </v-cell>

        <div class="secondInfo padding border-top">
          <p class="font-s font-light">订单编号: {{ orderDetail.orderId }}</p>
          <p class="font-s font-light">创建日期: {{ $filters.formatTime(orderDetail.created) }}</p>
        </div>
      </div>
      <!--费用详情-->
      <order-fee :order="orderDetail" :orderFee="orderFee"></order-fee>

      <!--订单处理日志 或 租赁协议-->
      <mt-popup v-model="popup" position="bottom" class="orderLog">
        <div class="log-box">
          <div class="log-item-box">
            <div class="title padding-m bg-yellow-4">
              <span class="font-default">{{ leases ? '租赁协议' : '订单处理日志' }}</span>
            </div>
            <div class="detail-box">
              <div v-if="orderLog" class="order-log-detail padding-m">
                <ul class="padding-bottom-xxl">
                  <li v-for="(item, index) in orderStatus" :key="item.text"
                      class="padding-bottom padding-left-l"
                      :class="{ 'active': index === 0 }">
                    <i class="iconfont" :class="{ 'icon-iot-time': index === 0,'done': index > 0 }"></i>
                    <div class="text-wrapper-overline">{{ item.log }}</div>
                    <div class="margin-top-s">{{ $filters.formatTime(item.created) }}</div>
                  </li>
                </ul>
              </div>
              <div v-else-if="leases">
                <p class="padding-m" v-html="rentalDeal ? rentalDeal : '暂无协议内容'">{{ rentalDeal ? rentalDeal : '暂无协议内容' }}</p>
              </div>
            </div>
            <button class="btn btn-block btn-primary" @click="popupClose()">关闭</button>
          </div>
        </div>
      </mt-popup>

      <!-- 按钮组 -->
      <div slot="footer" class="padding-right-m align-right border-top page-footer bg-white" style="height: 50px;line-height: 50px;">
        <action :order="orderDetail" type="view" :isBack="isBack"></action>
      </div>
    </app-view>
  </div>
</template>

<script>
  import VCell from '@/components/ui/v-cell'
  import Action from '@/pages-member/tpl/tpl-action'
  import Status from '@/pages-member/tpl/tpl-status'
  import VImage from '@/components/ui/v-image';
  import orderFee from './order-fee'

  import types from "@/store/types";

  export default {
    name: "serviceorder-view",
    data() {
      return {
        orderDetail: {
          contactMobile: '',
          contactName: '',
          productImage: '',
          leaseProduct: {
            lowestRental: 0,
            deviceDeposit: 0,
            productItemCode: ''
          },
          serviceAddress: '',
          productName: '',
          itemCode: '',
          serviceDate: '',
          serviceTime: '',
          orderId: '',
          created: ''
        },
        statusList: {
          prev: '',
          next: ''
        },
        nowStatus: '',
        prevStatus: true,
        nextStatus: true,
        popup: false,
        leases: false,
        orderLog: false,
        orderState: {
          created: '',
          log: ''
        },
        orderStatus: [],
        rentalDeal: '',
        statusArr: [],
        ifLease: false,
        cancelBtn: false,
        payBtn: false,
        evaluateBtn: false,
        activeCode: '',
        isActiveCode: false,
        orderFee: {},
        orderFees: 0,
        cur_type: '',
        isBack: false,
      }
    },
    created() {
      this.fetchData()
    },
    beforeRouteEnter(to,from,next) {
      next((vm) => {
        // 是否是单独页面
        let _isRepair = vm.$store.getters[types.common.getRepair];
        if(_isRepair) {
          vm.isBack = true;
        } else {
          if(from.path === '/lease/order/create') {
            vm.isBack = false;
          } else {
            vm.isBack = true;
          }
        }
      })
    },
    mounted() {
      this.$nextTick(() => {
        window.onpopstate = () => {
          let _hash = window.location.hash;
          if(_hash) {
            if(_hash.indexOf('win') > -1) {
              this.leases = false;
              this.orderLog = true;
              this.popup = true;
            } else if(_hash.indexOf('lease') > -1) {
              this.leases = true;
              this.orderLog = false;
              this.popup = true;
            }
          }
        }
      })
    },
    methods: {
      /**
       * 拉取数据
       */
      fetchData() {
        let that = this;
        // 获取订单详情
        this.$http.get(`${this.$apihost}/serviceorders/${this.$route.params.id}`)
          .then((res) => {
            this.orderDetail = res;
            // 判断是否为租赁订单
            if(this.orderDetail.orderType === 'returnDeposit') {
              this.ifLease = false;
            } else {
              this.ifLease = true;
            }

            // 获取订单状态列表
            this.$http.get(`${this.$apihost}/serviceorders/const/status`)
              .then((res) => {
                this.statusArr = res;
                this.statusArr.forEach((value,index,array) => {
                  // 判断顶部状态
                  if(Number(array[index].name) === Number(this.orderDetail.status)) {
                    this.nowStatus = array[index].value;
                  }
                })
              })

            if(res && res.leaseActivationCode) {
              this.activeCode = res.leaseActivationCode;
              this.isActiveCode = true;
            }

            // 判断操作按钮的显示隐藏
            if(this.orderDetail.status < 40 && this.orderDetail.orderType === 'lease' && this.orderDetail.paidTime === null) {
              this.payBtn = true
              this.evaluateBtn = false
            } else if(this.orderDetail.status === 70) {
              this.payBtn = false
              this.evaluateBtn = true
            }
          })
        // 获取订单日志
        this.$http.get(`${this.$apihost}/serviceorders/${this.$route.params.id}/logs`)
          .then((res) => {
            this.orderStatus = res;
            this.orderState = this.orderStatus[0];
          })
        // 获取订单费用详情
        this.$http.get(`${this.$apihost}/serviceorders/${this.$route.params.id}/fees`)
          .then((fee) => {
            if(fee) {
              that.orderFee = fee;
              let _total = 0;
              for(let i = 0,len = fee.length; i < len; i++) {
                _total += Number(fee[i].subTotal);
              }
              that.orderFee.totalFee = Number(_total);
            }
          })
        this.$store.commit("hideLoading");
      },
      /**
       * 查看租赁协议
       */
      leasesOpen() {
        this.leases = true;
        window.location.hash = 'lease';
        this.$http.get(`${this.$apihost}/lease/products/${this.orderDetail.leaseProduct.id}/agreements`)
          .then((res) => {
            if(res && res.agree) {
              this.rentalDeal = res.agree;
            }
          })
      },
      /**
       * 查看订单日志
       */
      orderOpen() {
        this.orderLog = true;
        window.location.hash = 'win';
      },
      /**
       * 关闭订单日志弹窗
       */
      popupClose() {
        this.orderLog = false;
        this.leases = false;
        this.popup = false;
        this.$router.go(-1);
      },
      /**
       * 复制地址
       * @param val
       */
      copyAddress(val){
        this.$nextTick(() => {
          this.$clipboard(val)
          this.$messenger.success('复制成功')
        })
      }
    },
    components: {
      VCell,
      Action,
      Status,
      VImage,
      orderFee
    }
  }
</script>
