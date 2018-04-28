<!--
 * 订单详情 -- 维权订单信息
 * @author  hucw
 * @created 2018-04-11
 *-->
<template>
  <v-popup v-model="value" :fullScreen="true" title="维权订单信息" position="bottom">
    <div class="padding">
      <div class="border bg-white margin-bottom" v-for="item in defendOrders" :key="item.id">
        <v-cell title="退换货类型" :value="item.refundApplyTypeText"></v-cell>
        <v-cell title="退换货状态" :value="item.refundApplyStatusText"></v-cell>
        <v-cell title="申请原因" :value="item.refundApplyInfo"></v-cell>

        <div v-if="item.refundAmount > 0">
          <v-cell title="退款金额" :value="$filters.formatCurrency(item.refundAmount/100.0)"></v-cell>
          <v-cell title="退款状态" :value="item.refundStatusText"></v-cell>
        </div>

        <div v-if="item.refundApplyType === 'return'">
          <v-cell title="退货方式" :value="item.returnShippingTypeText"></v-cell>
          <v-cell title="退货物流" :value="item.returnLogisticsCompany"></v-cell>
          <v-cell title="退货单号" :value="item.returnInvoiceNo"></v-cell>
        </div>
        <div v-if="item.refundApplyType === 'change'">
          <v-cell title="换货方式" :value="item.shippingTypeText"></v-cell>
          <v-cell title="换货物流" :value="item.logisticsCompany"></v-cell>
          <v-cell title="换货单号" :value="item.invoiceNo"></v-cell>
        </div>
        <v-cell title="申请时间" :value="$filters.formatTime(item.gmtCreated)" v-if="item.gmtCreated !== null"></v-cell>
        <v-cell title="处理完成时间" :value="$filters.formatTime(item.endTime)" v-if="item.endTime !== null"></v-cell>
      </div>

      <div class="padding-top align-center">
        <button type="button" class="btn btn-default-outline" @click="value = false">关闭</button>
      </div>
    </div>
  </v-popup>
</template>

<script>
  import VPopup from "@/components/ui/v-popup";

  export default {
    name: "v-view-defendorders",
    components: {VPopup},
    props: {
      // 控制popup显示隐藏
      value: {
        type: Boolean,
        default: false
      },
      // 维权订单数据
      defendOrders: {
        type: Array,
        default: []
      },
    },
    watch: {
      value: function (newVal) {
        this.$emit("input", newVal);
      }
    }
  }
</script>

