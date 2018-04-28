<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .cover-img{
    position: relative;
    height: rem(200px);
    @extend %bg;
    background-position: center;
  }

  .products{
    .product-item {
      margin-bottom: rem(13px);
      background: $white;
      @include border(bottom, darken($border-dark, 10%));
    }

    .product-item__name{
      width: 100%;
      font-size: $font-size-m;
      font-weight: 400;
      @extend %text-wrapper;
    }
    .product-item__desc{
      width: 100%;
      font-size: $font-size-s;
      color: $font-lighter;
      margin-top: rem(5px);
    }
    .product-item__price{
      font-size: $font-size-m;
      font-weight: 400;
      color: $orange-1;
    }
    .product-item__listPrice{
      font-size: $font-size-s;
      color: $font-lighter;
    }
  }

  .label{
    border-radius: 0;
  }
  .border-bottom{
    border-bottom: 1px solid darken($border, 10%);
  }
</style>

<template>
  <v-app-page :pageUrl="pageParams.url" :pageParams="pageParams.params" @onPageLoaded="onPageLoaded">
    <!--<div class="border-bottom margin-bottom" v-if="bulletins.length > 0">
      <v-bulletin-swiper :bulletins="bulletins"></v-bulletin-swiper>
    </div>-->

    <div class="products" v-if="products.length > 0">
      <ul>
        <li class="product-item" v-for="product in products" :key="product.id" @click="viewProduct(product)">
          <div class="cover-img bg-white" :style="{'background-image': 'url(' + $filters.resizeImg(product.primaryMedia, 'm_fixed,h_400') + ')' }">
            <!--<div class="label label-cyan" v-show="product.supportTrial">支持试用</div>-->
          </div>
          <div class="padding">
            <div class="product-item__name">{{product.name}}</div>
            <div class="product-item__desc text-wrapper-2line">{{product.sellPoint}}</div>
            <div class="flex margin-top-s">
              <div>
                <div>
                  <span class="product-item__price">{{$filters.formatCurrency(product.price/100.0)}}</span>
                  <s class="product-item__listPrice" v-show="product.listPrice > product.price">{{$filters.formatCurrency(product.listPrice/100.0)}}</s>
                </div>
                <!--<div class="margin-top-s font-s color-orange-1" v-show="product.supportTrial">
                预付款 {{$filters.formatCurrency(product.prepaidAmount/100.0)}}，试用满意后支付尾款
              </div>-->
              </div>
              <div class="flex-item"></div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div style="height: 70px;"></div>
    <div slot="fixed">
      <app-nav navId="market"></app-nav>
    </div>
  </v-app-page>
</template>

<script>
  import VAppPage from '@/components/layouts/v-app-page.vue';
  import AppNav from '@/pages-member/nav';
  import VBulletinSwiper from '@/pages-member/bulletin/v-bulletin-swiper';
  import VHelp from '@/pages-member/market/v-help';

  import storeTypes from "@/store/types";

  import App from "scripts/app";

  export default{
    name: "nav-market",
    components: {VAppPage, AppNav, VBulletinSwiper, VHelp},
    data: function () {
      return {
        bulletins: [],
        products: [],
        pageParams: {
          url: App.basehost + "/pms/product",
          params: {
            page_sort: "orderNo_desc;id_desc",
            product_type: "ICP;CP",
            sale_status: "sale;listing;trial"
          }
        }
      };
    },
    mounted(){
      this.loadBulletins();
    },
    methods: {
      loadBulletins: function () {
        this.bulletins =  [{
          id: 1,
          title: "公告一",
          coverImagePath: "/static/images/market/banner1.jpg"
        },{
          id: 2,
          title: "公告二",
          coverImagePath: "/static/images/market/banner2.jpg"
        },{
          id: 3,
          title: "公告三",
          coverImagePath: "/static/images/market/banner3.jpg"
        },{
          id: 4,
          title: "公告四",
          coverImagePath: "/static/images/market/banner4.jpg"
        }]
      },

      /**
       * 分页数据加载回调
       * @param fileList 分页数据
       */
      onPageLoaded: function (fileList) {
        this.products = fileList;
      },

      /**
       * 查看商品详情
       * @param product
       */
      viewProduct: function (product) {
        this.$store.commit(storeTypes.product.setProduct, product);
        this.$router.push(`/product/${product.id}`);
      }
    }
  };
</script>
