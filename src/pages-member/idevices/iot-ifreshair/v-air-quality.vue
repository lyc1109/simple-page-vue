<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .iair-pm25 {
    font-size: rem($font-size-xl);
    font-weight: 400;
    position: absolute;
    top: 45%;
    left: 3%;
    text-align: center;
    color: $font-light;
  }
  .iair-pm25.iair-pm25-inner{
    left: auto;
    right: 3%;
  }
  .iair-pm25__text{
    color: $font-lighter;
    padding-top: 5px;
    font-size: rem($font-size-s);
  }
  .iair-quality{
    @extend %bg;
    margin: 0 auto;
    position: relative;
  }

  .iair-quality__text{
    font-size: rem(80px);
    font-weight: bold;
  }
  .pulse{
    @include pulse();
    animation: pulse 3s infinite;
  }
</style>

<template>
  <div class="iair-quality valign-center" :style="qualityStyle">
    <div class="iair-pm25" :style="pm25OutStyle">
      {{pm25out}}
      <div class="iair-pm25__text">室外PM2.5</div>
    </div>
    <div class="iair-pm25 iair-pm25-inner" :style="pm25InnerStyle">
      {{pm25}}
      <div class="iair-pm25__text">室内PM2.5</div>
    </div>

    <div class="full-width align-center">
     <!-- <div class="inline-block" :class="{'color-cyan pulse': freshState, 'font-lighter': !freshState}">
        <i class="iconfont icon-iot-qx"></i>
        <div>清新</div>
      </div>-->
      <div class="inline-block iair-quality__text" v-html="computeQualityText" :style="iairQualityTextStyle"></div>
      <!--<div class="inline-block"  :class="{'color-yellow-1 pulse': bacteriostaticState, 'font-lighter': !bacteriostaticState}">
        <i class="iconfont icon-iot-sj1"></i>
        <div>抑菌</div>
      </div>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: "v-air-quality",
    desc: "空气质量小组件",
    props: {
      quality: {
        type: Number,
        default: 0
      },
      qualityText: {
        type: String,
        default: "优"
      },
      pm25: {
        type: Number,
        default: 0
      },
      bacteriostaticState: {
        type: Boolean,
        default: false
      },
      freshState: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      pm25out: function () {
        if(this.pm25 === 0) {
          return 0;
        }
        return Math.floor(this.pm25 / 0.6);
      },

      qualityBoxWidth: function () {
        return Math.floor(this.$utils.getScreenWidth() / 1.5);
      },

      qualityStyle: function () {
        // 不同质量显示不同的背景图
        let bg = "/static/images/ifreshair/quality-bg-a.png";
        let airQuality = this.quality;
        if(airQuality === 3 || airQuality === 4) {
          bg = "/static/images/ifreshair/quality-bg-b.png";
        } else if(airQuality === 5 || airQuality === 6) {
          bg = "/static/images/ifreshair/quality-bg-c.png";
        }

        // 计算质量图占据屏幕比例
        let width = this.qualityBoxWidth;
        return {
          'background-image': 'url(' + this.$filters.staticImg(bg, '/resize,w_' + width) + ")",
          width: width + "px",
          height: width + "px",
        }
      },

      // 计算室内外PM2.5的位置
      pm25InnerStyle: function () {
        let screenWidth = this.$utils.getScreenWidth();
        let qualityWidth = this.qualityBoxWidth;
        return {
          right: -Math.floor((screenWidth-qualityWidth)/2.2) + "px"
        }
      },
      pm25OutStyle: function () {
        let screenWidth = this.$utils.getScreenWidth();
        let qualityWidth = this.qualityBoxWidth;
        return {
          left: -Math.floor((screenWidth-qualityWidth)/2.2) + "px"
        }
      },

      // 计算空气质量文本显示
      computeQualityText: function () {
        let qualityHtml = "<span class='color-green-1'>"+ this.qualityText +"</span>";
        let airQuality = this.quality;
        if(airQuality === 3 || airQuality === 4) {
          qualityHtml = "<span class='color-yellow-2'>"+ this.qualityText +"</span>";
        } else if(airQuality === 5 || airQuality === 6) {
          qualityHtml = "<span class='color-danger'>"+ this.qualityText +"</span>";
        }
        return qualityHtml;
      },

      iairQualityTextStyle: function () {
        let screenWidth = this.$utils.getScreenWidth();
        if(screenWidth <= 320) {
          return;
        }

        return {
          margin: "0 10px"
        };
      }
    },
  }
</script>
