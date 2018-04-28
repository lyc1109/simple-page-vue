<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .block {
    background: rgba(255, 255, 255, 0.5);
    /*padding: 0 5px;*/
    margin-bottom: 15px;
  }
</style>

<template>
  <div>
    <!-- 设备基本信息 -->
    <div class="block">
      <div class="ripple" @click="editDeviceAliasName">
        <v-cell class="cell" title="设备别名" :value="device.deviceName" :isLink="true"></v-cell>
      </div>

      <v-cell class="cell" title="设备编码" :value="device.deviceId"></v-cell>
      <v-cell class="cell" title="设备类型" :value="deviceType"></v-cell>
      <v-cell class="cell" title="购买日期" :value="this.$filters.formatDate(device.purchasedDate)"></v-cell>
      <v-cell class="cell" title="安装地址">
        <div class="text-wrapper-overline" slot="value">{{deviceAddress}}</div>
      </v-cell>
    </div>

    <!-- 设备租赁信息 -->
    <div class="block" v-if="isLeaseDevice">
      <v-cell class="cell" title="租赁押金" :value="device.creditRent ? '信用免押租赁' : this.$filters.formatCurrency(device.leaseDeposit/100.0)"></v-cell>
      <v-cell class="cell" title="租赁起始日" :value="this.$filters.formatDate(device.leaseStartDate)"></v-cell>
      <v-cell class="cell" title="租赁到期日" :value="this.$filters.formatDate(device.leaseDueDate)"></v-cell>
      <v-cell class="cell" title="租赁公司" :value="device.company" v-if="!this.$filters.isNullStr(company)"></v-cell>
      <router-link :to="'/serviceorder/' + device.leaseOrderEntityId + '/view'" v-if="$filters.isNullStr(device.leaseOrderEntityId)">
        <v-cell class="cell" title="租赁订单" :value="device.orderId" :isLink="true" v-if="device"></v-cell>
      </router-link>
      <v-cell class="cell ripple" title="充值记录" :isLink="true" @click.native="isShowRechargeOrdersPopup = true"></v-cell>
    </div>

    <!-- 设备服务信息 -->
    <div class="block border-top">
      <router-link :to="'/devices/' + device.id + '/orderlist'">
        <v-cell class="cell" title="设备服务订单" :isLink="true"></v-cell>
      </router-link>
      <router-link :to="'/devices/' + device.id + '/oauth'">
        <v-cell class="cell" title="查看设备授权" :isLink="true"></v-cell>
      </router-link>
      <v-cell class="cell" title="恢复出厂设置" :isLink="true" @click.native="resetWaterDevice" v-show="isWaterDevice"></v-cell>
    </div>

    <div style="height: 50px;"></div>
    <div class="page-footer padding border-top align-right bg">
      <button type="button" class="btn btn-danger-outline btn-sm" @click="refund" v-show="isLeaseDevice">退租</button>
      <button type="button" class="btn btn-warning-outline btn-sm" @click="unbindDevice" v-show="!isLeaseDevice">解绑</button>

      <button type="button" class="btn btn-info-outline btn-sm" @click="createServiceOrder">报修</button>
      <button type="button" class="btn btn-primary-outline btn-sm" @click="recharge" v-show="isLeaseDevice">续费</button>

      <!-- 扩展动作 -->
      <div class="inline-block"><slot name="actions"></slot></div>

      <button type="button" class="btn btn-sm" @click="goBack" v-if="isShowBack">返回</button>
    </div>

    <!-- 缴费记录 -->
    <v-rechargeorder-popup v-model="isShowRechargeOrdersPopup" :deviceEntityId="device.id"></v-rechargeorder-popup>

    <!-- 商务租赁退租选择设备 -->
    <mt-popup v-model="companyRefundPopup" position="right" class="logs-recharge">
      <company-refund @cancel="companyRefundPopup = false" :lotData="companyRefundDevices"></company-refund>
    </mt-popup>
  </div>
</template>

<script>
  import CompanyRefund from "@/pages-member/devices/company-refund.vue"
  import VRechargeorderPopup from "@/pages-member/idevices/v-rechargeorders-popup";

  import storeTypes from "@/store/types";

  import userDeviceApi from "@/apis/api-userdevices";
  import waterDeviceApi from "@/apis/api-iot-waterdevices";

  export default {
    name: "v-detail",
    desc: "设备详情小组件，用于显示设备详情通用信息",
    components: {CompanyRefund, VRechargeorderPopup},
    props: {
      // 是否显示
      isShowBack: {
        type: Boolean,
        default: true
      }
    },
    data: function () {
      return {
        // 充值记录控制
        isShowRechargeOrdersPopup: false,

        // 商务租赁退租选择设备弹窗
        companyRefundPopup: false,
        companyRefundDevices: []
      }
    },
    computed: {
      userDevice: function () {
        return this.$store.getters[storeTypes.idevice.getUserDevice] || null;
      },

      device: function () {
        return this.$store.getters[storeTypes.idevice.getDevice] || {};
      },

      deviceType: function () {
        if (this.device.deviceType === "C") {
          return "普通设备";
        }

        if (this.device.iotDeviceType === "iAir") {
          return "空气净化器";
        } else if (this.device.iotDeviceType === "iWater") {
          return "智能净水器";
        } else {
          return "未知";
        }
      },

      deviceAddress: function () {
        if (this.device.address) {
          return this.device.address.fullAddress;
        }
        return "";
      },

      // 是否租赁产品
      isLeaseDevice: function () {
        return this.device.deviceType === "L";
      },
      // 是否水机类型
      isWaterDevice: function () {
        return this.device.iotDeviceType === "iWater";
      },
    },

    methods: {
      editDeviceAliasName: function () {
        if(this.userDevice === null) {
          this.$toast.show("用户设备信息为空，无法操作");
          return;
        }
        let that = this;
        this.$dlg.prompt("请填写别名", (deviceName) => {
          that.$loading.show();
          userDeviceApi.edit(that.userDevice.id, deviceName)
            .then(function (resp) {
              that.$loading.hide();
              if(resp) {
                that.device.deviceName = deviceName;
                that.$toast.success("设备别名修改成功");
              } else {
                that.$toast.error("设备别名修改失败");
              }
            })
        })
      },

      // 水机恢复出厂设置
      resetWaterDevice: function () {
        let that = this;
        that.$dlg.confirm("是否确定将设备恢复出厂设置？", function () {
          that.$loading.show();
          waterDeviceApi.executeInstruction(this.device.id, "restore")
            .then((resp) => {
              that.$loading.hide();
              if(resp === true) {
                that.$toast.success("恢复出厂设置成功");
              } else {
                that.$toast.error("恢复出厂设置失败");
              }
            })
        })
      },

      // 用户设备解绑
      unbindDevice: function () {
        let that = this;
        that.$dlg.confirm("是否确定解除绑定设备？", function () {
          that.$loading.show();
          userDeviceApi.unbind(this.userDevice.id)
            .then(() => {
              that.$loading.hide();
              that.$router.replace("/devices");
            })
        })
      },

      // 创建服务订单
      createServiceOrder: function () {
        let that = this;
        const device = this.device;
        let orderParams = {
          deviceId: device.id,
          deviceEntityId: device.id,
          deviceName: device.deviceName,
          productId: device.productId,
          productImage: device.productImage,
          itemCode: device.itemCode,
          purchasedDate: that.$filters.formatDate(device.purchasedDate),
          address: JSON.stringify(device.address)
        };
        this.$router.push({
          path: "/serviceorder/create",
          query: orderParams
        });
      },

      // 租赁充值续费
      recharge: function () {
        let device = this.device;
        if(this.$filters.isNullStr(device.company)) {
          let rechargeUrl = "/devices/" + device.id + "/recharge";
          rechargeUrl += "?leaseProductId=" + device.leaseProductId;
          rechargeUrl += "&deviceName=" + device.deviceName;
          rechargeUrl += "&leaseDueDate=" + this.$filters.formatDate(device.leaseDueDate);
          this.$router.push(encodeURI(rechargeUrl));
        } else {
          this.$toast.show("企业租赁请联系商家进行续费。");
        }
      },

      // 退租
      refund: function() {
        let that = this;
        that.$store.commit("showLoading");

        let device = this.device;
        let lotNo = device.lotNo;
        if(this.$filters.isNullStr(lotNo)) {
          let deviceEntityIds = [device.id];
          let deviceIds = [device.deviceId];
          let params = {
            isRefund: true,
            deviceId: JSON.stringify(deviceEntityIds),
            macId: JSON.stringify(deviceIds),
            orderId: device.leaseOrderEntityId || ''
          };
          this.$router.push({
            path: '/devices/refund',
            query: params
          });
        } else {
          // 商务租赁退租
          that.$http.get(`${that.$apihost}/devices/list/${lotNo}`)
            .then((res) => {
              that.companyRefundDevices = res;
              that.companyRefundPopup = true;
            })
        }
      },

      goBack: function () {
        this.$router.go(-1);
      }
    }
  }
</script>
