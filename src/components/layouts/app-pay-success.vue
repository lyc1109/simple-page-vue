<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .icon-iot-xiaolian{
    font-size: rem(100px);
  }

  .page-footer{
    margin: 0 auto;
    width: 210px;
    text-align: left;
    @extend %text-wrapper;
  }
</style>

<template>
  <div class="full-screen bg-white align-center">
    <div class="padding-l">
      <i class="iconfont icon-iot-xiaolian color-green-1"></i>

      <h2 class="color-green-1 margin-top-xxl">付款成功</h2>

      <h3 class="color-primary-light margin-top" v-if="memos !== ''">{{memos}}</h3>
    </div>

    <div class="margin-top-xl">
      <button type="button" class="btn btn-primary-outline btn-round" @click="redirect()">{{redirectText}}</button>
    </div>

    <div class="page-footer border-none">
      <div class="align-center margin-bottom"><h4>温馨提示</h4></div>
      <p>1、给您发送退款链接的都是骗子</p>
      <p>2、所有要您提供密码的都是耍流氓</p>
    </div>
  </div>
</template>

<script>
  import types from "@/store/types";

  // 支付成功页面可传入参数
  // memos: 备注
  // redirectText: 重定向提示
  // redirectUrl:  重定向路径
  export default {
    name: "app-pay-success",
    computed: {
      memos: function () {
        let query = this.$route.query;
        return query.memos || "";
      },

      redirectText: function () {
        let query = this.$route.query;
        let text = query.redirectText || "";
        if(text === "") {
          text = "返回首页"
        }
        return text;
      },

      redirectUrl: function () {
        let query = this.$route.query;
        let url = query.redirectUrl || "";
        if(url === "") {
          const role = this.$store.getters[types.oauth.getRole];
          if(role === "USER") {
            const curShop = this.$store.getters[types.oauth.getCurShop];
            url = "/shop_" + curShop.id;
          } else {
            url = "/wos";
          }
        }
        return url;
      }
    },

    methods: {
      redirect: function () {
        this.$router.replace(this.redirectUrl)
      }
    }
  }
</script>
