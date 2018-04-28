<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .tip-btn {
    @include border-radius(20px);
  }
  .tip-btn {
    background-color: $white;
    border-color: rgba($blue-3,.35);
    a {
      color: $primary-light!important;
    }
  }
</style>

<template>
  <div class="full-height bg-white error-page valign-center align-center">
    <div class="valign-center block-center" style="flex-direction: column">
      <img src="/static/images/error/404.png" class="tips" width="320"/>

      <div class="padding-top-xxl">
        <router-link class="btn btn-link font-bold font-m margin-top-l" :to="redirectUri.path" replace>返回{{redirectUri.name}}</router-link>

        <!--<mt-button v-show="redirectUri.name !== ''" class="tip-btn btn-sm margin-top-l margin-left-zero">

        </mt-button>-->
      </div>
      <div class="flex-item">
        <img src="/static/images/error/footer.png" class="tips" width="320"/>
      </div>
    </div>
    <!--<div class="align-center block-center">-->

      <!--<img src="/static/images/404.png" class="tips"/>-->

      <!--<div class="margin-top-xl font-m" v-show="redirectUri.name !== ''">-->
        <!--<router-link :to="redirectUri.path" replace>返回{{redirectUri.name}}</router-link>-->
        <!--<div class="font-m">
          <span v-html="curShopLink"></span>
        </div>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import MutationTypes from "@/store/types";

  export default{
    name: "error-404",
    computed: {
      redirectUri: function () {
        // 获取重定向路径
        let redirect = "";
        let name = "";
        const role = this.$store.getters[MutationTypes.oauth.getRole];
        if (role === "USER") {
          const curShop = this.$store.getters[MutationTypes.oauth.getCurShop];
          if(curShop !== null) {
            redirect = "/shop_" + curShop.id;
            name = curShop.name;
          }
        } else {
          redirect = "/wos";
          name = "工单系统";
        }
        return {
          path: redirect,
          name: name
        };
      }
    }
  }
</script>
