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

        h3{
          width: 89%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
          font-weight: normal;
        }
        .money{
          display: flex;
          position: relative;
          padding-bottom: rem(4px);

          .deposit {
            background: $white;

            .tag-name {
              color: $white;
              background: $yellow-3;
              text-align:center;
              padding: 0 rem(3px);
              border: 1px solid rgba($yellow-3,.3);
              border-radius: 3px 0 0 3px;
            }

            .tag-value {
              font-weight: 100;
              color: $yellow-3;
              padding: rem(1px) rem(5px);
              border: 1px solid rgba($yellow-3,.3);
              border-left: none;
              border-radius: 0 3px 3px 0;
            }
          }
          .rental{
            position: absolute;
            right: 0;
          }
        }
        .active-code{
          font-size: rem(14px);
        }
      }
    }
    .checkBtn{
      position: relative;
      font-style: inherit;

      &:after,&:before{
        content: '';
        display: inline-block;
        width: 0;
        height: 0;
        font-size: 0;
        border: 7px solid transparent;
        border-left: 7px solid #fff;
        position: absolute;
        right: -3px;
        top: 4px;
      }
      &:before{
        border-left-color: $gray;
        right: -5px;
      }
    }
    .secondInfo{
      p{
        font-size: $font-size-s;
        color: $font-light;

        &:last-child{
          margin-bottom: 0;
        }
      }
    }
  }
  .operateBtn{
    text-align: right;
    @include border(top);
  }
  .copy-btn{
    @include border-radius(3px);
  }
</style>

<template>
  <div>
    <app-view :hasFooter="true">
      <div class="detailStatus">
        <div class="status">
          <div class="doingStatus padding-top-xxl">
            <span class="margin-top-m status-name">{{ nowStatus }}</span>
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
            <div class="text-title text-wrapper">
              {{ orderDetail.leaseProductName ? orderDetail.leaseProductName : (orderDetail.productName ? orderDetail.productName : '无产品名称') }}
            </div>
            <p v-if="orderDetail.itemCode">{{ orderDetail.itemCode }}</p>
            <div class="valign-center">
              <span v-if="activeCode" class="color-primary active-code">激活码：{{ activeCode }}</span>
            </div>
            <div class="font-light margin-top">
              产品型号：{{ orderDetail.leaseProduct && orderDetail.leaseProduct.productItemCode ? orderDetail.leaseProduct.productItemCode : '无产品型号' }}
            </div>
          </div>
        </div>
        <v-cell title="服务类型" :value="orderDetail.shopServiceName"></v-cell>

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

        <!--个人租赁-->
        <v-cell title="备注说明" :value="orderDetail.customerMemo" v-if="orderDetail.customerMemo !== ''">
          <div slot="value">{{orderDetail.customerMemo}}</div>
        </v-cell>

        <div class="secondInfo padding border-top">
          <p>订单编号: {{ orderDetail.orderId }}</p>
          <p>创建日期: {{ $filters.formatTime(orderDetail.created) }}</p>
        </div>
      </div>
      <div v-if="orderDetail.paidTime && orderDetail.payType" class="bg-white orderInfo" :class="{ 'margin-top': orderFee.length > 0 }">
        <v-cell class="padding-right-m" v-if="orderFee" v-for="item in orderFee" :key="item.subTotal" :title="item.feeDefName || item.feeTypeDesc" :value="$filters.formatCurrency(item.subTotal/100)"></v-cell>
        <v-cell v-if="orderFee.length > 0" class="add-num padding-right-m" title="总计" :value="$filters.formatCurrency(orderFee.totalFee/100)"></v-cell>
      </div>

      <!--订单处理日志-->
      <mt-popup v-model="orderLog" position="bottom" class="orderLog">
        <div class="log-box">
          <div class="log-item-box">
            <div class="title padding-m bg-yellow-4">
              <span class="font-default">订单处理日志</span>
            </div>
            <div class="detail-box">
              <div class="order-log-detail padding-m">
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
            </div>
            <button class="btn btn-block btn-primary" @click="orderClose()">关闭</button>
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

  import types from "@/store/types";
  import serviceorderApis from "@/apis/api-serviceorder";

  export default {
    name: "serviceorder-view",
    data() {
      return {
        // 订单详情
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
        // 订单状态
        nowStatus: '',
        prevStatus: true,
        nextStatus: true,
        orderLog: false,
        orderState: {
          created: '',
          log: ''
        },
        orderStatus: [],
        statusArr: [],
        payBtn: false,
        evaluateBtn: false,
        activeCode: '',
        orderFee: {},
        orderFees: 0,
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
          if(from.path === '/serviceorder/create') {
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
              this.orderLog = true;
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
        let _id = that.$route.params.id;
        // 获取订单详情
        serviceorderApis.getOrder(_id)
          .then((res) => {
            this.orderDetail = res;

            // 获取订单状态列表
            serviceorderApis.getOrderStatus()
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
            }

            // 判断操作按钮的显示隐藏
            if(this.orderDetail.orderType === 'common' && this.orderDetail.status === 70) {
              this.payBtn = false
              this.evaluateBtn = true
            }
          })
        // 获取订单日志
        serviceorderApis.logs(_id)
          .then((res) => {
            this.orderStatus = res;
            this.orderState = this.orderStatus[0];
          })
        // 获取订单费用详情
        serviceorderApis.fees(_id)
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
       * 查看订单日志
       */
      orderOpen() {
        this.orderLog = true;
        window.location.hash = 'win';
      },
      /**
       * 关闭订单日志弹窗
       */
      orderClose() {
        this.orderLog = false;
        this.$router.go(-1);
      },
    },
    components: {
      VCell,
      Action,
      Status,
      VImage
    }
  }
</script>
