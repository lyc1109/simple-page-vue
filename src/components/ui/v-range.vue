<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .range-box{
    padding: 2px 3px 2px 2px;
    display: block;
  }

  .range-val-float{
    height: 22px;
    position: relative;
    margin-bottom: 3px;
  }

  .range-val{
    background: $primary;
    color: $white;
    display: inline-block;
    height: 22px;
    line-height: 22px;
    padding: 0 rem(12px);
    border-radius: 15px;
    font-size: $font-size-s;
    position: absolute;
    top: 0;
  }
</style>

<template>
  <div>
    <!--固定值-->
    <div class="padding align-center" :class="valClass" v-if="showVal && valType === 'fixed'">
      <span class="font-light">{{valTitle}}:</span>
      <span class="font-bold margin-left">{{value}}</span>
    </div>

    <!--漂浮值-->
    <div class="range-val-float " v-if="showVal && valType === 'float'">
      <div class="range-val" :class="valClass" :style="{left: floatValLeft}">{{value}}{{valUnit}}</div>
    </div>

    <!--进度滑块-->
    <div class="range-box">
      <mt-range v-model="value" :min="min" :max="max" :step="step" :disabled="disabled" :bar-height="barHeight" ref="VRange">
        <div slot="start">
          <slot name="range-start"></slot>
        </div>
        <div slot="end">
          <slot name="range-end"></slot>
        </div>
      </mt-range>
    </div>
  </div>
</template>

<script>
  export default {
    name: "v-range",
    props: {
      // 滑块的值
      value: {
        type: Number,
        default: 0
      },
      // 最小值
      min: {
        type: Number,
        default: 0
      },
      // 最大值
      max: {
        type: Number,
        default: 100
      },
      // 步长
      step: {
        type: Number,
        default: 1
      },
      // 是否禁用
      disabled: {
        type: Boolean,
        default: false
      },
      // 滑槽的线宽（像素）
      barHeight: {
        type: Number,
        default: 1
      },
      // 是否显示值
      showVal: {
        type: Boolean,
        default: false
      },
      // 值名称
      valTitle: {
        type: String,
        default: ""
      },
      // 值显示类型：fixed | float
      valType: {
        type: String,
        default: "fixed"
      },
      // 值扩展样式
      valClass: {
        type: String,
        default: ""
      },
      // 单位值
      valUnit: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        // 上次选中的值
        temp: 0,

        thumbEl: null,
        floatValLeft: ""
      }
    },
    watch: {
      value(newVal) {
        this.$emit('getRange', newVal);
        // TODO: 计算浮动值的位置
        /*if(this.value > 0 && this.thumbEl !== null) {
          setTimeout(() => {
            this.floatValLeft = this.thumbEl.style.left;
            let leftTmp = (parseInt(this.floatValLeft.replace("%", "")) / 100).toFixed(1);
            leftTmp = leftTmp * 100;
            if(leftTmp >0 && leftTmp < 50) {
              leftTmp = leftTmp - 2;
            } else if(leftTmp >= 50 && leftTmp < 70) {
              leftTmp = leftTmp - 7;
            }  else if(leftTmp >= 70 && leftTmp < 80) {
              leftTmp = leftTmp - 12;
            } else if(leftTmp >= 80) {
              leftTmp = leftTmp - 16;
            }
            this.floatValLeft = leftTmp + "%";
          }, 100)
        }*/
      }
    },
    mounted: function () {
      /*let $range = this.$refs.VRange.$el;
      this.thumbEl = $range.getElementsByClassName("mt-range-thumb")[0];
      console.log(this.thumbEl.clientWidth);*/
    }
  }
</script>
