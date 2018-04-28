<template>
  <div>
    <div v-if="order.orderType !== 'returnDeposit' && order.paidTime && order.payType" class="bg-white orderInfo" :class="{ 'margin-top': orderFee.length > 0 }">
      <v-cell class="padding-m" v-for="item in orderFee" :key="item.subTotal" :title="item.feeDefName || item.feeTypeDesc" :value="$filters.formatCurrency(item.subTotal/100)"></v-cell>
      <v-cell v-if="orderFee.length > 0" class="add-num padding-m" title="总计" :value="$filters.formatCurrency(orderFee.totalFee/100)"></v-cell>
    </div>
    <div v-if="order.orderType === 'returnDeposit'">
      <div v-if="orderFee && orderFee.length > 0" class="form-group bg-white margin-top">
        <div class="flex padding-m padding-left-zero border-bottom" v-for="fee in orderFee">
          <div v-if="fee.memo">
            <div class="flex">
              <div class="flex-item">
                <div class="text-wrapper">
                  <span v-if="fee.feeType === 'YJ'">{{ fee.feeItemName }}</span>
                  <span v-else-if="fee.feeType === 'ZJ'">租金</span>
                </div>
              </div>
              <div class="font-s color-danger font-family-num">
                <span>{{ $filters.formatCurrency(fee.subTotal/100) }} </span>
              </div>
            </div>
            <div class="flex margin-top-s">
              <div class="flex-item font-s text-wrapper-overline font-light padding-right-m">{{ fee.memo }}</div>
            </div>
          </div>
          <div v-else class="flex">
            <div class="flex-item">
              <div class="text-wrapper-overline">
                <span v-if="fee.feeType === 'YJ'">{{ fee.feeItemName }}</span>
                <span v-else-if="fee.feeType === 'ZJ'">租金</span>
              </div>
            </div>
            <div class="font-s color-danger font-family-num">
              <span>{{ $filters.formatCurrency(fee.subTotal/100) }} </span>
            </div>
          </div>
        </div>
        <div v-if="orderFee.totalFee" class="flex padding-m padding-left-zero">
          <div class="flex-item">
            <div class="text-wrapper-overline">退款金额合计</div>
          </div>
          <div class="font-s color-danger font-family-num">
            <span>{{ $filters.formatCurrency(orderFee.totalFee/100) }} </span>
          </div>
        </div>
        <div v-if="orderFee.adjustFee !== '' && orderFee.adjustFee !== undefined && orderFee.adjustFee !== null">
          <v-cell title="调整后金额" :value="$filters.formatCurrency(orderFee.adjustFee/100)" class="padding-m padding-left-zero color-danger"></v-cell>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'order-fee',
    props: ['order','orderFee']
  }
</script>
