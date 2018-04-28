<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .error-page {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: center;

    .valign-center {
      height: 100%;
      flex-direction: column;
      overflow: hidden;

      .tips {
        width: auto;
        max-width: 100%;
      }
    }
  }
  .btn {
    @include border-radius(20px);
  }
  .btn-default {
    background-color: $white;
    border-color: rgba($blue-3,.35);
    color: $primary-light;
  }
</style>
<template>
  <div>
    <div class="bg-white error-page valign-center align-center">
      <div v-if="code === 404" class="valign-center">
        <img src="/static/images/error/404.png" class="tips" width="320"/>
        <div>
          <mt-button class="btn btn-default btn-sm margin-top-l margin-left-zero"
                     @click.stop="goIndex()">返回首页</mt-button>
        </div>
        <div class="flex-item"><img src="/static/images/error/footer.png" class="tips" width="320"/></div>
      </div>
      <div v-else-if="code === 500" class="valign-center">
        <img src="/static/images/error/500.png" class="tips" width="320"/>
        <div>
          <mt-button class="btn btn-default btn-sm margin-top-l margin-left-zero"
                     @click.stop="goIndex()">返回首页</mt-button>
        </div>
        <div class="flex-item">
          <img src="/static/images/error/footer.png" class="tips" width="320"/>
        </div>
      </div>
      <div v-else-if="code === 504" class="valign-center">
        <i class="iconfont icon-sad empty-icon"></i>
        <p class="font-lighter margin-top">504</p>
      </div>
    </div>
  </div>
</template>

<script>
  import types from "@/store/types";

  export default {
    name: "v-error",
    props: ['code'],
    computed: {
      redirectUri: function () {
        // 获取重定向路径
        let redirect = "";
        let name = "";
        const role = this.$store.getters[types.oauth.getRole];
        console.log(role);
        if (role === "USER") {
          const curShop = this.$store.getters[types.oauth.getCurShop];
          if(curShop !== null) {
            redirect = "/shop_" + curShop.id;
//            name = curShop.name;
          }
        } else {
          redirect = "/wos";
//          name = "工单系统";
        }
        return redirect;
      }
    },
    mounted(){
      this.$nextTick(() => {
        window.onpopstate = () => {
          this.$store.commit(types.common.setErrorCode, '');
        }
      })
    },
    methods: {
      goIndex() {
        this.$store.commit(types.common.setErrorCode, '');
        this.$router.push(this.redirectUri);
      }
    }
  }
</script>
