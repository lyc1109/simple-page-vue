<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .header {
    width: 100%;
  }
  .img-thumbnail {
    border: none;
  }
  .app-footer {
    &>div {
      @include border(top);

      .valign-center {
        float: right;
        height: rem(50px);

        .btn {
          @include border-radius(20px);
          border: rem(1px) solid $font-lighter;
        }
      }
    }
  }
</style>
<style lang="scss" type="text/scss">
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
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    overflow: hidden;
    justify-content: center;

    img {
      height: 100%;
      width: auto;
      max-width: initial;
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
    bottom: 0;
    top: rem(98px);
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
  .chooseDevice-page {
    width: 100%;
    height: 100%;
    background-color: $white;
  }
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
    <!--设备详情页面-->
    <app-view :hasFooter="false">
      <div class="padding-m flex order-info-item bg-white">
        <div class="flex-item-2 margin-right-m">
          <div class="product-image valign-center border border-radius">
            <img v-lazy="$filters.img((entity.device && entity.device.productImage ? entity.device.productImage : ''),'!wh100')"
                 :src="$filters.img((entity.device && entity.device.productImage ? entity.device.productImage : ''),'!wh100')">
          </div>
        </div>
        <div class="product-info flex-item flex">
          <div class="font-m font-title text-wrapper">
            <span class="order-productname font-bold-400 text-wrapper-2line"> {{ entity.device && entity.device.deviceName ? entity.device.deviceName : '' }} </span>
          </div>
          <div class="font-s font-lighter margin-top-s text-wrapper">产品型号：{{ entity.device && entity.device.itemCode ? entity.device.itemCode : '' }} </div>
          <div class="flex-item"></div>
        </div>
      </div>
      <div class="padding-top line-top"></div>

      <div class="form-group devices-field">
        <v-input v-if="type === 'name'"
                 type="text" class="form-field required" name="purchaseChannel" label="设备别名" placeholder="请填写设备别名"
                 v-model="formData.nickname"
                 v-validate="'required'"
                 data-vv-as="设备别名"
                 :error-msg="errors.first('purchaseChannel')"></v-input>
        <div v-if="entity.device && entity.device.deviceType && entity.device.deviceType !== 'L'">
          <v-date-picker v-if="type === 'date'"
                         class="form-field" label="发票日期" placeholder="请选择发票日期"
                         v-model="formData.serviceDate"
                         :startDate="startDate"
                         :endDate="endDate"
                         :defaultVal="$filters.formatDate(new Date())"></v-date-picker>
          <div v-if="type === 'pic'" class="form-field">
            <div class="font-light padding-m padding-left-zero">发票图片</div>
            <!--<div class="imgs-box flex">-->
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
            <!--</div>-->
          </div>
        </div>
      </div>

      <div class="page-footer bg-white" @click="saveModify">
        <button type="button"
                class="btn btn-primary btn-block"
                id="btnSubmit">保存设备信息</button>
      </div>
    </app-view>
  </div>
</template>

<script>
  import VCell from '@/components/ui/v-cell.vue';
  import VDatePicker from "@/components/ui/v-date-picker";
  import VImage from '@/components/ui/v-image';
  import moment from "moment";

  export default{
    name: "devices-edit",
    data() {
      return {
        // 设备数据
        entity: {},
        // 编辑类型
        type: (this.$route.query && this.$route.query.type) || 'name',
        // 设备昵称、发票日期等表格数据
        formData: {
          nickname: '',
          serviceDate: new Date(),
        },
        // 发票图片
        imgArr: [],
        // 图片上传成功后服务器返回的数据
        imgEntity: {},
        // 正在上传
        isLoading: false
      }
    },
    created() {
      this.$http.get(this.$apihost + '/userdevices/' + this.$route.params.id)
      .then((data) => {
        this.entity = data;
        let _temp = data.device;
        this.formData.nickname = _temp.deviceName;
      })
      this.$store.commit("hideLoading");
    },
    computed: {
      /**
       * 最小可选择日期
       */
      startDate: function () {
        return moment().startOf('year').subtract('2','years').toDate();
      },
      /**
       * 最大可选择日期
       */
      endDate: function () {
        return moment().toDate();
      }
    },
    methods: {
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
       * 修改用户设备信息
       */
      saveModify() {
        let that = this;
        let _that = this.formData;
        let _type = this.type;
        let _params = {};

        if(_type === 'name') {
          if(!_that.nickname) {
            this.$messenger.error('请输入设备别名');
            return;
          }
          _params = {
            device_name: _that.nickname,
            userDeviceEntityId: that.entity.id
          };
        } else if(_type === 'pic') {
          if(that.isLoading) {
            that.$toast.error('正在上传图片...请稍后');
            return false;
          }
          if(that.imgArr && JSON.stringify(that.imgArr) !== '[]') {
            if(!that.imgEntity || JSON.stringify(that.imgEntity) === '[]') {
              this.$messenger.error('图片尚未上传，请重新选择图片');
              return false;
            }
          }
          _params = {
            invoice_image: that.imgEntity && that.imgEntity.id,
            userDeviceEntityId: that.entity.id
          };
        } else {
          _params = {
            invoice_date: that.$filters.formatDate(_that.serviceDate),
            userDeviceEntityId: that.entity.id
          };
        }

//        let _params = {
//          device_name: _that.nickname,
//            invoice_date: that.$filters.formatDate(_that.serviceDate),
//          invoice_image: that.imgEntity && that.imgEntity.id,
//          userDeviceEntityId: that.entity.id
//        }

        this.$messagebox({
          title: '提示',
          message: '是否确认修改设备信息?',
          showCancelButton: true
        }).then((action) => {
          if(action === 'confirm') {
            this.$http.post(`${that.$apihost}/userdevices/${that.entity.id}`, _params)
              .then((res) => {
                this.$toast.success('修改成功!');
                setTimeout(() => {
                  if(this.$route.query.urlQuery === 'jbr'){
                    this.$router.replace({
                      path: `/devices/${that.$route.params.id}/view`,
                      query: {
                        urlQuery: that.$route.query.urlQuery && this.$route.query.urlQuery.indexOf('jbr') > -1 ? this.$route.query.urlQuery : ''
                      }
                    });
                  }else{
                    this.$router.replace(`/devices/${that.$route.params.id}/view`);
                  }
                  this.$router.go(-1);
                },500);
              });
          }
        });
      },
      /**
       * 选择图片
       * @param res
       */
      imagechanged(res) {
        let that = this;
        let _uploadTemp = [];
        let _temp = res && res.curImg;

        that.isLoading = true;
        that.imgArr = res && res.imgBase64;
        _uploadTemp.push(_temp);

        setTimeout(function() {
          that.$bus.emit('upload-img', _uploadTemp);
        },500);
      },
      /**
       * 删除图片
       * @param index
       */
      deleteImg(index) {
        this.imgArr.splice(index,1);
        this.$bus.emit('delete-img', index);
      },
      /**
       * 展示大图
       * @param index
       */
      showImg(index) {
        this.$bus.emit('show-img',{
          imgIndex: index
        });
      }
    },
    components: {
      VDatePicker,
      VCell,
      VImage
    }
  }
</script>
