<!--
 * 订单详情 -- 顶部组件
 * @author  hucw
 * @created 2018-04-11
 *-->
<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .order-header {
    position: relative;
    color: $white;
    background-color: $primary;
    background-image: linear-gradient(top, #2F8CFC, #03A9F4); /* Chrome 26, Firefox 16+, IE 10+, Opera */
    background-image: -webkit-linear-gradient(top, #2F8CFC, #03A9F4); /* Chrome 10-25, iOS 5+, Safari 5.1+ */
    background-image: -moz-linear-gradient(top, #2F8CFC, #03A9F4);    /* Chrome 10-25, iOS 5+, Safari 5.1+ */
  }
  .order-header__progress{
    width: 100%;
    text-align: center;
    position: relative;
    height: rem(130px);
    align-items: normal;
    padding-top: rem(25px);

    // 中间横线
    &:before {
      content: '';
      display: inline-block;
      width: 100%;
      height: 1px;
      background: linear-gradient(left,rgba(255,255,255,.2),rgba(255,255,255,.6),#fff,rgba(255,255,255,.6),rgba(255,255,255,.2));
      position: absolute;
      top: 30%;
      left: 0;
    }

    // 白色原点
    .flex-item {
      position: relative;
      min-height: rem(40px);
      color: rgba(255, 255, 255, .6);
      font-size: 16px;

      &::before {
        display: block;
        content: "";
        width: 15px;
        height: 15px;
        margin: 15px auto;
        border-radius: 50%;
        background: rgba(255, 255, 255, .6);
        @include box-shadow(0, 0, 15px, rgba(255, 255, 255, 1));
      }
    }
    .flex-item.active{
      color: $white;
      font-size: 18px;

      &::before{
        background: rgba(255, 255, 255, .9);
      }
    }
  }

  .order-header__logs {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: rem(10px);
  }
</style>

<template>
  <div class="order-header">
      <div class="order-header__progress flex">
        <div class="flex-item" v-show="prestatus !== ''">{{prestatus}}</div>
        <div class="flex-item active">{{curstatus}}</div>
        <div class="flex-item" v-show="laststatus !== ''">{{laststatus}}</div>
      </div>

    <div class="flex order-header__logs" @click="isShowLogsPopup = true">
      <div><i class="iconfont icon-iot-tongzhi1 font-s"></i></div>
      <div class="flex-item padding-left">{{defaultLog}}</div>
      <div><i class="iconfont icon-iot-youjiantou1 font-s"></i></div>
    </div>

    <v-popup v-model="isShowLogsPopup" title="订单日志" position="bottom" :fullScreen="true">
      <div class="padding">
        <v-timeline :data="timelineData"></v-timeline>
      </div>
    </v-popup>
  </div>
</template>

<script>
  import VPopup from "@/components/ui/v-popup";
  import VTimeline from "@/components/ui/v-timeline";

  import _ from "loadash";

  export default {
    name: "v-view-header",
    components: {VPopup, VTimeline},
    props: {
      tradeorder: Object,
    },
    computed: {
      // 日志信息处理
      logs: function() {
        return this.tradeorder.logs;
      },
      defaultLog: function () {
        if (this.logs.length === 0) {
          return "暂时没有日志信息"
        }
        return this.logs[0].logContent;
      },

      // 解析时间轴数据
      timelineData: function () {
        this.calOrderStatus();

        if (this.logs.length === 0) {
          return [];
        }
        let timelineData = [];
        for(let item of this.logs){
          let content = this.$filters.formatTime(item.gmtCreated);
          content += "&nbsp;&nbsp;" + item.logContent;
          timelineData.push(content);
        }
        return timelineData
      },
    },
    data: function () {
      return {
        isShowLogsPopup: false,
        prestatus: "",
        curstatus: "",
        laststatus: ""
      }
    },
    mounted: function() {
      this.calOrderStatus();
    },
    methods: {

      // 获取部分订单状态信息，用于显示状态进度
      calOrderStatus: function(){
        this.curstatus = "";
        this.prestatus = "";
        this.laststatus = "";
        if (this.tradeorder.cancelStatus !== null) {
          this.calCancelOrderStatus();
          return;
        }
        if (this.tradeorder.defendStatus !== null) {
          this.calDefendOrderStatus();
          return;
        }

        let statusList = [{
          status: 0,
          name: "待支付"
        }, {
          status: 10,
          name: "待发货"
        }, {
          status: 20,
          name: "配送中"
        }, {
          status: 30,
          name: "待收货"
        }, {
          status: 80,
          name: "交易完成"
        }];

        const status = this.tradeorder.orderStatus;
        this.curstatus = this.tradeorder.orderStatusText;
        if (status > 0 && status < 80) {
          const idx = _.findIndex(statusList, {status: status});
          if (statusList[idx - 1]) {
            this.prestatus = statusList[idx - 1].name;
          }
          if (statusList[idx + 1]) {
            this.laststatus = statusList[idx + 1].name;
          }
        }
      },

      // 计算取消订单状态信息
      calCancelOrderStatus: function () {
        let statusList = [{
          status: 0,
          name: "取消处理中"
        }, {
          status: 10,
          name: "退款中"
        }, {
          status: 80,
          name: "取消成功"
        }];
        const cancelStatus = this.tradeorder.cancelStatus;
        this.curstatus = this.tradeorder.cancelStatusText;
        if (cancelStatus > 0 && cancelStatus < 80) {
          const idx = _.findIndex(statusList, {status: cancelStatus});
          if (statusList[idx - 1]) {
            this.prestatus = statusList[idx - 1].name;
          }
          if (statusList[idx + 1]) {
            this.laststatus = statusList[idx + 1].name;
          }
        }
      },

      // 计算退换货订单状态信息
      calDefendOrderStatus: function () {
        let statusList = [{
          status: 0,
          name: "待确认"
        }, {
          status: 10,
          name: "退货中"
        }, {
          status: 20,
          name: "待退款"
        }, {
          status: 80,
          name: "已退换货"
        }];
        const defendStatus = this.tradeorder.defendStatus;
        this.curstatus = this.tradeorder.defendStatusText;
        if (defendStatus > 0 && defendStatus < 80) {
          const idx = _.findIndex(statusList, {status: defendStatus});
          if (statusList[idx - 1]) {
            this.prestatus = statusList[idx - 1].name;
          }
          if (statusList[idx + 1]) {
            this.laststatus = statusList[idx + 1].name;
          }
        }
      }
    }
  }
</script>

