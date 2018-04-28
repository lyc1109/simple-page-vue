<!-- 手动添加设备 -->
<style scoped lang="scss" type="text/scss">
  @import '~variables';
  @import 'src/assets/scss/components/_popupwindow';
  .flex-item-2 {
    flex: 0 0 20%;
    padding-top: 20%;
    position: relative;
  }
  .text-wrapper-2line {
    white-space: initial;
  }
  .line-top {
    background: $page_bg;
  }
  .product-image {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    justify-content: center;
    img {
      max-width: fit-content;
      width: auto;
      height: 100%;
    }
  }
  .product-info {
    flex-direction: column;
  }
  .order-info-item {
    align-items: flex-start;
    padding-left: 0!important;
    margin-left: rem($m);
    @extend %padding-m;
    &:first-child {
      margin-left: 0;
      padding-left: rem($m)!important;
    }
  }
  .devices-field {
    position: absolute;
    left: 0;
    right: 0;
    min-height: calc(100% - 305px);
    .mint-cell-value {
      font-weight: 500;
    }
  }
  .page-footer {
    z-index: 10;
    @include border(top);
    button {
      height: rem(45px);
      margin-left: 0!important;
    }
  }
</style>
<style lang="scss" type="text/scss">
  @import '~variables';

  .imgs-box {
    flex-wrap: wrap;
    .square-uploadimg.opactiyClass {
      height: 0;
      overflow: hidden;
    }
    .img-item {
      position: relative;
      width: rem(70px);
      height: rem(70px);
      @include border(all);
    }
    .iconfont {
      position: absolute;
      top: -8px;
      right: -8px;
    }
    .file-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 5;
      opacity: 0;
    }
  }
</style>
<template>
  <div>
    <app-view :hasFooter="false">
      <router-link to="/devices/choose">
        <div class="padding-m flex order-info-item bg-white">
          <div class="flex-item-2 margin-right-m">
            <div class="product-image valign-center border border-radius">
              <img v-lazy="$filters.img((serviceItem && serviceItem.coverImage ? serviceItem.coverImage : ''),'!q70')">
            </div>
          </div>
          <div class="product-info flex-item flex">
            <div class="font-m font-title text-wrapper">
              <span class="order-productname font-bold-400 text-wrapper-2line"> {{ serviceItem.name ? serviceItem.name : '无产品名称' }} </span>
            </div>
            <div class="font-s font-lighter margin-top-s text-wrapper">产品型号：{{ serviceItem.itemCode ? serviceItem.itemCode : '无产品型号' }} </div>
            <div class="flex-item"></div>
          </div>
        </div>
      </router-link>

      <div class="form-group margin-top">
        <v-date-picker class="form-field" label="购买日期" placeholder="请选择购买日期"
                       v-model="formData.purchaseDate"
                       :startDate="startDate"
                       :endDate="endDate"
                       :defaultVal="$filters.formatDate(new Date())"></v-date-picker>
        <div class="flex padding border-bottom"
             @click.stop="selectAddress()">
          <div style="width: 80px" class="font-light">联系地址</div>
          <div class="flex-item flex">
            <div class="flex-item padding-right-m text-wrapper-overline">{{formData.fullAddress}}</div>
            <i class="fa fa-angle-right font-lighter"></i>
          </div>
        </div>
        <v-date-picker class="form-field" label="发票日期" placeholder="请选择发票日期"
                       v-model="formData.serviceDate"
                       :startDate="startDate"
                       :endDate="endDate"
                       :defaultVal="$filters.formatDate(new Date())"></v-date-picker>
      </div>
      <div class="devices-field padding-left-m padding-bottom-m bg-white margin-bottom-xl">
        <div class="font-light padding-m padding-left">发票图片</div>
        <div class="imgs-box flex padding-left">
          <!--<div class="img-item bg-image margin-bottom-m margin-right-m"-->
          <!--v-for="(item, index) in imgArr"-->
          <!--:style="{ backgroundImage: 'url(' + $filters.img(item) + ')' }"-->
          <!--@click.stop="showImg(index)">-->
          <!--<i class="iconfont icon-iot-guanbi color-red-1" @click.stop="deleteImg(index)"></i>-->
          <!--</div>-->
          <div class="margin-bottom-m margin-right-m square-uploadimg">
            <v-image className="img-item"
                     btnText="十"
                     :crop="false"
                     :changeImg="imagechanged"
                     :delImg="deleteImg"
                     errorTips="请选择图片"
                     :uploadImg="uploadImg"
                     :uploadErr="uploadErr"
                     :isOnly="true"></v-image>
          </div>
        </div>
      </div>

      <div class="page-footer bg-white">
        <button type="button"
                class="btn btn-primary btn-block"
                id="btnSubmit"
                @click="confirmRegister">立即绑定设备</button>
      </div>
    </app-view>

    <address-selector :isBack="false"></address-selector>
  </div>
</template>

<script type="text/javascript">
  import VSelector from "@/components/ui/v-selector";
  import VDatePicker from "@/components/ui/v-date-picker";
  import AddressSelector from "@/pages-member/shop-member/address-selector";
  import VImage from '@/components/ui/v-image';

  import moment from "moment";
  import types from "@/store/types";

  import shopMemberApi from "@/apis/api-shop-member";
  import productApi from "@/apis/api-product";

  export default {
    name: 'devices-bind',
    data() {
      return {
        // 当前设备数据
        serviceItem: [],
        // 填写的设备数据
        formData: {
          purchaseDate: new Date(),
          serviceDate: new Date(),
          address: {},
          purchaseChannel: '',
          fullAddress: "",
        },
        // 是否显示地址选择页面
        showAddressSelector: false,
        // 所选的图片的base64数组，用以预览
        imgArr: [],
        // 上传后的图片对象
        imgEntity: {},
        // 扫码出来的设备编码
        scanId: this.$route.query && this.$route.query.scanId,
        // 是否正在上传图片
        isLoading: false,
        prevPage: '',
      }
    },
    beforeRouteEnter(to,from,next){
      next((vm) => {
        vm.prevPage = from.path
      })
    },
    created() {
      let that = this;
      that.$store.state.showLoading = true;

      shopMemberApi.findDefaultAddress()
        .then((data) => {
          if (data && JSON.stringify(data) !== '[]') {
            that.formData.fullAddress = data.fullAddress;
            that.formData.address = data;
          }
        });

      let queryData = that.$route.query;
      let _deviceData = queryData.data;
      if(_deviceData) {
        that.serviceItem = JSON.parse(decodeURIComponent(_deviceData));
      }

      // 统一扫码处理
      let deviceId = queryData.deviceId;
      if(!this.$filters.isUndefined(deviceId)) {
        productApi.findByDeviceId(deviceId)
          .then((product) => {
            this.serviceItem = product;
            this.serviceItem.specId = queryData.productSpecId;
            this.scanId = deviceId;
          });
      }

      setTimeout(function() {
        that.$store.state.showLoading = false;
      }, 500)
    },
    computed: {
      /**
       * 最小可选择日期
       */
      startDate: function () {
        return moment().startOf('year').subtract('80', 'years').toDate();
      },
      /**
       * 最大可选择日期，默认今天
       */
      endDate: function () {
        return moment().toDate();
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        this.$bus.on("address-selected", (address) => {
          this.formData.fullAddress = address.fullAddress;
          this.formData.address = address;
        });
        window.onpopstate = () => {
          if(this.$route.query.urlQuery && this.$route.query.urlQuery.indexOf('jbr') > -1){
            this.$router.replace('/jbr/home')
          }else{
            if(!window.location.hash) {
              this.$router.replace('/devices');
            }
          }
        }
      });
    },
    methods: {
      /**
       * 获取设备数据
       * @param data
       */
      getData(data) {
        this.serviceItem = data;
      },
      /**
       * 成功上传图片回调
       */
      uploadImg(res) {
        let _temp = res && res[0];
//        this.imgEntity.push(_temp);
        this.imgEntity = _temp;
        this.isLoading = false;
      },
      /**
       * 上传图片失败回调
       */
      uploadErr(res) {
        this.$toast.error('上传图片失败');
      },
      /**
       * 选择图片
       * @param res
       */
      imagechanged(res) {
        let that = this;
        let _uploadTemp = [];
        let _temp = res && res.curImg;

        that.imgArr = res && res.imgBase64;
        _uploadTemp.push(_temp);
        that.isLoading = true;
        setTimeout(function() {
          that.$bus.emit('upload-img', _uploadTemp);
        },500);
      },
      /**
       * 删除图片
       * @param index
       */
      deleteImg(index) {
        this.$bus.emit('delete-img', index);
        this.imgArr.splice(index, 1);
      },
      /**
       * 放大预览图片
       * @param index 当前图片的索引
       */
      showImg(index) {
        this.$bus.emit('show-img', {
          imgIndex: index
        });
      },
      /**
       * 绑定设备
       */
      confirmRegister() {
        let that = this;
        if(JSON.stringify(that.formData.address) === '{}') {
          that.$toast.error('请输入地址！');
          return false;
        }
        if(that.isLoading) {
          that.$toast.error('图片正在上传，请稍等片刻~');
          return false;
        }

        that.$dlg.confirm("是否立即绑定设备?",  () => {
          that.$store.commit("showLoading");

          let _temp = that.formData;
          let _params = {
            address: _temp.address.fullAddress,
            area: _temp.address.area,
            city: _temp.address.city,
            province: _temp.address.province,
            deviceName: that.serviceItem.name,
            invoiceDate: that.$filters.formatDate(_temp.serviceDate),
            invoiceImageId: that.imgEntity && that.imgEntity.id,
            productId: that.serviceItem.id,
            productSpecId: that.serviceItem.specId ? that.serviceItem.specId : null,
            purchasedDate: that.$filters.formatDate(_temp.purchaseDate)
          };

          if(that.scanId) {
            _params.deviceId = that.scanId;
          } else {
            _params.deviceId = '';
          }
          that.$http.post(`${that.$apihost}/userdevices/register/common`,{},true,_params)
            .then((res) => {
              that.$router.replace({
                path: `/devices/${res.id}/view`
              });
            })
        });
      },
      /**
       * 选择地址
       */
      selectAddress() {
        window.location.hash = 'address';
        this.$store.commit(types.shopMember.setShowAddressSelector, true);
      },
    },
    components: {
      VSelector,
      VDatePicker,
      AddressSelector,
      VImage,
    }
  }
</script>
