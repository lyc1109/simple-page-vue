<!--
 * 页面容器封装，所有需要非分页处理页面都应该引用此组件
 * @author  hucw
 * @created 2018-04-26
 *-->
<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .v-app{
    background: $page_bg;
    min-height: 100%;
    height: 100%;

    .v-app-content{
      position: relative;
    }
  }
  .v-license{
    width: 100%;
    padding: rem(30px) 0 rem(70px) 0;
    text-align: center;
    color: $font-light;
    //font-size: rem($font-size-m);
  }
</style>

<template>
  <div class="v-app">
    <v-bscroll :enableScroll="enableScroll" :scrollData="scrollData" :restoreScroll="restoreScroll">
      <div id="appContent"><slot></slot></div>

      <!-- 品智云技术支持 -->
      <v-license ref="licenseEl" :class="licenseClass"></v-license>
    </v-bscroll>

    <!-- 绝对定位元素，解决启用better-scroll后容器内部绝对定位无效 -->
    <slot name="fixed"></slot>
  </div>
</template>

<script>
  import VBscroll from "./v-bscroll";
  import VLicense from "./v-license";

  export default {
    name: "v-app",
    desc: "所有页面最外层容器组件",
    components: {VBscroll, VLicense},
    props: {
      // 是否启用优化滚动体验，默认为false
      enableScroll: {
        type: Boolean,
        default: false
      },
      // 父组件相关数据，用于异步请求后刷新scroll确保滚动效果
      scrollData: {
        type: Object,
        default: null
      },
      // 是否记录还原滚动位置
      restoreScroll: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        licenseClass: ""
      }
    },
    mounted: function () {
      // 正文内容高度小于屏幕高度时，技术支持组件设置绝对订单
      /*setTimeout(() => {
        let screenHeight = this.$utils.getScreenHeight();
        let rect = this.$refs.licenseEl.$el.getBoundingClientRect();
        if (rect.top < screenHeight + 100) {
          this.licenseClass = "v-license-fixed"
        }
      }, 300)*/
    }
  }
</script>
