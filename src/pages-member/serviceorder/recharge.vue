<style scoped type="text/scss" lang="scss">
  @import "~variables";

  // 个人支付页面
  .standard-lease-box {
    overflow: auto;

    .top-bg-box {
      width:100%;
      height: rem(80px);
      position: relative;
      background: $primary;
    }
    .wavy-line {
      width: 100%;
      height: 10px;
      border-radius: 0.5px;
      background: -webkit-linear-gradient(315deg, #fff, #fff 45%, transparent, transparent 55%, transparent 100%), -webkit-linear-gradient(45deg,#fff, #fff 45%, #ddd, transparent 55%, transparent 100%);
      background: -moz-linear-gradient(315deg, #fff, #fff 45%, transparent, transparent 55%, transparent 100%), -moz-linear-gradient(45deg,#fff, #fff 45%, #ddd, transparent 55%, transparent 100%);
      background: linear-gradient(315deg, #fff, #fff 45%, transparent, transparent 55%, transparent 100%), linear-gradient(45deg,#fff, #fff 45%, #ddd, transparent 55%, transparent 100%);
      background-size: 10px 10px;
      background-repeat: repeat-x;
    }
    .money-box {
      position: relative;
      top: rem(-50px);
      .money-detail {
        position: relative;
        top: rem(-1px);
        box-shadow: 0 2px 3px 0 rgba(0,0,0,0.1);
      }

      .circle-tag-box {
        position: relative;
        top: rem(-1px);

        .circle-tag-line {
          border: 1px dashed #ddd;
        }
        .circle-tag {
          width: rem(15px);
          height: rem(30px);
          background: $page_bg;
        }
        .circle-tag-left {
          border-radius: 0 15px 15px 0;
          box-shadow: inset -2px 3px 4px rgba(0,0,0,.1);
        }
        .circle-tag-right {
          border-radius: 15px 0 0 15px;
          box-shadow: inset 2px 3px 4px rgba(0,0,0,.1);
        }
      }
    }
    .pay-detail-box {
      position: relative;
      top: rem(-51px);
      justify-content: center;
      box-shadow: 0 2px 3px 0 rgba(0,0,0,0.1);
    }
    .pay-btn-box {
      /*position: relative;*/
      /*<!--top: rem(-50px);-->*/
    }
  }
  .orderInfo {
    display: flex;
    .orderImg {
      flex: 0 0 20%;
      width: 100%;

      div{
        width: 100%;
        padding-bottom: 100%;
        height: 0;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
      }
    }
    .orderText{
      h3{
        font-weight: 600;
      }
    }
  }
  /*设备押金*/
  .deposit{
    &>i{
      float: left;
      font-size: $font-size-l;
      color: $primary;
      display: inline-block;
    }
    .depositText{
      display: inline-block;

      h3{
        font-weight: 600;
      }
    }
    .cash{
      display: inline-block;
      float: right;
      font-size: $font-size-l;
      color: $primary;
      font-weight: 500;
    }
  }
  /*设备充值套餐*/
  .combo-main {
    position: relative;
    height: auto;

    .combo-box {
      flex-wrap: wrap;
      overflow: initial;
    }

    .combo-item-box {
      position: relative;
      width: 47.5%;
      height: rem(120px);
      margin-top: $m;
      .mint-cell-checkbox {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        align-items: flex-end;
        justify-content: center;
      }

      &:nth-child(odd) {
        margin-right: 5%;
      }
      .combo-content {
        height: rem(92px);
        border: 1px solid rgba($border, .9);
        position: relative;
        top: 0;
        box-shadow: 0 10px 5px -8px $gray;
        @include border-radius(8px);
        .center-box {
          flex-direction: column;
        }

        .combo-title {
          background: $font-lighter;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }

        .combo-detail {
          position: relative;
          top: 0;
          height: rem(62px);
          justify-content: center;
          border-top: 1px dashed $font-lighter;

          .price-color {
            color: $font-lighter;
          }

          .del-color {
            color: $font-lighter;
          }
        }
      }

      //覆盖
      .combo-1 {
        .combo-title {
          background: $yellow-3!important;
        }
        .combo-detail {
          border-top: 1px dashed $yellow-3!important;

          .price-color {
            color: $yellow-3;
          }
        }
      }
      .combo-2 {
        .combo-title {
          background: $green-5!important;
        }
        .combo-detail {
          border-top: 1px dashed $green-5!important;
          .price-color {
            color: $green-5;
          }
        }
      }
      .combo-3 {
        .combo-title {
          background: $green-6!important;
        }
        .combo-detail {
          border-top: 1px dashed $green-6!important;
          .price-color {
            color: $green-6;
          }
        }
      }
      .combo-4 {
        .combo-title {
          background: $primary;
        }
        .combo-detail {
          border-top: 1px dashed $primary;

          .price-color {
            color: $primary;
          }
        }
      }
      .combo-5 {
        .combo-title {
          background: $orange-1;
        }
        .combo-detail {
          border-top: 1px dashed $orange-1;

          .price-color {
            color: $orange-1;
          }
        }
      }
      &:nth-child(1),&:nth-child(2) {
        margin-top: 0;
      }

    }
  }
  .credit-page {
    top: initial!important;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    overflow: hidden;
    height: auto!important;
    -webkit-transform: initial!important;
    transform: initial!important;

    .credit-top {
      justify-content: center;
      .iconfont {
        font-size: 50px;
      }
    }
    .credit-info {
      .flex {
        line-height: 1.5;
        align-items: flex-start;
      }
    }
    .agree-box {
      .mint-cell-checkbox {
        position: relative;
        .mint-checkbox-input {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 10;
          opacity: 0;
          display: inline-block;
        }
      }
      .mint-checkbox-input:checked + .mint-checkbox-core {
        background: $green-7;
        border-color: $green-7;
      }
      .agree-btn {
        width: $m;
        height: $m;
        background: $primary;
        justify-content: center;
      }
    }
    .bg-primary {
      background: $primary;
    }
    .bg-green-7 {
      background: $green-7;
    }
  }
  .footer{
    height: 100%;
    .valign-center {
      height: 100%;
    }

    .btn-item {
      height: 100%;
      justify-content: center;
      margin: 0!important;
      &.btn-1 {
        background: $green-7;
      }
      &.btn-2 {
        background: $primary;
      }
    }
  }
</style>
<style lang="scss" type="text/scss">
  .credit-form .mint-cell {
    min-height: 43px!important;
    padding: 0 15px;
  }
</style>
<template>
  <app-view :has-footer="!isUsrLease">
    <div v-if="isUsrLease" style="position: fixed;top:0;bottom: 0; left: 0;right:0;">
      <div class="bg-light full-height standard-lease-box">
        <!--<div class="padding-m align-center font-bold-500 font-m border-bottom bg-yellow-4">支付订单</div>-->
        <div class="top-bg-box">
          <div style="height: 100%;width: 100%;position: absolute;top: 0;">
            <!--<img :src="$filters.img('')" alt="" style="width: 100%;height:100%;">-->
          </div>
        </div>
        <div class="money-box margin-m margin-bottom-zero">
          <div class="wavy-line"></div>
          <div class="bg-white padding-l money-detail">
            <div class="font-default font-bold-500 font-light align-center margin-top-l">应支付金额（元）</div>
            <div class="font-xl font-bold-700 align-center margin-top margin-bottom-l">{{ $filters.formatCurrency(cardVal/100) }}</div>
          </div>
          <div class="circle-tag-box bg-white flex">
            <div class="circle-tag circle-tag-left"></div>
            <div class="flex-item margin-left-m margin-right-m">
              <div class="circle-tag-line"></div>
            </div>
            <div class="circle-tag circle-tag-right"></div>
          </div>
        </div>
        <div class="pay-detail-box border-bottom margin-m margin-top-zero bg-white">
          <div class="valign-center padding-l flex">
            <div class="align-left flex-item">
              <div class="margin-bottom-m flex">
                <span class="font-light font-s">产品名称：</span><span class="font-bold-500 flex-item align-right text-wrapper-overline">{{ rechargeList.productName }}</span>
              </div>
              <div class="margin-bottom-m flex">
                <span class="font-light font-s">产品押金：</span><span class="font-bold-500 flex-item align-right">{{ $filters.formatCurrency(rechargeList.deviceDeposit/100) }}</span>
              </div>
              <div class="margin-bottom-m flex">
                <span class="font-light font-s">产品租金：</span><span class="font-bold-500 flex-item align-right">{{ $filters.formatCurrency((Number(cardVal) - Number(rechargeList.deviceDeposit))/100) }}</span>
              </div>
              <div class="margin-bottom-m flex">
                <span class="font-light font-s">订单编号：</span><span class="font-bold-500 flex-item align-right">{{ entity && entity.orderId }}</span>
              </div>
            </div>
          </div>
          <div class="padding-top-m flex pay-btn-box">
            <button class="ripple btn-primary btn flex-item padding margin-left-zero" @click="pay()">立即支付</button>
          </div>
        </div>

      </div>
    </div>
    <div v-if="!isUsrLease">
      <div class="orderInfo bg-white padding padding-top-m padding-bottom-m">
        <div class="orderImg">
          <div class="border border-radius"
               :style="{ 'background-image': `url(${$filters.img(rechargeList.productCoverImg)})` }"></div>
        </div>
        <div class="orderText padding-left-m">
          <h3>{{ rechargeList.productName }}</h3>
          <span>{{ rechargeList.code }}</span>
        </div>
      </div>
      <div class="deposit bg-white margin-top padding-m" v-if="isFirst">
        <!--<i class="iconfont icon-iot-deposit"></i>-->
        <div class="depositText">
          <h3>设备押金</h3>
          <span>押金满一年可退，无需担忧</span>
        </div>
        <div class="cash padding-top padding-bottom color-primary">
          ¥ <span class="font-family-num">{{ Number(rechargeList.deviceDeposit/100).toFixed(2) }}</span>
        </div>
      </div>
      <div class="combo bg-white margin-top padding-m">
        <div class="title">
          <!--<i class="iconfont icon-yajin"></i>-->
          <div class="comboText">
            <h3>设备充值套餐</h3>
            <span>选择充值，保障设备正常运行</span>
          </div>
        </div>
        <div class="combo-main margin-top-m">
          <ul class="combo-box flex-item flex">
            <li v-for="(item, index) in rentList"
                v-if="(item.valueAfter > 0 && (isFirst && index < 4 ? item.isFrtSuprt : true)) || (index === 4 && leaseSet && leaseSet.firstFreeDays && leaseSet.firstFreeDays > 0 && !hasUsed)"
                class="combo-item-box">
              <div class="combo-content" :class="`combo-${index+1}`">
                <div class="combo-title padding-s">
                  <span class="color-white">{{ item.title }}</span>
                </div>
                <div class="combo-detail valign-center">
                  <div class="flex center-box">
                    <div class="present-price font-light align-center font-family-num">
                      <b class="font-l price-color">¥ {{ item.valueAfter }}</b>
                      <del v-if="item.valueAfter < item.delValue">{{ item.delValue }}</del>
                    </div>
                    <div class="original-price align-center">
                      <span v-if="index < 4" class="font-default price-color">(¥ <span class="font-family-num">{{ item.average }}</span>/月)</span>
                      <span v-if="index === 4" class="font-default price-color">(可体验<span class="font-family-num">{{ leaseSet.firstFreeDays }}</span>天)</span>
                    </div>
                  </div>
                </div>
              </div>

              <!--可选按钮-->
              <div v-if="isFirst">
                <label v-if="leaseSet && leaseSet.firstChargeStategy === 'RO'"
                       class="mint-cell-checkbox valign-center margin-top-s">
                  <input type="radio"
                         :value="index"
                         v-model="checkCard"
                         name="deviceSelect"
                         class="mint-checkbox-input" @click="selectCombo(index)">
                  <i class="mint-checkbox-core"></i>
                </label>
                <!--必选按钮-->
                <label v-if="leaseSet && leaseSet.firstChargeStategy === 'RR'" class="mint-cell-checkbox valign-center margin-top-s">
                  <span class="mint-radio">
                    <input type="radio"
                           :value="index"
                           v-model="annualCard"
                           name="deviceSelect"
                           class="mint-radio-input" @click="selectCombo(index)">
                    <span class="mint-radio-core"></span>
                  </span>
                </label>
              </div>
              <div v-else-if="!isFirst">
                <label class="mint-cell-checkbox valign-center margin-top-s">
                  <span class="mint-radio">
                    <input type="radio"
                           :value="index"
                           v-model="annualCard"
                           name="deviceSelect"
                           class="mint-radio-input" @click="selectCombo(index)">
                    <span class="mint-radio-core"></span>
                  </span>
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!--免押金协议-->
    <mt-popup v-model="creditPopup" position="bottom" class="credit-page padding-bottom-xxl">
      <!--信用免押金-->
      <div class="padding-bottom-xxl bg-white">
        <div class="padding-m valign-center credit-top">
          <div class="color-green-7 align-center">
            <i class="iconfont icon-iot-zmxy"></i>
            <div class="font-default">服务授权</div>
          </div>
        </div>
        <div class="credit-info padding-m padding-top-zero">
          <div class="font-s flex">
            <span class="font-default">•</span>
            <div class="font-light margin-left-s flex-item">使用身份信息（姓名、身份证号）办理业务</div>
          </div>
          <div class="font-s flex margin-top-s">
            <span class="font-default">•</span>
            <span class="font-light margin-left-s flex-item text-wrapper-overline">查询你的芝麻分等信用信息，如尚未开通芝麻信用服务，则予以开通</span>
          </div>
        </div>
        <div class="credit-form">
          <div class="margin-m margin-bottom-s border-bottom">
            <v-input class="form-field required padding-right-m"
                     v-model.trim="usrName"
                     type="text"
                     name="usrName"
                     placeholder="真实姓名"
                     v-validate="{ required: true,regex: /^[\u4e00-\u9fa5]{2,5}$/ }"
                     data-vv-as="真实姓名"
                     :error-msg="errors.first('usrName')"></v-input>
          </div>
          <div class="margin-m margin-top-zero border-bottom">
            <v-input class="form-field required padding-right-m"
                     v-model.trim="usrNo"
                     type="number"
                     name="usrNo"
                     placeholder="身份证号码"
                     v-validate="{ required: true,regex: /(^\(^\d{18}$)|(^\d{17}(\d|X|x)$)/ }"
                     data-vv-as="身份证号码"
                     :error-msg="errors.first('usrNo')"></v-input>
          </div>
        </div>
        <div class="padding-m flex agree-box">
          <div class="mint-cell-checkbox">
            <input type="checkbox" class="mint-checkbox-input" v-model="isAgree"/>
            <i class="mint-checkbox-core"></i>
          </div>
          <div class="flex-item text-wrapper margin-left">
            <span class="font-s">授权即表示同意</span>
            <span class="color-green-7 agree-text" @click="checkProtocal()">《用户授权协议》</span>
          </div>
          <!--<div v-if="isAgree" class="valign-center agree-btn border-radius-circle" @click="agree()">-->
          <!--<i class="iconfont icon-iot-gou color-success font-bold-700 font-s"></i>-->
          <!--</div>-->
          <!--<div v-else-if=></div>-->
        </div>
        <div class="page-footer padding-m color-white align-center bg-green-7" @click.stop="authorize()">立即授权</div>
      </div>
    </mt-popup>

    <div class="footer border-top flex valign-center" slot="footer" v-if="!isUsrLease">
      <div class="bg-white font-family-num border-right padding-left-m padding-right-m">
        <b class="color-primary font-bold-500">￥ {{ Number(cardVal/100).toFixed(2) }}</b>
      </div>
      <div v-if="isAlipay && leaseSet && leaseSet.supportCreditRent && isFirst"
           class="btn-item btn-1 color-white padding-left-m padding-right-m valign-center flex-item"
           @click.stop="creditFree()">免押金付款</div>
      <div class="btn-item btn-2 color-white padding-left-m padding-right-m valign-center flex-item" @click="pay()">立即付款</div>
    </div>
  </app-view>
</template>
<script>
  import VRadio from '@/components/ui/v-radio'
  import types from "@/store/types";

  export default {
    name: 'recharge',
    data() {
      return {
        // 支付数据
        rechargeList: {
          code: '',
          listDeviceDeposit: 0,
          listHalfyearlyRental: 0,
          listMonthlyRental: 0,
          listQuarterlyRental: 0,
          listYearlyRental: 0,
          productCoverImg: '',
          productName: '',
          deviceDeposit: 0
        },
        // 套餐数据
        rentList: [],
        // 当前选择的套餐的index索引值
        annualCard: 0,
        // 可选套餐的选中值
        checkCard: [],
        // 显示的支付值
        cardVal: 0,
        // 接口需要的选中套餐的月数
        submitVal: 12,
        // 激活码
        activeCode: '',
        i: 0,
        timer: null,
        // 租赁产品id
        leaseProductId: this.$route.query && this.$route.query.leaseProductId,
        // 是否是第一次支付
        isFirst: false,
        // 租赁订单id
        leaseOrderId: '',
        // 产品对象
        entity: {},
        // 是否使用过体验卡
        hasUsed: true,
        // 是否显示信用免押金弹窗
        creditPopup: false,
        // 用户信用免押金时填写的身份证
        usrNo: '',
        // 用户信用免押金时填写的姓名
        usrName: '',
        // 租退策略
        leaseSet: {},
        // 信用免押金协议界面
        freePopup: false,
        // 是否同意协议
        isAgree: false,
        // 是否信用免押金
        isCredit: false,
        // 是否是继续支付订单
        isOrderPay: this.$route.query && this.$route.query.isOrderPay
      }
    },
    components: {
      VRadio
    },
    created() {
      // 处理jssdk签名,兼容history模式
//      let _ua = navigator.userAgent.toLowerCase();

      // 如果是ios微信浏览器
//      if (/iphone|ipad|ipod/.test(_ua)) {
        let _href = location.href.split('#')[0];
        this.$store.commit(types.common.setEnterURL, _href);
//      }

      this.fetchData();
      if(this.$store.state.refresh) {
        this.$router.go(0);
      }
    },
    computed: {
      // 设备id
      entityId() {
        return this.$route.params.id;
      },
      // 不是个人租赁
      isUsrLease() {
        let that = this;
        let _flag = false;
        let _query = that.$route.query;
        let _month = _query && _query.rentMonth;
        let _isPay = _query && _query.isOrderPay;
        if(_month !== undefined) {
          _flag = true;
        } else if(_isPay !== undefined) {
          _flag = true;
        }
        return _flag;
      },
      // 是不是在支付宝环境中
      isAlipay() {
        let _flag = false;
        let nav = navigator && navigator.userAgent.toLowerCase().match(/Alipay/i);
        if(nav && nav[0] === 'alipay') {
          _flag = true;
        }
        return _flag;
      },
    },
    methods: {
      /**
       * 拉取数据
       */
      fetchData() {
        let that = this;
        // 处理套餐数据
        let initRent = function(_res,_type) {
          let _lease = _res;
          that.rechargeList = _lease;

          let _credit = that.$route.query && that.$route.query.isCredit;
          that.isCredit = Boolean(Number(_credit));
          if(that.isCredit) {
            that.rechargeList.deviceDeposit = 0;
          }

          let number = function(n) {
            let _n = 0;
            n = n + '';
            if(n.indexOf('.') > -1) {
              _n = Number(n).toFixed(2);
            } else {
              _n = Number(n);
            }
            return _n;
          };

          // 处理套餐数据
          that.rentList = [
            {
              title: '年',
              value: number(_lease.yearlyRental),
              valueAfter: number(_lease.yearlyRental/100),
              delValue: number(_lease.listYearlyRental/100),
              average: number(_lease.yearlyRental/1200),
              isFrtSuprt: _lease.supportFirstChargeYear,
              month: 12
            },
            {
              title: '半年',
              value: number(_lease.halfyearlyRental),
              valueAfter: number(_lease.halfyearlyRental/100),
              delValue: number(_lease.listHalfyearlyRental/100),
              average: number(_lease.halfyearlyRental/600),
              isFrtSuprt: _lease.supportFirstChargeHalfYear,
              month: 6
            },
            {
              title: '季',
              value: number(_lease.quarterlyRental),
              valueAfter: number(_lease.quarterlyRental/100),
              delValue: number(_lease.listQuarterlyRental/100),
              average: number(_lease.quarterlyRental/300),
              isFrtSuprt: _lease.supportFirstChargeQuarterly,
              month: 3
            },
            {
              title: '月',
              value: number(_lease.monthlyRental),
              valueAfter: number(_lease.monthlyRental/100),
              delValue: number(_lease.listMonthlyRental/100),
              average: number(_lease.monthlyRental/100),
              isFrtSuprt: _lease.supportFirstChargeMonth,
              month: 1
            },
            {
              title: '体验卡',
              value: 0,
              valueAfter: 0,
              month: 0
            }
          ];

          // 获取体验卡数据
          that.$http.get(`${that.$apihost}/lease/rechargeorders/freepackage/used`, {
            leaseProductId: that.leaseProductId
          })
            .then((free) => {
              that.hasUsed = free;
            })

          // 获取租退策略数据
          that.$http.get(`${that.$apihost}/lease/products/${that.leaseProductId}/scenario`)
            .then((lease) => {
              that.leaseSet = lease;
              // 首充策略
              let _chargeType = lease && lease.firstChargeStategy;

              // 非第一次支付费用
              if(_type) {
                let _rent = that.rentList;
                that.rentList.splice(_rent.length - 1, 1);

                for(let i in _rent) {
                  if(_rent[i].value > 0) {
                    that.annualCard = i;
                    // 提交的套餐值
                    that.submitVal = _rent[i].month;
                    // 显示的套餐
                    that.cardVal = _rent[i].value;
                    break;
                  }
                }
              } else {
                // 第一次支付需根据首充策略判断
                let _month = that.$route.query && that.$route.query.rentMonth;

                // 仅押金
                if(_chargeType === 'OD') {
                  that.annualCard = '';
                  // 提交的套餐值
                  that.submitVal = '';
                  // 显示的套餐
                  that.cardVal = Number(that.rechargeList.deviceDeposit);
                } else {
                  let _index = '';
                  let _temp = that.rentList;
//                  if(_chargeType === 'RO') {
                    // 可选
                    if(_month !== undefined) {
                      _month = Number(_month);

                      switch(_month) {
                        case 0:
                          _index = 4;
                          break;
                        case 1:
                          _index = 3;
                          break;
                        case 3:
                          _index = 2;
                          break;
                        case 6:
                          _index = 1;
                          break;
                        case 12:
                          _index = 0;
                          break;
                        default:
                          _index = 0;
                          break;
                      }
                    } else if(_chargeType === 'RR') {
                      // 必选 首充可选套餐并且支付金额大于0
                      for(let i = 0; i < 5; i++) {
                        if(_temp[i].valueAfter > 0 && _temp[i].isFrtSuprt) {
//                        that.annualCard = i;
                          _index = i;
                          break;
                        }
                      }
                      that.annualCard = _index;
                    }
                    if(_index !== '') {
                      console.log(_index);
                      that.checkCard = _index;
                      that.annualCard = _index;
                    }
//                  }

                  if(_index !== '') {
                    let _curMonth = Number(that.rentList[_index].month);
                    // 提交的套餐值
                    that.submitVal = Number(_curMonth);
                    // 显示的套餐
                    that.cardVal = Number(that.rentList[_index].value) + Number(that.rechargeList.deviceDeposit);
                  } else {
                    // 提交的套餐值
                    that.submitVal = '';
                    // 显示的套餐
                    that.cardVal = Number(that.rechargeList.deviceDeposit);
                  }
                }
              }
            })
        };

        if(that.isOrderPay) {
          // 获取订单费用详情
          that.$http.get(`${that.$apihost}/serviceorders/${that.$route.params.id}/fees`)
            .then((res) => {
              let _temp = res;
              that.rechargeList.deviceDeposit = 0;
              for(let i = 0,len = res.length; i < len; i++) {
                let _type = _temp[i].feeType;
                if(_type && _type === 'YJ') {
                  that.rechargeList.deviceDeposit = _temp[i].subTotal || 0;
                }
                if(_type && _type === 'ZJ') {
                  that.cardVal = _temp[i].subTotal || 0;
                }
              }
              that.cardVal += Number(that.rechargeList.deviceDeposit);
            })
        }

        if(this.$route.path.indexOf('serviceorder') > -1) {
          // 个人租赁支付押金
          this.isFirst  = true;
          this.$http.get(`${this.$apihost}/serviceorders/${that.entityId}`)
            .then((res) => {
              this.entity = res;
              let _lease = res.leaseProduct;
              this.leaseProductId = _lease && _lease.id;
              this.leaseOrderId = this.$route.params.id;

              // 处理套餐数据
              // 从订单详情页面过来支付订单
              if(this.isOrderPay) {
                that.rechargeList.productName = res.productName;
              } else {
                // 其他
                initRent(_lease, false);
              }
            })
        } else if(this.$route.query.orderId) {
          // 续费
          this.isFirst = false
          this.$http.get(`${this.$apihost}/waterdevices/${that.entityId}`)
            .then((res) => {
//                  if(res.device.leaseProductId !== '') {
              that.leaseProductId = res.leaseProductId;
              that.leaseOrderId = res.leaseOrderEntityId;

              that.$http.get(`${that.$apihost}/lease/products/${that.$route.query.orderId}`)
                .then((res) => {
                  initRent(res, true);
                })
//                  }
            })
        } else {
          // 扫一扫支付押金
          that.isFirst = true;
          that.$http.get(`${that.$apihost}/waterdevices/${that.entityId}`)
            .then((res) => {
              this.leaseProductId = res.leaseProductId
              this.leaseOrderId = res.leaseOrderEntityId

              this.$http.get(`${this.$apihost}/lease/products/${this.leaseProductId}`)
                .then((res) => {
                  initRent(res, false);
                })
            })
        }
        this.$store.commit("hideLoading");
      },
      /**
       * 信用免押金支付
       */
      creditFree() {
        let _chargeType = this.leaseSet && this.leaseSet.firstChargeStategy;
        if(_chargeType === 'RR' && !this.annualCard) {
          this.$toast.warn("请先选择套餐");
          return false;
        }
        this.creditPopup = true;
      },
      /**
       * 套餐选择
       * @param index
       */
      selectCombo(index) {
        let that = this;
        let _rent = that.rentList;
        // 首次支付押金时
        if(that.isFirst) {
          let _chargeType = that.leaseSet && that.leaseSet.firstChargeStategy;
          let _month = that.rentList[index].month;
          if(index !== '' && index !== null && index !== undefined) {
            // 可选
            if(_chargeType === 'RO') {
              if (_month === that.submitVal) {
                that.submitVal = '';
                that.checkCard = [];
              } else {
                that.annualCard = index;
                // 显示的套餐
                that.cardVal = Number(_rent[index].value) + Number(that.rechargeList.deviceDeposit);
                // 提交的套餐值(月数)
                that.submitVal = Number(_rent[index].month);
              }
            } else if(_chargeType === 'RR') {
              // 必选
              that.annualCard = index;
              // 显示的套餐
              that.cardVal = Number(_rent[index].value) + Number(that.rechargeList.deviceDeposit);
              // 提交的套餐值(月数)
              that.submitVal = Number(_rent[index].month);
            }
          }
//          that.annualCard = index;
//          // 显示的套餐
//          that.cardVal = Number(_rent[index].value) + Number(that.rechargeList.deviceDeposit);
//          // 提交的套餐值(月数)
//          that.submitVal = Number(_rent[index].month);
        } else {
          that.annualCard = index;
          that.checkCard = index;
          // 显示的套餐
          that.cardVal = Number(_rent[index].value);
          // 提交的套餐值
          that.submitVal = Number(_rent[index].month);
        }
      },
      /**
       * 立即授权
       */
      authorize() {
        let that = this;
        let _index = 0;
        let _chargeType = that.leaseSet && that.leaseSet.firstChargeStategy;
        if(_chargeType === 'RR') {
          if(!this.annualCard) {
            this.$toast.warn("请先选择套餐");
            return false;
          } else {
            _index = that.annualCard;
          }
        } else if(_chargeType === 'RO') {
          _index = that.checkCard;
        }

        if(!that.isAgree) {
          this.$toast.warn("授权需同意协议内容");
          return false;
        }

        that.$validator.validateAll().then((result) => {
          if(result) {
            let _params = {
              cert_no: that.usrNo,
              name: that.usrName,
              credit_score: that.leaseSet && that.leaseSet.admittanceScore,
            };
            that.$http.get(`${that.$apihost}/zhima/isaccord`, _params)
              .then((res) => {
                if (res) {
                  that.rechargeList.deviceDeposit = 0;
                  that.isCredit = true;
                  if(_chargeType === 'OD') {
                    that.cardVal = 0;
                  } else {
                    if(_index !== '' && _index !== undefined && _index !== null && JSON.stringify(_index) !== '[]') {
                      that.cardVal = (that.rentList && that.rentList[_index].valueAfter) ? that.rentList[_index].valueAfter : 0;
                    } else {
                      that.cardVal = 0;
                    }
                  }
                  that.pay(true);
                } else {
                  that.$toast.error('抱歉，您不符合信用免押金条件！');
                }
              }).catch((errMsg) => {
                that.$toast.error('抱歉' + errMsg);
              })
          }
        })
      },
      /**
       * 支付
       * @param type
       */
      pay(type) {
        let that = this;
        let _title = '付款';
        if(type) {
          _title = '授权并支付'
        }
        that.$dlg.confirm(`确定${_title}？`, () => {
          that.payAgain();
        });
      },
      // 支付下单
      payAgain() {
        let that = this;
        // 已经下单还未支付
        if(this.$route.query && this.$route.query.isOrderPay) {
          that.$http.post(`${that.$apihost}/serviceorders/${that.entityId}/pay/unifiedorder`)
            .then((res) => {
              that.payOrder(res,'order');
            })
        } else {
          let _params = {
            rental_package: that.submitVal,
            credit_rent: that.isCredit
          };
          if(that.$route.path.indexOf('serviceorder') > -1) {
            // 首次支付押金时
            that.$http.post(`${that.$apihost}/serviceorders/${that.entityId}/pay/deposit`)
              .then((res) => {
                that.payOrder(res,'order');
              });
          } else if(that.$route.query.scanId) {
            let _json = {
              deviceEntityId: that.entityId,
              deviceId: that.$route.query.scanId,
              rental_package: that.submitVal,
              credit_rent: that.isCredit
            };
            // 扫一扫支付押金
            that.$http.post(`${that.$apihost}/lease/devices/${that.entityId}/scan-pay`, _json)
              .then((res) => {
                that.payOrder(res,'device');
              })
          } else {
            // 续费
            that.$http.post(`${that.$apihost}/lease/devices/${that.entityId}/recharge`, _params)
              .then((res) => {
                that.payOrder(res,'device')
              })
          }
        }
      },
      // 调起支付请求
      payOrder(res,type) {
        let that = this;
        let _res = {};

        if(res.indexOf('<form') !== 0) {
          _res = JSON.parse(res);
        }

        if(res) {
          if(_res && _res.zeroPay) {
            // 支付成功后的回调函数
            if(that.$route.path.indexOf('userdevices') > -1) {
              that.$router.push({
                path: '/serviceorder/recharge/success',
                query: {
                  code: '',
                  leaseOrderId: that.leaseOrderId,
                  entityId: that.$route.params.entityId,
                  payType: type
                }
              })
            } else {
              that.getCode(5,type);
            }
          } else {
            let _nav = navigator && navigator.userAgent.toLowerCase().match(/MicroMessenger/i);
            if (_nav && _nav[0] === "micromessenger") {
              that.$wechat.init(that,function() {
                that.$wechat.pay({
                  appId: _res.appId,
                  timeStamp: _res.timeStamp,
                  nonceStr: _res.nonceStr,
                  package: _res.package,
                  signType: _res.signType,
                  paySign: _res.paySign,
                  success: function (res) {
                    // 支付成功后的回调函数
                    if(that.$route.path.indexOf('userdevices') > -1) {
                      that.$router.push({
                        path: '/serviceorder/recharge/success',
                        query: {
                          code: '',
                          leaseOrderId: that.leaseOrderId,
                          entityId: that.$route.params.entityId,
                          payType: type
                        }
                      })
                    } else {
                      that.getCode(5,type);
                    }
                  }
                });
              });
            } else {
              const div = document.createElement('div');
              div.innerHTML = res;
              document.getElementById('app').appendChild(div);
              if(document.forms[0]) {
                document.forms[0].submit();
              }
            }
          }
        } else {
          that.$toast.error('系统异常：支付出现错误！');
        }
      },
      // 轮询获取激活码
      getCode(index,type) {
        let that = this;
        that.i++
        that.$http.get(`${that.$apihost}/serviceorders/${that.leaseOrderId}/activecode`)
          .then((res) => {
            if (that.i < index) {
              if (res !== '') {
                clearTimeout(that.timer)
                that.activeCode = res
                that.$router.push({
                  path: '/serviceorder/recharge/success',
                  query: {
                    code: that.activeCode,
                    leaseOrderId: that.leaseOrderId,
                    entityId: that.entityId,
                    payType: type
                  }
                })
              }
            } else if (this.i === index) {
              if (res !== '') {
                clearTimeout(this.timer)
                that.activeCode = res
                that.$router.push({
                  path: '/serviceorder/recharge/success',
                  query: {
                    code: that.activeCode,
                    leaseOrderId: that.leaseOrderId,
                    entityId: that.entityId,
                    payType: type
                  }
                })
              } else {
                this.$toast.warn("获取激活码失败");
                clearTimeout(this.timer);
                return false
              }
            }
          })
        that.timer = setTimeout(() => {
          that.getCode(index)
        },1000)
      }
    }
  }
</script>
