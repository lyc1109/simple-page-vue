<template>
  <div>
    <span v-if="order.status==20">待确认</span>
    <span v-if="order.status==5">已拒绝</span>
    <!--<span class="color-red-1" v-if="order.status==25">已拒绝</span>-->
    <span v-if="order.status==30">待执行</span>
    <span>
      <span v-if="order.orderType === 'install'">进行中</span>
      <span v-else-if="order.status==40 && order.deviceType != 'L'">待计价</span>
      <span v-else-if="order.status==40 && order.deviceType == 'L'">进行中</span>
    </span>
    <span v-if="order.status==41">进行中</span>
    <span v-if="order.status==45">已付款</span>
    <span v-if="order.status==60">待付款</span>
    <span v-if="order.status==65">已付款，待确认</span>
    <span v-if="order.status==70">待评价</span>
    <span class="text-second font-light" v-if="order.status==80">已完成</span>
    <span v-if="order.status==85">已取消，待确认</span>
    <span class="text-second font-light" v-if="order.status==90">已取消</span>
    <span v-if="order.status==92">待退款</span>
  </div>
</template>

<script>
    export default{
        name: "tplStatus",
        props: [
            "order"
        ]
    }
</script>
