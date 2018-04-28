<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .block-center {
    width: 100%;
    padding: rem(20px);
  }
  .icon-sec {
    font-size: 80px;
  }
</style>

<template>
  <div class="full-height valign-center">
    <div class="align-center block-center font-light">
      <i class="fa fa-shield icon-sec"></i>
      <p class="margin-top-m font-size">为了您的账号安全，请先绑定手机号码</p>
      <hr/>

      <form class="padding-top-m align-left bind-mobile-box">
        <p>
          <v-input type="tel" name="mobile_no" label="手机号码" placeholder="请输入手机号"
                      v-model="formData.mobile_no"
                      v-validate="'required|mobile'"
                      data-vv-as="手机号码"
                      :error-msg="errors.first('mobile_no')"></v-input>
        </p>
        <p>
          <v-input type="number" name="sms_code" label="验证码" placeholder="请输入验证码"
                      v-model="formData.sms_code"
                      v-validate="'required|numeric|min:4|max:4'"
                      data-vv-as="验证码"
                      :error-msg="errors.first('sms_code')">
            <v-btn-smscode :mobile="formData.mobile_no" :disabled="!canSendCode"></v-btn-smscode>
          </v-input>
        </p>

        <div class="padding-top-l">
          <button type="button" class="btn btn-primary btn-block" :disabled="!canSubmit" @click="submit">立即绑定</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import types from "@/store/types";

  export default {
    name: "wos-bind-vendor",
    data: function() {
      return {
        formData: {
          mobile_no: "",
          sms_code: "",
        }
      };
    },
    computed: {
      canSendCode: function() {
        return !this.errors.has("mobile_no") && (this.fields.mobile_no && this.fields.mobile_no.valid);
      },
      canSubmit: function() {
        // 所有字段都已校验过且没有校验错误了
        return Object.keys(this.fields).every((key) => this.fields[key].valid) && !this.errors.any();
      },
      // 当前店铺
      curShop() {
        return this.$store.getters[types.oauth.getCurShop];
      },
    },
    methods: {
      submit: function() {
        this.$validator.validateAll()
          .then(() => {
            this.$loading.show();
            this.formData.shop_id = this.curShop && this.curShop.id;
            this.$http.post(`${this.$apihost}/ms/mobile`, this.formData)
              .then(() => {
                this.$loading.hide();

                // 更新用户手机号码
                let curUser = this.$store.state.auth.curUser;
                curUser.mobile = this.formData.mobile_no;
                this.$store.commit(types.oauth.updateCurUser, curUser);

//                this.$router.replace("/wos/index");
                window.location.href = '/wos/index';
              });
          });
      }
    },
  }
</script>
