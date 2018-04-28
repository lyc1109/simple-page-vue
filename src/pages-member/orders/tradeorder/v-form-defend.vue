<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .row-title {
    font-weight: 400;
    color: $font-light;
    margin-right: rem(10px);
    width: rem(48px);
    text-align: right;
  }

  .required::after{
    content: "*";
    color: $danger;
  }
</style>

<template>
  <v-popup v-model="value" title="申请退换货" position="bottom">
    <div class="padding">
      <div class="flex setting-row">
        <div class="row-title required">类型</div>
        <div class="flex-item">
          <v-radio :options="defendTypeData" v-model="defendType"></v-radio>
        </div>
      </div>
      <div class="flex setting-row">
        <div class="row-title required">原因</div>
        <div class="flex-item padding-right">
          <textarea class="border full-width" rows="3" v-model="reason"></textarea>
        </div>
      </div>
    </div>

    <div class="padding-top-m">
      <button type="button" class="btn btn-primary btn-lg btn-block" @click="createDefendOrder">提交申请</button>
    </div>
  </v-popup>
</template>
<script>
  import VSelector from "@/components/ui/v-selector";
  import VRadio from "@/components/ui/v-radio";
  import VPopup from "@/components/ui/v-popup";

  import TradeorderApi from '@/apis/api-tradeorder';

  export default {
    name: 'v-form-defend',
    desc: '退换货申请',
    components: {VPopup, VSelector, VRadio},
    props: {
      // 用于控制显示隐藏popup
      value: Boolean,
      // 订单信息
      tradeorder: Object
    },
    data: function () {
      return {
        defendType: "refund",
        reason: "",

        defendTypeData: [{
          label: "仅退款",
          value: "refund"
        },{
          label: "退货",
          value: "return"
        },{
          label: "换货",
          value: "change"
        }]
      };
    },
    methods: {
      createDefendOrder: function () {
        if (this.$filters.isNullStr(this.reason)) {
          this.$toast.error("请填写退换货原因");
          return;
        }
        let that = this;
        this.$loading.show();
        TradeorderApi.submitReturnChange(this.tradeorder.id, this.defendType, this.reason)
          .then((resp) => {
            that.$loading.hide();
            that.value = false;
            if (resp === true) {
              that.$dlg.alert("退换货申请已提交，请耐心等待确认处理。<br/> Tips: 若是退换货，确认通过后请在本页面提交退换货的物流信息");
              that.$emit("on-defend");
            } else {
              that.$toast.error("退换货申请失败，请重新尝试")
            }
          })
          .catch((resp) => {
            that.value = false;
            that.$loading.hide();
            that.$toast.error(resp.errMsg ? resp.errMsg : "退换货申请失败，请重新尝试")
          })
      }
    },
    watch: {
      value: function (newVal) {
        this.$emit("input", newVal);
      }
    }
  }
</script>
