<template>
  <div>
    <div  class="padding-top-xxl align-center block-center font-light" v-show="!isShowBindMobilePopup">
      <div class="inline-block">
        <mt-spinner type="double-bounce" color="#bbbec4" :size="28"></mt-spinner>
      </div>
      <p class="margin-top">正在登录授权，请稍候...</p>
    </div>

    <v-bind-mobile v-model="isShowBindMobilePopup" @bind-success="bindMobileSuccess"></v-bind-mobile>
  </div>
</template>

<script>
  import types from "@/store/types";
  import VBindMobile from "@/components/auth/v-bind-mobile";

  export default {
    name: "shop-index",
    components: {VBindMobile},
    data: function () {
      return {
        accessTokenCode: "",
        isShowBindMobilePopup: false
      }
    },
    mounted: function () {
      // 存储当前店铺ID与访问全路径
      const shopId = this.$route.params.shopId;
      this.$store.commit(types.oauth.setShopId, shopId);
      const redirectUrl = window.location.href;
      this.$store.commit(types.oauth.setRedirectUrl, redirectUrl);
      //console.log(this.$store.getters[types.oauth.getRedirectUrl]);
      //console.log(this.$utils.getParamsFromUrl(redirectUrl, "entry"));

      this.bindCurShop(shopId);
    },

    methods: {
      /**
       * 绑定当前店铺信息
       *
       * @param shopId   当前店铺信息
       */
      bindCurShop: function (shopId) {
        this.$http.post(`${this.$apihost}/ms/shop/shop_${shopId}`)
          .then((curShop) => {
            console.log("店铺信息已绑定：" + curShop.name + ", shop_" + curShop.id);

            // 缓存当前店铺、用户角色
            this.$store.commit(types.oauth.updateCurShop, curShop);
            this.$store.commit(types.oauth.updateRole, "USER");

            // 判断当前用户是否已绑定手机号码
            if (this.checkUsrIsBindMobile()) {
              // 已绑定重定向到页面
              this.redirectEntry();
            } else {
              this.isShowBindMobilePopup = true;
            }
          })
          .catch((e) => {
            // 不处理异常,避免不听上面未登录异常
          });
      },

      // 检测当前用户是否已绑定手机号码
      checkUsrIsBindMobile: function () {
        const curUser = this.$store.getters[types.oauth.getCurUser];
        return curUser !== null && curUser.mobile !== null && curUser.mobile !== "";
      },

      // 成功绑定手机号码回调
      bindMobileSuccess: function () {
        this.redirectEntry();
      },

      /**
       * 重定向到特定入口
       */
      redirectEntry: function() {
        // 获取重定向URL
        //let redirectUrl = this.$store.getters[types.oauth.getRedirectUrl];
        let redirectUrl = window.location.href;
        let entry = this.$utils.getParamsFromUrl(redirectUrl, "entry");

        let entryRoutes = "/home";
        let needParams = true;
        switch (entry) {
          // 个人信息
          case "profile":
            entryRoutes = "/my";
            break;

          // 我的设备
          case "devices":
            entryRoutes = "/devices";
            break;

          // 租赁中心
          case "lease":
            entryRoutes = "/lease";
            break;

          // 扫码租赁
          case "payLease":
            entryRoutes = "/lease/scan";
            needParams = false;
            break;

          // 注册绑定设备
          case "registDevice":
            entryRoutes = "/devices/choose";
            break;

          // 一键保修
          case "repair":
            entryRoutes = "/repair";
            break;

          // 一键保修
          case "tdsmap":
            entryRoutes = "/tdsmap";
            break;

          // 默认地址
          default:
            entryRoutes = "/home";
        }

        if(entry !== "" && needParams) {
          // 是否显示导航
          let nav = this.$utils.getParamsFromUrl(redirectUrl, "nav");
          entryRoutes += "?nav=" + (nav === null ? false : nav);

          // 是否显示页签
          let tab = this.$utils.getParamsFromUrl(redirectUrl, "tab");
          entryRoutes += "&tab=" + (tab === null ? false : tab);

          // 租赁场景
          if(entry === "lease") {
            let scenario = this.$utils.getParamsFromUrl(redirectUrl, "scenario");
            entryRoutes += "&scenario=" + (scenario === null ? "standard" : scenario);
          }
        }

        console.log("重定向到入口：" + entryRoutes);
        window.location.href = entryRoutes;
      }
    }
  };
</script>
