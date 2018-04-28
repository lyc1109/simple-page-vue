<!-- 已废弃：请统一使用v-app -->
<!-- 已废弃：请统一使用v-app -->
<!-- 已废弃：请统一使用v-app -->
<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .empty-icon {
    font-size: rem(80px);
  }
  .app-view.has-nav,
  .app-view.has-footer {
    padding-bottom: rem($footer-height + 10px);
  }
  .app-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: rem(50px);
    overflow: hidden;
    background-color: $white;

    .btn-block{
      height: rem(50px);
      border-radius: 0;
      font-size: $font-size-m;
    }
  }
</style>

<template>
  <div class="app-view" :class="{'has-footer': hasFooter}">
    <!--错误页面-->
    <v-error v-if="isError" :code="errorCode"></v-error>

    <div v-if="!isError">
      <v-spinner v-if="isLoading && !isEmpty"></v-spinner>
      <!--空页面-->
      <v-empty v-if="!isLoading && isEmpty"></v-empty>
      <!--下拉刷新-->
      <v-pull-refresh v-if="hasPullRefresh && !isLoading && !isEmpty"
                      :params="pullRefresh.params"
                      :events="pullRefresh.events">
        <slot></slot>

        <footer class="app-footer" v-if="hasFooter"><slot name="footer"></slot></footer>
      </v-pull-refresh>

      <div v-if="hasPullRefresh == false" v-show="!isLoading && !isEmpty">
        <slot></slot>

        <footer class="app-footer" v-if="hasFooter"><slot name="footer"></slot></footer>
      </div>
    </div>
  </div>
</template>

<script>
  import types from "@/store/types";
  import VSpinner from "@/components/ui/v-spinner";
  import VEmpty from "@/components/ui/v-empty";
  import VError from "@/components/ui/v-error";
  import VPullRefresh from "@/components/ui/v-pull-refresh";

  export default{
    components: {VSpinner, VEmpty, VError, VPullRefresh},
    name: "app-view",
    props: {
      hasFooter: {
        type: Boolean,
        default: false
      },
      hasPullRefresh: {
        type: Boolean,
        default: false
      },
      pullRefresh: {
        params: {},
        events: {}
      }
    },
    computed: {
      isLoading: function () {
        return this.$store.state.showLoading;
      },
      isEmpty: function () {
        return this.$store.state.showEmptyView;
      },
      errorCode: function() {
        return this.$store.getters[types.common.getErrorCode];
      },
      isError: function () {
        let _isError = false;
        if(this.errorCode === 404 || this.errorCode === 500) {
          _isError = true;
          this.$store.state.showErrorView = true;
          this.$store.state.showLoading = false;
        }
        return _isError;
      },
    }
  }
</script>
