<template>
  <div class="padding-top-xxl align-center block-center font-light">
    <div class="inline-block">
      <mt-spinner type="double-bounce" color="#bbbec4" :size="28"></mt-spinner>
    </div>
    <p class="margin-top">正在登录授权，请稍候...</p>
  </div>
</template>

<script>
  import App from '@/assets/scripts/app';
  import MutationTypes from "@/store/types";

  import oauthApi from "@/apis/api-oauth";
  import userApi from "@/apis/api-user";

  export default{
    name: "login",
    data: function () {
      return {
        accessTokenCode: ""
      }
    },
    mounted: function () {
      // 判断是否后台登录回调处理
      if (this.hasAccessCode()) {
        this.getAccessToken();
      } else {
        // 先在后台登出系统
        this.$http.post(this.$basehost + "/logout")
          .then(() => {
            this.toLogin();
          })
          .catch(() => {
            this.toLogin();
          });
      }
    },
    methods: {
      // 判断是否有登录临时授权码
      hasAccessCode: function () {
        const accessTokenCode = this.$utils.getParamsFromUrl(window.location.href, "code");
        this.accessTokenCode = accessTokenCode;
        console.log("AccessTokenCode: " + accessTokenCode);
        return accessTokenCode !== null && accessTokenCode !== "";
      },

      // 登录处理
      toLogin: function () {
        // 清理授权信息
        this.$store.commit(MutationTypes.oauth.updateAuthToken, "");
        this.$store.commit(MutationTypes.oauth.updateCurUser, null);
        /*this.$store.commit(MutationTypes.oauth.updateCurShop, null);*/

        // 获取重定向路径
        let redirectUrl = "";
        if(this.$route.query && this.$route.query.redirect) {
          redirectUrl = this.$route.query.redirect;
        }
        if(redirectUrl === "" || redirectUrl.indexOf("shop_") === -1){
          const role = this.$store.getters[MutationTypes.oauth.getRole];
          if(role === "USER") {
            const curShop = this.$store.getters[MutationTypes.oauth.getCurShop];
            if(curShop === null) {
              redirectUrl = "/shop_n6ZR6p"; //默认测试厂商
            } else {
              redirectUrl = "/shop_" + curShop.id;
            }
          } else {
            redirectUrl = "/wos";
          }
        }
        this.$store.commit(MutationTypes.oauth.setRedirectUrl, redirectUrl);
        console.log("redirectUrl: " + redirectUrl);


        // 授权登录回调，在config个文件中配置
        const appId = App.appId;
        let accessHost = App.accessTokenHost + "/login";

        // 跳转登录授权
        let authUrl = encodeURI(App.authHost + "/oauth2/authorize?client_id=" + appId + "&redirect_uri=" + accessHost);
        window.open(authUrl, "_self");
      },

      /**
       * 获取Token
       */
      getAccessToken: function() {
        oauthApi.getToken(this.accessTokenCode)
          .then((authToken) => {
            this.$store.commit(MutationTypes.oauth.updateAuthToken, authToken);

            // 获取当前用户信息
            userApi.curUser()
              .then((user) => {
                this.$store.commit(MutationTypes.oauth.updateCurUser, user);
                this.redirect();
              })
              .catch((msg) => {
                this.$toast.error("抱歉，获取当前用户信息失败。" + msg)
              });
          })
          .catch((msg) => {
            this.$toast.error("抱歉，获取Token失败。" + msg)
          })
      },

      // 重定向到页面
      redirect: function() {
        // 从缓存中获取重定向路径
        const redirectUri = this.$store.getters[MutationTypes.oauth.getRedirectUrl];
        console.log("redirectUri：" + redirectUri);
        if (redirectUri !== "") {
          window.location.href = redirectUri;
        } else {
          window.location.href = '/';
        }
      },
    }
  }
</script>
