<!-- 扫码租赁套餐选择页面 -->
<template>
  <div class="bg-white">
    <div v-if="leaseScenario.scenarioName">
      <lease-product-view-tpl :leaseProduct="leaseProduct" :leaseScenario="leaseScenario"
                          :leaseAgreement="leaseAgreement" :refundAgreement="refundAgreement">
      </lease-product-view-tpl>

      <!--租赁协议-->
      <div class="padding-m align-center border-top" v-show="!$filters.isNullHtml(leaseAgreement)">
        <v-checkbox v-model="agreeLeaseAgreement"></v-checkbox>
        <div class="inline-block">同意<span class="color-blue-1" @click="showLeaseAgreement=true">《租赁协议》</span></div>
      </div>
      <v-popup :fullScreen="true" v-model="showLeaseAgreement">
        <div class="padding full-height">
          <div v-html="leaseAgreement"></div>
          <div style="height: 50px;"></div>
        </div>
        <div class="page-footer border-top">
          <button class="btn btn-default btn-block" @click="showLeaseAgreement = false">确定</button>
        </div>
      </v-popup>

      <div style="height: 50px;"></div>

      <div class="page-footer bg border-top">
        <div class="flex">
          <div class="flex-item">
            <button type="button" class="btn btn-block btn-lg btn-primary" @click="createScanLease">立即租赁</button>
          </div>
          <div class="flex-item" v-if="canUseCreditRent">
            <button type="button" class="btn btn-block btn-lg btn-cyan" @click="creditRentLease">免押金租赁</button>
          </div>
        </div>
      </div>

      <!-- 选择租赁套餐 -->
      <lease-package-picker :leaseProduct="leaseProduct"
                            :leaseScenario="leaseScenario"
                            :creditRent="isCreditRent"
                            :showPicker="showPicker"
                            @onOk="onLeasePackagePicked"
                            @onCancel="onLeasePackageCancel">
      </lease-package-picker>

      <!-- 信用免押查询组件 -->
      <lease-creditrent-picker :score="leaseScenario.admittanceScore"
                               :showPicker="showCreditRentPicker"
                               @onOk="onCreditRentAccord"
                               @onCancel="onCreditRentCancel"
                               v-if="leaseScenario.supportCreditRent">
      </lease-creditrent-picker>
    </div>
  </div>
</template>

<script>
  import LeasePackagePicker from "@/pages-member/lease/lease-package-picker";
  import LeaseCreditrentPicker from "@/pages-member/lease/lease-creditrent-picker";
  import LeaseProductViewTpl from "../product/view-tpl";
  import VCheckbox from '@/components/ui/v-checkbox'
  import VPopup from '@/components/ui/v-popup'

  import types from "@/store/types";

  import leaseProductApi from "@/apis/api-lease-product";

  export default {
    name: "lease-scan-form",
    components: {
      LeasePackagePicker,
      LeaseProductViewTpl,
      LeaseCreditrentPicker,
      VPopup,
      VCheckbox
    },
    data: function(){
      return {
        showPicker: false,
        leaseProduct: {},
        leaseScenario: {},
        refundAgreement: "",

        leaseAgreement: "",
        showLeaseAgreement: false,
        agreeLeaseAgreement: true,

        showCreditRentPicker: false,
        isCreditRent: false,
        creditScore: 0
      }
    },
    computed: {
      deviceEntityId: function () {
        return this.$route.query.deviceEntityId;
      },
      deviceId: function () {
        return this.$route.query.deviceId;
      },
      leaseProductId: function () {
        return this.$route.query.leaseProductId;
      },
      canUseCreditRent: function () {
        return this.$alipay.isInAlipay() && this.leaseScenario.supportCreditRent === true;
      }
    },
    mounted(){
      console.log("leaseProductId：" + this.leaseProductId + ", deviceId: " + this.deviceId);
      this.loadLeaseProduct();
    },

    methods: {
      loadLeaseProduct: function () {
        if (this.leaseProductId === "") {
          this.$toast.warn("请传入租赁产品ID信息");
          return;
        }

        this.$loading.show();
        const that = this;
        leaseProductApi.detailInfos(this.leaseProductId, (detailInfo) => {
          that.$loading.hide();

          console.log(detailInfo);
          that.leaseProduct = detailInfo.leaseProduct;
          that.leaseScenario = detailInfo.leaseScenario;
          that.leaseAgreement = detailInfo.leaseAgreement;
          that.refundAgreement = detailInfo.refundAgreement;

          //this.showPicker = true;
        });
      },

      // 支付宝免押金租赁
      createScanLease(){
        if(this.agreeLeaseAgreement === false) {
          this.$toast.error("为保障您的权益，请先同意租赁协议");
          return;
        }
        this.showPicker = true;
      },

      // 支付宝免押金租赁
      creditRentLease(){
        if(this.agreeLeaseAgreement === false) {
          this.$toast.error("为保障您的权益，请先同意租赁协议");
          return;
        }
        this.showCreditRentPicker = true;
      },
      // 信用免押准入通过回调
      onCreditRentAccord(){
        this.showCreditRentPicker = false;
        this.isCreditRent = true;
        this.creditScore = this.leaseScenario.admittanceScore;

        // 选择租赁套餐
        this.showPicker = true;
      },
      onCreditRentCancel(){
        this.showCreditRentPicker = false;
      },

      // 租赁套餐选择事件
      onLeasePackagePicked: function (data) {
        this.showPicker = false;

        let fees = [];
        let totalAmount = 0;
        if(!this.isCreditRent && data.deviceDeposit > 0) {
          totalAmount += data.deviceDeposit;
          fees.push({
            name: "押金",
            amount: data.deviceDeposit
          })
        }
        if(data.rentalAmount > 0) {
          totalAmount += data.rentalAmount;
          fees.push({
            name: "租金",
            amount: data.rentalAmount
          })
        }

        // 转到支付界面
        const payInfo = {
          type: "scan",
          payTitle: this.leaseProduct.name,
          fees: fees,
          totalAmount: totalAmount,
          scanLeaseInfo: {
            deviceId: this.deviceId,
            deviceEntityId: this.deviceEntityId,
            rentalPackage: data.rentalPackage,
            isCreditRent: this.isCreditRent,
          }
        };
        this.$store.commit(types.appPay.setPayInfo, payInfo);
        //this.$router.replace("/app/pay");
        window.location.href = "/app/pay"
      },
      onLeasePackageCancel: function () {
        this.showPicker = false
      },
    }
  }
</script>
