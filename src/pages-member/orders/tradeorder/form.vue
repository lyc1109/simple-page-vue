<template>
  <v-app>
    <div class="padding bg-white">
      <ul v-if="products.length > 0">
        <li v-for="product in products">
          <div class="flex">
            <div class="padding-s">
              <img class="img-thumbnail" width="60" height="60" :src="$filters.resizeImg(product.primaryMedia, 'm_fill,h_100,w_100')"/>
            </div>
            <div class="flex-item padding-left-s padding-right-s">
              <div class="text-wrapper font-bold">{{product.productName}}</div>
              <div class="margin-top-s font-s">已选型号：{{product.productItemCode}}</div>
              <div class="margin-top-s" style="margin-left: -2px">
                <div v-if="!product.isOnTrial" >
                  <span class="font-bold color-orange-1">{{$filters.formatCurrency(product.price/100.0)}}</span>
                  <s class="font-s font-light" v-show="product.listPrice > product.price" >{{$filters.formatCurrency(product.listPrice/100.0)}}</s>
                </div>
                <span class="font-s color-orange-1 margin-left" v-show="product.isOnTrial">试用预付款 {{$filters.formatCurrency(product.prepaidAmount/100.0)}}</span>
              </div>
            </div>
            <div class="padding-s font-bold color-orange-1">x{{product.productNum}}</div>
          </div>
        </li>
      </ul>
      <div class="padding align-center font-light font-m" v-if="products.length === 0">请选择所要购买商品</div>
    </div>

    <!--联系信息-->
    <div class="margin-top border-top bg-white border-bottom">
      <v-form-receiver @onChange="onContactsChange" ref="contactsForm"></v-form-receiver>
      <v-input class="form-field"
               type="textarea"
               v-model.trim="formData.buyerMemo"
               name="buyerMemo"
               label="备注"
               :rows="3"
               placeholder="填写备注"></v-input>
    </div>

    <!--金额信息-->
    <div class="margin-top border-top bg-white">
      <v-cell title="应付金额">
        <div slot="value">
          {{$filters.formatCurrency(formData.payment/100.0)}}
        </div>
      </v-cell>
      <v-cell title="应付余款金额" v-show="formData.paymentRemainder > 0">
        <div slot="value">
          {{$filters.formatCurrency(formData.paymentRemainder/100.0)}}
        </div>
      </v-cell>
      <v-cell title="运费">
        <div slot="value">
          {{$filters.formatCurrency(formData.postFee/100.0)}}
        </div>
      </v-cell>
      <!--<v-cell title="优惠券" :isLink="true">
        <div slot="value" class="font-light">无可用优惠券</div>
      </v-cell>-->
      <div class="padding-right padding-top-m padding-bottom-m font-light align-right font-bold color-orange-1">
        实付金额：{{$filters.formatCurrency(formData.totalAmount/100.0)}}
      </div>
    </div>

    <div style="height:50px"></div>

    <div class="page-footer bg border-top">
      <div class="flex">
        <div class="flex-item align-right padding-right">
          共<span class="font-bold color-orange-1">{{productCount}}</span>件，实付款<span class="font-bold color-orange-1">{{$filters.formatCurrency(formData.totalAmount/100.0)}}</span>
        </div>

        <div class="flex-item">
          <button type="button" class="btn btn-block btn-lg btn-primary" @click="submit">提交订单</button>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
  import VFormReceiver from '@/pages-member/orders/tradeorder/v-form-receiver';

  import TradeorderApi from '@/apis/api-tradeorder';

  import storeTypes from "@/store/types";

  export default {
    name: "tradeorder-form",
    desc: "创建销售订单",
    components: {
      VFormReceiver
    },
    data: function () {
      return {
        formData: {
          // 应支付金额(分)
          payment: 0,
          // 应支付余款(分)
          paymentRemainder: 0,
          // 折扣金额（优惠券）
          discountFee: 0,
          // 邮费
          postFee: 0,

          // 收货信息
          receiverName: "",
          receiverMobile: "",
          receiverProvince: "",
          receiverCity: "",
          receiverArea: "",
          receiverAddress: "",
          receiverZip: "",
          buyerMemo: "",

          products: []
        },

        productCount: 0,
      }
    },
    computed: {
      products: function () {
        return this.$store.getters[storeTypes.tradeorder.getProducts];
      }
    },
    mounted(){
      this.calAmount();
    },
    methods: {
      // 监听联系信息变化
      onContactsChange: function (contactObj) {
        Object.assign(this.formData, contactObj);
      },

      // 计算金额信息
      calAmount: function () {
        if (this.products.length === 0) {
          return;
        }

        let totalAmount = 0;
        let payment = 0;
        let paymentRemainder = 0;
        let productCount = 0;
        for(let product of this.products){
          productCount += product.productNum;
          if (product.isOnTrial) {
            // 试用商品预付款
            let prepaidAmount = product.prepaidAmount*product.productNum;
            payment += prepaidAmount;
            paymentRemainder += product.price - prepaidAmount;
          } else {
            payment += product.price*product.productNum;
          }

          // 运费
          if (product.freight > this.formData.postFee) {
            this.formData.postFee = product.freight;
          }
        }
        this.productCount = productCount;
        this.formData.paymentRemainder = paymentRemainder;
        this.formData.payment = payment;
        this.formData.totalAmount = payment + this.formData.postFee - this.formData.discountFee
      },

      submit: function () {
        let that = this;
        that.formData.products = this.$store.getters[storeTypes.tradeorder.getProducts];

        that.$refs.contactsForm.validate(() => {
          that.$loading.show();
          TradeorderApi.submit(this.formData)
            .then((resp) => {
              console.log("订单提交成功");
              that.$loading.hide();
              that.$toast.success("订单提交成功");
              that.toPay(resp);
            })
            .catch(() => {
              console.log("订单提交失败");
              that.$loading.hide();
              that.$toast.error("抱歉，订单提交失败，请重新尝试提交");
            });
        });
      },

      toPay: function (tradeorder) {
        let subject = this.products[0].productName + "等共" + this.productCount + "件商品";

        // 转到支付界面
        const payInfo = {
          type: "order",
          subject: subject,
          payTitle: tradeorder.orderId,
          totalAmount: this.formData.totalAmount,
          fees: [],
          orderInfo: {
            orderType: "tradeorder",
            orderEntityId: tradeorder.id
          }
        };
        this.$store.commit(storeTypes.appPay.setPayInfo, payInfo);
        //this.$router.replace("");
        window.location.href = "/app/pay"
      }
    }
  }
</script>

