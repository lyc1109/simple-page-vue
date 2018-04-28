<!-- 租赁产品查看视图 -->
<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .tab-container{
    margin-top: rem(46px);
    background-color: $white;
  }

  .product-detail{
    padding: rem(10px);
    img{
      max-width: 100100%;
      margin: 10px;
    }
  }
</style>

<template>
  <div>
    <mt-navbar v-model="activeTab">
      <mt-tab-item id="tabProduct">基本信息</mt-tab-item>
      <mt-tab-item id="tabProductDetail">产品详情</mt-tab-item>
    </mt-navbar>

    <mt-tab-container v-model="activeTab">
      <!-- 基本信息 -->
      <mt-tab-container-item id="tabProduct">
        <div class="tab-container">
          <div class="align-center border-bottom">
            <img :src="$filters.resizeImg(leaseProduct.productCoverImg, 'm_fixed,h_180,q_80')" height="180"/>
          </div>
          <div class="padding">
            <div class="text-title">{{leaseProduct.name}}</div>
            <div class="margin-top-s font-light font-s">
              <span v-html="leaseProduct.briefIntroduction" v-if="leaseProduct.briefIntroduction !== ''"></span>
              <span v-if="leaseProduct.briefIntroduction === ''">暂无简介</span>
            </div>
          </div>

          <div class="padding border-top">
            <div class="flex">
              <div class="font-bold">设备押金</div>
              <div class="flex-item font-bold color-red-1 padding-left-m">
                {{ $filters.formatRMB(leaseProduct.deviceDeposit) }}
                <s class="font-s font-lighter" style="font-weight: lighter;"
                   v-if="leaseProduct.deviceDeposit < leaseProduct.listDeviceDeposit">{{ $filters.formatRMB(leaseProduct.listDeviceDeposit) }}</s>
              </div>
            </div>
            <div class="margin-top-s bg padding-s font-s font-light" v-if="leaseProduct.deviceDepositMemos !== ''">
              押金说明：{{leaseProduct.deviceDepositMemos}}
            </div>
          </div>

          <div class="padding">
            <div class="font-bold">租金套餐</div>
            <div class="margin-top-s bg padding-s font-s font-light" v-if="leaseProduct.rentalMemos !== ''">
              押金说明：{{leaseProduct.rentalMemos}}
            </div>

            <div class="margin-top">

              <!-- 年卡：支持首充或者金额大于0显示 -->
              <div class="rental-package rental-package-danger"  v-if="leaseProduct.yearlyRental > 0">
                <div class="rental-package-header">年卡</div>
                <div class="rental-package-body">
                  <h3>
                    {{ $filters.formatRMB(leaseProduct.yearlyRental) }}
                    <s class="font-s font-lighter" style="font-weight: lighter;"
                       v-if="leaseProduct.yearlyRental < leaseProduct.listYearlyRental">{{ $filters.formatRMB(leaseProduct.listYearlyRental) }}</s>
                  </h3>
                  <div class="margin-top-s font-s font-lighter">({{ $filters.formatRMB(leaseProduct.yearlyRental/12.0) }}/月)</div>
                </div>
              </div>

              <!-- 半年卡：支持首充或者金额大于0显示 -->
              <div class="rental-package rental-package-warn" v-if="leaseProduct.halfyearlyRental > 0">
                <div class="rental-package-header">半年卡</div>
                <div class="rental-package-body">
                  <h3>
                    {{ $filters.formatRMB(leaseProduct.halfyearlyRental) }}
                    <s class="font-s font-lighter" style="font-weight: lighter;"
                       v-if="leaseProduct.halfyearlyRental < leaseProduct.listHalfyearlyRental">{{ $filters.formatRMB(leaseProduct.listHalfyearlyRental) }}</s>
                  </h3>
                  <div class="margin-top-s font-s font-lighter">({{ $filters.formatRMB(leaseProduct.halfyearlyRental/6.0) }}/月)</div>
                </div>
              </div>

              <!-- 季度卡：支持首充或者金额大于0显示 -->
              <div class="rental-package rental-package-primary" v-if="leaseProduct.quarterlyRental > 0">
                <div class="rental-package-header">季度卡</div>
                <div class="rental-package-body">
                  <h3>
                    {{ $filters.formatRMB(leaseProduct.quarterlyRental) }}
                    <s class="font-s font-lighter" style="font-weight: lighter;"
                       v-if="leaseProduct.quarterlyRental < leaseProduct.listQuarterlyRental">{{ $filters.formatRMB(leaseProduct.listQuarterlyRental) }}</s>
                  </h3>
                  <div class="margin-top-s font-s font-lighter">({{ $filters.formatRMB(leaseProduct.quarterlyRental/3.0) }}/月)</div>
                </div>
              </div>

              <!-- 月卡：支持首充或者金额大于0显示 -->
              <div class="rental-package rental-package-success" v-if="leaseProduct.monthlyRental > 0">
                <div class="rental-package-header">月卡</div>
                <div class="rental-package-body">
                  <h3 class="margin-top margin-bottom">
                    {{ $filters.formatRMB(leaseProduct.monthlyRental) }}
                    <s class="font-s font-lighter" style="font-weight: lighter;"
                       v-if="leaseProduct.monthlyRental < leaseProduct.listMonthlyRental">{{ $filters.formatRMB(leaseProduct.listMonthlyRental) }}</s>
                  </h3>
                </div>
              </div>

            </div>

            <div class="clearfixed"></div>
          </div>

          <div class="padding border-top" @click="shopLeaseAgreementPopup = true" v-if="!$filters.isNullHtml(leaseAgreement)">
            <div class="flex">
              <div class="font-bold">租赁协议</div>
              <div class="flex-item font-lighter font-s align-right">
                查看协议 <i class="fa fa-angle-right"></i>
              </div>
            </div>
          </div>
          <div class="padding border-top" @click="shopRefundAgreementPopup = true" v-if="!$filters.isNullHtml(refundAgreement)">
            <div class="flex">
              <div class="font-bold">退租协议</div>
              <div class="flex-item font-lighter font-s align-right">
                查看协议 <i class="fa fa-angle-right"></i>
              </div>
            </div>
          </div>
        </div>
      </mt-tab-container-item>

      <!-- 产品详情 -->
      <mt-tab-container-item id="tabProductDetail">
        <div class="tab-container product-detail" v-html="leaseProduct.description"></div>
      </mt-tab-container-item>
    </mt-tab-container>

    <v-popup :fullScreen="true" v-model="shopLeaseAgreementPopup" v-if="!$filters.isNullHtml(leaseAgreement)">
      <div class="padding full-height">
        <div v-html="leaseAgreement"></div>
        <div style="height: 50px;"></div>
      </div>
      <div class="page-footer border-top">
        <button class="btn btn-default btn-block" @click="shopLeaseAgreementPopup = false">确定</button>
      </div>
    </v-popup>
    <v-popup :fullScreen="true" v-model="shopRefundAgreementPopup" v-if="!$filters.isNullHtml(refundAgreement)">
      <div class="padding full-height">
        <div v-html="refundAgreement"></div>
        <div style="height: 50px;"></div>
      </div>
      <div class="page-footer border-top">
        <button class="btn btn-defauv-modellt btn-block" @click="shopRefundAgreementPopup = false">确定</button>
      </div>
    </v-popup>
  </div>
</template>

<script>

  import VPopup from "@/components/ui/v-popup";

  export default {
    components: {VPopup},
    name: "lease-product-view-tpl",
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
      // 租赁协议
      leaseAgreement: {
        type: String,
        require: true,
        default: ""
      },
      // 退租协议
      refundAgreement: {
        type: String,
        require: true,
        default: ""
      },
    },
    data: function () {
      return {
        activeTab: "tabProduct",
        shopLeaseAgreementPopup: false,
        shopRefundAgreementPopup: false
      }
    }
  }
</script>
