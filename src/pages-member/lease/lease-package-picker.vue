<!--
租赁套餐选择器，父组件引入此组件：
  <lease-package-picker :leaseProductId="leaseProductId" @onOk="onLeasePackagePicked"></lease-package-picker>

参数说明：
  leaseProductId：[必选] 租赁产品ID，用于获取押金、充值套餐信息以及租赁场景说明。
  showPicker：用于控制选择器显示隐藏，默认true。
  isRecharge: 是否设备充值，用于控制押金显示隐藏，默认false。
  creditRent: 是否信用免押金租赁，用于控制押金显示隐藏, 默认false。

事件：
  onOk: 确定选择套餐后触发事件，回传传数据给父组件。data: { deviceDeposit: 0, leasePackage: "" }
-->
<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .lease-package-picker{
    width: 100%;
  }

  .picker-body{
    max-height: rem(400px);
    overflow: auto;
  }

  .flex-packages{
    align-items: left;
  }

  .rental-package{
    cursor: pointer;
  }
</style>

<template>
  <div>
    <mt-popup class="lease-package-picker" :closeOnClickModal="false" position="bottom" v-model="isReadyShow" v-if="leaseProduct != null">
      <div class="flex padding  border-bottom">
        <div class="flex-item font-bold">{{isRecharge ? "请选择充值套餐" : "请选择租赁套餐"}}</div>
        <div class="flex-item align-right" @click="onCancel()"><i class="fa fa-times-circle icon-m font-light"></i></div>
      </div>

      <div class="picker-body">
        <div class="full-width">

          <!-- 产品信息 -->
          <div class="flex padding">
            <div style="width:60px;"><img class="img-thumbnail" :src="this.$filters.img(leaseProduct.productCoverImg, '!wh100')" width="60px"/></div>
            <div class="flex-item padding-left">
              <div>{{leaseProduct.name}}</div>
              <div class="margin-top font-s font-light">产品型号：{{leaseProduct.productItemCode}}</div>
            </div>
          </div>
        </div>

        <div class="padding border-top">
          <!-- 押金 -->
          <div v-if="!isRecharge">
            <div class="flex">
              <div class="font-bold">设备押金</div>
              <div class="flex-item font-bold color-red-1 padding-left-m">
                <span v-if="creditRent">芝麻信用免押金</span>
                <div v-if="!creditRent">
                  {{ $filters.formatRMB(leaseProduct.deviceDeposit) }}
                  <s class="font-s font-lighter" style="font-weight: lighter;"
                    v-if="leaseProduct.deviceDeposit < leaseProduct.listDeviceDeposit">{{ $filters.formatRMB(leaseProduct.listDeviceDeposit) }}</s>
                </div>
              </div>
            </div>
            <div class="margin-top-s bg padding-s font-s font-light" v-if="leaseProduct.deviceDepositMemos !== ''">
              押金说明：{{leaseProduct.deviceDepositMemos}}
            </div>
          </div>

          <!-- 租金套餐根据首充策略显示或隐藏 -->
          <div v-if="isRecharge || leaseScenario.firstChargeStategy !== 'OD'">
            <div class="font-bold margin-top-m">租金套餐</div>
            <div class="margin-top-s bg padding-s font-s font-light" v-if="leaseProduct.rentalMemos !== ''">
              租金说明：{{leaseProduct.rentalMemos}}
            </div>
            <div class="margin-top">

              <!-- 年卡：支持首充或者充值且金额大于0显示 -->
              <div class="rental-package rental-package-danger" @click="toggleLeasePackage('12')" v-if="leaseProduct.yearlyRental > 0">
                <div class="rental-package-header">年卡</div>
                <div class="rental-package-body">
                  <h3>
                    {{ $filters.formatRMB(leaseProduct.yearlyRental) }}
                    <s class="font-s font-lighter" style="font-weight: lighter;"
                       v-if="leaseProduct.yearlyRental < leaseProduct.listYearlyRental">{{ $filters.formatRMB(leaseProduct.listYearlyRental) }}</s>
                  </h3>
                  <div class="margin-top-s font-s font-lighter">({{ $filters.formatRMB(leaseProduct.yearlyRental/12.0) }}/月)</div>
                </div>
                <label><input type="radio" value="12" :checked="leasePackage === '12'" :name="calRadioName('12')"/></label>
              </div>

              <!-- 半年卡：支持首充或者充值且金额大于0显示 -->
              <div class="rental-package rental-package-warn" @click="toggleLeasePackage('6')" v-if="leaseProduct.halfyearlyRental > 0">
                <div class="rental-package-header">半年卡</div>
                <div class="rental-package-body">
                  <h3>
                    {{ $filters.formatRMB(leaseProduct.halfyearlyRental) }}
                    <s class="font-s font-lighter" style="font-weight: lighter;"
                       v-if="leaseProduct.halfyearlyRental < leaseProduct.listHalfyearlyRental">{{ $filters.formatRMB(leaseProduct.listHalfyearlyRental) }}</s>
                  </h3>
                  <div class="margin-top-s font-s font-lighter">({{ $filters.formatRMB(leaseProduct.halfyearlyRental/6.0) }}/月)</div>
                </div>
                <label><input type="radio" value="6" :checked="leasePackage === '6'" :name="calRadioName('6')"/></label>
              </div>

              <!-- 季度卡：支持首充或者充值且金额大于0显示 -->
              <div class="rental-package rental-package-primary" @click="toggleLeasePackage('3')" v-if="leaseProduct.quarterlyRental > 0">
                <div class="rental-package-header">季度卡</div>
                <div class="rental-package-body">
                  <h3>
                    {{ $filters.formatRMB(leaseProduct.quarterlyRental) }}
                    <s class="font-s font-lighter" style="font-weight: lighter;"
                       v-if="leaseProduct.quarterlyRental < leaseProduct.listQuarterlyRental">{{ $filters.formatRMB(leaseProduct.listQuarterlyRental) }}</s>
                  </h3>
                  <div class="margin-top-s font-s font-lighter">({{ $filters.formatRMB(leaseProduct.quarterlyRental/3.0) }}/月)</div>
                </div>
                <label><input type="radio" value="3" :checked="leasePackage === '3'" :name="calRadioName('3')"/></label>
              </div>

              <!-- 月卡：支持首充或者充值且金额大于0显示 -->
              <div class="rental-package rental-package-success" @click="toggleLeasePackage('1')" v-if="leaseProduct.monthlyRental > 0">
                <div class="rental-package-header">月卡</div>
                <div class="rental-package-body">
                  <h3 class="margin-top margin-bottom">
                    {{ $filters.formatRMB(leaseProduct.monthlyRental) }}
                    <s class="font-s font-lighter" style="font-weight: lighter;"
                       v-if="leaseProduct.monthlyRental < leaseProduct.listMonthlyRental">{{ $filters.formatRMB(leaseProduct.listMonthlyRental) }}</s>
                  </h3>
                </div>
                <label><input type="radio" value="1" :checked="leasePackage === '1'" :name="calRadioName('1')"/></label>
              </div>

              <!-- 体验卡 -->
              <div class="rental-package" @click="toggleLeasePackage('0')" v-if="canUseFreePackage">
                <div class="rental-package-header">体验卡</div>
                <div class="rental-package-body">
                  <h3>
                    {{ $filters.formatRMB(0) }}
                  </h3>
                  <div class="margin-top-s font-s font-lighter">(可体验{{ leaseScenario.firstFreeDays }} 天)</div>
                </div>
                <label><input type="radio" value="0" :checked="leasePackage === '0'" :name="calRadioName()"/></label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="padding-top-m clearfixed">
        <button type="button" class="btn btn-primary btn-lg btn-block" @click="onOk()">
          {{isRecharge ? "立即充值" : "立即租赁"}}
          ({{ $filters.formatRMB(totalAmount) }})
        </button>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import leaseProductApi from "@/apis/api-lease-product";

  export default {
    name: "lease-package-picker",
    props: {
      // 租赁产品
      leaseProduct: {
        type: Object,
        require: true,
        default: {}
      },
      // 租赁场景
      leaseScenario: {
        type: Object,
        require: true,
        default: {}
      },
      // 是否设备充值，用于控制押金或套餐首充显示
      isRecharge: {
        type: Boolean,
        default: false
      },
      // 是否免押金租赁
      creditRent: {
        type: Boolean,
        default: false
      },
      // 控制显示、隐藏picker
      showPicker: {
        type: Boolean,
        default: true
      },
    },
    data: function () {
      return {
        hadUsedFeePackage: false,

        // 需要回传数据
        leasePackage: ""
      }
    },
    computed: {
      isReadyShow: function () {
        // 控制popup显示：父组件showPicker=true且租赁产品、场景数据不为空
        return this.showPicker && this.leaseProduct !== null && this.leaseScenario !== null;
      },
      // 是否可以使用体验卡
      canUseFreePackage: function () {
        return !this.isRecharge && this.leaseScenario.firstFreeDays && this.leaseScenario.firstFreeDays > 0 && !this.hadUsedFeePackage;
      },
      // 总金额：押金+套餐金额
      totalAmount: function () {
        let amount = this.leaseProduct.deviceDeposit;
        if(this.isRecharge || this.creditRent) {
          amount = 0;
        }
        return amount + this.rentalAmount;
      },
      // 租赁套餐金额
      rentalAmount: function () {
        if(this.leasePackage === "") {
          return 0;
        }
        if(this.leasePackage === "12") {
          return this.leaseProduct.yearlyRental;
        } else if(this.leasePackage === "6") {
          return this.leaseProduct.halfyearlyRental;
        } else if(this.leasePackage === "3") {
          return  this.leaseProduct.quarterlyRental;
        } else if(this.leasePackage === "1") {
          return  this.leaseProduct.monthlyRental;
        }
        return 0;
      },
    },
    mounted(){
      this.loadCanUseFeePackage();
    },
    methods: {
      // 加载用户是否已使用过体验卡
      loadCanUseFeePackage: function () {
        leaseProductApi.canUsedFeePackage(this.leaseProduct.id)
          .then((canUseFeePackage) => {
            this.hadUsedFeePackage = canUseFeePackage;

            // 计算第一个选中的套餐
            if(this.isRecharge || this.leaseScenario.firstChargeStategy !== 'OD') {
              this.leasePackage = this.calFirstPackageChecked();
            }
          })
      },

      // 计算选中第一个套餐
      calFirstPackageChecked: function () {
        if(this.leaseProduct.yearlyRental > 0) {
          return "12";
        }
        if(this.leaseProduct.halfyearlyRental > 0) {
          return "6";
        }
        if(this.leaseProduct.quarterlyRental > 0) {
          return "3";
        }
        if(this.leaseProduct.monthlyRental > 0) {
          return "1";
        }
        return "";
      },

      // 单选框名称，用于控制是否必选或可选
      calRadioName: function (leasePackage = "") {
        if(this.isRecharge || this.leaseScenario.firstChargeStategy === 'RR') {
          return "rentalPackage"
        }
        if(leasePackage === "12") {
          return "rentalPackageYear"
        } else if(leasePackage === "6") {
          return "rentalPackageHalfYear"
        } else if(leasePackage === "3") {
          return "rentalPackageQuarterly"
        } else if(leasePackage === "1") {
          return "rentalPackageMonth"
        }
        return "rentalPackageFree";
      },

      toggleLeasePackage: function (selectedPackage = "") {
        //console.log("leasePackage: " + this.leasePackage + ", selectedPackage: " + selectedPackage);
        // 充值或首充必选直接设置
        if(this.isRecharge || this.leaseScenario.firstChargeStategy === 'RR') {
          this.leasePackage = selectedPackage;
        } else {
          // 可选套餐控制
          if(this.leasePackage === selectedPackage) {
            this.leasePackage = "";
          } else {
            this.leasePackage = selectedPackage;
          }
        }
      },

      onOk: function () {
        let deviceDeposit = this.leaseProduct.deviceDeposit;
        if(this.isRecharge || this.creditRent) {
          deviceDeposit = 0;
        }

        this.$emit('onOk', {
          deviceDeposit: deviceDeposit,
          rentalPackage: this.leasePackage,
          rentalAmount: this.rentalAmount
        });
      },
      onCancel: function () {
        this.$emit('onCancel');
      }
    }
  }
</script>
