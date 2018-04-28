<!--
 * 订单详情
 * @author  hucw
 * @created 2018-04-10
 *-->
<style scoped lang="scss" type="text/scss">
  @import "~variables";

</style>

<template>
  <v-app>
    <div v-if="tradeorder !== null">
      <v-view-header :tradeorder="tradeorder"></v-view-header>

      <div class="flex bg-white padding">
        <div class="iconbox iconbox-light"><i class="iconfont icon-IOT-dz color-orange-1"></i></div>
        <div class="flex-item padding-left">
          <span class="font-m font-bold-300">{{tradeorder.receiverName}}</span>
          <span class="font-m font-bold-300 margin-left">{{tradeorder.receiverMobile}}</span>
          <div class="margin-top">{{tradeorder.receiverFullAddress}}</div>
        </div>
      </div>
      <div class="flex bg-white padding border-top">
        <div class="iconbox iconbox-light"><i class="iconfont icon-iot-chezai color-cyan"></i></div>
        <div class="flex-item padding-left">
          <span class="font-m font-bold-300">{{tradeorder.logisticsCompany}}</span>
          <a :href="'tel:' + tradeorder.logisticsCompanyPhone" class="font-m font-bold-300"
             v-show="!$filters.isNullStr(tradeorder.logisticsCompanyPhone)">({{tradeorder.logisticsCompanyPhone}})</a>
          <div class="margin-top logisticsInfo" :data-clipboard-text="tradeorder.invoiceNo">
            <span class="valign-middle">运单号：<span id="invoiceNo">{{tradeorder.invoiceNo}}</span></span>
            <i class="fa fa-copy margin-left-s"></i>
          </div>
        </div>
        <div><button type="button" class="btn btn-xs" @click="viewLogistics">查看物流</button></div>
      </div>

      <div class="padding bg-white margin-top">
        <ul>
          <li v-for="product in tradeorder.products">
            <div class="flex">
              <div class="padding-s">
                <img class="img-thumbnail" width="60" height="60" :src="$filters.resizeImg(product.productCoverImg, 'm_fill,h_100,w_100')"/>
              </div>
              <div class="flex-item padding-left-s padding-right-s">
                <div class="text-wrapper font-bold">{{product.productName}}</div>
                <div class="margin-top-s font-s">商品型号：{{product.productItemCode}}</div>
                <div class="margin-top-s" style="margin-left: -2px">
                  <span class="font-light">{{$filters.formatCurrency(product.price/100.0)}}</span>
                  <!--<s class="font-s font-light" v-show="!product.supportTrial && product.listPrice > product.price" >{{$filters.formatCurrency(product.listPrice/100.0)}}</s>
                  <span class="font-s color-orange-1 margin-left" v-show="product.supportTrial">预付款 {{$filters.formatCurrency(product.prepaidAmount/100.0)}}</span>-->
                </div>
              </div>
              <div class="font-bold color-orange-1">x{{product.productNum}}</div>
            </div>
          </li>
        </ul>
      </div>

      <div class="margin-top bg-white">
        <v-cell title="订单备注" :isLink="true" :value="tradeorder.buyerMemo" @click.native="isShowMemosPopup = true" v-if="!$filters.isNullStr(tradeorder.buyerMemo)"></v-cell>
        <v-cell title="维权信息" :isLink="true" value="点击查看" @click.native="isShowDefendOrderPopup = true" v-if="defendOrders.length > 0"></v-cell>
      </div>

      <div class="margin-top bg-white">
        <v-cell title="商品合计">
          <div slot="value" class="font-light">{{$filters.formatCurrency(tradeorder.payment/100.0)}}</div>
        </v-cell>
        <v-cell title="调整金额" v-show="tradeorder.adjustFee !== 0">
          <div slot="value" class="font-light">{{$filters.formatCurrency(tradeorder.adjustFee/100.0)}}</div>
        </v-cell>
        <v-cell title="运费">
          <div slot="value" class="font-light">{{$filters.formatCurrency(tradeorder.postFee/100.0)}}</div>
        </v-cell>
        <!--<v-cell title="优惠金额">
          <div slot="value" class="font-light">{{$filters.formatCurrency(tradeorder.discountFee/100.0)}}</div>
        </v-cell>-->
        <v-cell :title="$filters.isNullTime(tradeorder.payTime) ? '应支付金额' : '已支付金额'">
          <div slot="value" class="font-light color-orange-1 font-bold">{{$filters.formatCurrency(tradeorder.totalAmount/100.0)}}</div>
        </v-cell>
        <v-cell title="应付余款" v-show="!$filters.isNullTime(tradeorder.payTime) && tradeorder.paymentRemainder > 0">
          <div slot="value" class="font-light color-orange-1 font-bold">{{$filters.formatCurrency(tradeorder.paymentRemainder/100.0)}}</div>
        </v-cell>
        <v-cell title="已支付余款" v-show="!$filters.isNullTime(tradeorder.remainderPayTime)">
          <div slot="value" class="font-light color-orange-1 font-bold">{{$filters.formatCurrency(tradeorder.paymentRemainder/100.0)}}</div>
        </v-cell>
      </div>

      <div class="padding">
        <!--<div class="font-light margin-bottom-s" v-show="!$filters.isNullStr(tradeorder.buyerMemo)">订单备注：{{tradeorder.buyerMemo}}</div>-->
        <div class="font-light margin-bottom-s">订单编号：{{tradeorder.orderId}}</div>
        <div class="font-light margin-bottom-s" v-show="!$filters.isNullTime(tradeorder.payTime)">支付时间：{{$filters.formatTime(tradeorder.payTime)}}</div>
        <div class="font-light margin-bottom-s" v-show="!$filters.isNullTime(tradeorder.remainderPayTime)">余款支付时间：{{$filters.formatTime(tradeorder.remainderPayTime)}}</div>
        <div class="font-light margin-bottom-s">创建时间：{{$filters.formatTime(tradeorder.created)}}</div>
      </div>

      <div style="height:50px"></div>

      <div class="page-footer padding align-right">
        <button type="button" class="btn btn-sm" @click="goBack">返回</button>

        <button type="button" class="btn btn-sm margin-left-s" @click="cancel" v-show="tradeorder.orderStatus < 20 && tradeorder.cancelStatus === null">取消订单</button>
        <button type="button" class="btn btn-sm btn-primary margin-left-s" @click="pay" v-show="canPay">立即支付</button>
        <button type="button" class="btn btn-sm btn-cyan margin-left-s" @click="pay" v-show="isPayRemainder">支付尾款</button>
        <button type="button" class="btn btn-sm btn-info" @click="isShowDefendForm = true" v-show="canReturn">申请退换货</button>
        <button type="button" class="btn btn-sm btn-danger" @click="submitDefendLogistics" v-show="tradeorder.defendStatus === 10">添加物流信息</button>
        <button type="button" class="btn btn-sm btn-primary margin-left-s" @click="finished" v-show="canFinished">确认收货</button>
        <!--<button type="button" class="btn btn-sm btn-primary" @click="">支付余款</button>
        <button type="button" class="btn btn-sm btn-primary" @click="">评价</button>-->
      </div>
    </div>

    <v-popup v-model="isShowMemosPopup" title="订单备注" position="bottom" :fullScreen="true">
      <div class="padding">
        <v-timeline :data="memosData"></v-timeline>
      </div>
    </v-popup>

    <!--退换货popup-->
    <v-form-defend v-model="isShowDefendForm" :tradeorder="tradeorder" @on-defend="onSubmitDefend"></v-form-defend>

    <!--维权订单popup-->
    <v-view-defendorders v-model="isShowDefendOrderPopup" :defendOrders="defendOrders"></v-view-defendorders>

    <v-script src="/static/js/clipboard.min.js"></v-script>
  </v-app>
</template>

<script>
  import VPopup from "@/components/ui/v-popup";
  import VTimeline from "@/components/ui/v-timeline";
  import VViewHeader from "@/pages-member/orders/tradeorder/v-view-header"
  import VViewDefendorders from '@/pages-member/orders/tradeorder/v-view-defendorders';
  import VFormDefend from '@/pages-member/orders/tradeorder/v-form-defend';

  import storeTypes from '@/store/types'
  import TradeorderApi from '@/apis/api-tradeorder';


  export default {
    name: "tradeorder-view",
    components: {VFormDefend, VPopup, VViewHeader, VTimeline, VViewDefendorders},
    data: function () {
      return {
        orderId: this.$route.params.id,
        tradeorder: null,

        // 备注留言处理
        memos: [],
        isShowMemosPopup: false,

        // 申请退换货
        isShowDefendForm: false,

        // 维权订单信息
        defendOrders: [],
        isShowDefendOrderPopup: false
      }
    },
    computed: {
      orderStatus: function () {
        return this.tradeorder.orderStatus || 0;
      },
      isPayRemainder: function () {
        return this.orderStatus === 30 && !this.$filters.isNullTime(this.tradeorder.payTime) && this.$filters.isNullTime(this.tradeorder.remainderPayTime);
      },
      canFinished: function () {
        // 非试用且已发货状态
        return this.tradeorder.paymentRemainder <= 0 && this.orderStatus === 20 && this.tradeorder.defendStatus === null;
      },
      // 是否可以支付: 状态<5且未取消且未退款
      canPay: function () {
        return this.orderStatus <= 5 && this.tradeorder.cancelStatus === null && this.tradeorder.refundStatus === null;
      },
      // 是否可以申请退换货
      canReturn: function () {
        //return this.orderStatus >= 20 && this.orderStatus <= 80 && this.tradeorder.defendStatus === null;
        return this.orderStatus >= 20;
      },

      // 实际应该支付金额
      payTotal: function () {
        return this.tradeorder.payment + this.tradeorder.postFee - this.tradeorder.discountFee;
      },

      // 备注时间轴数据
      memosData: function () {
        if (this.memos.length === 0) {
          if (this.tradeorder !== null && !this.$filters.isNullStr(this.tradeorder.buyerMemo)) {
            return [this.tradeorder.buyerMemo];
          } else {
            return [];
          }
        }

        let timelineData = [];
        for(let item of this.memos){
          let content = this.$filters.formatTime(item.gmtCreated);
          content += "&nbsp;&nbsp;" + item.memo;
          timelineData.push(content);
        }

        if (!this.$filters.isNullStr(this.tradeorder.buyerMemo)) {
          timelineData.push(this.tradeorder.buyerMemo);
        } else {
          this.tradeorder.buyerMemo = timelineData[0];
        }

        return timelineData
      }
    },
    mounted() {
      this.loadDetail();

      // 初始化粘贴板复制功能
      setTimeout(() => {
        let clipboardJS = new ClipboardJS('.logisticsInfo');
        let that = this;
        clipboardJS.on('success', function(e) {
          console.info('Text:', e.text);
          that.$dlg.confirm("运单号已复制，是否现在去查询物流信息？", () => {
            that.viewLogistics();
          })
        });
      }, 1000);
    },
    methods: {
      /**
       * 加载订单详情
       */
      loadDetail: function () {
        this.$loading.show();
        TradeorderApi.detail(this.orderId)
          .then((resp) => {
            this.tradeorder = resp;
            this.$loading.hide();

            this.loadMemos();
            this.loadDefendOrders();
          })
          .catch(() => {
            this.$loading.hide();
          })
      },

      /**
       * 获取备注信息列表
       */
      loadMemos: function () {
        TradeorderApi.getMemos(this.tradeorder.id)
          .then((resp) => {
            this.memos = resp;
          });
      },

      /**
       * 获取维权订单信息列表
       */
      loadDefendOrders: function () {
        TradeorderApi.getDefendOrders(this.tradeorder.id)
          .then((resp) => {
            this.defendOrders = resp;
          });
      },

      /**
       * 查看物流信息
       */
      viewLogistics: function () {
        if (!this.$filters.isNullStr(this.tradeorder.logisticsCompanyUrl)) {
          window.open(this.tradeorder.logisticsCompanyUrl);
        } else {
          this.$toast.warn("暂无物流公司官网");
        }
      },

      /**
       * 取消订单
       */
      cancel: function () {
        let that = this;
        that.$dlg.prompt("请输入取消原因", (resp) => {
          that.$loading.show();
          TradeorderApi.cancel(that.tradeorder.id, resp)
            .then((resp) => {
              that.$loading.hide();
              if (resp === true) {
                that.$dlg.alert("订单取消申请已提交，请耐心等待确认处理。");
                that.loadDetail();
              } else {
                that.$toast.error("订单取消失败，请重新尝试")
              }
            })
            .catch(() => {
              that.$loading.hide();
              that.$toast.error("订单取消失败，请重新尝试")
            })
        })
      },

      /**
       * 完成订单
       */
      finished: function () {
        let that = this;
        that.$dlg.confirm("是否确定确认收货", () => {
          that.$loading.show();
          TradeorderApi.finished(that.tradeorder.id)
            .then((resp) => {
              that.$loading.hide();
              if (resp === true) {
                that.$toast.success("订单交易完成")
                that.loadDetail();
              } else {
                that.$toast.error("确认收货失败，请重新尝试")
              }
            })
            .catch((e) => {
              that.$loading.hide();
              that.$toast.error(e.errMsg ? e.errMsg : "确认收货失败，请重新尝试");
            })
        })
      },

      /**
       * 开始支付
       */
      pay: function () {
        let tradeorder = this.tradeorder;
        let payAmount = this.isPayRemainder ? tradeorder.paymentRemainder : tradeorder.totalAmount;

        // 解析支付时显示标题内容
        let subject = "";
        let productCount = 0;
        if (tradeorder.products.length > 0) {
          for(let product of tradeorder.products){
            if (subject === "") {
              subject = product.productName;
            }
            productCount += product.productNum;
          }
          subject += "等共" + productCount + "件商品";
        }

        // 转到支付界面
        const payInfo = {
          type: "order",
          subject: subject,
          payTitle: tradeorder.orderId,
          totalAmount: payAmount,
          fees: [],
          orderInfo: {
            orderType: "tradeorder",
            isPayRemainder: this.isPayRemainder,
            orderEntityId: tradeorder.id
          }
        };
        this.$store.commit(storeTypes.appPay.setPayInfo, payInfo);
        window.location.href = "/app/pay";
      },

      // 退换货申请后重新加载数据
      onSubmitDefend: function () {
        this.loadDetail();
      },

      // 跳转添加退换货物流信息
      submitDefendLogistics: function () {
        this.$router.push({
         path: `/tradeorder/${this.tradeorder.id}/return-change/logistics`,
          query: {
           orderId: this.tradeorder.orderId
         }
        });
      },

      /**
       * 返回
       */
      goBack: function () {
        this.$router.go(-1);
      }
    }
  }
</script>

