<!-- 工单计价 -->
<style lang="scss" type="text/scss">
  @import '~variables';
  .work-order-info,
  .fee-info {
    .cell-item {
      padding: rem($m);
      padding-left: 0;
      .mint-cell-wrapper {
        min-height: initial;
        padding: 1px;
        .mint-cell-title {
          min-width: rem(70px);
        }
      }
      .mint-cell-allow-right::after {
        right: rem($m);
      }
    }
    .last-cell-item {
      .cell-item {
        border: none!important;
      }
    }
  }
  .work-order-info {
    .mint-cell-value {
      font-weight: 500;
    }
  }
  .fee-info {
    border: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .cell-item {
      border: none;
      &:last-child {
        @include border(bottom);
      }
    }
    .mint-cell-value {
      flex-direction: column;
      align-items: flex-end;
      .item-money {
        color: $primary;
        font-weight: 500;
        font-size: $font-size-m;
      }
      .item-num {
        margin-top: $s;
        font-size: $font-size-s;
      }
    }
  }
</style>
<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .flex {
    align-items: flex-start;
    .flex-item-2 {
      flex: 0 0 20%;
      padding-top: 20%;
      position: relative;
    }
  }
  .line-top {
    background: $page_bg;
  }
  .valuation-image {
    position: absolute;
    top: 0;
    max-height: 100%;
    width: 100%;
    overflow: hidden;
    justify-content: center;
    img {
      max-width: 100px;
      width: auto;
      height: 100%;
    }
  }
  .product-info {
    flex-direction: column;
  }
  .order-info-item {
    padding-left: 0!important;
    margin-left: rem($m);
    @extend %padding-m;
    &:first-child {
      margin-left: 0;
      padding-left: rem($m)!important;
    }
  }
  .page-footer {
    z-index: 10;
    max-width: 768px;
    -webkit-box-shadow: 0 -3px 10px #eaeaea;
    -moz-box-shadow: 0 -3px 10px #eaeaea;
    box-shadow: 0 -3px 10px #eaeaea;
    .subTotal {
      width: rem(100px);
      height: rem(45px);
      justify-content: center;
      @extend %valign-center;
    }
    .btn-block {
      margin: 0!important;
      border-radius: 0;
      height: 45px;
      line-height: 42px;
      padding: 0;
    }
  }
  .mint-service,.mint-fitting {
    @extend %padding-m;
    .mint-cell-title {
      padding-left: rem(20px);
    }
    .mint-cell-wrapper {
      @extend %valign-center;
      padding: 0;
      .mint-cell-value {
        padding: 1px;
      }
    }
  }
  .mint-fitting {
    .mint-cell-title {
      padding-left: rem(114px);
      margin-top: rem(-30px);
    }
  }
  #adjustFee {
    border: 1px solid $border;
    @include border-radius(3px);
    text-align: right;
    height: rem(30px);
    padding-left: 5px;
    padding-right: 5px;
    font-size: $font-size-m;
  }
  .servicefee-page {
    width: 100%;
    height: 100%;
    background-color: $white;
  }
</style>

<template>
  <div>
    <app-view :hasFooter="false">
      <div class="padding-m flex order-info-item bg-white">
        <div class="flex-item-2 margin-right-m">
          <div class="valuation-image valign-center border border-radius">
            <img v-lazy="$filters.img((entity.productImage ? entity.productImage : ''),'!wh100')">
          </div>
        </div>
        <div class="product-info flex-item flex">
          <div class="font-m font-title text-wrapper">
            <span class="order-productname font-bold-400">{{ entity.productName }}</span>
          </div>
          <div class="font-s font-lighter margin-top-m">工单号：{{ entity.workOrderId }}</div>
          <div class="font-s font-lighter margin-top-m">设备货号：{{ entity.product && entity.product.itemCode ? entity.product.itemCode : '无' }}</div>
        </div>
      </div>
      <div class="padding-top line-top"></div>
      <div class="cell-group work-order-info">
        <div v-if="!(entity.orderType === 'common' && entity.deviceType === 'L')">
          <mt-cell class="cell-item" title="保修期" v-if="entity.afterWarrantyPeriod && entity.afterWarrantyPeriod === true"><span class="color-red-1">已过保修期</span></mt-cell>
          <mt-cell class="cell-item" title="保修期" v-else-if="entity.afterWarrantyPeriod === false"><span class="color-green-1">保修期内</span></mt-cell>
        </div>
        <mt-cell class="cell-item" title="工单类型" :value="entity.shopServiceName"></mt-cell>
      </div>

      <div class="padding-top line-top"></div>
      <div style="position: relative;min-height: 500px;">
        <div class="fee-info cell-group">
          <div @click="serviceFee">
            <mt-cell class="cell-item"
                     title="服务费"
                     is-link>
              <div class="item-money">￥ {{ feeData.fwsubTotal/100 }}</div>
              <div class="item-num">已选 {{ feeData.fwCheck.length }}项</div>
            </mt-cell>
          </div>
          <div @click="fittingFee">
            <mt-cell class="cell-item"
                     title="配件费"
                     is-link>
              <div class="item-money">￥ {{ feeData.pjsubTotal/100 }}</div>
              <div class="item-num">已选 {{ feeData.pjCheck.length }}项</div>
            </mt-cell>
          </div>
          <div class="last-cell-item">
            <mt-cell class="cell-item" title="修改总价">
              <input class="color-primary font-bold-500"
                     v-model="totalFee"
                     type="number"
                     step="0.01" min="0"
                     id="adjustFee"
                     value="0">
            </mt-cell>
          </div>
        </div>
      </div>

      <div class="page-footer page-footer-fill flex">
        <div class="subTotal flex-item">
          <div class="font-m">合计：</div>
          <div class="font-bold-500 color-primary"><span class="font-s">¥</span> <span class="currency-number font-l" id="subTotal">{{ totalFee }}</span></div>
        </div>
        <div style="width: 120px;">
          <button type="button"
                  class="btn btn-primary btn-block"
                  id="btnSubmit"
                  @click="confirmFee">确认费用</button>
          <a class="btn btn-danger btn-block" href="" v-if="false">返回首页</a>
        </div>
      </div>
    </app-view>
  </div>
</template>

<script type="text/javascript">
  import types from "@/store/types";

  export default {
    name: 'valuation-page',
    props: ['order'],
    data() {
      return {
        // 当前对象的数据载体
        entity: {},
        // 当前对象的id
        entityId: this.$route.params.id,
        // 收费类型
        serviceType: '',
        // 要提交的服务费用数据
        feedata: {
          // 服务费用多选
          fwCheck: [],
          // 服务费用提交项
          fwItems: [],
          // 配件费用多选
          pjCheck: [],
          // 配件费用提交项
          pjItems: [],
          // 服务总金额
          fwsubTotal: 0,
          // 配件总金额
          pjsubTotal: 0,
          // 服务费用数量数组
          fwQuatityNum: [],
          // 配件费用数量数组
          pjQuatityNum: [],
          // 所选服务项目的总数量
          fwSelectNum: 0,
          // 所选配件项目的总数量
          pjSelectNum: 0,
          // 所选配件规格
          pjSelectItems: []
        },
        totalFee: 0
      }
    },
    created() {
      this.$store.state.showLoading = true;
      //产品数据
      let pageData = this.$store.getters[types.wos.getValuationData];
      if(JSON.stringify(pageData) === '{}') {
        this.$http.get(this.$woshost + "/workorders/" + this.entityId)
          .then((res) => {
            this.entity = res;
            this.$store.commit(types.wos.setValuationData, res);
          })
      } else {
        this.entity = pageData;
      }
      this.$store.state.showLoading = false;
    },
    computed: {
      // 费用数据
      feeData() {
        let _data = this.feedata;
        let _serviceItem = this.$store.getters[types.wos.getServiceData];
        if(_serviceItem && JSON.stringify(_serviceItem) !== '{}') {
          _data = _serviceItem.feeData;
        }

        let _total = 0;
        if(_data && JSON.stringify(_data) !== '{}') {
          _total = (Number(_data.fwsubTotal) + Number(_data.pjsubTotal))/100;
        }
        this.totalFee = _total;

        return _data;
      },
      // 选中数据
      serviceItem() {
        let _temp = this.feeData;
        let _items = {};
        if(JSON.stringify(_temp) !== '{}') {
          _items = _temp.fwItems.concat(_temp.pjItems);
        }
        return _items;
      }
    },
    methods: {
      /**
       * 跳转到费用选择页面
       */
      toFeePage() {
        this.$loading.show()
        this.$store.commit(types.wos.setServiceData, {
          serviceType: this.serviceType,
          feeData: this.feeData
        });
        this.$router.push({path: '/wos/workOrder/' + this.entityId + '/valuation/fee'});
      },
      /**
       * 进入配件费用页面
       */
      fittingFee() {
        this.serviceType = 'fitting';
        this.toFeePage();
      },
      /**
       * 进入服务费用页面
       */
      serviceFee() {
        this.serviceType = 'service';
        this.toFeePage();
      },
      /**
       * 提交费用总计和费用项目
       */
      confirmFee() {
        const that = this;
        that.$dlg.confirm("是否确定计价正确?", () => {
          let _params = {
            'adjust_fee': parseInt(that.totalFee * 100),
            'recalculate_fee': true,
            'fee_items': JSON.stringify(that.feeData.fwItems.concat(that.feeData.pjItems))
          };
          that.$http.post(that.$woshost + '/workorders/' + that.entityId + '/fee/calculate',_params)
            .then((res) => {
              that.$messenger.alert('计价成功');
              setTimeout(function() {
                that.$router.push({ path: `/wos/workOrder/${that.entityId}` });
                that.$store.commit(types.wos.setServiceData, null);
                that.$store.commit(types.wos.setPageData, null);
              },500)
            });
        });
      }
    }
  }
</script>
