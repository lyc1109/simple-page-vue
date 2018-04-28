<template>
  <div>
    <div class="padding-m" v-if="!isProduct">

      <div class="padding bg-white">
        <h4>注册设备</h4>
        <div class="form-group margin-top margin-bottom">
          <v-input type="text" class="form-field required" name="deviceId" label="设备编码" placeholder="12位设备编码"
                   v-model.trim="deviceId"
                   v-validate="'required'"
                   data-vv-as="设备编码"
                   :error-msg="errors.first('deviceId')">
          </v-input>
        </div>
        <button class="btn btn-success btn-block" @click="registerDevice()">注册设备</button>
      </div>

      <div class="padding-top-l border-bottom margin-bottom-l" style="border-color: #fff;"></div>

      <div class="padding bg-white">
        <h4>模拟个人租赁</h4>
        <div class="form-group margin-top margin-bottom">
          <v-input type="text" class="form-field required" name="leaseProductId" label="租赁产品ID" placeholder="租赁产品ID(混淆后)"
                   v-model.trim="leaseProductId"
                   v-validate="'required'"
                   data-vv-as="设备编码"
                   :error-msg="errors.first('leaseProductId')">
          </v-input>
          <v-input type="text" class="form-field required" name="leasePackage" label="充值套餐" placeholder="充值套餐(0, 1, 3, 6, 12)"
                   v-model.trim="leasePackage"
                   v-validate="'required'"
                   data-vv-as="充值套餐"
                   :error-msg="errors.first('leasePackage')">
          </v-input>
        </div>
        <button class="btn btn-primary btn-block" @click="submitLeaseOrder()">提交租赁订单</button>
      </div>

      <div class="margin-top-m padding bg-white">
        <h4>激活个人租赁设备</h4>
        <div class="form-group margin-top margin-bottom">
          <v-input type="text" class="form-field required" name="deviceId" label="设备编码" placeholder="12位设备编码"
                   v-model.trim="deviceId"
                   v-validate="'required'"
                   data-vv-as="设备编码"
                   :error-msg="errors.first('deviceId')">
          </v-input>
          <v-input type="text" class="form-field required" name="activeCode" label="激活码" placeholder="租赁订单6位激活码"
                   v-model.trim="activeCode"
                   v-validate="'required'"
                   data-vv-as="激活码"
                   :error-msg="errors.first('activeCode')">
          </v-input>
        </div>
        <button class="btn btn-primary btn-block" @click="activeStandardDevice()">激活设备</button>
      </div>

      <div class="padding-top-l border-bottom margin-bottom-l" style="border-color: #fff;"></div>

      <div class="margin-top-m padding bg-white">
        <h4>模拟扫码租赁</h4>
        <div class="form-group margin-top margin-bottom">
          <v-input type="text" class="form-field required" name="deviceId" label="设备编码" placeholder="12位设备编码"
                   v-model.trim="deviceId"
                   v-validate="'required'"
                   data-vv-as="设备编码"
                   :error-msg="errors.first('deviceId')">
          </v-input>
          <v-input type="text" class="form-field required" name="leasePackage" label="充值套餐" placeholder="充值套餐(0, 1, 3, 6, 12)"
                   v-model.trim="leasePackage"
                   v-validate="'required'"
                   data-vv-as="充值套餐"
                   :error-msg="errors.first('leasePackage')">
          </v-input>
        </div>
        <button class="btn btn-info btn-block" @click="scanActiveDevice()">扫码租赁</button>
      </div>

      <div class="padding-top-l border-bottom margin-bottom-l" style="border-color: #fff;"></div>

      <div class="margin-top-m padding bg-white">
        <h4>模拟租赁设备充值</h4>
        <div class="form-group margin-top margin-bottom">
          <v-input type="text" class="form-field required" name="deviceId" label="设备编码" placeholder="12位设备编码"
                   v-model.trim="deviceId"
                   v-validate="'required'"
                   data-vv-as="设备编码"
                   :error-msg="errors.first('deviceId')">
          </v-input>
          <v-input type="text" class="form-field required" name="leasePackage" label="充值套餐" placeholder="充值套餐(0, 1, 3, 6, 12)"
                   v-model.trim="leasePackage"
                   v-validate="'required'"
                   data-vv-as="充值套餐"
                   :error-msg="errors.first('leasePackage')">
          </v-input>
        </div>
        <button class="btn btn-warn btn-block" @click="rechargeDevice()">设备充值</button>
      </div>

      <div class="margin-top-m padding bg-white">
        <h4>模拟订单支付</h4>
        <div class="form-group margin-top margin-bottom">
          <v-input type="text" class="form-field required" name="orderId" label="订单id" placeholder="订单id（混淆后）"
                   v-model.trim="orderId"
                   v-validate="'required'"
                   data-vv-as="订单id"
                   :error-msg="errors.first('orderId')">
          </v-input>
        </div>
        <button class="btn btn-warn btn-block" @click="payOrder()">订单支付</button>
      </div>

      <div class="padding-top-l border-bottom margin-bottom-l" style="border-color: #fff;"></div>

      <div class="margin-top-m padding bg-white">
        <h4>工单添加设备</h4>
        <div class="form-group margin-top margin-bottom">
          <v-input type="text" class="form-field required" name="deviceId" label="设备编码" placeholder="12位设备编码"
                   v-model.trim="deviceId"
                   v-validate="'required'"
                   data-vv-as="设备编码"
                   :error-msg="errors.first('deviceId')">
          </v-input>
          <v-input type="text" class="form-field required" name="workOrderId" label="工单id" placeholder="工单id（混淆后）"
                   v-model.trim="workOrderId"
                   v-validate="'required'"
                   data-vv-as="工单id"
                   :error-msg="errors.first('workOrderId')">
          </v-input>
        </div>
        <button class="btn btn-info btn-block" @click="addDevice()">工单添加设备</button>
      </div>

      <div class="padding-top-l border-bottom margin-bottom-l" style="border-color: #fff;"></div>

      <div class="margin-top-m padding bg-white">
        <h4>模拟销售订单支付</h4>
        <div class="form-group margin-top margin-bottom">
          <v-input type="text" class="form-field required" name="orderId" label="订单id" placeholder="订单id（混淆后）"
                   v-model.trim="orderId"
                   v-validate="'required'"
                   data-vv-as="订单id"
                   :error-msg="errors.first('orderId')">
          </v-input>
        </div>
        <button class="btn btn-cyan btn-block" @click="payTradeOrder()">模拟支付</button>
      </div>
    </div>

    <div class="padding" v-if="isProduct">
      生产环境，不可使用此工具
    </div>
  </div>
</template>

<script>
  import App from '@/assets/scripts/app';

  export default {
    name: "devtools",

    data: function (){
      return {
        isProduct: App.isProduct,
        deviceId: "",
        activeCode: "",
        leasePackage: "3",
        leaseProductId: "",
        orderId: "",

        workOrderId: ""
      }
    },

    methods: {
      // 提交租赁订单
      submitLeaseOrder(){
        if(this.leaseProductId === "" || this.leasePackage === "") {
          this.$toast.error("请输入租赁产品或充值套餐");
          return;
        }

        this.$http.post(this.$basehost + "/devtools/leaseorders/submit/" + this.leaseProductId, {
          leasePackage: this.leasePackage
        })
          .then((order) => {
            this.activeCode = order.leaseActivationCode;
            this.$toast.success("租赁订单提交成功，激活码：" + order.leaseActivationCode);
          });
      },

      // 注册设备
      registerDevice() {
        if(this.deviceId === "") {
          this.$toast.error("请输入设备编码");
          return;
        }

        this.$http.post(this.$basehost + "/devtools/device/register/" + this.deviceId)
          .then((resp) => {
            this.$toast.success("设备注册成功");
          });
      },

      // 激活个人租赁设备
      activeStandardDevice() {
        if(this.activeCode === "" || this.deviceId === "") {
          this.$toast.error("请输入设备编码或激活码");
          return;
        }

        this.$http.post(this.$basehost + "/devtools/device/active/" + this.deviceId, {
          activeCode: this.activeCode
        })
          .then((device) => {
            this.$toast.success("设备激活成功，到期日：" + this.$filters.formatTime(device.leaseDueDate));
          });
      },

      // 扫码租赁
      scanActiveDevice() {
        if(this.deviceId === "" || this.leasePackage === "") {
          this.$toast.error("请输入设备编码或充值套餐");
          return;
        }

        this.$http.post(this.$basehost + "/devtools/device/scan-active/" + this.deviceId, {
          leasePackage: this.leasePackage
        })
          .then((device) => {
            this.$toast.success("设备租赁成功，到期日：" + this.$filters.formatTime(device.leaseDueDate));
          });
      },

      // 设备充值
      rechargeDevice() {
        if(this.deviceId === "" || this.leasePackage === "") {
          this.$toast.error("请输入设备编码或充值套餐");
          return;
        }

        this.$http.post(this.$basehost + "/devtools/device/recharge/" + this.deviceId, {
          leasePackage: this.leasePackage
        })
          .then((device) => {
            this.$toast.success("设备充值成功，到期日：" + this.$filters.formatTime(device.leaseDueDate));
          });
      },

      // 订单支付
      payOrder() {
        if(this.orderId === "") {
          this.$toast.error("请输入订单id");
          return;
        }

        this.$http.post(this.$basehost + "/devtools/leaseorders/pay/" + this.orderId)
          .then((order) => {
            this.$toast.success("订单支付成功");
          });
      },

      // 添加设备
      addDevice() {
        if(this.workOrderId === "") {
          this.$toast.error("请输入订单id");
          return;
        }

        this.$http.post(this.$basehost + "/devtools/workorder/" + this.workOrderId + "/devices/add", {
          device_id: this.deviceId
        })
          .then(() => {
            this.$toast.success("设备添加成功");
          });
      },

      // 销售订单支付
      payTradeOrder() {
        if(this.orderId === "") {
          this.$toast.error("请输入订单id");
          return;
        }

        this.$http.post(this.$basehost + "/devtools/tradeorder/" + this.orderId + "/pay")
          .then((resp) => {
            if (resp === true) {
              this.$toast.success("订单支付成功");
            } else {
              this.$toast.error("订单支付失败");
            }
          });
      },
    }
  };
</script>
