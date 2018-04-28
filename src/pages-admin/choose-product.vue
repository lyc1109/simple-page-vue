\<style lang="scss" type="text/scss">
  @import "~variables";

  .chooseDevice-page {
    width: 100%;
    height: 100%;
    background-color: $white;
  }
  .mint-radiolist-label {
    position: absolute;
    left: 0;
    right: 0;
    height: 100%;
    @extend %valign-center;
  }
</style>
<style scoped type="text/scss" lang="scss">
  @import "~variables";

  .popup-window {
    height: 100%;
    overflow: auto;
    display: inherit;
  }
  .popup-window {
    .popup-window-title {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999;
      background-color: $white!important;
      .bg-light {
        background: lighten($page_bg,3%);
      }
      .key-box {
        //padding: rem($s) rem($m);
        background: lighten($page_bg,2%);
        @include border-radius(35px);
        .bg-light {
          background: lighten($page_bg,2%);
        }
        .key-input {
          width: 100%;
          padding: 0;
          border: none;
        }
        .icon-guanbi {
          color: lighten($font-lighter,13%);
        }
      }
    }
    .popup-window-body {
      padding-top: 0;
      margin: rem(55px) 0 rem(55px);
    }
  }
  .mint-radio-input[disabled] + .mint-radio-core {
    border: none!important;
  }
  .page-footer {
    z-index: 15;
  }
  .mint-cell-wrapper {
    height: 100%;
  }
  .cell-group {
    padding-left: 0!important;
    background: $page_bg;
    .cell-item:last-child {
      @include  border(bottom);
    }
  }
  .mint-cell-footer {
    color: #666;
    text-align: right;
  }
  .service-box,
  .specs-box {
    position: relative;
    @include border(bottom);
    .goods-content {
      height: rem(60px);
      white-space: initial;
      flex-direction: column;
      justify-content: flex-start;
      .flex-vdir {
        flex-direction: column;
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
    .goods-image {
      width: rem(60px);
      height: rem(60px);
      overflow: hidden;
      justify-content: center;
      img {
        height: 100%;
        width: auto;
        max-width: fit-content;
      }
    }
  }
  .device-box {
    .device-footer {
      background: lighten($page_bg,4%);
      align-items: flex-start;
      .goods-content {
        height: auto;
      }
      .product-title {
        color: $font-title;
      }
      .goods-image {
        width: rem(45px);
        height: rem(45px);
        overflow: hidden;
        justify-content: center;
        img {
          height: 100%;
          width: auto;
          max-width: fit-content;
        }
      }
    }
  }
  .page-footer button {
    height: rem(45px);
    margin-left: 0!important;
  }
</style>

<!-- 添加设备 -->
<template>
  <div class="popup-window">
    <div class="popup-window-content">
      <div class="popup-window-title padding-left-m padding-right-m padding-top padding-bottom flex bg-white">
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
      <div class="popup-window-body">
        <div class="cell-group">
          <app-page type="device"
                    :url="page.url"
                    :params="page.params"
                    :storeMutation="page.storeMutation"
                    :storeGetter="page.storeGetter"
                    @loaded="onPageLoaded"
                    class="device-box bg">
            <div v-if="productData && productData.length>0"
                 class="device-box"
                 v-for="(item, index) in productData">
              <div class="device-header flex service-box padding-m valignc-center margin-top bg-white">
                <label class="mint-radiolist-label padding-left-m"
                       v-if="!(item.specs && item.specs.length > 0)">
                <span class="mint-radio">
                  <input type="radio"
                         class="mint-radio-input"
                         name="deviceSelect"
                         :value="item.id"
                         v-model="productCheck"
                         @click="addDevice({
                          name: item.name,
                          id: item.id,
                          itemCode: item.itemCode,
                          coverImage: item.coverImage
                         })">
                  <span class="mint-radio-core"></span>
                </span>
                </label>
                <label class="mint-radiolist-label padding-left-m"
                       v-else-if="item.specs && item.specs.length > 0"
                       @click="showSpecs(index)">
                  <span class="mint-radio">
                    <input type="radio" class="mint-radio-input" disabled name="deviceSelect">
                    <span class="mint-radio-core"></span>
                  </span>
                </label>

                <div class="goods-image margin-left-xl margin-right-m border border-radius valign-center">
                  <img v-lazy="$filters.img(item.coverImage,'!q70')"/>
                </div>
                <div class="flex-item flex goods-content">
                  <div class="product-title"><div class="text-wrapper-2line font-bold-400 font-m">{{ item.name }}</div></div>
                  <div class="flex-item"></div>
                  <div class="product-footer font-light">
                    <span v-if="!item.specs && item.itemCode != ''">产品型号：{{ item.itemCode }}</span>
                    <div v-else-if="item.specs" class="flex">
                      请选择规格信息
                      <div class="flex-item"></div>
                      <i class="fa font-lighter font-m" :class="specsBoxShow[index] === false ? 'fa-angle-down' : 'fa-angle-up'"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="device-footer"
                   v-if="item.specs"
                   v-show="specsBoxShow[index]">
                <div class="flex specs-box padding-left-xxl"
                     v-for="specItem in item.specs"
                     @click="addDevice({
                              name: item.name,
                              id: item.id,
                              specId: specItem.id,
                              itemCode: specItem.itemCode,
                              coverImage: specItem.coverImage
                             })">
                  <label class="mint-radiolist-label padding-left-xxl">
                    <span class="mint-radio">
                      <input type="radio"
                             class="mint-radio-input"
                             name="deviceSelect"
                             :value="specItem.id"
                             v-model="productCheck">
                      <span class="mint-radio-core"></span>
                    </span>
                  </label>
                  <div class="flex padding-m padding-left-xl" style="align-items: flex-start">
                    <div class="goods-image border border-radius valign-center">
                      <img v-lazy="$filters.img(specItem.coverImage,'!q70')"/>
                    </div>
                    <div class="flex-item flex margin-left-m goods-content">
                      <div class="product-title margin-bottom-s"><div class="text-wrapper font-bold-400">产品型号：{{ specItem.itemCode }}</div></div>
                      <div class="flex-item"></div>
                      <div class="product-footer font-light text-wrapper-2line font-s flex" style="flex-wrap: wrap">
                        <div v-for="optionItem in specItem.specItems" class="margin-right-m margin-top">{{ optionItem.name }}:{{ optionItem.value }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!productData || productData.length <= 0" class="margin-top">
              <div class="padding-l align-center text-second bg-white" style="height:100%">暂无设备可选</div>
            </div>
          </app-page>
        </div>
      </div>

      <div class="page-footer bg-white flex">
        <button type="button" class="btn btn-block flex-item" @click="cancel()">取消</button>
        <button type="button" class="btn btn-primary btn-block" id="btnSubmit" @click="selectDevice()">确定</button>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import types from "@/store/types";
  import AppPage from '@/components/layouts/app-page';

  export default {
    name: 'choose-product',
    // [deviceId: 设备id（混淆后）] [type: 需要更新的产品类型,为lease则表示更新所属租赁产品信息]
    props: ['deviceId','type','leaseSet'],
    components: {
      AppPage
    },
    data() {
      return {
        // 搜索关键字
        keywords: '',
        isComparing: false,
        // 选择的产品
        productCheck: '',
        // 产品数据
        productData: [],
        // 规格显示隐藏
        specsBoxShow: [],
        // 选择的产品数据
        checkData: {},
        // 所属产品api
        url: `${this.$apihost}/admin/tools/products`,
        // 所属租赁产品api
        leaseUrl: `${this.$apihost}/admin/tools/lease/products`,
        // 更新所属产品api
        updateUrl: `${this.$apihost}/devices/${this.deviceId}/product`,
        // 更新所属租赁产品api
        updateLeaseUrl: `${this.$apihost}/admin/tools/lease/devices/${this.deviceId}/product`,
      }
    },
    created() {
      this.$loading.show();
    },
    computed: {
      // 当前店铺
      curShop () {
        return this.$store.getters[types.oauth.getCurShop];
      },
      // 数据源url
      productDataUrl() {
        let _type = this.type;
        let _url = '';
        if(_type) {
          _url = this.type === 'lease' ? this.leaseUrl : this.url
        }
        return _url;
      },
      // 更新api
      updateApi() {
        return (this.type && this.type === 'lease' ? this.updateLeaseUrl : this.updateUrl);
      },
      // 分页参数
      page () {
        let that = this;
        let _isLease = that.type && that.type === 'lease';
        let _params = {
          page_size: 10,
          shop_id: this.curShop && this.curShop.id,
        };

        if(_isLease) {
          _params.scenario = this.leaseSet && this.leaseSet.scenarioCode;
        }
        return {
          url: this.productDataUrl,
          params: _params,
          storeMutation: types.userDevices.setPageData,
          storeGetter: ''
//          storeGetter: types.userDevices.getPageData
        }
      },
    },
    methods: {
      /**
       * 页面加载后操作
       * @param fileList
       */
      onPageLoaded (fileList) {
        let that = this;
        that.$store.commit("hideLoading");
        that.$loading.hide();

        that.productData = fileList;

        let _device = fileList;
        if(_device) {
          for(let i = 0,len = _device.length; i < len; i++) {
            that.specsBoxShow.push(false);
          }
        }
      },
      /**
       * 显示规格选项
       * @param index
       */
      showSpecs(index) {
        let _temp = this.specsBoxShow[index];
        this.specsBoxShow.splice(index, 1, !_temp);
      },
      /**
       * 选中状态
       * @param items
       */
      addDevice(items) {
        this.checkData = items;
      },
      /**
       * 选择设备
       */
      selectDevice() {
        let that = this;
        let _isLease = that.type && that.type === 'lease';
        let _param = {};

        if(_isLease) {
          _param = {
            lease_product: that.productCheck
          };
        } else {
          _param = {
            product: that.productCheck
          };
        }
        if(that.productCheck !== '') {
          that.$http.post(`${that.updateApi}`, _param).then((res) => {
            if(res) {
              that.$toast.success('修改成功！');
              that.productCheck = '';
              that.$emit('prdtSuccess');
            }
          })
        } else {
          this.$toast.error('请选择一个要绑定的设备');
        }
      },
      /**
       * 清除输入
       */
      clearInput() {
        this.keywords = '';
        this.searchProduct();
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
              that.searchProduct();
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
       * 搜索
       */
      searchProduct() {
        let that = this;
        let _isLease = that.type && that.type === 'lease';
        let _searchword = this.keywords;
        that.productCheck = '';

        let _param = {
          'q': _searchword,
          'shop_id': this.curShop && this.curShop.id,
        };
        if(_isLease) {
          _param.scenario = this.leaseSet && this.leaseSet.scenarioCode;
        }
        //手动添加的产品只能是普通产品
        this.$http.get(`${this.productDataUrl}`, _param)
          .then((res) => {
            this.productData = res.fileList;
            let _device = this.productData;
            let that = this;
            if(_device) {
              for(let i = 0,len = _device.length; i < len; i++) {
                that.specsBoxShow.push(false);
              }
            }
          });
      },
      /**
       * 判断是否实时搜索还是回车搜索
       * @param e
       */
      searchKey(e) {
        if(e.keyCode === 13) {
          this.searchProduct();
        } else {
          this.autoSearch();
        }
      },
      /**
       * 取消
       */
      cancel() {
        this.$router.go(-1);
      }
    }
  }
</script>
