<template>
  <v-app ref="form">
    <!--<div class="padding-l align-center">
      <h3>添加退换货物流信息</h3>
    </div>-->

    <div class="margin-m bg-white border">
      <v-cell class="v-cell-lg" title="订单编号" :value="orderId" align="left"></v-cell>
      <v-selector v-model="formData.shippingType"
                  label="物流方式"
                  name="shippingType"
                  placeholder="请选择物流方式"
                  :data="shippingTypeData"
                  labelKey="label"
                  valKey="value" class="padding-left-s padding-right"></v-selector>
      <v-selector v-model="formData.logisticsCompany"
                  label="物流公司"
                  name="logisticsCompany"
                  placeholder="请选择物流公司"
                  :data="logisticsData" class="padding-left-s padding-right"></v-selector>
      <v-input v-model.trim="formData.invoiceNo"
               label="物流单号"
               name="invoiceNo"
               placeholder="请输入物流单号" class="padding-left padding-right"></v-input>
    </div>

    <div class="margin-top-m padding-m">
      <button type="button" class="btn btn-block btn-lg btn-primary" @click="submit">提交物流信息</button>
    </div>
  </v-app>
</template>

<script>
  import VSelector from '@/components/ui/v-selector';
  import TradeorderApi from '@/apis/api-tradeorder';

  import storeTypes from "@/store/types";

  export default {
    name: "form-defend-logistics",
    desc: "退换货订单增加退货物流信息",
    components: {VSelector},
    data: function () {
      return {
        orderEntityId: this.$route.params.orderEntityId,
        orderId: this.$route.query.orderId,
        formData: {
          // 物流类型
          shippingType: "express",
          // 物流公司
          logisticsCompany: "",
          // 物流单号
          invoiceNo: "",
        },
        // 物流公司数据
        logisticsData: [],
        // 物流方式数据
        shippingTypeData: [{
          label: "物流",
          value: "logistics"
        },{
          label: "快递",
          value: "express"
        },{
          label: "送货上门",
          value: "delivery"
        }]
      }
    },
    mounted: function () {
      this.loadLogisticsData();
    },
    watch: {
      "formData.shippingType": function (newVal) {
        if (newVal === "delivery") {
          this.formData.logisticsCompany = "其它";
        }
      }
    },
    methods: {
      loadLogisticsData: function () {
        TradeorderApi.logistics()
          .then((resp) => {
            this.logisticsData = resp;
          })
      },
      submit: function () {
        let that = this;

        if (this.formData.shippingType !== "delivery") {
          if (this.$filters.isNullStr(this.formData.invoiceNo)) {
            this.$toast.err("请输入物流单号");
            return;
          }
        }

        that.$dlg.confirm("是否确认添加退换货物流信息", () => {
          that.$loading.show();
          TradeorderApi.submitLogistics(this.orderEntityId, this.formData.shippingType, this.formData.logisticsCompany, this.formData.invoiceNo)
            .then((resp) => {
              that.$loading.hide();
              that.$toast.success("物流信息提交成功");
              setTimeout(() => {
                that.$router.go(-1);
              }, 1000)
            })
            .catch(() => {
              console.log("物流信息提交失败");
              that.$loading.hide();
              that.$toast.error("抱歉，物流信息提交失败，请重新尝试提交");
            });
        });
      }
    }
  }
</script>

