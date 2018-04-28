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
  .imgs-box {
    .v-modal {
      opacity: 0.7;
      filter: Alpha(opacity=70);
    }
  }
</style>
<template>
  <div>
    <!--放大图片-->
    <div @click.stop="close()">
      <mt-popup v-model="showImgPopup"
                v-if="showImgPopup"
                class="show-image-popup valign-center">
        <!--<i class="iconfont icon-iot-guanbi"></i>-->
        <mt-swipe :auto="0"
                  :defaultIndex="defaultIndex"
                  :showIndicators="showIndicators">
          <mt-swipe-item v-for="(item, index) in imgList" :key="index">
            <div class="valign-center show-item">
              <img :src="item" alt="">
            </div>
          </mt-swipe-item>
        </mt-swipe>
      </mt-popup>
    </div>
  </div>
</template>

<script>
  export default {
    name: "v-show-image",
    props: {
      // 图片数据
      imgList: {
        type: Array,
        default: []
      },
      // 图片显示弹窗
//      showImgPopup: {
//        type: Boolean,
//        default: false
//      }
    },
    data() {
      return {
        // 初始显示的图片
        defaultIndex: 0,
        // 图片显示弹窗
        showImgPopup: false,
      }
    },
    computed: {
      // 是否显示轮播图圆点
      showIndicators() {
        let _isShow = true;
        if(this.imgList && this.imgList.length <= 1) {
          _isShow = false;
        }
        return _isShow;
      },
    },
    mounted: function () {
      let that = this;
      //放大图片操作
      that.$bus.on("v-show-img", (index) => {
        that.showImg(index);
      });
    },
    methods: {
      /**
       * 放大图片预览
       * @param data
       */
      showImg(index) {
        this.showImgPopup = true;
        this.defaultIndex = index;
      },
      /**
       * 关闭弹窗
       */
      close() {
        this.showImgPopup = false;
//        this.$emit('cancel');
      }
    }
  }
</script>
