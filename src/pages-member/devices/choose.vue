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
  <div v-show="!showLoading" class="popup-window">
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
          <div v-if="deviceData && deviceData.length>0"
               class="device-box"
               v-for="(item, index) in deviceData">
            <div class="device-header flex service-box padding-m valignc-center margin-top bg-white">
              <label class="mint-radiolist-label padding-left-m"
                     v-if="!(item.specs && item.specs.length > 0)">
              <span class="mint-radio">
                <input type="radio"
                       class="mint-radio-input"
                       name="deviceSelect"
                       :value="item.id"
                       v-model="deviceCheck"
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
                           v-model="deviceCheck">
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
          <div v-if="!deviceData || deviceData.length <= 0" class="margin-top">
            <div class="padding-l align-center text-second bg-white" style="height:100%">暂无设备可选</div>
          </div>
        </div>
      </div>

      <div class="page-footer bg-white">
        <button type="button" class="btn btn-primary btn-block" id="btnSubmit" @click="selectDevice">确定</button>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { Toast } from 'mint-ui'
  import types from "@/store/types";

  export default {
    name: 'devices-choose',
    data() {
      return {
        keywords: '',       //搜索关键字
        isComparing: false,
        deviceCheck: '',    //选择的设备
        deviceData: [],     //设备数据
        specsBoxShow: [],   //规格显示隐藏
        checkData: {},      //选择的设备数据
        showLoading: true
      }
    },
    created() {
      let that = this;
      that.$store.state.showLoading = true;
      this.$http.get(this.$apihost + '/products/find',{
        device_type: 'C',
        product_type: 'CP'
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
      setTimeout(function () {
        that.showLoading = false;
        that.$store.state.showLoading = false;
      }, 1000);
    },
    methods: {
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
        if(this.deviceCheck !== '') {
          this.$router.replace({
            path: `/devices/bind`,
            query: {
              data: encodeURIComponent(JSON.stringify(this.checkData)),
              urlQuery: this.$route.query.urlQuery && this.$route.query.urlQuery.indexOf('jbr') > -1 ? this.$route.query.urlQuery : ''
            }
          });
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
        this.deviceCheck = '';
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
