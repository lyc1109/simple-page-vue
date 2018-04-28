<style lang="scss" scoped>
  @import "~variables";
  @import "src/assets/scss/pages/shop-cart/shop-cart-view";
</style>
<style lang="scss">
  @import "~variables";
  #v-shop-cart-view{
    .mint-cell-swipe-buttongroup{
      display: flex;
      align-items: center;
      background-color: $primary;
    }
    .mint-cell-swipe-button{
      height: auto;
      line-height: inherit;
    }
  }
</style>

<template>
  <v-app>
    <div id="v-shop-cart-view">
      <div class="no_product align-center margin-l" v-show="productList.length === 0">
        <i class="fa fa-shopping-cart"></i>
        <span class="padding-left-l ">购物车是空的</span>
      </div>
      <v-each-good :productList="productList" @judgeAllCheck="judgeAllCheck"></v-each-good>

      <footer class="page-footer">
        <div class="calculate">
          <div class="calc-left">
            <v-checkbox v-model="allCheck" @input="allClick"></v-checkbox>
            <span>全选</span>
          </div>
          <div class="calc-right margin-right-m">
            <span class="font">合计: </span>
            <span class="num">{{$filters.formatCurrency(totalMoney/100.0)}}</span>
          </div>
        </div>
        <div class="calc-btn btn btn-block btn-lg btn-primary" @click="createTradeOrder">去结算</div>
      </footer>
    </div>
  </v-app>
</template>
<script>
import VCheckbox from "@/components/ui/v-checkbox"
// import VSwitch from "@/components/ui/v-switch"
import VNumcount from "../v-numcount"
import VCellSwipe from "@/components/ui/v-cell-swipe"
import shopCartApi from "@/apis/api-tradeorder"
import VEachGood from "./v-each-good"
import storeTypes from "@/store/types";

export default {
  components: {VCheckbox, VNumcount, VCellSwipe, VEachGood},
  watch: {
    value: function (newVal) {
      this.$emit("input", newVal);
    }
  },
  data () {
    return {
      productList: [],
      allCheck: true, // 全选
      judgePass: false //判断全选的来源
    }
  },
  computed: {
    totalMoney() {
      let count = 0;
      for(let item of this.productList){
        count += item.price * item.productNum;
      }
      return count
    }
  },
  created () {
    this.$loading.show();
    let that = this;
    shopCartApi.getShopCart().then((resp) => {
      resp.fileList.map((each) => {
        each.check = true
      });
      this.productList = resp.fileList;
      that.$loading.hide()
    }).catch((err) => {
      console.log(err);
      that.$loading.hide()
    })
  },
  methods: {
    createTradeOrder () {
      let products = [];
      for(let item of this.productList) {
        if (item.check && item.check === true) {
          products.push({
            productId: item.productId,
            productName: item.productName,
            productSpecId: item.productSpecId,
            productItemCode: item.productItemCode,
            primaryMedia: item.images,
            price: item.price,
            prepaidAmount: item.prepaidAmount,
            productNum: item.productNum,
            freight: item.freight,
            isOnTrial: false,
            isGift: false
          });
        }
      }
      if (products.length === 0) {
        this.$toast.warn('请选择至少一件商品结算');
        return
      }

      this.$store.commit(storeTypes.tradeorder.setProducts, products);
      this.$router.push({
        path: "/tradeorder/create",
      });
    },
    judgeAllCheck (val) {
      this.judgePass = val.judgePass;
      if(this.judgePass) {
        this.allCheck = val.allCheck;
      }
    },
    allClick (newVal) {
      if (this.judgePass) {
        this.judgePass = false;
        return
      }
      this.productList.map((each) => {
        each.check = newVal
      })
    },
  }
}
</script>
