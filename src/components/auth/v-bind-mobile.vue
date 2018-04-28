<style scoped lang="scss" type="text/scss">
  .icon-sec {
    font-size: 80px;
  }
</style>

<template>
  <v-popup :fullScreen="true" v-model="value">
    <div class="full-height padding-top-xxl">
      <div class="align-center block-center font-light">
        <i class="fa fa-shield icon-sec"></i>

        <p class="margin-top-m font-size">为了您的账号安全，请先绑定手机号码</p>

        <hr/>

        <form class="padding-m align-left bind-mobile-box">

          <v-input type="tel" name="mobile" label="手机号码" placeholder="请输入手机号"
                   v-model="formData.mobile_no"
                   v-validate="'required|mobile'"
                   data-vv-as="手机号码"
                   :error-msg="errors.first('mobile')"></v-input>

          <v-input type="number" name="smsCode" label="验证码" placeholder="请输入验证码"
                   v-model="formData.sms_code"
                   v-validate="'required|numeric|min:4|max:4'"
                   data-vv-as="验证码"
                   :error-msg="errors.first('smsCode')">
            <v-btn-smscode :mobile="formData.mobile_no" :disabled="!canSendCode"></v-btn-smscode>
          </v-input>

          <div class="padding-top-l">
            <button type="button" class="btn btn-primary btn-block" :disabled="!canSubmit" @click="submit">立即绑定</button>
          </div>
        </form>
      </div>
    </div>
  </v-popup>
</template>

<script>
  import VPopup from "@/components/ui/v-popup"
  import types from "@/store/types";

  export default {
    name: "v-bind-mobile",
    components: {VPopup},
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        formData: {
          mobile_no: "",
          sms_code: "",
          shop_id: ""
        }
      };
    },
    computed: {
      canSendCode () {
        return !this.errors.has("mobile") && (this.fields.mobile && this.fields.mobile.valid);
      },
      canSubmit () {
        // 所有字段都已校验过且没有校验错误了
        return Object.keys(this.fields).every((key) => this.fields[key].valid) && !this.errors.any();
      }
    },
    methods: {
      submit () {
        this.$validator.validateAll()
          .then(() => {
            this.$loading.show();
            this.formData.shop_id = this.$store.getters[types.oauth.getShopId];
            this.$http.post(this.$apihost + "/ms/mobile", this.formData)
              .then(() => {
                this.$loading.hide();

                // 更新用户手机号码
                let curUser = this.$store.getters[types.oauth.getCurUser];
                curUser.mobile = this.formData.mobile_no;
                this.$store.commit(types.oauth.updateCurUser, curUser);

                this.$emit("bind-success")
              });
          });
      }
    },
    watch: {
      value: function (newVal) {
        this.$emit("input", newVal);
      }
    }
  }
</script>
