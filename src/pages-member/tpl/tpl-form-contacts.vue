<template>
  <div>
    <v-input class="contact-name form-field required padding-right-m"
             v-model.trim="contactData.contactName"
             name="contactName"
             label="联系人"
             placeholder="请填写联系人"
             v-validate="'required'"
             data-vv-as="联系人"
             :error-msg="errors.first('contactName')"></v-input>

    <v-input type="text" name="address" class="address form-field required"
             label="联系地址" placeholder="请选择联系地址"
             v-validate="'required'" :data-vv-as="'联系地址'" :error-msg="errors.first('address')"
             v-model="contactData.fullAddress"
             readonly="true"
             @click.native="selectAddress()">
      <i class="fa fa-angle-down font-lighter"></i>
    </v-input>

    <v-input class="contactMobile form-field required"
             v-model.trim="contactData.contactMobile"
             name="contactMobile"
             label="手机号码"
             placeholder="请填写手机号码"
             v-validate="'required|mobile'"
             :error-msg="errors.first('contactMobile')"
             data-vv-as="手机号码">
      <v-btn-smscode :mobile="contactData.contactMobile" :disabled="!isSendCode"></v-btn-smscode>
    </v-input>
    <v-input class="sms-code form-field required padding-right-m"
             type="number"
             name="smsCode"
             label="验证码"
             placeholder="请填写验证码"
             v-model.trim="contactData.smsCode"
             v-validate="'required|numeric|max: 4|min: 4'"
             data-vv-as="验证码"
             :error-msg="errors.first('smsCode')"></v-input>
    <address-selector></address-selector>
  </div>
</template>
<script>
  import VSelector from '@/components/ui/v-selector'
  import VDatePicker from '@/components/ui/v-date-picker'
  import AddressSelector from '@/pages-member/shop-member/address-selector'

  import types from '@/store/types'

  import ShopMemberApi from '@/apis/api-shop-member';
  import OrderUtils from '@/assets/scripts-page/order-utils'

  export default {
    name: 'tpl-form-contacts',
    components: {
      VSelector,
      VDatePicker,
      AddressSelector
    },
    data: function () {
      return {
        fullAddress: "",

        contactData: {
          contactName: "",
          contactMobile: "",

          province: "",
          city: "",
          area: "",
          address: "",
          fullAddress: "",

          smsCode: ""
        },
      }
    },
    computed: {
      serviceTimeData: function () {
        const data = {
          startDate: OrderUtils.getServiceStartDate(),
          endDate: OrderUtils.getServiceEndDate(),
          times: OrderUtils.getServiceDate()
        };
        this.serviceDate = this.$filters.formatDate(data.startDate);
        this.serviceTime = data.times[0];
        return data;
      },

      isSendCode() {
        return !this.errors.has('contactMobile') && (this.fields.contactMobile && this.fields.contactMobile.valid)
      }
    },
    watch: {
      contactData: {
        deep: true,
        handler: function (){
          this.$emit("onChange", this.contactData);
        }
      }
    },
    mounted(){
      this.$bus.on("address-selected", (addressObj) => {
        Object.assign(this.contactData, addressObj);
        this.fullAddress = addressObj.fullAddress;
      });
      this.loadDefaultAddress();
    },
    methods: {
      selectAddress: function () {
        this.$store.commit(types.shopMember.setShowAddressSelector, true);
      },

      loadDefaultAddress: function () {
        ShopMemberApi.findDefaultAddress()
          .then((defaultAddress) => {
            if(defaultAddress !== null) {
              Object.assign(this.contactData, defaultAddress);
              this.fullAddress = defaultAddress.fullAddress;
            }
          })
      },

      validate: function (callbackFn) {
        this.$validator.validateAll()
          .then((result) => {
            if(result === true) {
              callbackFn && callbackFn(this);
            }
          })
      }
    }
  }
</script>
