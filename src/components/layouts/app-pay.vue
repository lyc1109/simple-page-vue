<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .pay-container {
    padding: rem(20px);

    &:before {
      content: "";
      display: block;
      height: rem(100px);
      width: 100%;
      background: $primary;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }
  }

  .pay-content {
    z-index: 10;
    text-align: center;
    margin-top: rem(25px);

    .wavy-line {
      width: 100%;
      height: 10px;
      border-radius: 0.5px;
      background: -webkit-linear-gradient(315deg, #fff, #fff 45%, transparent, transparent 55%, transparent 100%), -webkit-linear-gradient(45deg, #fff, #fff 45%, #ddd, transparent 55%, transparent 100%);
      background: -moz-linear-gradient(315deg, #fff, #fff 45%, transparent, transparent 55%, transparent 100%), -moz-linear-gradient(45deg, #fff, #fff 45%, #ddd, transparent 55%, transparent 100%);
      background: linear-gradient(315deg, #fff, #fff 45%, transparent, transparent 55%, transparent 100%), linear-gradient(45deg, #fff, #fff 45%, #ddd, transparent 55%, transparent 100%);
      background-size: 10px 10px;
      background-repeat: repeat-x;
    }
  }

  .pay-body {
    background: $white;
    padding-top: rem(50px);

    .pay-divider {
      padding-top: rem(30px);

      .divider-circle {
        width: rem(15px);
        height: rem(30px);
        background: $page_bg;
      }
      .divider-circle-left {
        border-radius: 0 15px 15px 0;
        box-shadow: inset -2px 3px 4px rgba(0, 0, 0, 0.1);
      }
      .divider-circle-right {
        border-radius: rem(15px) 0 0 rem(15px);
        box-shadow: inset 2px 3px 4px rgba(0, 0, 0, 0.1);
      }
      .divider-line div {
        margin: 0 12px;
        border-bottom: 1px dashed $gray;
      }
    }
  }
</style>

<template>
  <div>
    <div class="pay-container">
      <div class="pay-content">
        <div class="wavy-line"></div>

        <div class="pay-body">
          <h4 class="font-light">应支付金额(元)</h4>
          <h2 class="margin-top">{{this.$filters.formatRMB(totalAmount)}}</h2>

          <div class="flex pay-divider">
            <div class="divider-circle divider-circle-left"></div>
            <div class="flex-item divider-line">
              <div></div>
            </div>
            <div class="divider-circle divider-circle-right"></div>
          </div>

          <div class="margin-top-l padding-left">
            <v-cell class="border-none padding-top-s" title="类型" :value="typeText"></v-cell>
            <v-cell class="border-none padding-top-s" title="标题" v-if="!$filters.isNullStr(subject)">
              <div slot="value" class="text-wrapper-overline" v-html="subject">商品详情</div>
            </v-cell>
            <v-cell class="border-none padding-top-s" :title="type==='order' ? '订单编号' : '租赁产品'" :value="payTitle"></v-cell>

            <v-cell class="border-none padding-top-s" v-for="fee in fees"
                    :key="fee.name"
                    :title="fee.name"
                    :value=" $filters.formatRMB(fee.amount) " v-if="fees.length > 0"></v-cell>
          </div>
        </div>
      </div>

      <div class="padding-top-l">
        <button type="button" class="btn btn-block btn-lg btn-primary margin-top-l" @click="pay()" v-if="!paySuccessFlag">
          立即支付( {{this.$filters.formatRMB(totalAmount)}} )
        </button>
        <button type="button" class="btn btn-block btn-lg btn-success margin-top-l" disabled="disabled" v-if="paySuccessFlag">
          <i class="iconfont icon-iot-xz"></i>
          已支付成功
        </button>

        <!-- 支付宝支付处理 -->
        <div class="margin-top" v-if="isInAlipay">
          <!--<button type="button" class="btn btn-block btn-primary-outline" @click="onPaySuccessHandler">
            已完成支付
          </button>-->

          <div class="hidden" ref="alipayForm" v-html="alipayFormHtml"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import App from "@/assets/scripts/app";
  import types from "@/store/types";
  import payApis from "@/apis/api-pay";

  export default {
    name: "app-pay",
    data: function () {
      return {
        // 支付类型：order(订单支付) | recharge(设备充值) | scan(扫码租赁)
        type: "",
        // 首要标题
        subject: "",
        // 显示标题：产品名称 | 租赁产品名称 | 设备名称
        payTitle: "",
        // 费用明细: [{name: "", amount: 0}]
        fees: [],
        // 应付总金额
        totalAmount: 0,

        // 订单支付必需
        orderInfo: {
          orderType: "",
          orderEntityId: "",
          // 是否支付尾款，销售订单有效
          isPayRemainder: false
        },

        // 设备充值必需
        rechargeInfo: {
          deviceEntityId: "",
          leaseDueDate: "",
          rentalPackage: ""
        },

        // 扫码租赁必需
        scanLeaseInfo: {
          deviceId: "",
          deviceEntityId: "",
          rentalPackage: "",
          isCreditRent: false,
        },

        // -------------------------------------
        // 组件本身data
        paySuccessFlag: false,
        // 存储中的支付信息
        storePayInfo: null,

        // 支付宝支付表单信息
        alipayFormHtml: "",
      }
    },
    computed: {
      typeText: function () {
        if (this.type === "order") {
          return "订单支付"
        }
        if (this.type === "recharge") {
          return "设备充值"
        }
        if (this.type === "scan") {
          return "扫码租赁"
        }
        return "未知类型"
      },

      payType: function () {
        if (this.$wechat.isInWechat()) {
          return "wepay";
        }
        if (this.$alipay.isInAlipay()) {
          return "alipay";
        }
        return "";
      },

      isInAlipay: function () {
        return this.$alipay.isInAlipay();
      }
    },
    mounted() {
      let payInfo = this.$store.getters[types.appPay.getPayInfo];
      console.log(JSON.stringify(payInfo));
      if (payInfo === null || payInfo.type === "") {
        this.$toast.error("支付信息为空，无法支付");
        return;
      }
      this.storePayInfo = payInfo;
      this.type = payInfo.type;
      this.totalAmount = payInfo.totalAmount;
      this.fees = payInfo.fees;
      this.subject = payInfo.subject;
      this.payTitle = payInfo.payTitle;
      this.orderInfo = payInfo.orderInfo;
      this.rechargeInfo = payInfo.rechargeInfo;
      this.scanLeaseInfo = payInfo.scanLeaseInfo;

      if(payInfo.paySuccess) {
        this.paySuccessFlag = true;
      } else {
        this.pay();
      }
    },

    methods: {
      // 开始支付
      pay: function () {
        if (this.paySuccessFlag === true) {
          this.$dlg.alert("已支付成功，不可重复支付。");
          return;
        }
        if (this.payType === "") {
          this.$dlg.alert("未知支付环境，无法进行支付。");
          return;
        }

        switch (this.type) {
          case "order":
            if (this.orderInfo.orderType === "tradeorder") {
              this.payTradeOrder();
            } else {
              this.payOrder();
            }
            break;

          case "recharge":
            this.payRecharge();
            break;

          case "scan":
            this.payScanLease();
            break;

          default:
            this.$dlg.alert("未知支付类型，无法进行支付。");
            break;
        }
      },

      // 订单支付
      payOrder: function () {
        let orderInfo = this.orderInfo;
        console.log("订单支付信息：" + JSON.stringify(orderInfo));
        if (orderInfo.orderEntityId === "") {
          this.$dlg.alert("未知订单信息，无法进行支付。");
          return;
        }

        let that = this;
        this.$loading.show();
        payApis.payOrder(orderInfo.orderEntityId, this.payType)
          .then((payInfo) => {
            this.$loading.hide();
            that.doPay(payInfo);
          })
      },

      // 设备充值支付
      payRecharge: function () {
        let rechargeInfo = this.rechargeInfo;
        console.log("设备充值支付信息：" + JSON.stringify(rechargeInfo));
        if (rechargeInfo.deviceEntityId === "") {
          this.$dlg.alert("未知设备信息，无法进行支付。");
          return;
        }
        if (rechargeInfo.rentalPackage === "") {
          this.$dlg.alert("未知充值套餐信息，无法进行支付。");
          return;
        }

        let that = this;
        that.$loading.show();
        payApis.payRecharge(rechargeInfo.deviceEntityId, rechargeInfo.rentalPackage, this.payType)
          .then((payInfo) => {
            that.$loading.hide();
            that.doPay(payInfo);
          });
      },

      // 扫码租赁支付
      payScanLease: function () {
        let scanLeaseInfo = this.scanLeaseInfo;
        console.log("扫码租赁支付信息：" + JSON.stringify(scanLeaseInfo));
        if (scanLeaseInfo.deviceEntityId === "" || scanLeaseInfo.deviceId === "") {
          this.$dlg.alert("未知设备信息，无法进行支付。");
          return;
        }

        let that = this;
        that.$loading.show();
        payApis.payScanLease(scanLeaseInfo.deviceEntityId, scanLeaseInfo.deviceId, scanLeaseInfo.rentalPackage, scanLeaseInfo.isCreditRent, this.payType)
          .then((payInfo) => {
            that.$loading.hide();
            that.doPay(payInfo);
          });
      },

      // 订单支付
      payTradeOrder: function () {
        let orderInfo = this.orderInfo;
        console.log("订单支付信息：" + JSON.stringify(orderInfo));
        if (orderInfo.orderEntityId === "") {
          this.$dlg.alert("未知订单信息，无法进行支付。");
          return;
        }

        let that = this;
        this.$loading.show();
        payApis.payTradeOrder(orderInfo.orderEntityId, this.payType, orderInfo.isPayRemainder)
          .then((payInfo) => {
            this.$loading.hide();
            that.doPay(payInfo);
          })
      },

      /**
       * 发起微信或支付宝支付
       *
       * @param payInfo    支付配置参数
       */
      doPay: function (payInfo) {
        // 0元支付
        if(payInfo.indexOf("zeroPay") > -1) {
          this.onPaySuccessHandler();
          return false;
        }

        let that = this;
        if (this.payType === "wepay") {
          that.$wechat.init(App.accessTokenHost + "/app/pay", function () {
            // 注：微信支付后台回传的是String字符串，需要转成JSON
            that.$wechat.pay(JSON.parse(payInfo), function () {
              that.paySuccessFlag = true;
              that.onPaySuccessHandler();
            });
          })
        } else if (this.payType === "alipay") {
          this.alipayFormHtml = payInfo;
          this.$nextTick(() => {
            let $form = this.$refs.alipayForm.firstElementChild;
            if ($form === null) {
              setTimeout(() => {
                $form = this.$refs.alipayForm.firstElementChild;
              }, 1000)
            }
            $form.submit();
            that.onPaySuccessHandler();
          });
        }
      },

      /**
       * 监听支付成功处理
       *
       * * 订单支付：判断订单是已支付
       * * 设备充值：判断租赁设备到期日是否一般化
       * * 扫码租赁：判断租赁设备是否已激活
       */
      onPaySuccessHandler: function () {
        let that = this;
        that.$loading.show();
        if(this.type === "order") {
          if (that.orderInfo.orderType === "tradeorder") {
            payApis.payTradeOrderResult(this.orderInfo.orderEntityId, that.orderInfo.isPayRemainder, function (isSuccess, order) {
              that.$loading.hide();
              if(isSuccess) {
                that.$dlg.alert("订单支付成功。");

                let memo = "订单支付成功，我们将尽快为您安排发货";
                if (that.orderInfo.isPayRemainder) {
                  memo = "订单交易完成，感谢您的支持";
                }
                that.paySuccess(memo, "返回首页", "");
              } else {
                that.$dlg.alert("抱歉，未查询到订单支付成功。<br/> Tips: 建议返回查看订单详情确认是否已支付成功")
              }
            });
          } else {
            payApis.payOrderResult(this.orderInfo.orderEntityId, function (isSuccess, order) {
              that.$loading.hide();
              if(isSuccess) {
                that.$dlg.alert("订单支付成功。激活码：" + order.leaseActivationCode);
                that.paySuccess("激活码：" + order.leaseActivationCode, "返回首页", "");
              } else {
                that.$dlg.alert("抱歉，未查询到订单支付成功。<br/> Tips: 建议返回查看订单详情确认是否已支付成功")
              }
            });
          }
        } else if(this.type === "recharge") {
          payApis.payRechargeResult(this.rechargeInfo.deviceEntityId, this.rechargeInfo.leaseDueDate, function (isSuccess) {
            that.$loading.hide();
            if(isSuccess) {
              that.$toast.success("设备充值成功。");
              that.paySuccess("", "返回我的设备", "/devices");
            } else {
              that.$dlg.alert("抱歉，未查询到设备充值成功。<br/> Tips: 建议返回查看设备信息确认是否已支付成功")
            }
          });
        } else if(this.type === "scan") {
          payApis.payScanLeaseResult(this.scanLeaseInfo.deviceEntityId, function (isSuccess) {
            that.$loading.hide();
            if(isSuccess) {
              that.$toast.success("支付成功，设备已激活。");
              that.paySuccess("", "返回我的设备", "/devices");
            } else {
              that.$dlg.alert("抱歉，未查询到设备激活成功。<br/> Tips: 建议返回我的设备中查看是否已激活设备")
            }

          });
        } else {
          that.$loading.hide();
        }
      },

      /**
       * 支付成功提示
       *
       * @param memos        备注
       * @param redirectText 重定向提示
       * @param redirectUrl  重定向URL
       */
      paySuccess: function (memos = "", redirectText = "", redirectUrl = "") {
        this.storePayInfo.paySuccess = true;
        this.$store.commit(types.appPay.setPayInfo, this.storePayInfo);

        let paySuccessUrl = "/pay/success";
        paySuccessUrl += "?memos=" + memos;
        paySuccessUrl += "&redirectText=" + redirectText;
        paySuccessUrl += "&redirectUrl=" + redirectUrl;
        this.$router.replace(encodeURI(paySuccessUrl))
      }
    }
  }
</script>
