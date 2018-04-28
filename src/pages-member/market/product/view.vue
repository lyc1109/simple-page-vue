<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .product-swiper {
    height: rem(200px);
    overflow: hidden;
    text-align: center;
    background: $white;

    img{
      max-width: 100%;
      max-height: 100%;
    }
  }

  .product-tabs{
    position: relative;
  }
  .product-tabs-container{
    padding: rem(10px);
    overflow: auto;
  }
  .product-desc img{
    max-width: 100%;
  }

  .user-order-badge {
    position: absolute;
    top: -3px;
    right: rem(-5px);
    width: rem(15px);
    height: rem(15px);
    text-align: center;
    font-size: $font-size-s;
    color: $white;
    border-radius: rem(25px);
    background-color: $red-2;

    &.more {
      width: initial;
      height: initial;
      padding: rem(0.5px) rem(4px);
    }
  }
</style>

<template>
  <v-app :enableScroll="true" :scrollData="product" v-if="product !== null">
    <div class="bg-white border-bottom">
      <mt-swipe class="product-swiper" :auto="5000" :prevent="true" :style="swipeStyle" :showIndicators="product.medias.length > 1" v-if="product.medias.length > 0">
        <mt-swipe-item v-for="media in product.medias" :key="media">
          <div class="valign-center" style="height:200px;line-height: 200px;">
            <img class="block-center" :src="$filters.qualityImg(media, 'q_80')"/>
          </div>
        </mt-swipe-item>
      </mt-swipe>
      <div class="product-swiper" v-if="product.medias.length === 0">
        <div class="valign-center" style="height:200px;line-height: 200px;">
          <img class="block-center" :src="$filters.qualityImg('')"/>
        </div>
      </div>

      <div class="border-top padding">
        <div class="font-m font-bold-400">{{product.name}}</div>
        <div class="font-s font-light margin-top-s text-wrapper-2line">{{product.sellPoint}}</div>
        <div class="margin-top-s flex">
          <div class="flex-item">
            <span class="font-m font-bold-400 color-orange-1">{{$filters.formatCurrency(product.price/100.0)}}</span>
            <s class="font-s font-light" v-show="product.listPrice > product.price" >{{$filters.formatCurrency(product.listPrice/100.0)}}</s>
            <!--<s class="font-s font-light" v-show="!product.supportTrial && product.listPrice > product.price" >{{$filters.formatCurrency(product.listPrice/100.0)}}</s>
            <span class="font-s color-orange-1 margin-left" v-show="product.supportTrial">
              预付款 {{$filters.formatCurrency(product.prepaidAmount/100.0)}}
            </span>-->
          </div>
          <div class="flex-item align-right">
            <span class="font-s font-light">运费：{{$filters.formatCurrency(product.freight/100.0)}}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="margin-top bg-white">
      <mt-navbar class="product-tabs" :fixed="isTabFixed" v-model="curTab">
        <mt-tab-item id="tab1">图文介绍</mt-tab-item>
        <mt-tab-item id="tab2">规格参数</mt-tab-item>
        <mt-tab-item id="tab3">包装售后</mt-tab-item>
      </mt-navbar>

      <mt-tab-container class="product-tabs-container" v-model="curTab">
        <mt-tab-container-item id="tab1">
          <div class="text-wrapper-overline product-desc" ref="productDesc" v-html="productDesc">商品详情</div>
        </mt-tab-container-item>
        <mt-tab-container-item id="tab2">
          <v-cell class="border-none" title="品牌" value="品牌" align="left"></v-cell>
          <v-cell class="border-none" title="名称" :value="product.name" align="left"></v-cell>
          <v-cell class="border-none" title="型号" :value="product.itemCode" align="left"></v-cell>
          <v-cell class="border-none" title="尺寸" align="left">
            <div slot="value">{{product.length}}mm x {{product.width}}mm x {{product.height}}mm</div>
          </v-cell>
          <v-cell class="border-none" title="重量" :value="product.netWeight + 'kg'" align="left"></v-cell>
          <v-cell class="border-none" align="left"
                  v-for="item in product.productPropertyDtos"
                  :key="item.id"
                  :title="item.propertyName"
                  :value="item.propertyValue"></v-cell>
          <v-cell class="border-none" title="保修期" :value="product.warrantyPeriod + '月'" align="left"></v-cell>
        </mt-tab-container-item>
        <mt-tab-container-item id="tab3">
          <div class="margin-top-m" v-show="!$filters.isNullHtml(product.logisticsDescription)">
            <p class="font-bold">物流说明</p>
            <div class="margin-top-s" v-html="product.logisticsDescription"></div>
          </div>

          <div class="margin-top-m" v-show="!$filters.isNullHtml(product.afterSale)">
            <p class="font-bold">包装售后</p>
            <div class="margin-top-s" v-html="product.afterSale"></div>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>

    <div style="height:50px"></div>

    <!-- 绝对定位的元素必须放置在slot="fixed"内部 -->
    <div slot="fixed">
      <div class="page-footer align-center border-top">
        <div class="flex">
          <div class="padding-left">
            <a :href="'tel:' + curShop.hotline">
              <i class="iconfont icon-iot-kefu icon-default"></i>
              <div class="font-s">客服</div>
            </a>
          </div>
          <div class="padding-left" @click="goHome()">
            <i class="iconfont icon-iot-shouye-1 icon-default"></i>
            <div class="font-s">首页</div>
          </div>
          <div class="padding-left" @click="$router.push('/shopcart')">
            <div style="position: relative">
              <i class="iconfont icon-iot-shangcheng-1 icon-default"></i>
              <div class="font-s">购物车</div>

              <div v-if="cartCount > 0"
                   class="user-order-badge font-family-num"
                   :class="{ 'more': cartCount >= 10 }">{{ cartCount > 99 ? '99+' : cartCount }}</div>
            </div>
          </div>
          <div class="flex-item padding-left">
            <button type="button" class="btn btn-block btn-lg btn-cyan" @click="addCart">加入购物车</button>
          </div>
          <div class="flex-item">
            <button type="button" class="btn btn-block btn-lg btn-primary" @click="buy">立即购买</button>
          </div>
        </div>
      </div>

      <!-- 立即购买/加入购物车popup -->
      <v-buy-popup v-model="isShowBuyPopup" :type="chooseType" :product="product"></v-buy-popup>
    </div>
  </v-app>
</template>

<script>
  import VHelp from '@/pages-member/market/v-help';
  import VBuyPopup from '@/pages-member/market/product/v-buy-popup';

  import storeTypes from "@/store/types";
  import ProductApi from '@/apis/api-ms-product';
  import shopCartApi from "@/apis/api-tradeorder"

  export default {
    name: "product-view",
    desc: "商品详情页",
    components: {VHelp, VBuyPopup},
    data: function () {
      return {
        // 商品数据
        productId: this.$route.params.id,
        product: this.$store.getters[storeTypes.product.getProduct],

        // 页签处理
        curTab: "tab1",
        isTabFixed: false,

        // 购买商品popup
        isShowBuyPopup: false,
        chooseType: "buy",
        cartCount: 0
      }
    },
    computed: {
      screenWidth: function () {
        return this.$utils.getScreenWidth();
      },
      productDesc: function () {
        let desc = this.product.productDesc;
        if (this.$filters.isNullHtml(desc)) {
          return "<div class='padding-m align-center font-light'>暂无商品详情</div>";
        }

        // oss缩放图片
        const reside = "?x-oss-process=image/resize,w_" + this.screenWidth*2;
        desc = desc.replace("?oss-process", reside);
        return desc;
      },
      curShop: function () {
        return this.$store.getters[storeTypes.oauth.getCurShop];
      },
    },
    mounted: function () {
      this.loadDetail();
      this.getCartCount();
      this.watchCartCount();
    },
    methods: {
      /**
       * 获取商品详情
       */
      loadDetail: function () {
        this.$loading.show();
        ProductApi.detail(this.productId)
          .then((resp) => {
            this.product = resp;
            console.log(resp);

            setTimeout(() => {
              this.$loading.hide();

              // 删除详情图片上下间隔
              let $productDescEl = this.$refs.productDesc;
              let $imgs = $productDescEl.getElementsByTagName("img");
              if ($imgs.length > 0) {
                for(let $img of $imgs){
                  if ($img.parentElement) {
                    $img.parentElement.style.margin = 0;
                    $img.parentElement.style.padding = 0;
                    $img.parentElement.style.lineHeight = 0;
                  }
                }
              }
            }, 600);
          })
      },

      // 监听购物车更新
      watchCartCount () {
        let that = this;
        this.$bus.on('updateCartCount', (resp) => {
          that.cartCount = resp;
        })
      },

      // 获取购物车商品数量
      getCartCount () {
        let that = this;
        shopCartApi.getShopCartNum().then((resp) => {
          that.cartCount = resp.count;
        }).catch((err) => {
          console.log(err);
        });
      },

      // 加入购物车
      addCart () {
        this.chooseType = 'cart';
        this.isShowBuyPopup = true;
      },

      buy: function () {
        this.chooseType = 'buy';
        this.isShowBuyPopup = true;
      },

      /**
       * 返回首页
       */
      goHome: function () {
        const curShop = this.$store.getters[storeTypes.oauth.getCurShop];
        let redirectUrl;
        if(curShop === null) {
          redirectUrl = "/shop_n6ZR6p"; //默认测试厂商
        } else {
          redirectUrl = "/shop_" + curShop.id;
        }
        this.$router.replace(redirectUrl);
      }
    }
  }
</script>

