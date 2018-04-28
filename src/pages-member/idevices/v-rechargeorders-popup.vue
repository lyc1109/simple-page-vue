<style scoped lang="scss" type="text/scss">
  @import "~variables";
</style>

<template>
  <v-popup title="充值记录" v-model="value" position="bottom" :fullScreen="true">
    <div class="padding">
      <v-timeline :data="timelineData"></v-timeline>
    </div>

    <div style="height:50px"></div>
    <div class="page-footer">
      <button type="button" class="btn btn-gray btn-block btn-lg"></button>
    </div>
  </v-popup>
</template>

<script>
  import VPopup from "@/components/ui/v-popup";
  import VTimeline from "@/components/ui/v-timeline";

  import ideviceApi from "@/apis/api-iot-idevice";

  export default {
    name: "v-recharge-orders",
    desc: "设备充值订单记录",
    components: {VPopup, VTimeline},
    props: {
      deviceEntityId: String,
      value: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        timelineData: []
      }
    },
    watch: {
      value: function (newVal) {
        this.$emit("input", newVal);
        if(newVal === true) {
          this.getRechargeOrders();
        }
      }
    },
    mounted: function () {
      if(this.value === true) {
        this.getRechargeOrders();
      }
    },
    methods: {
      getRechargeOrders: function (){
        let that = this;
        this.timelineData = [];
        if(!this.$filters.isNullStr(this.deviceEntityId)) {
          ideviceApi.getRechargeOrders(this.deviceEntityId)
            .then((resp) => {
              console.log(resp);
              if(resp.length > 0) {
                let logContent = "";
                for(let order of resp) {
                  logContent += order.leaseProductPackageName;
                  logContent += "(" + that.$filters.formatDate(order.leaseStartDate) + "~" + that.$filters.formatDate(order.leaseEndDate) + ")";
                  logContent += "<div class='margin-top-s font-s font-lighter'>";
                  logContent += "充值时间: " + that.$filters.formatTime(order.created);
                  logContent += "</div>";
                  this.timelineData.push(logContent);
                }
              }
            })
        }
      }
    }
  }
</script>

