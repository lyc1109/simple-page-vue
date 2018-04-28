<style lang="scss" type="text/scss">
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
    display: inherit;
  }
  .popup-window {
    .popup-window-title {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999;
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
      margin: rem(48px) 0 rem(50px);
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
      <div class="popup-window-title padding-m flex bg-yellow-4">
        请选择要报修的设备
        <!--<div class="key-box flex flex-item">-->
          <!--<i class="font-lighter iconfont icon-iot-search"></i>-->
          <!--<input type="text" placeholder="搜索产品" class="key-input bg-light padding-left-s" v-model="keywords" @keyup="searchKey($event)">-->
          <!--<i class="iconfont icon-iot-guanbi font-lighter" @click="clearInput" :style="{'display': keywords.length > 0 ? 'inline-block' : 'none' }"></i>-->
        <!--</div>-->
        <!--<div class="margin-left-m font-light valign-center" @click="searchKey($event)">-->
          <!--<i class="iconfont icon-IOT-sx"></i>-->
          <!--<span>搜索</span>-->
        <!--</div>-->
      </div>
      <div class="popup-window-body">
        <app-page type="device"
                  :url="page.url"
                  :params="page.params"
                  :storeMutation="page.storeMutation"
                  :storeGetter="page.storeGetter"
                  @loaded="onPageLoaded"
                  class="device-box bg">
          <div class="cell-group">
            <div v-if="deviceData && deviceData.length"
                 class="device-box"
                 v-for="(item, index) in deviceData">
              <div class="device-header flex service-box padding-m valignc-center margin-top bg-white">
                <label class="mint-radiolist-label padding-left-m">
                  <span class="mint-radio">
                    <input type="radio"
                           class="mint-radio-input"
                           name="deviceSelect"
                           :value="(item.device && item.device.id)"
                           v-model="deviceCheck"
                           @click="addDevice({
                            id: (item.device && item.device.id)
                           })">
                    <span class="mint-radio-core"></span>
                  </span>
                </label>

                <div class="goods-image margin-left-xl margin-right-m border border-radius valign-center">
                  <img v-lazy="$filters.img((item.device && item.device.productImage),'!wh100')"/>
                </div>
                <div class="flex-item flex goods-content">
                  <div class="product-title"><div class="text-wrapper-2line font-bold-400 font-m">{{ (item.device && item.device.deviceName) || '无设备名称' }}</div></div>
                  <div class="product-footer font-light">
                    设备SN码：{{ (item.device && item.device.deviceId) || '无' }}
                  </div>
                  <div class="product-footer font-light">
                    产品型号：{{ (item.device && item.device.itemCode) || '无' }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!deviceData || deviceData.length <= 0" class="margin-top">
              <div class="padding-l align-center text-second bg-white" style="height:100%">暂无设备可选</div>
            </div>
          </div>
        </app-page>
      </div>

      <div class="page-footer bg-white">
        <button type="button" class="btn btn-primary btn-block" id="btnSubmit" @click="selectDevice">确定</button>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import types from "@/store/types";
  import AppPage from '@/components/layouts/app-page';

  export default {
    name: 'repair-choose',
    components: {
      AppPage
    },
    data() {
      return {
        keywords: '',
        //搜索关键字
        isComparing: false,
        //选择的设备
        deviceCheck: '',
        //设备数据
        deviceData: {},
        //选择的设备数据
        checkData: {},
      }
    },
    created() {
      let that = this;
      that.$store.state.showLoading = false;
      that.$loading.show();
//      this.$http.get(`${this.$apihost}/userdevices`)
//        .then((res) => {
//          this.deviceData = res.fileList;
//          let _device = this.deviceData;
//          let that = this;
//          if(_device) {
//            for(let i=0,len=_device.length; i<len; i++) {
//              that.specsBoxShow.push(false);
//            }
//          }
//        });
    },
    computed: {
      page () {
        return {
          url: this.$apihost + "/userdevices",
          params: {
            page_size: 10,
            page_sort: 'createdDate_desc',
          },
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
        this.$loading.hide();
        this.deviceData = fileList;
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
        if(that.deviceCheck !== '') {
          that.$router.replace({
            path: `/repair`,
            query: {
              deviceId: that.checkData && that.checkData.id
            }
          });
        } else {
          that.$toast.error('请选择一个要绑定的设备');
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
        let _device_type = 'C';
        let _product_type = 'CP';
        let _searchword = this.keywords;
        //手动添加的产品只能是普通产品
        this.$http.get(this.$apihost + '/products/find',{
          'q': _searchword,
          'device_type': _device_type,
          'product_type': _product_type
        })
          .then((res) => {
            this.deviceData = res.fileList;
            let _device = this.deviceData;
            let that = this;
            if(_device) {
              for(let i=0,len=_device.length; i<len; i++) {
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
      }
    }
  }
</script>
