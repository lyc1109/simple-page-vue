<template>
  <div>
    <div class="align-center" v-if="leaseProduct !== null">
      <div class="padding-m bg-white">
        <img :src="$filters.resizeImg(leaseProduct.productCoverImg, 'm_fill,w_100,h_100')"/>
        <div class="text-title margin-top">{{deviceName}}</div>

        <div class="margin-top-m">
          设备到期日：<span class="font-bold color-danger">{{leaseDueDate}}</span>
        </div>
      </div>

      <div class="padding-m">
        <button type="button" class="btn btn-lg btn-primary btn-round padding-left-l padding-right-l" @click="showPicker = true">
          立即充值
        </button>
      </div>
    </div>

    <!-- 选择租赁套餐 -->
    <lease-package-picker :leaseProduct="leaseProduct"
                          :leaseScenario="leaseScenario"
                          :showPicker="showPicker"
                          isRecharge="true"
                          @onOk="onLeasePackagePicked"
                          @onCancel="onLeasePackageCancel"  v-if="leaseProduct !== null"></lease-package-picker>
  </div>
</template>

<script>
  import LeasePackagePicker from "@/pages-member/lease/lease-package-picker";
  import leaseProductApi from "@/apis/api-lease-product";

  import types from "@/store/types";

  export default {
    name: "device-recharge-form",
    components: {
      LeasePackagePicker
    },
    data: function(){
      return {
        showPicker: false,
        leaseProduct: null,
        leaseScenario: null,
      }
    },
    computed: {
      deviceEntityId: function () {
        return this.$route.params.deviceEntityId;
      },
      leaseProductId: function () {
        return this.$route.query.leaseProductId;
      },
      deviceName: function () {
        return this.$route.query.deviceName;
      },
      leaseDueDate: function () {
        return this.$route.query.leaseDueDate;
      }
    },
    mounted(){
      this.loadLeaseProduct();
    },
    methods: {
      loadLeaseProduct: function () {
        this.$loading.show();
        leaseProductApi.detailInfos(this.leaseProductId, (detailInfo) => {
          this.$loading.hide();
          this.leaseProduct = detailInfo.leaseProduct;
          this.leaseScenario = detailInfo.leaseScenario;

          this.showPicker = true;
        });
      },

      // 租赁套餐选择事件
      onLeasePackagePicked: function (data) {
        this.showPicker = false;

        let fees = [];
        let totalAmount = data.rentalAmount;
        if (totalAmount > 0) {
          fees.push({
            name: "租金",
            amount: totalAmount
          })
        }
        // 转到支付界面
        const payInfo = {
          type: "recharge",
          payTitle: this.deviceName,
          totalAmount: totalAmount,
          fees: fees,
          rechargeInfo: {
            deviceEntityId: this.deviceEntityId,
            leaseDueDate: this.leaseDueDate,
            rentalPackage: data.rentalPackage
          },
        };
        this.$store.commit(types.appPay.setPayInfo, payInfo);
        //this.$router.push("/app/pay");
        window.location.href = "/app/pay"
      },

      onLeasePackageCancel: function () {
        this.showPicker = false
      },
    }
  }
</script>
