<style scoped lang="scss" type="text/scss">
  @import "~variables";
</style>

<template>
  <div>
    <div v-if="leaseScenario.scenarioName">
      <lease-product-view-tpl :leaseProduct="leaseProduct" :leaseScenario="leaseScenario"
                              :leaseAgreement="leaseAgreement" :refundAgreement="refundAgreement">
      </lease-product-view-tpl>

      <div style="height: 50px;"></div>

      <div class="page-footer bg border-top">
        <div class="flex">
          <div>
            <a class="padding" :href="'tel:' + curShop.hotline">
              <i class="iconfont icon-iot-kefu"></i>
              <span style="margin-top: -2px;">客服</span>
            </a>
          </div>

          <!-- 个人租赁 -->
          <div class="flex-item" v-if="leaseScenario.scenarioCode === 'standard'">
            <button type="button" class="btn btn-block btn-lg btn-primary" @click="createLeaseOrder">立即租赁</button>
          </div>
          <!-- 扫码租赁 -->
          <div class="flex-item" v-if="leaseScenario.scenarioCode === 'apartment'">
            <button type="button" class="btn btn-block btn-lg btn-primary" @click="scanLease">扫码租赁</button>
          </div>
          <!-- 企业租赁 -->
          <div class="flex-item" v-if="leaseScenario.scenarioCode === 'commercial'">
            <button type="button" class="btn btn-block btn-lg btn-primary" @click="businessLease">租赁预约</button>
          </div>

          <!-- 芝麻信用免押金租赁  -->
          <div class="flex-item" v-if="canUseCreditRent">
            <button type="button" class="btn btn-block btn-lg btn-cyan" @click="creditRentLease">免押金租赁</button>
          </div>
        </div>
      </div>

      <!-- 选择租赁套餐 -->
      <lease-package-picker :leaseProduct="leaseProduct"
                            :leaseScenario="leaseScenario"
                            :showPicker="showLeasePackagePicker"
                            :creditRent="isCreditRent"
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
  import LeaseProductViewTpl from "./view-tpl";

  import types from "@/store/types";

  import App from "@/assets/scripts/app";
  import leaseProductApi from "@/apis/api-lease-product";
  import scanHandler from "@/assets/scripts-page/lease-scan";

  export default {
    name: "lease-product-view",
    components: {
      LeasePackagePicker,
      LeaseProductViewTpl,
      LeaseCreditrentPicker
    },
    data: function () {
      return {
        showLeasePackagePicker: false,
        leaseProduct: {},
        leaseScenario: {},
        leaseAgreement: "",
        refundAgreement: "",

        showCreditRentPicker: false,
        isCreditRent: false,
        creditScore: 0
      }
    },
    computed: {
      leaseProductId: function () {
        return this.$route.params.id;
      },
      curShop: function () {
        return this.$store.getters[types.oauth.getCurShop];
      },
      canUseCreditRent: function () {
        // 公寓扫码或企业租赁不可用
        const scenarioCode = this.leaseScenario.scenarioCode;
        if(scenarioCode === "commercial" || scenarioCode === "apartment") {
          return false;
        }
        return this.$alipay.isInAlipay() && this.leaseScenario.supportCreditRent === true;
      }
    },
    mounted() {
      console.log("leaseProductId：" + this.leaseProductId);
      this.loadLeaseProduct();
    },
    methods: {
      loadLeaseProduct: function () {
        if (this.$filters.isUndefined(this.leaseProductId)) {
          this.$toast.warn("请传入租赁产品ID信息");
          return;
        }

        this.$loading.show();
        leaseProductApi.detailInfos(this.leaseProductId, (detailInfo) => {
          this.$loading.hide();
          console.log(detailInfo);
          this.leaseProduct = detailInfo.leaseProduct;
          this.leaseScenario = detailInfo.leaseScenario;
          this.leaseAgreement = detailInfo.leaseAgreement;
          this.refundAgreement = detailInfo.refundAgreement;
        });
      },

      // 创建租赁订单
      createLeaseOrder: function () {
        this.showLeasePackagePicker = true;
      },
      // 租赁套餐选择事件
      onLeasePackagePicked: function (data) {
        this.showLeasePackagePicker = false;

        this.$store.commit(types.leaseorder.setLeaseParams, {
          leaseProduct: this.leaseProduct,
          leaseAgreement: this.leaseAgreement,

          deviceDeposit: data.deviceDeposit,
          rentalPackage: data.rentalPackage,
          rentalAmount: data.rentalAmount,

          creditRent: this.isCreditRent,
          creditScore: this.creditScore,
        });
        this.$router.push("/lease/order/create");
      },
      onLeasePackageCancel: function () {
        this.showLeasePackagePicker = false
      },

      // 扫码租赁
      scanLease() {
        const curUrl = App.accessTokenHost + "/lease/product/" + this.leaseProductId;
        if(this.$wechat.isInWechat() || this.$alipay.isInAlipay()) {
          scanHandler.scan(curUrl);
        } else {
          this.$dlg.prompt("手动输入二维码上12位设备编码", (resp) => {
            scanHandler.getDeviceQRCodeResult(resp);
          })
        }
      },

      // 企业租赁预约
      businessLease(){
        this.$store.commit(types.leaseorder.setLeaseParams, {
          leaseProduct: this.leaseProduct,
          leaseAgreement: this.leaseAgreement
        });
        this.$router.push("/lease/order/create/business");
      },

      // 支付宝免押金租赁
      creditRentLease(){
        this.showCreditRentPicker = true;
      },
      // 信用免押准入通过回调
      onCreditRentAccord() {
        this.showCreditRentPicker = false;
        this.isCreditRent = true;
        this.creditScore = this.leaseScenario.admittanceScore;
        this.createLeaseOrder();
      },
      onCreditRentCancel(){
        this.showCreditRentPicker = false;
      }
    }
  };
</script>
