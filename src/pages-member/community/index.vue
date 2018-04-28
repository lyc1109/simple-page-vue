<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .article-item {
    /*width: 100%;*/
    background: $white;
    overflow: auto;
    &:first-child {
      margin-top: 0!important;
      .news-tag-top {
        position: absolute;
        top: 0;
        left: -5px;
        z-index: 50;
        background: #ffcc66;
        color: #fff;
        padding: 3px 8px;
        &::before {
          content: '';
          width: 0;
          height: 0;
          border-top: 5px solid rgba(#000,.5);
          border-left: 5px solid transparent;
          position: absolute;
          left: 0;
          z-index: -10;
          top: 24px;
        }
      }
    }
    .article-title {
      background: rgba(#000,.3);
      color: $white;
      @extend %text-wrapper;
      position: absolute;
      z-index: 999;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .item-box {
      width: 100%;
      padding-top: 46%;
      position: relative;
      .image-item {
        width: 100%;
        height: 100%;
        justify-content: center;
        position: absolute;
        top: 0;
        overflow: hidden;
        img {
          width: 100%;
          height: auto;
          min-height: 100%;
        }
      }
    }
  }
  .none-box {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: center;
  }
  .postBtn {
    position: fixed;
    right: 0;
    bottom: rem(80px);
    overflow: hidden;
    z-index: 999;
    height: rem(50px);
    width: rem(50px);
    background: $primary;
    justify-content: center;

    .iconfont {
      font-size: rem(25px);
    }
  }
</style>

<template>
  <div class="full-height">
    <app-view class="bg-white full-height" :hasPullRefresh="hasPullRefresh" :pullRefresh="pullRefresh">
      <app-page type="community"
                :url="page.url"
                :params="page.params"
                :storeMutation="page.storeMutation"
                :storeGetter="page.storeGetter"
                v-on:loaded="onPageLoaded">
        <div class="ripple bg article-box" id="" v-if="communityList && communityList.length > 0">
          <div class="article-item bg-white padding-m margin-top" v-for="(list, index) in communityList" @click="detail(list.id)">
            <div class="item-box">
              <div class="news-tag-top border-radius" v-if="index === 0"><span class="font-s">今日热点</span></div>
              <div class="valign-center image-item">
                <img v-lazy="$filters.img((list.coverImage ? $filters.img(list.coverImage) : ''),'@160h_385w_1e_1c')">
                <div class="article-title padding">
                  {{ list.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </app-page>
    </app-view>

    <!--发帖-->
    <!--<div class="postBtn border-radius-circle valign-center" @click.stop="post()">-->
      <!--<i class="iconfont icon-tj-copy color-white"></i>-->
    <!--</div>-->
  </div>
</template>

<script>
  import AppPage from '@/components/layouts/app-page';
  import types from "@/store/types";

  import sysApi from "@/apis/api-sys";

  export default{
    name: "shop-community",
    data: function () {
      return {
        communityList: [],
        totalElements: 0,
        pullRefresh: {
          events: {
            topMethod: this.topMethod
          }
        },
        hasPullRefresh: true
      };
    },
    created() {
      let that = this;
      this.$store.state.showLoading = false;
    },
    computed: {
      page() {
        return {
          url: this.$apihost + "/community/topic",
          params: {
            "page_size": 10,
            "view_type": 'HOT',
            "tenant_id": this.$route.params.shopId
          },
          storeMutation: this.$store.getters[types.memberCommunity.setPageData],
          storeGetter: this.$store.getters[types.memberCommunity.getPageData]
        }
      }
    },
    methods: {
      onPageLoaded: function (fileList) {
        this.$store.commit("hideLoading");
        this.communityList = fileList;
        this.totalElements = fileList.length;
        if(this.totalElements <= 0) {
          this.hasPullRefresh = false;
        }
      },
      /**
       * 下拉刷新数据
       */
      topMethod() {
        this.$bus.emit("page-refresh");
      },
      /**
       * 文章详情
       * @param id
       */
      detail(id) {
        let _id = '';

        if(id) {
          _id = id;
        }

//        this.$router.push({ path: `/community/shop_${this.$route.params.shopId}/article_${_id}/view` });
        this.$utils.loctnHref(`/community/shop_${this.$route.params.shopId}/article_${_id}/view`);
      },
      post() {
        this.$store.commit('showLoading');
//        this.$router.push({
//          path: `/community/shop_${this.$route.params.shopId}/post`
//        });
        this.$utils.loctnHref(`/community/shop_${this.$route.params.shopId}/post`);
      }
    },
    components: {
      AppPage
    }
  };
</script>
