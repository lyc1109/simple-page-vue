<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .empty-icon {
    font-size: rem(80px);
  }
</style>

<template>
  <div class="full-height valign-center">
    <div class="align-center block-center font-light">
      <div v-show="!hasError">
        <div class="inline-block">
          <mt-spinner type="double-bounce" color="#bbbec4" :size="28"></mt-spinner>
        </div>
        <p class="margin-top">正在为您跳转，请稍候...</p>
      </div>

      <div v-show="hasError">
        <i class="iconfont icon-sad empty-icon"></i>
        <p class="font-lighter margin-top">{{ errMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import types from "@/store/types";

  export default{
    name: "wos",
    data: function () {
      return {
        hasError: false,
        errMsg: ""
      }
    },
    created: function () {
      let _href = location.href.split('#')[0];
      this.$store.commit(types.common.setEnterURL, _href);

      this.$store.commit(types.oauth.updateRole, "WOS");
      const curUser = this.$store.getters[types.oauth.getCurUser];
      if (curUser !== null) {
        const mobile = curUser.mobile;
        if (mobile === null || mobile === "") {
          this.$router.replace("/wos/bind/vendor");
        } else {
          this.isServiceMan();
        }
      } else {
        this.$bus.emit("oauth");
      }
    },
    methods: {
      isServiceMan() {
        this.$http.get(this.$apihost + "/user/serviceman")
          .then((result) => {
            if (result === true) {
              this.$router.replace("/wos/index");
            } else {
              this.hasError = true;
              this.errMsg = "抱歉，您还不是服务人员";
            }
          })
      }
    }
  }
</script>
