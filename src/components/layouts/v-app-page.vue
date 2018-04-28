<!--
 * 页面容器封装（带分页处理），所有需要分页处理的页面都应该引用此组件
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
</style>

<template>
  <div class="v-app">
    <app-page ref="appPage" :url="pageUrl" :params="pageParams" @loaded="onPageLoaded">
      <v-bscroll ref="bscroll"
                 :enableScroll="true" :scrollData="pageData" :restoreScroll="true"
                 :enablePullup="true" @onPullingUp="onLoadMore">

        <!-- 分页内容列表 -->
        <slot></slot>

        <!-- 上拉加载内容 -->
        <slot name="loadmore">
          <v-spinner v-show="isLoadingMore">加载更多数据中...</v-spinner>
        </slot>

        <!-- 品智云技术支持 -->
        <v-license ref="licenseEl" :class="licenseClass"></v-license>
      </v-bscroll>
    </app-page>

    <!-- 绝对定位元素，解决启用better-scroll后容器内部绝对定位无效 -->
    <slot name="fixed"></slot>
  </div>
</template>

<script>
  import AppPage from './app-page';
  import VBscroll from "./v-bscroll";
  import VLicense from "./v-license";
  import VSpinner from '@/components/ui/v-spinner';

  export default {
    name: "v-app-page",
    desc: "页面容器封装（带分页处理），所有需要分页处理的页面都应该引用此组件",
    components: {VBscroll, AppPage, VLicense, VSpinner},
    props: {
      // [必须] 分页数据请求URL
      pageUrl: {
        type: String,
        required: true
      },
      // [可选] 请求参数,json格式
      pageParams: {
        type: Object,
        default: {}
      },
    },
    data: function () {
      return {
        // 分页列表数据
        pageData: [],
        // 是否加载更多标识
        isLoadingMore: false,
        // 技术组件额外样式
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
      }, 400)*/
    },
    methods: {
      /**
       * 分页数据加载回调
       * @param fileList 分页数据
       */
      onPageLoaded: function (fileList) {
        this.pageData = fileList;
        this.$emit("onPageLoaded", fileList);

        this.onLoadMoreFinished();
      },

      // 加载更多
      onLoadMore: function () {
        this.isLoadingMore = true;
        this.$refs.appPage.loadMore();
      },

      // 结束加载更多
      onLoadMoreFinished: function () {
        this.isLoadingMore = false;
        this.$refs.bscroll.finishedPullup();
      }
    }
  }
</script>
