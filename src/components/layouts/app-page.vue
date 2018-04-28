<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .has-no-more {
    color: $font-lighter;
    text-align: center;
    @extend %padding-m;
    display: flex;

     .hr,.last-tips {
       position: relative;
       width: 100%;
       display: inline-block;
       vertical-align: middle;
       flex: 1;
    }

    .hr {
      content: '';
      display: inline-block;
      height: 1px;
      background-color: $gray-light;
      flex: 1;
      position: relative;
      top: rem(10px);
    }
  }
</style>

<template>
  <div v-infinite-scroll="loadMore"
       infinite-scroll-disabled="scrollDisabled"
       infinite-scroll-distance="10"
       infinite-scroll-immediate-check="true">

    <div v-show="totalElements > 0">
      <slot></slot>
    </div>

    <v-spinner v-show="isLoading"></v-spinner>

    <div class="has-no-more" v-show="isLastPage && totalElements > 0 && isLoading === false && totalPages > 1">
      <div class="hr margin-right-s"></div>
      <div class="last-tips">我也是有底线的</div>
      <div class="hr margin-left-s"></div>
    </div>

    <div v-if="totalElements <= 0 && isLoading === false">
      <v-empty></v-empty>
    </div>
  </div>
</template>

<script>
  import VEmpty from '@/components/ui/v-empty';
  import VSpinner from '@/components/ui/v-spinner';
  import _ from 'lodash';

  export default{
    name: "app-page",
    components: {VEmpty, VSpinner},
    props: {
      // [必须] 分页数据请求URL
      url: {
        type: String,
        required: true
      },
      // [可选] 请求参数,json格式
      params: {
        type: Object,
        default: {}
      },
      // [可选] 分页数据状态mutation
      storeMutation: {
        type: String,
        default: ""
      },
      // [可选] 分页数据状态getter
      storeGetter: {
        type: String,
        default: ""
      },
      // 分页类型，用以区别空数据页面
      type: {
        type: String,
        default: 'list'
      }
    },
    data: function () {
      return {
        totalElements: 0,
        totalPages: 0,
        fileList: [],
        curPage: 1,
        isLoading: true,
        isLastPage: false,
        newParams: {},
      }
    },
    computed: {
      scrollDisabled: function () {
        if(this.isLastPage) {
          return true;
        }
        return this.isLoading;
      },
      _params: function () {
        let _json = this.params;
        if(this.newParams && JSON.stringify(this.newParams) !== '{}') {
          _json = this.newParams;
        }
        return _json;
      }
    },
    mounted: function() {
      this.$store.commit("hideLoading");

      // 从store中恢复数据
      let pageData = this.getStore();
      if (_.isEmpty(pageData) || pageData.totalElements === 0) {
        this.loadMore();
      } else {
        this.totalElements = pageData.totalElements;
        this.totalPages = pageData.totalPages;
        this.fileList = pageData.fileList;
        this.curPage = pageData.curPage;
        this.isLastPage = pageData.isLastPage;
        this.isLoading = false;
      }

      // 监听刷新数据事件
      this.$bus.on("page-refresh", (_params) => {
        if(_params) {
          this.newParams = _params;
        }
        this.refresh();
      });
    },
    methods: {
      // 加载更多数据
      loadMore: function () {
        if (this.isLastPage || (this.totalPages > 0 && (this.curPage > this.totalPages))) {
          this.isLoading = false;
          this.isLastPage = true;
          this.$emit('loaded', this.fileList);
          return false;
        }

        this.isLoading = true;
        this._fetchData();
      },

      // 刷新数据
      refresh: function () {
        this._fetchData(true);
      },

      _fetchData: function (isRefresh = false) {
        // 设置下一页
        if(isRefresh) {
          this.curPage = 1;
        } else {
          if(this.totalElements > 0) {
            this.curPage++;
          }
        }

        // 合并请求参数
        const requestData = _.assign({
          page_no: this.curPage,
          page_size: 15,
        }, this._params);

        // 拉取分页信息
        this.$http.get(this.url, requestData)
          .then((page) => {
            this.totalElements = page.totalElements;
            this.totalPages = page.totalPages;
            this.isLastPage = this.curPage === this.totalPages;

            // 是否刷新
            if(isRefresh) {
              if(page.fileList) {
                this.fileList = page.fileList;
              } else {
                this.fileList = page;
              }
            } else {
              if(page.fileList) {
                this.fileList = this.fileList.concat(page.fileList);
              } else {
                this.fileList = page;
              }
            }

            this.isLoading = false;

            // 提交存储
            this.commitStore();
          })
          .catch(() => {
            this.isLoading = false;
          });
      },

      /**
       * 提交状态存储
       */
      commitStore: function () {
        if (this.storeMutation === "") {
          return;
        }
        this.$store.commit(this.storeMutation, {
          totalElements: this.totalElements,
          totalPages: this.totalPages,
          fileList: this.fileList,
          isLastPage: this.isLastPage,
          curPage: this.curPage
        });
      },

      /**
       * 从状态存储获取
       */
      getStore: function () {
        if (this.storeGetter === "") {
          return null;
        }
        return this.$store.getters[this.storeGetter];
      }
    },
    watch: {
      // 监听分页数据变化事件通知
      fileList(value) {
        this.$emit('loaded', value);
      }
    }
  }
</script>
