<style lang="scss" type="text/scss">
  @import "~variables";

  .show-image-popup {
    width: 80%;
    height: 80%;
    background: transparent;
    justify-content: center;
    overflow: hidden;

    .mint-swipe {
      width: 100%;

      .show-item {
        height: 100%;
        width: 100%;
        overflow: hidden;
        justify-content: center;

        img {
          width: auto;
          height: auto;
          max-height: 100%;
        }
      }
    }
  }
  .disabled-bg {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
  }
  .imgs-box {
    flex-wrap: wrap;

    &.flex-right {
      justify-content: flex-end;
    }

    .square-uploadimg {
      position: relative;
      &.opacityUpload {
        height: 0;
        overflow: hidden;
      }
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
    .v-modal {
      opacity: 0.7;
      filter: Alpha(opacity=70);
    }
    .uploading-bg {
      background: rgba(0,0,0,.5);
      width: 100%;
    }
  }
</style>
<template>
  <div :class="{ 'flex': !isUpload }">
    <div v-if="!isUpload" class="flex-item"></div>
    <div :class="{ 'imgs-box flex padding-top-m': crop !== 'local' }">
      <div class="img-item bg-image margin-bottom-m margin-right-m"
           v-if="imgList && imgList.length >= 1 && crop !== 'local'"
           v-for="(item, index) in imgList"
           :style="{ backgroundImage: 'url(' + $filters.img(item) + ')' }"
           @click.stop="showImg(index)">
        <div v-if="isUpload">
          <i v-if="(index === Number(imgList.length - 1)) && (value !== 100 && isUploading === false)"
             class="iconfont icon-iot-guanbi color-red-1 close-btn" @click.stop="deleteImg(index)"></i>
          <i v-else-if="(index !== Number(imgList.length - 1))" class="iconfont icon-iot-guanbi color-red-1 close-btn" @click.stop="deleteImg(index)"></i>
        </div>
        <div v-if="isUpload && (index === Number(imgList.length - 1))" class="uploading-bg" :style="{ height: value + '%'  }"></div>
      </div>
      <div v-if="isUpload" :class="{ 'opacityUpload': isOnly && imgList.length >= 1, 'margin-bottom-m margin-right-m square-uploadimg':  crop !== 'local' }">
        <div v-show="isUploading" class="disabled-bg" @click.stop="loadingAlert()"></div>
        <vue-core-image-upload
          :class="className"
          :text="btnText"
          :extensions="extensions"
          :crop="crop"
          :cropRatio="cropRatio"
          :cropBtn="cropBtn"
          :maxFileSize="maxFileSize"
          :maxWidth="maxW"
          :max-height="maxH"
          :inputAccept="inputAccept"
          :isXhr="false"
          :multiple="true"
          ref="inputcheck"
          @imagechanged="imagechanged"
          style="justify-content: center;overflow: hidden">
        </vue-core-image-upload>
      </div>
    </div>
    <div>
      <!--上传进度-->
      <!--<mt-popup v-model="progressPopup" style="width: 100%;background: transparent;">
        <div class="padding-m bg-white margin-left-xxl margin-right-xxl">
          <div class="align-center">
            文件正在上传中...
          </div>
          <div v-if="!crop">
            <mt-progress v-if="uploadList && uploadList.length === 1"
                         :value="value" transition="progress-fade">
              <div slot="end">{{ value }}%</div>
            </mt-progress>
            <mt-progress v-if="uploadList && uploadList.length > 1"
                         :value="(value/(uploadList && uploadList.length))*100" transition="progress-fade">
              <div slot="end">{{ value }}/{{ uploadList && uploadList.length }}</div>
            </mt-progress>
          </div>
          <div v-else-if="crop">
            <mt-progress v-if="uploadList"
                         :value="value" transition="progress-fade">
              <div slot="end">{{ value }}%</div>
            </mt-progress>
          </div>
        </div>
      </mt-popup>-->

      <!--放大图片-->
      <v-show-image :imgList="imgList"></v-show-image>
    </div>
  </div>
</template>

<script>
  import types from '@/store/types';
  import VueCoreImageUpload from 'vue-core-image-upload';
  import VShowImage from './v-show-image';
  import ossUploader from "scripts/oss-uploader";

  export default {
    name: "v-image",
    props: {
      // 图片裁剪按钮的类名
      className: {
        type: String,
        default: '',
      },
      // 需要显示按钮的文本
      btnText: {
        type: String,
        default: ''
      },
      // 图片限制类型
      extensions: {
        type: String,
        default: 'png,gif,jpeg,jpg'
      },
      // 是否裁剪 [local: 本地裁剪; false: 不裁剪]
      crop: [String, Boolean],
      // 限制裁剪的形状(设置为auto表示不限制裁剪框形状)
      cropRatio: {
        type: String,
        default: '1:1'
      },
      // 按钮文本
      cropBtn: {
        type: Object,
        default: function() {
          return {
            ok: '确定',
            cancel: '取消'
          }
        }
      },
      // 文件大小限制,默认10M
      maxFileSize: {
        type: Number,
        default: 10485760
      },
      // 限制图片的最大宽度
      maxW: {
        type: Number,
        default: 150
      },
      // 限制图片的最大高度
      maxH: {
        type: Number,
        default: 150
      },
      // 赋予上传file的接受类型
      inputAccept: {
        type: String,
        default: 'image/*'
      },
      // 图片上传成功后的提示语
      successTips: {
        type: String,
        default: null
      },
      // 图片选择错误时的提示信息
      errorTips: {
        type: String,
        default: ''
      },
      // 当input框改变选择图片时候的回调事件，以数组形式返回input的获取的图片数据
      changeImg: {
        type: Function,
        default: undefined
      },
      // 删除图片时的回调事件，以数组形式返回input的获取的图片数据
      delImg: {
        type: Function,
        default: undefined
      },
      // 上传图片后的回调
      uploadImg: {
        type: Function,
        default: undefined
      },
      // 上传图片失败的回调
      uploadErr: {
        type: Function,
        default: undefined
      },
      // 是否显示上传按钮
      isUpload: {
        type: Boolean,
        default: true
      },
      // 不上传图片时候传入图片数据展示
      imgShowList: {
        type: Array,
        default: null
      },
      // 是否只需要一张图
      isOnly: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 进度条弹窗是否显示
        progressPopup: false,
        // 进度条显示值，方便做效果
        value: 0,
        // 进度条真实值
        progress: 0,
        // 图片base64数组
        imgArr: [],
        // 图片file数组
        fileData: [],
        // 上传多张图片时执行次数，与执行时间先后有关。用以控制进度条效果
        count: 0,
        // 执行进度条方法的次数
        proCount: 0,
        // 放大图片弹窗是否显示
        showImgPopup: false,
        // 初始显示的图片
        defaultIndex: 0,
        // 要上传的图片数组
        uploadList: [],
        // 是否正在上传
        isUploading: false
      }
    },
    mounted: function () {
      let that = this;
      //上传图片操作
      that.$bus.on("upload-img", (data) => {
        if(data) {
          that.uploadList = data;
        } else {
          that.uploadList = that.imgData;
        }
        that.upload();
      });
      //删除图片操作
      that.$bus.on("delete-img", (index) => {
        that.deleteImg(index);
      });
      //放大图片操作
      that.$bus.on("show-img", (data) => {
        that.showImg(data);
      });
    },
    computed: {
      imgData() {
        let _data = [];
        let that = this;
        if(that.crop) {
          _data = that.imgArr;
        } else {
          _data = that.fileData;
        }
        return _data;
      },
      imgList() {
        let _img = [];
        let that = this;
        if(that.imgShowList && that.imgShowList.length >= 1) {
          _img = that.imgShowList;
        } else {
          _img = that.imgArr;
        }
        return _img;
      }
    },
    watch: {
      // 进度条
      value(_value) {
        let that = this;
        let len = 0;
        let _tips = that.successTips;
        // 裁剪时只有一个对象，len为1
        if(that.crop) {
          len = 1;
        } else {
          len = that.uploadList.length;
        }

        // 分单图和多图上传
        if(len <= 1) {
          if (_value >= 100) {
            that.progressPopup = false;
            setTimeout(() => {
              if(_tips) {
                that.$messenger.success(_tips);
              }
              that.value = 0;
              that.isUploading = false;
            }, 200);
            clearInterval(that.timer);
            clearTimeout(that.timer);
          }
        } else if(len > 1) {
          if (_value >= len) {
            that.progressPopup = false;
            setTimeout(() => {
              if(_tips) {
                that.$messenger.success(_tips);
              }
              that.value = 0;
              that.count = 0;
              that.isUploading = false;
            }, 200);
          }
        }
      },
      progress(_progress) {
        if(_progress > 0) {
          this.progressIng(_progress);
          this.proCount++;
        }
      }
    },
    methods: {
      /**
       * 图片上传进度显示
       * @param _p
       */
      progressIng(_p) {
        if(_p > 0) {
          let that = this;
          let _len = that.uploadList && that.uploadList.length;
          let _isCrop = that.crop;
          let _time = 500*that.count;

          //针对只有一个对象的显示方法
          let onlyOne = function() {
            if(_p >= 100 && that.proCount === 0) {
              that.value = 0;
              that.timer = setInterval(() => {
                if(that.value < 100) {
                  that.value++
                }
              }, 20);
            } else {
              that.value = _p;
            }
          }
          that.progressPopup = true;

          //计算执行次数，方便 计算多对象上传时的进度条延时器 时间
          that.count++;
          //裁剪的话只有一个对象 或 非裁剪时只选择了一个对象

          if(_isCrop) {
            onlyOne();
          } else if(!_isCrop) {
            if(!_isCrop && _len === 1) {
              onlyOne();
            } else {
              if(_p === 100) {
                setTimeout(() => {
                  that.value++;
                }, _time);
              }
            }
          }
        }
      },
      /**
       * 图片本地预览，以数组形式返回选择图片的base64对象，只有不裁剪时使用
       * @param _fileArr
       * @param _fileVal
       */
      prvImgData(_fileArr, _fileVal) {
        let that = this;

        let _tip = that.errorTips || "请选择 jpg/png/gif 格式的图片！"; // 设定提示信息
        let filters = {
          "jpeg": "/9j/4",
          "gif": "R0lGOD",
          "png": "iVBORw"
        };
        //图片验证
        let validateImg = ((data) => {
          var pos = data.indexOf(",") + 1;
          for (let e in filters) {
            if (data.indexOf(filters[e]) === pos) {
              return e;
            }
          }
          return;
        });

        // 看支持不支持FileReader
        if(!_fileArr || !window.FileReader) {
          //降级处理
          if (!/\.jpg$|\.png$|\.gif$/i.test(_fileVal)) {
            that.$messenger.error(_tip);
          } else {
            that.imgArr.push(_fileVal);
            that.fileData.push({
              fileObj: _fileArr,
              fileVal: _fileVal
            });
          }
          return;
        } else {
          let fr = new FileReader();
          fr.readAsDataURL(_fileArr);
          fr.onloadend = ((e) => {
            let src = e.target.result;
            if (!validateImg(src)) {
              that.$messenger.error(_tip);
            } else {
              that.imgArr.push(src);
              that.fileData.push({
                fileObj: _fileArr,
                fileVal: _fileVal
              });
            }
          })
        }

        //图片预览的回调
        that.changeImg && that.changeImg({
          imgBase64: that.imgArr,
          imgData: that.fileData,
          curImg: {
            fileObj: _fileArr,
            fileVal: _fileVal
          }
        });
      },
      /**
       * 改变图片回调事件
       * @param res
       */
      imagechanged(res) {
        let that = this;
        let hasRepeat = false;
        let _file = that.fileData;
        let form = document.getElementsByClassName('g-core-image-upload-btn')[0];
        let inputDom = form.getElementsByTagName('input')[0];
        let wrapBox = form.getElementsByClassName('g-core-image-corp-container')[0].getElementsByClassName('image-wrap')[0];
        let wrap = wrapBox.getElementsByTagName('IMG')[0];
        let curValue = inputDom.value;

        // 初始化
        let initInput = function(isLoading) {
          inputDom.value = '';
          wrapBox.style.backgroundImage = '';
          wrap.src = '';
          that.isUploading = isLoading;
        }

        // 通过DOM取文件数据
        let curFile = res;
        // 不裁剪时需要判断是否重复并返回数组对象
        if(curFile) {
          if(!that.crop) {
            if(curFile && curFile.length && curFile.length > 1) {
              that.$messenger.error('请选择单张图片');
              initInput(false);
              return false;
            } else {
              if(_file && _file.length > 0) {
                for (let item of _file) {
                  if(curValue === item.fileVal) {
                    hasRepeat = true;
                    break;
                  }
                }
              }

              if(!hasRepeat) {
                that.prvImgData(curFile, curValue);
              } else {
                that.$messenger.error('不能选择重复图片！');
                initInput(false);
                return false;
              }
            }
          } else {
            // 图片预览的回调
            that.imgArr.splice(0, 1, curFile);
            that.changeImg && that.changeImg(curFile);
          }

          that.isUploading = true;
        } else {
          that.$toast.error('系统异常');
          initInput(false);
          return false;
        }
        initInput(true);
      },
      /**
       * 删除图片
       * @param index
       */
      deleteImg(index) {
        if(!this.crop) {
          this.fileData.splice(index,1);
          this.imgArr.splice(index,1);
        } else {
          this.imgArr = '';
        }
      },
      /**
       * 上传图片
       */
      upload: function () {
        let that = this;
        let _isLoading = false;
        let files = that.uploadList;

        // 素材保存至服务器
        let saveToBase = function (_files, _fileStorePath, _callback) {
          let _params = [{
            'name': _files.name,
            'path': _fileStorePath,
            'fileSize': _files.size,
            'mediaType': 0
          }];
          that.$http.post(`${that.$apihost}/media/save`, {}, true, _params)
            .then((res) => {
              _isLoading = false;
              _callback && _callback(res);
            })
        }

        // 如果有裁剪返回的是base64对象
        if(that.crop) {
          that.proCount = 0;
          that.progress = 0;
          let _tempFile = files && files[0];

          if(_tempFile && !_isLoading) {
            _isLoading = true;
            ossUploader.uploadBase64(_tempFile, "/vue-base64", function (progress) {
              that.progress = progress;
            })
              .then((fileRes) => {
                saveToBase(fileRes.fileObj, fileRes.filePath, function(res) {
                  that.uploadImg && that.uploadImg(res);
                })
              })
              .catch((error) => {
                that.progressPopup = false;
                that.uploadErr && that.uploadErr(error);
              })
          }
        } else {
          for(let i = 0,len = files.length; i<len; i++) {
            let _temp = files[i];
            let _tempFile = _temp.fileObj;
//
            if(_tempFile && !_isLoading) {
              _isLoading = true;
              that.proCount = 0;
              that.progress = 0;
              ossUploader.upload(_tempFile, "/vue-test", function (progress) {
                that.progress = progress;
              })
                .then((fileRes) => {
                  saveToBase(_tempFile, fileRes.filePath, function(res) {
                    that.uploadImg && that.uploadImg(res);
                  })
                })
                .catch((error) => {
                  that.progressPopup = false;
                  that.uploadErr && that.uploadErr(error);
                })
            }
          }
        }
      },
      /**
       * 放大图片预览
       * @param data
       */
      showImg(data) {
        let _img = this.imgArr;
        if(!_img || JSON.stringify(_img) === '[]' && data && data.imgData) {
          this.imgArr = data.imgData;
        }
        this.defaultIndex = data && data.imgIndex;
//        this.showImgPopup = true;
        this.$bus.emit('v-show-img', this.defaultIndex);
      },
      /**
       * 上传提示
       */
      loadingAlert() {
        this.$toast.error('图片正在上传中...请稍等');
      }
    },
    components: {
      VueCoreImageUpload,
      VShowImage
    }
  }
</script>
