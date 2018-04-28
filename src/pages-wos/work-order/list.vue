<style scope type="text/css" lang="scss">
  @import "~variables";

  .orders.workorders {
    li {
      @extend %margin-bottom;
    }
  }
</style>

<template>
  <div class="list-container orders workorders">
    <app-view :hasFooter="false" :hasPullRefresh="true" :pullRefresh="pullRefresh">
      <app-page :url="page.url"
                :params="page.params"
                :storeMutation="page.storeMutation"
                :storeGetter="page.storeGetter"
                v-on:loaded="onPageLoaded">
          <index-order :workOrder="fileList" type="list"></index-order>
      </app-page>
    </app-view>
  </div>
</template>

<script>
  import actions from "../tpl/tpl-actions.vue"
  import status from "../tpl/tpl-status.vue"
  import AppPage from '@/components/layouts/app-page'
  import types from "@/store/types"
  import VPullRefresh from "@/components/ui/v-pull-refresh";
  import indexOrder from "../index-order.vue";

  export default {
    name: "wos-page",
    data() {
      return {
        fileList: [],
        pullRefresh: {
          events: {
            topMethod: this.topMethod
          }
        }
      }
    },
    computed: {
      page() {
        let curShop = this.$store.getters[types.oauth.getCurShop];
        return {
          url: this.$woshost + "/workorders",
          params: {
            "page_size": 3,
            "type": this.$route.params.type
          }
        }
      }
    },
    created: function () {
      this.$store.state.showLoading = true;
      let wosData = this.$store.getters[types.wos.getPageData];
      if(wosData.rating) {
        this.entity = wosData;
        this.$store.state.showLoading = false;
      } else {
        this.$http.get(this.$woshost + "/dashboard")
          .then((resp) => {
            this.$store.commit(types.wos.setPageData, resp);
            this.entity = resp;
            this.$store.state.showLoading = false;
          });
      }
    },
    methods: {
      onPageLoaded(fileList) {
        this.fileList = fileList;
      },
      topMethod() {
        this.$bus.emit('page-refresh');
      }
    },
    components: {
      actions,
      status,
      AppPage,
      indexOrder,
      VPullRefresh
    }
  }
</script>
