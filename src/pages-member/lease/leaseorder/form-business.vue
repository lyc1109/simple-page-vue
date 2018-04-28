<template>
  <div>
    <div class="flex padding bg-white" v-if="leaseProduct.name">
      <div><img :src="$filters.img(leaseProduct.productCoverImg, '!wh100')" height="60px" width="60px"/></div>
      <div class="flex-item padding-left">
        <div class="text-title text-wrapper">{{leaseProduct.name}}</div>
        <div class="margin-top-m">
          <span class="label label-primary font-s">型号: {{leaseProduct.productItemCode}}</span>
        </div>
      </div>
    </div>

    <div class="margin-top clearfixed border-top bg-white">
      <v-input class="form-field required padding-right-m"
               v-model.trim="formData.leaseCompany"
               name="leaseCompany"
               label="公司名称"
               placeholder="请填写公司名称"
               v-validate="'required'"
               data-vv-as="公司名称"
               :error-msg="errors.first('leaseCompany')"></v-input>
      <v-input class="form-field required padding-right-m"
               type="number"
               name="leaseCount"
               label="租赁数量"
               placeholder="请租赁数量"
               v-model.trim="formData.leaseCount"
               v-validate="'required|numeric|min_value: 1'"
               data-vv-as="租赁数量"
               :error-msg="errors.first('leaseCount')"></v-input>
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

    <!-- 服务商时间，租赁预约隐藏 -->
    <div class="hidden">
      <tpl-form-servicetime @onChange="onServiceTimeChange" ref="serviceTimeForm"></tpl-form-servicetime>
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

        leaseAgreement: "",
        showLeaseAgreement: false,
        agreeLeaseAgreement: true,

        // 表单数据
        formData: {
          leaseProductId: "",
          leaseCount: 10,
          leaseCompany: "",

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
    mounted(){
      // 从缓存中获取表单数据
      const leaseParams = this.$store.getters[types.leaseorder.getLeaseParams];
      this.leaseProduct = leaseParams.leaseProduct;
      if(this.leaseProduct === null || this.$filters.isUndefined(this.leaseProduct)) {
        this.$dlg.alert("租赁产品数据为空，无法处理。");
        return;
      }
      this.leaseAgreement = leaseParams.leaseAgreement;
      this.formData.leaseProductId = this.leaseProduct.id;
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

        this.$validator.validateAll()
          .then(() => {
            this.$refs.contactsForm.validate(() => {
              SysApi.validateSmsCode(this.formData.contactMobile, this.formData.smsCode)
                .then((resp) => {
                  ServiceOrderApi.submitLeaseBusinessOrder(this.formData)
                    .then((order) => {
                      this.$router.replace("/serviceorder/"+ order.id +"/view");
                    })
                });
            });
          })
      }
    }
  }
</script>
