<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .btn-smscode {
    border: none;
    @include border(left);
  }

  .btn-smscode.disabled{
    color: $font-light;
  }
  .btn-smscode.enable{
    color: $primary;
  }
</style>

<template>
  <div>
    <button type="button" class=""
            :class="{'btn btn-sm btn-default btn-smscode disabled': isDisabled, 'btn btn-sm btn-smbtn-default btn-smscode enable': !isDisabled}"
            :disabled="isDisabled"
            @click="sendSmsCode">
      {{btnSmsCodeText}}
    </button>
  </div>
</template>

<script>
  import App from "scripts/app";

  export default{
    name: "v-btn-smscode",
    props: {
      mobile: {
        type: String,
        default: ""
      },
      disabled: {
        type: Boolean,
        default: true
      }
    },
    data: function () {
      return {
        btnSmsCodeText: "验证码",
        smsSec: 60,
        smsInterval: 0
      };
    },
    methods: {
      sendSmsCode: function () {
        if (this.mobile === "") {
          this.$toast.error("手机号码不能为空哟");
          return;
        }

        // 先禁用按钮
        this.smsSec = 59;

        this.$loading.show();
        setTimeout(() => {
          this.$http.post(this.$apihost + "/sms/sendCode", {mobile: this.mobile})
            .then((respData) => {
              this.sendSuccess(respData);
            })
            .catch(() => {
              // 兼容支付宝处理
              if((/Alipay/i).test(window.navigator.userAgent)) {
                this.sendSuccess();
              } else {
                this.smsSec = 60;
              }
            });
        }, 1000)
      },

      sendSuccess: function(respData) {
        const that = this;
        if (respData && !App.isProduct) {
          that.$toast.success("验证码：" + respData);
        }
        that.startInterVal();
        that.$loading.hide();
      },

      startInterVal: function () {
        const that = this;
        that.smsInterval = setInterval(function () {
          that.smsSec--;
          that.btnSmsCodeText = that.smsSec + "s";
          if (that.smsSec <= 0) {
            that.resetInterVal();
          }
        }, 1000);
      },

      resetInterVal: function () {
        clearInterval(this.smsInterval);
        this.smsSec = 60;
        this.smsInterval = 0;
        this.btnSmsCodeText = "重新获取";
      }
    },
    computed: {
      isDisabled: function () {
        return this.disabled || this.smsSec !== 60;
      }
    }
  }
</script>
