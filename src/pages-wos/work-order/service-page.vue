<style scoped type="text/scss" lang="scss">
  @import "~variables";
  @import 'src/assets/scss/components/_popupwindow';

  .popup-window {
    display: inherit;
    .popup-window-content {
      .popup-window-title {
        background-color: lighten($page_bg,2%);
        padding-top: rem($s)!important;
        padding-bottom: rem($s)!important;
        z-index: 50;
      }
      .popup-window-body {
        padding-top: 0;
        margin-bottom: rem(60px);
      }
      .popup-window-footer {
        position: fixed;
        z-index: 100;
        @include border(top);
        .subTotal {
          width: rem(100px);
          height: rem(45px);
          justify-content: center;
          .num-box {
            position: relative;
            margin: rem(4px) rem($m);
            height: rem(37px);
            width: rem(37px);
            justify-content: center;
            .num-badge {
              position: absolute;
              top: 0;
              right: rem(-5px);
              width: rem(15px);
              height: rem(15px);
              background: #ffc600;
              color: white;
              justify-content: center;
            }
          }
        }
        button {
          height: rem(45px);
          margin-left: 0!important;
        }
      }
      .serviceNum-page {
        z-index: 99!important;
        width: 100%;
        height: 100%;
        margin-bottom: rem(45px);
        background: transparent;
        flex-direction: column;
        .backpopup {
          width: 100%;
          background: rgba(0,0,0,.5);
        }
        .select-box {
          width: 100%;
          .select-title-box {
            background: $page_bg;
          }
          .product-number {
            min-width: rem(102px);
          }
        }
      }
    }
  }

  .text-wrapper-2line {
    white-space: initial;
  }
  .mint-cell-wrapper {
    height: 100%;
  }

  .service-page-box {
    margin-bottom: rem(55px);
    padding-left: 0!important;
    .cell-item:last-child {
      @include  border(bottom);
    }
  }
  .cell-group {
    padding-bottom: rem(60px);
  }
  .mint-cell-footer {
    color: $font-light;
    text-align: right;
  }
  .checklist-box {
    position: relative;
    @extend %padding-m;
    @extend %valign-center;
    @include border(bottom);
    .mint-cell-checkbox {
      position: static;
      .mint-checkbox-input {
        position: absolute;
        width: 65%;
        height: 80%;
        top: 10%;
        left: $m;
        z-index: 1;
        opacity: 0;
        display: block;
      }
      .mint-checkbox-core {
        position: absolute;
        left: $m;
        top: rem(35px);
        @include border(all,$gray-light);
      }
    }
    .product-logo {
      width: rem(60px);
      height: rem(60px);
      margin-left: rem(37px);
      justify-content: center;
      overflow: hidden;
      img {
        height: 100%;
        width: auto;
        max-width: fit-content;
      }
    }
    .product-content {
      flex-direction: column;
      padding-left: $m;
      .flex-vdir {
        flex-direction: column;
        width: 100%;
      }
      .product-title {
        width: 100%;
        .item-code {
          margin-top: rem(3px);
        }
      }
      .product-footer {
        width: 100%;
      }
    }
  }

  .quantity-decrease,
  .quantity-increase {
    display: inline-block;
    width: rem(28px);
    height: rem(28px);
    border: 1px solid $border;
    text-align: center;
    vertical-align: bottom;
    line-height: 26px;
    font-size: $font-size-m;
  }
  .quantity-decrease {
    margin-right: -4px;
    border-radius: 3px 0 0 3px;
  }
  .quantity-increase {
    border-radius: 0 3px 3px 0;
  }
  .quantity {
    border: 1px solid $border;
    text-align: center;
    height: rem(28px);
    padding: 0 5px;
    width: rem(30px);
    margin-right: -4px;
    font-size: $font-size;
  }
  .adjustFee {
    border: 1px solid $border;
    text-align: right;
    height: rem(30px);
    padding: 5px;
    font-size: $font-size-m;
  }
</style>
<!-- 工单计价-服务费用组件 -->
<template>
  <div class="popup-window">
    <div class="popup-window-content">
      <!--顶部搜索框-->
      <div class="padding-left-m padding-right-m padding-top padding-bottom flex bg-white">
        <div class="key-box flex flex-item">
          <i class="font-lighter iconfont icon-iot-search"></i>
          <input type="text" placeholder="搜索产品" class="key-input bg-light padding-left-s" v-model="keywords" @keyup="searchKey($event)">
          <i class="iconfont icon-iot-guanbi font-lighter" @click="clearInput" :style="{'display': keywords.length > 0 ? 'inline-block' : 'none' }"></i>
        </div>
        <div class="margin-left-m font-light valign-center" @click="searchKey($event)">
          <i class="iconfont icon-IOT-sx"></i>
          <span>搜索</span>
        </div>
      </div>
      <!--内容区域-->
      <div class="popup-window-body">
        <div  v-if="(fwData && fwData.length > 0) || (pjListData && pjListData.length > 0)"
              class="cell-group service-page-box margin-top">
          <!--服务选项-->
          <div class="flex checklist-box"
               v-show="fwData && fwData.length > 0"
               v-for="(item, index) in fwData"
               v-if="dataType==='service'">
            <div class="mint-cell-checkbox">
              <input type="checkbox"
                     class="mint-checkbox-input"
                     :value="item.id"
                     v-model="feeData.fwCheck"
                     @click="addService({
                       feeItemPrice: (servicesData && !servicesData.afterWarrantyPeriod ? item.price : item.priceAfter),
                       feeType: 'FW',
                       feeDefId: 0,
                       feeDefConfuseId: item.id,
                       feeItemName: item.name,
                       feeItemNum: feeData.fwQuatityNum[item.id],
                       subTotal: (servicesData && !servicesData.afterWarrantyPeriod ? item.price : item.priceAfter) * feeData.fwQuatityNum[item.id]
                     },index)"/>
              <i class="mint-checkbox-core"></i>
            </div>
            <div class="product-logo border border-radius valign-center">
              <img v-lazy="$filters.img(item.coverImage,'!q70')" />
            </div>
            <div class="flex-item flex product-content">
              <div class="product-title flex-vdir text-wrapper-2line">{{ item.name }}</div>
              <div class="flex-item"></div>
              <div class="product-footer flex">
                <div v-if="servicesData">
                  <!--保修期内-->
                  <div v-if="!servicesData.afterWarrantyPeriod" class="font-bold-400 valign-center" >
                    <span class="color-primary currency font-m">{{ $filters.formatCurrency(item.price/100) }}</span>
                    <del class="font-light margin-left-s"><span>{{ $filters.formatCurrency(item.priceAfter/100) }}</span></del>
                  </div>
                  <!--已过保修期-->
                  <div v-else-if="servicesData.afterWarrantyPeriod">
                    <span class="color-primary currency font-m">{{ $filters.formatCurrency(item.formatPriceAfter) }}</span>
                  </div>
                </div>
                <div class="flex-item"></div>
                <div class="product-number">
                  <a href="javascript:void(0);"
                     class="quantity-decrease"
                     @click="decrease(item.id, item.id)">-</a>
                  <input type="number"
                         class="quantity"
                         value="1"
                         v-model="feeData.fwQuatityNum[item.id]"
                         @change="quatityChange(item.id, item.id)">
                  <a href="javascript:void(0);"
                     class="quantity-increase"
                     @click="increase(item.id, item.id)">+</a>
                </div>
              </div>
            </div>
          </div>
          <!--配件选项-->
          <!--无规格区分的配件-->
          <div v-show="pjListData && pjListData.length>0" v-for="(item, index) in pjListData">
            <div class="flex checklist-box"
                 v-if="dataType==='fitting' && !item.multiSpec">
              <div class="mint-cell-checkbox">
                <input type="checkbox"
                       class="mint-checkbox-input"
                       v-model="feeData.pjCheck"
                       :value="item.id"
                       @click="addService({
                       feeItemPrice: (servicesData && !servicesData.afterWarrantyPeriod ? item.price : item.overduePrice),
                       feeType: 'PJ',
                       feeDefId: 0,
                       feeDefConfuseId: item.id,
                       feeItemName: item.name,
                       feeItemNum: feeData.pjQuatityNum[item.id],
                       subTotal: (servicesData && !servicesData.afterWarrantyPeriod ? item.price : item.overduePrice) * feeData.pjQuatityNum[item.id]
                       })"/>
                <i class="mint-checkbox-core"></i>
              </div>
              <div class="product-logo border border-radius valign-center">
                <img v-lazy="$filters.img(item.coverImage,'!wh100')"/>
              </div>
              <div class="flex-item flex product-content">
                <div class="product-title flex-vdir text-wrapper-2line">{{ item.name }}</div>
                <div class="flex-item"></div>
                <div class="product-footer flex">
                  <div v-if="servicesData">
                    <!--保修期内-->
                    <div v-if="!servicesData.afterWarrantyPeriod" class="color-primary font-bold-400 valign-center" >
                      <span class="color-primary currency font-m">{{ $filters.formatCurrency(item.price/100) }}</span>
                      <del v-if="item.overduePrice > item.price" class="font-light margin-left-s">
                        <span>{{ $filters.formatCurrency(item.overduePrice/100) }}</span>
                      </del>
                    </div>
                    <!--已过保修期-->
                    <div v-else-if="servicesData.afterWarrantyPeriod">
                      <span class="color-primary currency font-m">{{ $filters.formatCurrency(item.overduePrice/100) }}</span>
                    </div>
                  </div>
                  <div class="flex-item"></div>
                  <div class="product-number">
                    <a href="javascript:void(0);"
                       class="quantity-decrease"
                       @click="decrease(item.id, item.id)">-</a>
                    <input type="number"
                           class="quantity"
                           value="1"
                           v-model="feeData.pjQuatityNum[item.id]"
                           @change="quatityChange(item.id, item.id)"/>
                    <a href="javascript:void(0);"
                       class="quantity-increase"
                       @click="increase(item.id, item.id)">+</a>
                  </div>
                </div>
              </div>
            </div>
            <!--带有规格区分的配件-->
            <div class="flex checklist-box"
                 v-for="(item1, index1) in item.specs"
                 v-if="dataType === 'fitting' && item.multiSpec">
              <div class="mint-cell-checkbox">
                <input type="checkbox"
                       class="mint-checkbox-input"
                       :value="item1.id"
                       v-model="feeData.pjCheck"
                       @click="addService({
                       feeItemPrice: (((servicesData && !servicesData.afterWarrantyPeriod) || (servicesData.orderType === 'common' && servicesData.deviceType === 'L')) ? item1.price : item1.overduePrice),
                       feeType: 'SPEC',
                       feeDefId: 0,
                       feeDefConfuseId: item1.id,
                       feeItemName: item.name,
                       feeItemNum: feeData.pjQuatityNum[item1.id],
                       subTotal: (((servicesData && !servicesData.afterWarrantyPeriod) || (servicesData.orderType === 'common' && servicesData.deviceType === 'L')) ? item1.price : item1.overduePrice) * feeData.pjQuatityNum[item1.id]
                       },item1.itemCode)"/>
                <i class="mint-checkbox-core"></i>
              </div>
              <div class="product-logo border border-radius valign-center">
                <img v-lazy="$filters.img(item1.coverImage,'!100')"/>
              </div>
              <div class="flex-item flex product-content">
                <div class="product-title">
                  <div>{{ item1.productName }}</div>
                  <div class="font-s font-lighter item-code">规格：（{{ item1.itemCode }}）</div>
                </div>
                <div class="flex-item"></div>
                <div class="product-footer flex">
                  <div v-if="servicesData">
                    <!--保修期内-->
                    <div v-if="!servicesData.afterWarrantyPeriod || (servicesData.orderType === 'common' && servicesData.deviceType === 'L')" class="color-primary font-bold-400 valign-center" >
                      <span class="color-primary currency font-m">{{ $filters.formatCurrency(item1.price/100) }}</span>
                      <del v-if="item1.overduePrice > item1.price" class="font-light margin-left-s"><span>{{ $filters.formatCurrency(item1.overduePrice/100) }}</span></del>
                    </div>
                    <!--已过保修期-->
                    <div v-else>
                      <span class="color-primary currency font-m">{{ $filters.formatCurrency(item1.overduePrice/100) }}</span>
                    </div>
                  </div>
                  <div class="flex-item"></div>
                  <div class="product-number">
                    <a href="javascript:void(0);"
                       class="quantity-decrease"
                       @click="decrease(item1.id, item1.id)">-</a>
                    <input type="number"
                           class="quantity"
                           value="1"
                           v-model="feeData.pjQuatityNum[item1.id]"
                           @change="quatityChange(item1.id, item1.id)"/>
                    <a href="javascript:void(0);"
                       class="quantity-increase"
                       @click="increase(item1.id, item1.id)">+</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="margin-top" style="position: absolute;top: 0;bottom: 50px;left: 0;right: 0;">
          <!--无符合条件的选项提示-->
          <div v-if="dataType === 'service' && (!fwData || fwData.length === 0)" class="bg-white valign-center" style="height: calc(100% - 60px);justify-content: center;">
            <div class="padding-l align-center font-s font-light bg-white">暂无数据</div>
          </div>
          <div v-else-if="dataType === 'fitting' && (!pjListData || pjListData.length === 0)" class="bg-white valign-center" style="height: calc(100% - 60px);justify-content: center;">
            <div class="padding-l align-center font-s font-light bg-white">暂无数据</div>
          </div>
        </div>
      </div>
      <!--选择页底部-->
      <div class="popup-window-footer flex">
        <div class="subTotal flex-item flex valign-center" @click="showOrHideDetail">
          <div class="num-box border-radius-circle valign-center btn-primary">
            <i class="iconfont icon-IOT-gj"></i>
            <div class="num-badge border-radius-circle valign-center font-s"
                 v-if="dataType === 'service' && feeData.fwSelectNum > 0">{{ feeData.fwSelectNum }}</div>
            <div class="num-badge border-radius-circle valign-center font-s"
                 v-else-if="dataType === 'fitting' && feeData.pjSelectNum > 0">{{ feeData.pjSelectNum }}</div>
          </div>
          <div class="flex-item font-bold-500 margin-left-m valign-center">
            <span class="currency-number font-l" id="subTotal">{{ $filters.formatCurrency(dataType==='service'? feeData.fwsubTotal/100 : feeData.pjsubTotal/100) }}</span>
          </div>
        </div>
        <div style="width: 120px;">
            <button type="button" class="btn btn-primary btn-block" id="btnSubmit" @click="submitFee">确认</button>
            <a class="btn btn-danger btn-block" href="" v-if="false">返回首页</a>
        </div>
      </div>
      <!--选中的服务或配件详情-->
      <mt-popup v-model="feeDetailPopup"
                position="bottom"
                :modal="false"
                class="serviceNum-page flex">
        <div class="backpopup flex-item" @click="showOrHideDetail"></div>
        <div class="select-box bg-white">
          <!--详情弹窗页顶部-->
          <div class="padding-m font-s flex select-title-box bg-yellow-4">
            <div class="font-bold-500">已选{{dataType == 'service' ? '服务': '配件'}}</div>
            <div class="flex-item"></div>
            <div class="valign-center bg-yellow-4" @click="clearSelect(true)">
              <i class="iconfont icon-iot-del font-s"></i>
              <span>清空</span>
            </div>
          </div>
          <!--详情-->
          <div class="select-detail-box">
            <!--所选的服务详情-->
            <div class="padding-m flex border-bottom valign-center"
                 v-if="dataType === 'service' && feeData.fwSelectNum > 0"
                 v-for="item in feeData.fwItems">
              <div class="text-wrapper-2line">{{ item.feeItemName }}</div>
              <div class="flex-item"></div>
              <div class="color-primary font-bold-500">{{ $filters.formatCurrency(item.feeItemPrice/100) }}</div>
              <div class="product-number margin-left-m">
                <a href="javascript:void(0);"
                   class="quantity-decrease"
                   @click="decrease(item.feeDefConfuseId, item.feeDefConfuseId,true)">-</a>
                <input type="number"
                       class="quantity"
                       value="1"
                       v-model="feeData.fwQuatityNum[item.feeDefConfuseId]"
                       @change="quatityChange(item.feeDefConfuseId, item.feeDefConfuseId, true)"/>
                <a href="javascript:void(0);"
                   class="quantity-increase"
                   @click="increase(item.feeDefConfuseId, item.feeDefConfuseId)">+</a>
              </div>
            </div>
            <!--所选的配件详情-->
            <div class="padding-m flex border-bottom"
                 v-if="dataType === 'fitting' && feeData.pjSelectNum > 0"
                 v-for="item in feeData.pjItems">
              <div class="text-wrapper-2line" v-if="item.feeType === 'PJ'">{{ item.feeItemName }}</div>
              <div class="flex" v-else-if="item.feeType === 'SPEC'" style="flex-direction: column">
                <div class="text-wrapper-2line" >{{ item.feeItemName }}</div>
                <div class="text-wrapper font-s margin-top">{{ feeData.pjSelectItems[item.feeDefConfuseId] }}</div>
              </div>
              <div class="flex-item"></div>
              <div class="color-primary font-bold-500 margin-left-m margin-right-m">¥{{ item.feeItemPrice/100 }}</div>
              <div class="product-number">
                <a href="javascript:void(0);"
                   class="quantity-decrease"
                   @click="decrease(item.feeDefConfuseId, item.feeDefConfuseId,true)">-</a>
                <input type="number"
                       class="quantity"
                       value="1"
                       v-model="feeData.pjQuatityNum[item.feeDefConfuseId]"
                       @change="quatityChange(item.feeDefConfuseId, item.feeDefConfuseId, true)"/>
                <a href="javascript:void(0);"
                   class="quantity-increase"
                   @click="increase(item.feeDefConfuseId, item.feeDefConfuseId)">+</a>
              </div>
            </div>
            <!--未选择的提示-->
            <div class="none-select padding-m align-center"
                 v-if="(dataType === 'service' && feeData.fwSelectNum == 0) || (dataType === 'fitting' && feeData.pjSelectNum == 0)">
                    暂未选择{{dataType === 'service' ? '服务' : '配件'}}
            </div>
          </div>
        </div>
      </mt-popup>
    </div>
  </div>
</template>

<script type="text/javascript">
  import {Toast} from 'mint-ui';
  import types from "@/store/types";

  export default {
    name: 'wos-fee',
    data() {
      return {
        // 计价的类型 [service: 服务; fitting: 配件]
        dataType: '',
        // 服务数据
        servicesData: {},
        // 当前对象id
        entityId: this.$route.params.id,
        // 服务费用数据
        fwListData: [],
        // 配件费用数据
        pjListData: [],
        // 服务数量的数据
        fwQuatityNum: [],
        // 配件数量的数组
        pjQuatityNum: [],
        // 要提交的数据
        feeData: {
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
          // 选择的服务项目总数
          fwSelectNum: 0,
          // 选择的配件项目总数
          pjSelectNum: 0,
          // 所选配件规格
          pjSelectItems: []
        },
        // 搜索关键词
        keywords: '',
        // 防止重复搜索的标志
        isComparing: false,
        // 详情页弹窗
        feeDetailPopup: false,
      }
    },
    created() {
      this.$store.state.showLoading = true;
      let pageData = this.$store.getters[types.wos.getValuationData];
      let _serviceItem = this.$store.getters[types.wos.getServiceData];

      let that = this;
      let _flag = false;
      let _count = 0;

      //没有选择的时候
      if(JSON.stringify(pageData) === '{}') {
        this.$http.get(this.$woshost + "/workorders/" + this.entityId)
          .then((res) => {
            that.servicesData = res;
            this.$store.commit(types.wos.setValuationData, res);
          })
      } else {
        that.servicesData = pageData;
      }

      //获取服务费用
      if(JSON.stringify(that.servicesData) !== '{}') {
        let _shop = that.servicesData.shop;
        let _product = that.servicesData.product;

        that.$http.get(that.$apihost + '/shopServiceDefs/find/item-defs', {
          "shop_id": (_shop && _shop.id) || '',
          "shop_service_id": that.servicesData.shopServiceId || '',
          "product_id": (_product && _product.id) || ''
        })
          .then((resp) => {
            that.fwListData = resp;

            //获取配件费用
            if(_product && _product.id) {
              that.$http.get(that.$apihost + '/products/' + _product.id + '/parts')
                .then((res) => {
                  that.pjListData = res;
                  _flag = true;
                });
            } else {
              _flag = true;
            }
          });
      }

      //初始化数量，没有之前的操作数据则数量全部默认为1，有之前的数据则赋值
      let initNum = function () {
        let _fwData = that.fwListData;
        let _pjData = that.pjListData;
        for (let i = 0, len = _fwData.length; i < len; i++) {
          that.fwQuatityNum[_fwData[i].id] = 1;
        }

        for (let i = 0, len = _pjData.length; i < len; i++) {
          if (_pjData[i].multiSpec) {
            let _specsData = _pjData[i].specs;
            for (let j = 0, len = _specsData.length; j < len; j++) {
              that.pjQuatityNum[_specsData[j].id] = 1;
            }
          } else {
            that.pjQuatityNum[_pjData[i].id] = 1;
          }
        }

        if(_serviceItem && JSON.stringify(_serviceItem) !== '{}') {
          that.dataType = _serviceItem.serviceType;
          let _feeData = _serviceItem.feeData;
          that.feeData = _feeData;
          if (_feeData.fwQuatityNum && _feeData.fwQuatityNum.length === 0) {
            that.feeData.fwQuatityNum = that.fwQuatityNum;
          }

          if (_feeData.pjQuatityNum && _feeData.pjQuatityNum.length === 0) {
            that.feeData.pjQuatityNum = that.pjQuatityNum;
          }
        }

        that.$store.state.showLoading = false;
      }

      //分别请求服务和配件的数据，如果有数据才初始化数量
      let T = function () {
        if(_flag) {
          initNum();
          return false;
        }
        //定时器10次执行时间足够数据请求,执行超过10次就停掉，避免内存泄漏
        if(_count >= 10) {
          _flag = true;
        } else {
          _count++;
        }
        setTimeout(T, 500);
      }
      T();
      that.$loading.hide();
    },
    computed: {
      //处理搜索的服务数据
      fwData() {
        let _searchFw = [];
        let _keywords = this.keywords;

        if(this.dataType === 'service') {
          let _temp = this.fwListData;
          for(var i=0,len=_temp.length; i<len ; i++) {
            if((_temp[i].name.toString().indexOf(_keywords) !== -1) || (_temp[i].formatPriceAfter.toString().indexOf(_keywords) !== -1)) {
              _searchFw.push(_temp[i]);
            }
          }
        }

        return _searchFw;
      }
    },
    methods: {
      /**
       * 计算
       * @param type
       * @param index
       * @param itemIndex
       */
      calculate(type, index, itemIndex) {
        let _feeObj = this.feeData;

        if (this.dataType === 'service') {
          _feeObj.fwsubTotal = 0;
          _feeObj.fwSelectNum = 0;
          if (type && _feeObj.fwItems[itemIndex]) {
            let curItem = _feeObj.fwItems[itemIndex];
            curItem.feeItemNum = _feeObj.fwQuatityNum[index];
            curItem.subTotal = curItem.feeItemPrice * curItem.feeItemNum;
          }
          for (let i = 0, len = _feeObj.fwItems.length; i < len; i++) {
            _feeObj.fwsubTotal += Number(_feeObj.fwItems[i].subTotal);
            _feeObj.fwSelectNum += Number(_feeObj.fwItems[i].feeItemNum);
          }
          _feeObj.fwsubTotal = _feeObj.fwsubTotal.toFixed(2);
        } else {
          _feeObj.pjsubTotal = 0;
          _feeObj.pjSelectNum = 0;
          if (type) {
            let curItem = _feeObj.pjItems[itemIndex];
            curItem.feeItemNum = _feeObj.pjQuatityNum[index];
            curItem.subTotal = curItem.feeItemPrice * curItem.feeItemNum;
          }
          for (let i = 0, len = _feeObj.pjItems.length; i < len; i++) {
            _feeObj.pjsubTotal += Number(_feeObj.pjItems[i].subTotal);
            _feeObj.pjSelectNum += Number(_feeObj.pjItems[i].feeItemNum);
          }
          _feeObj.pjsubTotal = _feeObj.pjsubTotal.toFixed(2);
        }
      },
      /**
       * 选中事件
       * @param items
       * @param extra
       */
      addService(items,extra) {
        //        if (items.feeItemNum) {
        //避免直接退回时存储数据
//        this.$store.commit(types.wos.setServiceData, '');

        if (this.dataType === 'service') {
          let that = this;
          let _feeObj = that.feeData;
          let curserviceArr = _feeObj.fwCheck;
          let _checkLen = 0;
          let fwItemArr = _feeObj.fwItems;
          let _fwItemLen = 0;
          let hasin = true;
          let _hasFwId = false;

          if (curserviceArr.length) {
            _checkLen = curserviceArr.length;
          }

          if (fwItemArr.length) {
            _fwItemLen = fwItemArr.length;
          }

          for(let i in curserviceArr) {
            if(curserviceArr[i] === items.feeDefConfuseId) {
              _hasFwId = true;
              break;
            }
          }

          if (_checkLen < _fwItemLen && !_hasFwId) {
            for (let i = 0; i < _fwItemLen; i++) {
              if (fwItemArr[i].feeDefConfuseId === items.feeDefConfuseId) {
                hasin = false;
                _feeObj.fwsubTotal -= fwItemArr[i].subTotal;
                fwItemArr.splice(i, 1);
                break;
              }
            }
          } else if (_checkLen === _fwItemLen && _hasFwId) {
            curserviceArr.forEach((item, index) => {
              if (item === items.feeDefConfuseId) {
                hasin = false;
                _feeObj.fwsubTotal -= fwItemArr[index].subTotal;
                _feeObj.fwCheck.splice(index, 1);
                fwItemArr.splice(index, 1);
              }
            });
          }

          _feeObj.fwsubTotal = 0;

          if (hasin) {
            if (!(_checkLen > 0 && _hasFwId)) {
              _feeObj.fwCheck.push(items.feeDefConfuseId);
            }
            _feeObj.fwItems.push(items);
          }
        } else {
          let that = this;
          let _feeObj = that.feeData;
          let curserviceArr = _feeObj.pjCheck;
          let _checkLen = 0;
          let pjItemArr = that.feeData.pjItems;
          let _pjItemLen = 0;
          let hasin = true;
          let _hasPjId = false;

          if (curserviceArr.length) {
            _checkLen = curserviceArr.length;
          }
          if (pjItemArr.length) {
            _pjItemLen = pjItemArr.length;
          }

          for(let i in curserviceArr) {
            if(curserviceArr[i] === items.feeDefConfuseId) {
              _hasPjId = true;
              break;
            }
          }

          if (pjItemArr && _pjItemLen > 0) {
            if (_checkLen < _pjItemLen && !_hasPjId) {
              for (let i = 0; i < _pjItemLen; i++) {
                if (pjItemArr[i].feeDefConfuseId === items.feeDefConfuseId) {
                  hasin = false;
                  _feeObj.pjsubTotal -= pjItemArr[i].subTotal;
                  pjItemArr.splice(i, 1);
                  break;
                }
              }
            } else if (_checkLen === _pjItemLen && _hasPjId) {
              curserviceArr.forEach((item, index) => {
                if (item === items.feeDefConfuseId) {
                  hasin = false;
                  _feeObj.pjsubTotal -= pjItemArr[index].subTotal;
                  _feeObj.pjCheck.splice(index, 1);
                  pjItemArr.splice(index, 1);
                }
              });
            }
          }

          _feeObj.pjsubTotal = 0;

          if (hasin) {
            if (!(_checkLen > 0 && _hasPjId)) {
              _feeObj.pjCheck.push(items.feeDefConfuseId);
            }
            _feeObj.pjItems.push(items);
            _feeObj.pjSelectItems[items.feeDefConfuseId] = extra;
          }
        }

        this.calculate();
        //        }
      },
      /**
       * 清空某选项
       * @param _curItemArr
       * @param _curCheckArr
       * @param index
       * @param itemid
       * @param i
       * @param len
       */
      deletSelect(_curItemArr, _curCheckArr, index,itemid, i, len) {
        let _curIndex = 0;
        let _title = '删除该服务';
        if(len === 1) {
          _title = '清空选项';
        } else if(this.dataType === 'fitting') {
          _title = '删除该配件';
        }

        const that = this;
        that.$dlg.confirm('确定' + _title + '?', () => {
          for(let j = 0; j < len; j++) {
            let _temp = _curItemArr[j];
            if(_temp.feeDefConfuseId === itemid) {
              _curCheckArr.splice(i, 1);
              _curItemArr.splice(j, 1);
              if(j > 0) {
                _curIndex = parseInt(j-1);
              } else {
                if(len > 2) {
                  _curIndex = parseInt(j+1);
                } else if(len === 1) {
                  that.clearSelect(false);
                }
              }
              break;
            }
          }
          if(len >= 2) {
            that.calculate('dec', _curItemArr[_curIndex].feeDefConfuseId, i);
          }
        }, function () {
          if(that.dataType === 'service') {
            that.feeData.fwQuatityNum[index] = 1;
            that.feeData.fwQuatityNum.splice(index, 1, that.feeData.fwQuatityNum[index]);
          } else if(that.dataType === 'fitting') {
            that.feeData.pjQuatityNum[index] = 1;
            that.feeData.pjQuatityNum.splice(index, 1, that.feeData.pjQuatityNum[index]);
          }
        });
      },
      /**
       * 减数量
       * @param index
       * @param itemid
       * @param canDel
       */
      decrease(index, itemid, canDel) {
        let _feeObj = this.feeData;
        let _isDel = false;           //准备删除选定项的标志
        let _curNumArr = [];          //当前处理的存取选择数量的数组
        let _curCheckArr = [];        //当前处理的存取选项的数组
        let _curItemArr = [];         //当前处理的存取选项详细数据的数组

        if (this.dataType === 'service') {
          _curNumArr = _feeObj.fwQuatityNum;
          _curCheckArr = _feeObj.fwCheck;
          _curItemArr = _feeObj.fwItems;
        } else {
          _curNumArr = _feeObj.pjQuatityNum;
          _curCheckArr = _feeObj.pjCheck;
          _curItemArr = _feeObj.pjItems;
        }

        if(_curNumArr !== []) {
          if(_curNumArr[index] > 1) {
            _curNumArr.splice(index, 1, --_curNumArr[index]);
          } else if(_curNumArr[index] === 1 && canDel) {
            _isDel = true;
          }
        }

        for (let i = 0, len = _curCheckArr.length; i < len; i++) {
          if (itemid === _curCheckArr[i] && _curNumArr[index] >= 0) {
            if(!_isDel) {
              this.calculate('dec', index, i);
              if(_curNumArr[index] === 0) {
                _curCheckArr.splice(i, 1);
                if(this.dataType === 'fitting') {
                  _curItemArr.splice(index, 1);
                }
              }
              break;
            } else if(_isDel) {
              if(_curNumArr[index] === 1) {
                this.deletSelect(_curItemArr, _curCheckArr, index, itemid, i, len);
              }
            }
          }
        }
      },
      /**
       * 加数量
       * @param index
       * @param itemid
       */
      increase(index, itemid) {
        let _feeObj = this.feeData;

        if (this.dataType === 'service') {
          _feeObj.fwQuatityNum.splice(index, 1, ++_feeObj.fwQuatityNum[index]);
          for (let i = 0; i < _feeObj.fwCheck.length; i++) {
            if (itemid === _feeObj.fwCheck[i]) {
              this.calculate('inc', index, i);
            }
          }
        } else {
          _feeObj.pjQuatityNum.splice(index, 1, ++_feeObj.pjQuatityNum[index]);
          for (let i = 0; i < _feeObj.pjCheck.length; i++) {
            if (itemid === _feeObj.pjCheck[i]) {
              this.calculate('inc', index, i);
            }
          }
        }
      },

      /**
       * 数量改变时的操作
       * @param index
       * @param itemid
       * @param isDel
       */
      quatityChange(index, itemid, isDel) {
        let _feeObj = this.feeData;
        let _curNum = [];
        let _curCheck = [];           //当前处理的存取选项的数组
        let _curNumArr = [];          //当前处理的存取选择数量的数组
        let _curItemArr = [];         //当前处理的存取选项详细数据的数组

        //是否为正整数
        let isPositiveInteger = function(s) {
          var re = /^[0-9]+$/ ;
          return re.test(s);
        }

        if(this.dataType === 'service') {
          _curNum = _feeObj.fwQuatityNum;
          _curCheck = _feeObj.fwCheck;
          _curNumArr = _feeObj.fwQuatityNum;
          _curItemArr = _feeObj.fwItems;
        } else {
          _curNum = _feeObj.pjQuatityNum;
          _curCheck = _feeObj.pjCheck;
          _curNumArr = _feeObj.pjQuatityNum;
          _curItemArr = _feeObj.pjItems;
        }

        if(!isDel || _curNum[index]  > 0) {
          if(_curNum[index]  < 1) {
            this.$messenger.alert('数量必须为正整数');
            _curNum[index] = 1;
            _curNum.splice(index, 1, _curNum[index]);
          }

          if(!isPositiveInteger(_curNum[index])) {
            this.$messenger.alert('数量必须为正整数!');
            _curNum[index] = parseInt(_curNum[index]);
            _curNum.splice(index, 1, _curNum[index]);
          }

          for (let i = 0,len = _curCheck.length; i < len; i++) {
            if (itemid === _curCheck[i]) {
              this.calculate('change', index, i);
            }
          }
        } else if(isDel && _curNum[index]  <= 0) {
          for (let i = 0,len = _curCheck.length; i < len; i++) {
            if (itemid === _curCheck[i]) {
              this.deletSelect(_curItemArr, _curCheck, index, itemid, i, len);
            }
          }
        }
      },
      /**
       * 回写费用
       */
      submitFee() {
        this.$store.commit(types.wos.setServiceData, {
          serviceType: this.dataType,
          feeData: this.feeData
        });
        this.$router.replace({path: '/wos/workOrder/' + this.entityId + '/valuation'});
        this.$router.go(-1);
      },
      /**
       * 清除输入
       */
      clearInput: function() {
        this.keywords = '';
      },
      /**
       * 清空已选择的服务或配件
       */
      clearSelect: function (isAlert) {
        let that = this;
        let clearFn = function (self) {
          let _feeObj = self.feeData;

          if(self.dataType === 'service') {
            _feeObj.fwCheck = [];
            _feeObj.fwItems = [];
          } else if(this.dataType === 'fitting') {
            _feeObj.pjCheck = [];
            _feeObj.pjItems = [];
          }
          self.calculate();
          self.feeDetailPopup = false;
        }

        if(isAlert) {
          this.$dlg.confirm("确定清空选项？", function () {
            clearFn(that);
          });
        } else {
          clearFn(that);
        }
      },
      /**
       * 显示隐藏详情页
       */
      showOrHideDetail: function () {
        this.feeDetailPopup = !this.feeDetailPopup;
      },
      /**
       * 回车搜索配件
       */
      searchPj: function() {
        let _keywords = this.keywords;
        if(_keywords !== '') {
          if(this.dataType === 'fitting') {
            if(this.dataType === 'fitting') {
              this.$http.get(this.$apihost + '/products/' + this.servicesData.product.id + '/parts', {
                'q': _keywords
              })
                .then((res) => {
                  this.pjListData = res;
                })
            }
          }
        }
      },
      /**
       * 实时搜索
       */
      autoSearch() {
        if(!this.isComparing) {
          let that = this;
          let _openFlag = false;                //定时器开关标识
          let _compareKey = '';                 //与搜索词进行比较的存储器
          let T = function() {
            that.isComparing = true;            //是否允许比较搜索事件的标志
            if(_openFlag) {
              that.searchPj();
              that.isComparing = false;
              clearTimeout(T);
              return false;
            }

            if(_compareKey !== that.keywords) {
              _compareKey = that.keywords;
            } else if(!_openFlag) {
              _openFlag = true;
            }

            setTimeout(T,500);
          }
          if(that.keywords.length > 0) {
            T();
          }
        }
      },
      /**
       * 判断是否实时搜索还是回车搜索
       * @param e
       */
      searchKey(e) {
        if (this.dataType === 'fitting') {
          if(e.keyCode === 13) {
            this.searchPj();
          } else {
            this.autoSearch();
          }
        }
      }
    }
  }
</script>
