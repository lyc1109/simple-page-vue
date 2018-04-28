<style scoped lang="scss" type="text/scss">
  @import "~variables";
</style>

<template>
  <v-popup title="滤芯详情" v-model="value" position="bottom" :fullScreen="true">
    <div v-if="product !== null">
      <div class="align-center padding" style="height: 120px;">
        <img :src="$filters.resizeImg(product.coverImage, 'm_fixed,h_240')" height="120px"/>
      </div>

      <div class="margin-top border-top">
        <v-cell class="cell" title="滤芯名称" :value="product.name"></v-cell>
        <v-cell class="cell" title="滤芯品牌" :value="product.bandName"></v-cell>
        <v-cell class="cell" title="安装日期" :value="$filters.formatDate(part.installedAt)"></v-cell>
        <v-cell class="cell" title="预计可用天数" :value="part.estimatedDays + '天'"></v-cell>
        <v-cell class="cell" title="剩余可用百分比" :value="part.availablePercentage + '%'"></v-cell>
      </div>

      <div class="margin-top align-center">

      </div>
    </div>

    <div style="height:50px"></div>
    <div class="page-footer flex ">
      <div class="flex-item">
        <button type="button" class="btn btn-block btn-lg btn-gray" @click="value = false">关闭</button>
      </div>
      <div class="flex-item">
        <button type="button" class="btn btn-primary btn-lg btn-block" @click="resetFilter" v-if="!canCancelResetFilter">滤芯复位</button>
        <button type="button" class="btn btn-warn btn-lg btn-block" @click="unresetFilter" v-if="canCancelResetFilter">取消重置({{cancelRestValidSec}}s)</button>
      </div>
    </div>
  </v-popup>
</template>

<script>
  import VPopup from "@/components/ui/v-popup";

  import productApi from "@/apis/api-product";
  import IotIwater from "@/assets/scripts-page/iot-iwater.js";

  export default {
    name: "v-recharge-orders",
    desc: "设备充值订单记录",
    components: {VPopup},
    props: {
      // 控制popup显示隐藏
      value: {
        type: Boolean,
        default: false
      },
      // 设备信息
      device: {
        type: Object,
        default: {}
      },
      // 设备滤芯信息
      part: {
        type: Object,
        default: {
          partProductId: ""
        }
      },
    },
    data: function () {
      return {
        product: null,

        // 是否可取消重置滤芯操作
        canCancelResetFilter: false,
        // 有效可取消重置滤芯操作倒计时
        cancelRestValidSec: 10
      }
    },
    watch: {
      value: function (newVal) {
        this.$emit("input", newVal);
        if(newVal === true) {
          this.getProductDetail();
        }
      }
    },
    /*mounted: function () {
      if(this.value === true) {
        this.getRechargeOrders();
      }
    },*/
    methods: {
      getProductDetail: function () {
        productApi.detail(this.part.partProductId)
          .then((resp) => {
            this.product = resp;
          })
      },

      resetFilter: function () {
        let isOnline = this.device.iotDevice.online || false;
        if(!isOnline) {
          this.$toast.warn("设备离线不可操作");
          return;
        }

        let filterIndex = this.part.filterIndex;
        let deviceEntityId = this.device.id;
        let that = this;
        this.$dlg.confirm("是否确定重置第"+ filterIndex +"根滤芯状态?", () => {
          IotIwater.resetFilter(deviceEntityId, filterIndex)
            .then((resp) => {
              if(resp !== null) {
                that.part = Object.assign(that.part, resp);
                that.canCancelResetFilter = true;
                that.countDownSec();
              }
            })
        })
      },

      unresetFilter: function () {
        let filterIndex = this.part.filterIndex;
        let deviceEntityId = this.device.id;
        let that = this;
        this.$dlg.confirm("是否确定取消重置滤芯操作?", () => {
          IotIwater.unresetFilter(deviceEntityId, filterIndex)
            .then((resp) => {
              if(resp !== null) {
                that.part = Object.assign(that.part, resp);
                that.canCancelResetFilter = false;
              }
            })
        })
      },

      // 可取消重置倒计时
      countDownSec: function () {
        if(this.cancelRestValidSec <= 0 || this.canCancelResetFilter === false) {
          this.cancelRestValidSec = 10;
          this.canCancelResetFilter = false;
          return;
        }

        this.cancelRestValidSec--;
        setTimeout(() => {
          this.countDownSec();
        }, 1000);
      }
    }
  }
</script>

