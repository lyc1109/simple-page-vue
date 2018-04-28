<style scoped type="text/scss" lang="scss">
  @import '~variables';
</style>

<template>
  <div>
    <div class="flex padding bg-white" v-if="leaseProduct.name">
      <div style="width: 60px;"><img :src="$filters.img(leaseProduct.productCoverImg, '!wh100')" height="60px" width="60px"/></div>
      <div class="flex-item padding-left">
        <div class="text-title text-wrapper">{{leaseProduct.name}}</div>
        <div class="margin-top-m">
          <span class="label label-primary font-s" v-if="!formData.creditRent">押金({{$filters.formatRMB(deviceDeposit)}})</span>
          <span class="label label-primary font-s" v-if="formData.creditRent">免押金租赁</span>
          <span class="label label-cyan margin-left font-s">{{leasePackageName}}({{$filters.formatRMB(rentalAmount)}})</span>
        </div>
      </div>
    </div>

    <!-- 服务商时间 -->
    <div class="margin-top clearfixed border-top bg-white">
      <tpl-form-servicetime @onChange="onServiceTimeChange" ref="serviceTimeForm"></tpl-form-servicetime>
    </div>

    <!--联系信息-->
    <div class="margin-top border-top bg-white">
      <tpl-form-contacts @onChange="onContactsChange" ref="contactsForm"></tpl-form-contacts>
    </div>

    <!--租赁协议-->
    <div class="padding-m align-center" v-show="!$filters.isNullHtml(leaseAgreement)">
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

    <div class="page-footer">
      <button class="btn btn-block btn-lg btn-primary" @click="submit">立即提交</button>
    </div>
  </div>
</template>

<script>
  import VSelector from '@/components/ui/v-selector'
  import VCheckbox from '@/components/ui/v-checkbox'
  import VDatePicker from '@/components/ui/v-date-picker'
  import VPopup from '@/components/ui/v-popup'

  import TplFormServicetime from '@/pages-member/tpl/tpl-form-servicetime';
  import TplFormContacts from '@/pages-member/tpl/tpl-form-contacts';

  import types from '@/store/types'

  import ServiceOrderApi from '@/apis/api-serviceorder';
  import SysApi from '@/apis/api-sys';

  export default {
    name: 'lease-order-form',
    components: {
      VDatePicker,
      VSelector,
      VCheckbox,
      VPopup,
      TplFormServicetime,
      TplFormContacts
    },
    data: function() {
      return {
        leaseProduct: {},
        deviceDeposit: 0,
        rentalAmount: 0,

        leaseAgreement: "",
        showLeaseAgreement: false,
        agreeLeaseAgreement: true,

        // 表单数据
        formData: {
          leaseProductId: "",
          creditRent: false,
          creditScore: 0,
          leasePackage: "",

          contactName: "",
          contactMobile: "",
          serviceDate: "",
          serviceTime: "",
          customerMemo: "",

          province: "",
          city: "",
          area: "",
          address: "",

          smsCode: ""
        }
      }
    },
    computed: {
      leasePackageName: function () {
        const rentalPackage = this.formData.leasePackage;
        if(rentalPackage === "12") {
          return "年卡";
        } else if(rentalPackage === "6") {
          return "半年卡";
        } else if(rentalPackage === "3") {
          return "季度卡";
        } else if(rentalPackage === "1") {
          return "月卡";
        } else if(rentalPackage === "0") {
          return "体验卡";
        }
        return "未知套餐";
      }
    },
    mounted(){
      // 从缓存中获取表单数据
      const leaseParams = this.$store.getters[types.leaseorder.getLeaseParams];
      this.leaseProduct = leaseParams.leaseProduct;
      if(this.leaseProduct === null || this.$filters.isUndefined(this.leaseProduct)) {
        this.$dlg.alert("租赁产品数据为空，无法处理。");
        return;
      }
      this.deviceDeposit = leaseParams.deviceDeposit;
      this.rentalAmount = leaseParams.rentalAmount;
      this.leaseAgreement = leaseParams.leaseAgreement;

      this.formData.leaseProductId = leaseParams.leaseProduct.id;
      this.formData.leasePackage = leaseParams.rentalPackage;
      if(leaseParams.creditRent) {
        this.formData.creditRent = leaseParams.creditRent;
        this.formData.creditScore = leaseParams.creditScore;
      }
    },
    methods: {
      // 监听服务时间变化
      onServiceTimeChange: function (serviceDate, serviceTime) {
        this.formData.serviceDate = serviceDate;
        this.formData.serviceTime = serviceTime;
      },

      // 监听联系信息变化
      onContactsChange: function (contactObj) {
        Object.assign(this.formData, contactObj);
      },

      // 提交租赁订单
      submit: function () {
        if(this.agreeLeaseAgreement === false) {
          this.$toast.error("为保障您的权益，请先同意租赁协议");
          return;
        }

        //console.log(JSON.stringify(this.formData));
        this.$refs.contactsForm.validate(() => {
          SysApi.validateSmsCode(this.formData.contactMobile, this.formData.smsCode)
            .then((resp) => {
              ServiceOrderApi.submitLeaseOrder(this.formData)
                .then((order) => {
                  this.toPay(order);
                })
            });
        });
      },

      // 转到支付界面
      toPay(order) {
        let fees = [];
        let totalAmount = 0;
        if(!this.formData.creditRent && this.deviceDeposit > 0) {
          totalAmount += this.deviceDeposit;
          fees.push({
            name: "押金",
            amount: this.deviceDeposit
          })
        }
        if(this.rentalAmount > 0) {
          totalAmount += this.rentalAmount;
          fees.push({
            name: "租金",
            amount: this.rentalAmount
          })
        }

        // 转到支付界面
        const payInfo = {
          type: "order",
          payTitle: order.orderId,
          totalAmount: totalAmount,
          fees: fees,
          orderInfo: {
            orderType: "leaseorder",
            orderEntityId: order.id
          }
        };
        this.$store.commit(types.appPay.setPayInfo, payInfo);
        //this.$router.replace("");
        window.location.href = "/app/pay"
      }
    }
  }
</script>
