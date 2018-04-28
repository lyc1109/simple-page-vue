<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .swipe {
    height: rem(170px);

    .bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.2);
      font-size: $font-size-s;
      color: $white;
      overflow: hidden;
      @extend %padding-s;

      .flex-right {
        flex: 0 0 rem(100px);
        text-align: right;
      }
    }
  }
  .lease-image-box {
    width: 100%;
    .lease-image {
      width: 100%;
      height: rem(200px);
      overflow: hidden;
      justify-content: center;
      img {
        width: auto;
        max-width: fit-content;
      }
    }
  }

  .brief {
    -webkit-box-orient: vertical;
    color: $font-light;
    font-size: $font-size-s;
  }
  .shop-nav{
    border-top: 0 none;
    border-left: 0 none;
    border-right: 0 none;
    .is-selected {
      border-bottom-color: $primary!important;
      color: $primary!important;
    }
  }
  .leases{
    .agreement {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;

      .agree {
        flex: 1;
      }
      .btn {
        position: relative;
        flex: 2;
        height: rem(52px);
      }
    }
  }
</style>

<template>
  <div class="lease-page">
    <!-- 租赁场景页签 -->
    <mt-navbar v-if="leaseScenarios.length > 0 && isShowTab" v-model="curScenario" class="shop-nav">
      <mt-tab-item v-for="item in leaseScenarios" :id="item" :key="item" @click.native="toggleTab(item)">
        {{ (item === 'standard' ? '标准' : (item === 'apartment' ? '公寓' : (item === 'commercial' ? '商务' : ''))) }}租赁
      </mt-tab-item>
    </mt-navbar>

    <app-view class="has-nav lease-main" :hasPullRefresh="true" :pullRefresh="pullRefresh">
      <app-page :url="page.url"
                :params="page.params"
                :storeMutation="page.storeMutation"
                :storeGetter="page.storeGetter"
                @loaded="onPageLoaded"
                class="lease-box bg"
                :style="{ 'padding-top': isShowTab ? '50px' : '0' }">
        <div class="ripple bg-white border-bottom padding-m"
             v-if="leaseProducts && leaseProducts.length > 0"
             v-for="item in leaseProducts"
             @click="book(item)">
          <div class="lease-image-box">
            <div class="lease-image valign-center" style="max-height: 200px;overflow: hidden">
              <img src="" v-lazy="$filters.resizeImg(item.productCoverImg, 'm_fixed,h_400')" height="200px"/>
            </div>
          </div>
          <div class="flex-item margin-top-m">
            <div class="text-title text-wrapper"> {{item.name}} </div>
            <div class="brief text-wrapper-2line margin-top-s" v-if="item.briefIntroduction">
              {{ item.briefIntroduction }}
            </div>
            <div class="flex margin-top">
              <div class="flex-item">
                <span class="color-primary font-m font-bold-500 font-l">{{ $filters.formatCurrency(item.lowestRental/100) }}</span>
                <span class="color-primary font-s">起/月</span>
              </div>
              <!--<div class="flex-item align-right">-->
              <!--<button class="btn btn-sm btn-round btn-primary" @click.stop="book(item,true)">一键预约</button>-->
              <!--</div>-->
            </div>
          </div>
        </div>
      </app-page>
    </app-view>

    <app-nav navId="lease" v-if="isShowNav"></app-nav>
  </div>
</template>

<script>
  import AppNav from '@/pages-member/nav';
  import AppPage from '@/components/layouts/app-page';
  import types from "@/store/types";
  import AppEmptyView from '@/components/layouts/app-empty-view'

  export default {
    name: "nav-lease",
    components: {
      AppNav,
      AppPage,
      AppEmptyView,
    },
    data: function () {
      return {
        // 租赁产品分页数据
        leaseProducts: [],
        // 租赁场景页签数据
        leaseScenarios: [],
        // 当前选择租赁场景
        curScenario: this.$route.query.id ? this.$route.query.id : 'standard',
        // 下拉刷新数据
        pullRefresh: {
          events: {
            topStatusFresh: this.getListData
          }
        },
      }
    },
    computed: {
      page () {
        return {
          url: this.$apihost + "/lease/products",
          params: {
            status: 0,
            page_size: 5,
            scenario: this.$route.query.scenario ? this.$route.query.scenario : 'standard',
          },
          storeMutation: types.leaseProducts.setPageData,
          storeGetter: types.leaseProducts.getPageData
        }
      },

      // 当前店铺
      curShop() {
        return this.$store.getters[types.oauth.getCurShop];
      },

      // 是否显示tab
      isShowTab() {
        let query = this.$route.query;
        let tab = query.tab ? query.tab+"" : "true";
        return tab === "true";
      },

      // 是否显示nav
      isShowNav(){
        let query = this.$route.query;
        let nav = query.nav ? query.nav+"" : "true";
        return nav === "true";
      },
    },

    beforeRouteLeave(to,from,next) {
      this.$bus.off('page-refresh');
      let position = window.scrollY;
      this.$store.commit('saveMarketPosition',position);
      next();
    },

    created() {
      this.$store.commit("hideLoading");
      this.tabFetch();
    },

    mounted() {
      this.$nextTick(() => {
        let position = this.$store.state.market_position;
        window.scroll(0, position);
      })
    },

    methods: {
      /**
       * 获取分页数据
       */
      getListData() {
        let _params = {
          status: 0,
          page_size: 5,
          scenario: this.curScenario
        };
        this.$bus.emit('page-refresh', _params);
      },

      /**
       * 拉取tab数据
       */
      tabFetch() {
        let that = this;

        // 独立入口租赁场景参数
        let query = that.$route.query;
        let scenario = query.scenario ? query.scenario : "";
        if(scenario !== "") {
          this.curScenario = scenario;
          this.leaseScenarios = [scenario];
          return;
        }

        // 从后台加载支持的租赁场景
        this.$http.get(`${this.$apihost}/lease/scenarios`)
          .then((res) => {
            let scenarios = res;
            // 店铺id为42时不显示扫码租赁
            if(that.curShop && that.curShop.id === 'a6k1z1') {
              for(let i = 0,len = res.length; i < len; i++) {
                if(res[i] === 'apartment') {
                  scenarios.splice(i, 1);
                }
              }
            }
            that.leaseScenarios = scenarios;
            that.curScenario = scenarios[0];
          })
      },
      /**
       * 页面加载后操作
       * @param fileList
       */
      onPageLoaded (fileList) {
        this.leaseProducts = fileList;
      },

      /**
       * 切换租赁场景
       *
       * @param scenario 租赁场景代码
       */
      toggleTab(scenario) {
        this.curScenario = scenario;
        this.getListData();
      },

      /**
       * 跳转至产品详情
       * @param product
       */
      book(product) {
//        let _type = '';
//        this.$http.get(`${this.$apihost}/lease/products/${product.id}/scenario`)
//          .then((res) => {
//            _type = res.leaseProcess;
////            _type = this.curScenario;
//            if(_type === 'standard') {
//              this.$router.push({
//                path: `/lease/${product.id}`,
////                query: {
////                  leaseScenes: _type,
////                  entity: product && JSON.stringify(product),
////                  leaseSet: res,
////                  isCombo: isCombo,
////                }
//              })
//            } else if(_type === 'commercial') {
//              let _params = {};
//              _params.id = this.$route.params.id;
//              _params.entity = JSON.stringify(product);
//              _params.leaseScenes = 'commercial';
//
//              this.$router.push({
//                path: `/lease/order/create`,
//                query: _params
//              })
//            } else if(_type === 'apartment') {
//              this.scanLease();
//            }
//          })
        if(product && product.id) {
          this.$utils.loctnHref(`/lease/product/${product.id}`);
//          window.location.href = `/lease/${product.id}`;
//          this.$router.push({
//            path: `/lease/${product.id}`,
//          })
        }
      },
      /**
       * 公寓租赁
       */
      scanLease() {
        let that = this;
        that.addDevices = false;

        let nav = navigator && navigator.userAgent.toLowerCase();
        if(nav && nav.match(/MicroMessenger/i) && nav.match(/MicroMessenger/i)[0] === 'micromessenger') {
          that.$wechat.deviceScan(that, types);
        } else if(nav && nav.match(/Alipay/i) && nav.match(/Alipay/i)[0] === 'alipay') {
          that.$alipay.deviceScan(that, types);
        } else {
          that.$messenger.error('请在微信或支付宝内打开此页面!');
        }
      },
    },
  };
</script>
