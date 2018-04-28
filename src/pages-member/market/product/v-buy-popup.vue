<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .v-bup-popup /deep/ .mint-popup{
    overflow: visible;
  }

  .buyPopup{
    position: relative;
  }
  .cover-img{
    background: $white;
    position: absolute;
    top: -37px;
    left: 15px;
    padding: 2px;
  }

  .product-infos{
    padding-top: rem(5px);
    padding-left: rem(130px);
  }

  .btn-spec{
    margin-right: rem(5px);
    margin-bottom: rem(5px);
  }
  .btn-spec.selected{
    background: $orange-1;
    color: $white;
  }
</style>

<template>
  <v-popup class="v-bup-popup" v-model="value" position="bottom" :closeOnClickModal="true">
    <div class="buyPopup">
      <img class="img-thumbnail cover-img" width="100" height="100" :src="$filters.resizeImg(product.primaryMedia, 'm_fill,h_100,w_100')"/>

      <div class="product-infos">
        <div class="flex" style="align-items: normal">
          <div class="flex-item">
            <div class="text-wrapper font-bold">{{product.name}}</div>
            <div class="margin-top-s" style="margin-left: -2px">
              <span class="font-bold color-orange-1">{{$filters.formatCurrency(product.price/100.0)}}</span>
              <s class="font-s font-light" v-show="product.listPrice > product.price" >{{$filters.formatCurrency(product.listPrice/100.0)}}</s>
              <!--<s class="font-s font-light" v-show="!product.supportTrial && product.listPrice > product.price" >{{$filters.formatCurrency(product.listPrice/100.0)}}</s>
              <span class="font-s color-orange-1 margin-left" v-show="product.supportTrial">预付款 {{$filters.formatCurrency(product.prepaidAmount/100.0)}}</span>-->
            </div>
            <div class="margin-top-s font-light font-s">
              <span v-show="selectedSpec === ''">请选择：型号</span>
              <span v-show="selectedSpec !== ''"> 已选 {{selectedSpec}} &nbsp; {{buyCount}} 件 </span>
            </div>
          </div>
          <div class="align-right padding-right-s padding-left-s" @click="value = false">
            <i class="fa fa-times-circle icon-m font-light"></i>
          </div>
        </div>

      </div>

      <div class="margin-top padding-left-m padding-top border-top">
        <p class="font-bold">规格型号</p>

        <div v-if="multiSpec">
          <button type="button" class="btn btn-sm btn-spec"
                  v-for="spec in product.productSpecDtos"
                  :key="spec.id"
                  :class="{'selected': spec.itemCode === selectedSpec }"
                  @click="selectSpec(spec.itemCode)">{{spec.itemCode}}</button>
        </div>
        <div v-if="!multiSpec">
          <button type="button" class="btn btn-sm btn-spec selected" @click="selectSpec(product.itemCode)">{{product.itemCode}}</button>
        </div>
        <!--<button type="button" class="btn btn-sm btn-spec">{{product.itemCode}}</button>-->
      </div>

      <div class="margin-top padding-left-m padding-top border-top">
        <p class="font-bold">购买数量</p>
        <div class="inline-block"><v-numcount v-model="buyCount" :max="product.maxPurchase"></v-numcount></div>
        <div class="inline-block font-s color-danger" v-show="product.maxPurchase > 0 && buyCount >= product.maxPurchase">限制最多购买{{product.maxPurchase}}件</div>
      </div>

      <div style="height: 70px;"></div>
      <div class="page-footer flex">
        <div class="flex-item" v-show="type === 'cart'"><button type="button" class="btn btn-block btn-lg btn-info" @click="addCart">加入购物车</button></div>
        <div class="flex-item"><button type="button" class="btn btn-block btn-lg btn-primary" @click="createTradeOrder">立即购买</button></div>
      </div>
    </div>
  </v-popup>
</template>

<script>
  import VPopup from "@/components/ui/v-popup";
  import VNumcount from '@/pages-member/market/v-numcount';
  import tradeApi from '@/apis/api-tradeorder'
  import storeTypes from "@/store/types";

  export default {
    name: "v-buy-popup",
    components: {VPopup, VNumcount},
    props: {
      // 用于控制显示隐藏popup
      value: Boolean,

      // 类型：buy(立即购买) | cart(购物车)
      type: {
        type: String,
        default: "buy"
      },

      // 产品信息
      product: Object,
    },
    data: function () {
      return {
        buyCount: 1,
        selectedSpecId: "",
        selectedSpec: ""
      }
    },
    computed: {
      multiSpec: function() {
        let specs = this.product.productSpecDtos;
        if (specs.length > 0) {
          this.selectedSpec = specs[0].itemCode;
        } else {
          this.selectedSpec = this.product.itemCode;
        }
        return specs.length > 0;
      }
    },
    methods: {
      selectSpec: function (spec) {
        this.selectedSpec = spec;
      },

      createTradeOrder: function () {
        let products = this.getProducts();
         this.$store.commit(storeTypes.tradeorder.setProducts, products);
        this.$router.push({
          path: "/tradeorder/create",
        });
      },

      addCart: function () {
        let product = this.getProducts()[0];
        let goodData = {
          "onTrial": false,
          "productId": product.productId,
          "productNum": product.productNum,
          "productSpecId": product.productSpecId
        };
        let that = this;
        tradeApi.addInShopCart(goodData).then((resp) => {
          that.$toast.success('加入购物车成功');
          tradeApi.getShopCartNum().then((resp) => {
            that.$bus.emit('updateCartCount', resp.count)
          }).catch((err) => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err)
        });
        this.$nextTick(function(){
          this.value = false
        })
      },

      getProducts: function () {
        return [{
          productId: this.product.id,
          productName: this.product.name,
          productSpecId: this.selectedSpecId,
          productItemCode: this.selectedSpec,
          primaryMedia: this.product.primaryMedia,
          price: this.product.price,
          prepaidAmount: this.product.prepaidAmount,
          productNum: this.buyCount,
          freight: this.product.freight,
          isOnTrial: false,
          isGift: false
        }];
      }
    },
    watch: {
      value: function (newVal) {
        this.$emit("input", newVal);
      }
    }
  }
</script>

