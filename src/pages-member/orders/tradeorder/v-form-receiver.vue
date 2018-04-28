<template>
  <div>
    <v-input type="text" name="address" class="address form-field required"
             label="收货地址" placeholder="请选择收货地址"
             v-validate="'required'" :data-vv-as="'收货地址'" :error-msg="errors.first('address')"
             v-model="receiverData.fullAddress"
             readonly="true"
             @click.native="selectAddress()">
      <i class="fa fa-angle-down font-lighter"></i>
    </v-input>

    <v-input class="form-field required padding-right-m"
             v-model.trim="receiverData.receiverName"
             name="receiverName"
             label="收货人"
             placeholder="请填写收货人"
             v-validate="'required'"
             data-vv-as="收货人"
             :error-msg="errors.first('receiverName')"></v-input>

    <v-input class="form-field required"
             v-model.trim="receiverData.receiverMobile"
             type="tel"
             name="receiverMobile"
             label="联系方式"
             placeholder="请填写手机号码或电话号码"
             v-validate="'required|mobile'"
             :error-msg="errors.first('receiverMobile')"
             data-vv-as="联系方式">
    </v-input>

    <address-selector></address-selector>
  </div>
</template>
<script>
  import VSelector from '@/components/ui/v-selector'
  import VDatePicker from '@/components/ui/v-date-picker'
  import AddressSelector from '@/pages-member/shop-member/address-selector'

  import types from '@/store/types'

  import ShopMemberApi from '@/apis/api-shop-member';

  export default {
    name: 'v-form-receiver',
    desc: '收货人信息',
    components: {
      VSelector,
      VDatePicker,
      AddressSelector
    },
    data: function () {
      return {
        receiverData: {
          receiverName: "",
          receiverMobile: "",

          receiverProvince: "",
          receiverCity: "",
          receiverArea: "",
          receiverAddress: "",
          receiverZip: "",
          fullAddress: ""
        },
      }
    },
    watch: {
      receiverData: {
        deep: true,
        handler: function (){
          this.$emit("onChange", this.receiverData);
        }
      }
    },
    mounted(){
      this.$bus.on("address-selected", (addressObj) => {
        this.updateAddress(addressObj);
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
              this.updateAddress(defaultAddress);
            }
          })
      },

      // 更新地址信息
      updateAddress: function (address) {
        this.receiverData.receiverName = address.contactName;
        this.receiverData.receiverMobile = address.contactMobile;
        this.receiverData.receiverProvince = address.province;
        this.receiverData.receiverCity = address.city;
        this.receiverData.receiverArea = address.area;
        this.receiverData.receiverAddress = address.address;
        this.receiverData.receiverZip = address.zipCode;
        this.receiverData.fullAddress = address.fullAddress;
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
