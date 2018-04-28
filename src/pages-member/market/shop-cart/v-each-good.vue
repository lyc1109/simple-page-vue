<style lang="scss" scoped>
@import "~variables";
@import "src/assets/scss/pages/shop-cart/shop-cart-view";
</style>
<style lang="scss">
#v-shop-cart-view {
  .mint-cell-swipe-buttongroup {
    display: flex;
    align-items: center;
    background-color: rgb(54,169,206);
  }
  .mint-cell-swipe-button {
    height: auto;
    line-height: inherit;
  }
}
</style>
<template>
  <div id="v-each-good">
    <v-cell-swipe :id="id" :right="[
        {
          content: '删除',
          style: { background: 'rgb(54,169,206)', color: '#fff'},
          handler: () => deleteGood(id, it.id)
        }]" v-for="(it,id) in productList" :key="id">
        <div class="each-good padding-m" >
        <div class="flexbox">
          <div class="inline-flex">
            <v-checkbox v-model="it.check" @input="judgeAllCheck"></v-checkbox>
            <img :src="$filters.resizeImg(it.images, 'm_fill,h_80,w_80')" width="80" height="80" alt="" class="img  img-thumbnail cover-img">
          </div>
          <div class="detail">
            <div class="contain">
              <div class="name margin-bottom-s text-wrapper-2line">{{it.productName}}</div>
              <div class="type margin-bottom-s text-wrapper-line">已选：{{it.productItemCode}}</div>
            </div>
            <div class="trial margin-top-s">
              <div>
                <span class="current-price">{{$filters.formatCurrency(it.price/100.0)}}</span><br>
                <span class="origin-price">原价 {{$filters.formatCurrency(it.listPrice/100.0)}}</span>
                <!-- <span class="trial-price">预付款  {{it.prepaidAmount}}</span>  -->
              </div>
              <!-- <span>试用</span>
              <v-switch :value="false"></v-switch> -->
              <v-numcount v-model="it.productNum" @input="changeNum" @listId="changeId" :listId="id"></v-numcount>
            </div>
          </div>
        </div>
      </div>
      </v-cell-swipe>
  </div>
</template>
<script>
import VCheckbox from "@/components/ui/v-checkbox";
// import VSwitch from "@/components/ui/v-switch"
import VNumcount from "../v-numcount";
import VCellSwipe from "@/components/ui/v-cell-swipe";
import shopCartApi from "@/apis/api-tradeorder"
import storeTypes from "@/store/types";

import _ from "loadash";

export default {
  components: { VCheckbox, VNumcount, VCellSwipe },
  props: {
    productList: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      allCheck: true, // 全选
      judgePass: false, //判断全选的来源
      currentId: -1
    }
  },
  methods: {
    changeId (v) {
      this.currentId = v
    },
    changeNum: _.debounce(function(productNum) {
     this.$nextTick(function(){
       this.productList[this.currentId].productNum = productNum;
       this.$store.commit(storeTypes.tradeorder.setProducts, this.productList)
       let transData = {
         "onTrial": false,
         "productId": this.productList[this.currentId].productId,
         "productNum": productNum,
         "productSpecId": this.productList[this.currentId].productSpecId
       };
       if (productNum !== 0) {
         shopCartApi.editInShopCart(this.productList[this.currentId].id, transData).then((resp) => {
          console.log(resp)
        })
       }
     })
    }, 600),

    deleteGood (index, goodid) {
      let that = this;
      this.$dlg.confirm("确定删除该商品?", function () {
        shopCartApi.deleteGood(goodid).then((resp) => {
          that.productList.splice(index, 1);
          that.$store.commit(storeTypes.tradeorder.setProducts, that.productList)
        });
      })
    },

    judgeAllCheck (val) {
      let arr = this.productList.filter(function(each){
        return each.check
      })
      if (arr.length === this.productList.length) {
        this.allCheck = true
      } else if(arr.length === 0) {
        this.judgePass = false
      } else {
        this.allCheck = false
        this.judgePass = true
      }
      let obj = {
        allCheck: this.allCheck,
        judgePass: this.judgePass
      }
      this.$emit('judgeAllCheck', obj)
    },
  }
};
</script>

