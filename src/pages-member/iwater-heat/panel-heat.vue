<style scoped lang="scss" type="text/scss">
  @import 'src/assets/scss/components/_popupwindow';

  .range-tag-box {
    position: relative;
    -webkit-display: flex;
    -moz-display: flex;
    display: flex;
    .range-tag-content {
      position: relative;
      -webkit-flex: 1;
      -moz-flex: 1;
      flex: 1;
      margin-right: rem(20px);

      .range-tag {
        position: absolute;
        top: 0;
        padding: rem(2px) rem(8px) 0;
        line-height: normal;
        background: $primary;
        color: $white;
        border-radius: rem(30px);
      }
    }
  }
  .tag-box {
    justify-content: space-between;
    .tag-item {
      width: calc((100% - 90px)/4);
      padding-top: calc((100% - 90px)/4);
      position: relative;
      border: 1px solid $primary;
      color: $primary;
      .tag-item-box {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        flex-direction: column;
        justify-content: center;
      }
      img {
        width: rem(16px);
      }
    }
  }
  .openType-outflow {
    .range-tag-content {
      .range-tag {
        background: $primary;
      }
    }
    .tag-item {
      border: 1px solid $primary;
      color: $primary;
      &.current {
        background: $primary;
        color: $white;
        box-shadow: 0 0 3px 3px rgba($primary, 0.3);
      }
    }
  }
  .openType-tea {
    .range-tag-content {
      .range-tag {
        background: $danger-light;
      }
    }
    .tag-item {
      border: 1px solid $success;
      color: $success;
      &.current {
        background: $success;
        color: $white;
        box-shadow: 0 0 3px 3px rgba($success, 0.3);
      }
    }
  }
  .openType-milk {
    .range-tag-content {
      .range-tag {
        background: $danger-light;
      }
    }
    .tag-item {
      border: 1px solid $pink-1;
      color: $pink-1;
      &.current {
        background: $pink-1;
        color: $white;
        box-shadow: 0 0 3px 3px rgba($pink-1, 0.3);
      }
    }
  }
</style>
<style lang="scss" type="text/scss">
  @import "~variables";

  .iwater-heat-page.mint-popup {
    top: initial!important;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    overflow: hidden;
    height: auto!important;
    -webkit-transform: initial!important;
    transform: initial!important;
    .popup-window {
      position: relative;
    }
    .popup-window-content {
      height: auto!important;
      padding-bottom: rem(45px);
      .popup-window-footer {
        position: fixed!important;
      }
    }
    .popup-window-body {
      background-color: #fff!important;
      .range-input {
        .mt-range-thumb {
          border-radius: 0 50% 50%;
          transform: rotate(45deg);
          box-shadow: 1px 0 3px rgba(0,0,0,.4);
        }
      }
      .openType-outflow {
        .mt-range-progress {
          background-color: $primary;
        }
      }
      .openType-tea {
        .mt-range-progress {
          background-color: $danger-light;
        }
      }
      .openType-milk {
        .mt-range-progress {
          background-color: $danger-light;
        }
      }
    }
  }
</style>
<template>
  <div class="popup-window in">
    <div class="popup-window-content" @click.stop="">
      <div class="popup-window-title flex bg-yellow-4">
        <h4 class="color">{{ openType ? (openType === 'tea' ? '泡茶' : (openType === 'milk' ? '冲奶' : '出水量')) : '出水量' }}</h4>
        <div class="flex-item"></div>
        <i class="iconfont icon-iot-guanbi font-lighter" @click="close()"></i>
      </div>
      <div class="popup-window-body">
        <!--<div v-if="!activeId" class="valign-center bg" style="justify-content: center;min-height: 263px;">-->
        <!--<v-spinner :isAllPage="false"></v-spinner>-->
        <!--</div>-->
        <div class="padding-m padding-top-xl padding-bottom-xl bg-white"
             :class="`openType-${openType}`">
          <div class="range-tag-box margin-bottom-xl">
            <div class="range-tag-content">
              <div class="range-tag"
                   :style="{ 'left': tagPercent }">{{ rangeData.range + unitText }}</div>
            </div>
          </div>
          <v-range :value="rangeData && rangeData.range"
                   :min="rangeData && rangeData.minValue"
                   :max="rangeData && rangeData.maxValue"
                   @getRange="getRange"
                   class="range-input"
                   :showVal="false"></v-range>
          <div class="flex font-family-num font-light">
            <div class="flex-item">{{ rangeData.minValue + unitText }}</div>
            <div>{{ rangeData.maxValue + unitText }}</div>
          </div>
          <div v-if="rangeData" class="flex tag-box margin-top-l">
            <div v-for="(item, index) in rangeData.list"
                 class="border-radius-circle valign-center tag-item"
                 :class="{'current': index+1 === tempIndex }"
                 @touchstart="currentItem(index)"
                 @touchend="removeCur(item)">
              <div class="border-radius-circle font-s valign-center tag-item-box">
                <img v-if="openType && openType === 'outflow'" :src="`/static/images/devices/${imgArr[index]}ml${(index+1 === tempIndex) ? 'c' : ''}.png`" alt="">
                <span>{{ item + unitText }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="popup-window-footer">
        <button type="button" class="btn btn-primary btn-block" id="btnPopupOk" @click.stop="setRange">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
  import VRange from '@/components/ui/v-range';

  export default {
    name: 'panel-heat',
    components: {VRange},
    props: ['openType'],
    data() {
      return {
        // 单位
        unitText: 'ml',
        // 出水量图标
        imgArr: [200, 800, 1200, 1600],
        // 选中的index
        tempIndex: 0,
        // 出水量区间值
        outflowRange: {
          // 滑块默认值
          range: 280,
          // 出水量预定值
          list: [200, 800, 1200, 1600],
          // 滑块最小值
          minValue: 120,
          // 滑块最大值
          maxValue: 2000,
        },
        // 泡茶温度设定
        teaRange: {
          // 滑块默认值
          range: 50,
          // 出水量预定值
          list: [30, 50, 80, 100],
          // 滑块最小值
          minValue: 30,
          // 滑块最大值
          maxValue: 100,
        },
        // 冲奶温度设定
        milkRange: {
          // 滑块默认值
          range: 50,
          // 出水量预定值
          list: [30, 50, 80, 100],
          // 滑块最小值
          minValue: 30,
          // 滑块最大值
          maxValue: 100,
        },
      }
    },
    created: function () {
      let that = this;
      let _type = that.openType || 'outflow';

      that.getData(_type);
    },
    watch: {
      openType(_type) {
        let that = this;
        that.getData(_type);
      }
    },
    computed: {
      // 根据类型获取值
      rangeData() {
        let that = this;
        let _type = that.openType || 'outflow';
        let _temp = that.outflowRange;

        if(_type) {
          if(_type !== 'outflow') {
            that.unitText = '℃';
            if(_type === 'tea') {
              _temp = that.teaRange;
            } else if(_type === 'milk') {
              _temp = that.milkRange;
            }
          } else {
            that.unitText = 'ml';
          }
        }

        return _temp;
      },
      // 滑块显示的百分比
      tagPercent() {
        let that = this;
        let _data = 0;
        let _per = '';
        let _type = that.openType;
        let _tem = (_type && _type !== 'outflow') ? 5 : 0;
        let _temp = that.rangeData;
        let _value = _temp && (_temp.range || _temp.range === 0) && Number(_temp.range);
        let _min = _temp && (_temp.minValue || _temp.minValue === 0) && Number(_temp.minValue);
        let _max = _temp && (_temp.maxValue || _temp.maxValue === 0) && Number(_temp.maxValue);
        let _range = Number(_max - _min);

        if(_value < _min) {
          return false;
        }
        if(_range > 0) {
          _data = Number(Number(_value - _min)/_range)*100;
          _data = Number(_data).toFixed(1);
        }

        if(_data <= 2) {
          _per = `${_data}%`;
        } else if(_data > 2 && _data <= 50) {
          _per = `calc(${_data}% - (15px - ${_tem}px))`;
        } else if(_data > 50 && _data <= 80) {
          _per = `calc(${_data}% - (20px - ${_tem}px))`;
        } else if(_data > 80 && _data < 95) {
          _per = `calc(${_data}% - (25px - ${_tem}px))`;
        } else {
          _per = `calc(${_data}% - (30px - ${_tem}px))`;
        }
        return  _per;
      }
    },
    methods: {
      /**
       * 获取场景数据
       * @param type
       */
      getData(type) {
        let that = this;
        let _type = 'outflow';
        if(type) {
          _type = type;
        }
        if(_type) {
          that.$http.get(`${that.$apihost}/waterdevices/model/scenarios/${_type}`)
            .then((res) => {
              let _data = [];
              for(let i = 0,len = res.length; i < len; i++) {
                _data.push(Number(res[i].value));
              }
              if(_type === 'tea') {
                that.teaRange.list = _data;
                that.teaRange.range = _data[0];
              } else if(_type === 'milk') {
                that.milkRange.list = _data;
                that.milkRange.range = _data[0];
              } else {
                that.outflowRange.list = _data;
                that.outflowRange.range = _data[0];
              }
            })
        }
      },
      /**
       * 改变滑块值
       * @param _range
       */
      getRange(_range) {
        let that = this;
        that.rangeData.range = _range;
      },
      /**
       * 选中状态
       */
      currentItem(_index) {
        this.tempIndex = Number(_index + 1);
      },
      /**
       * 改变数量值
       * @param _range
       */
      removeCur(_range) {
        this.rangeData.range = _range;
        this.tempIndex = 0;
      },
      /**
       * 设置值
       */
      setRange: function () {
        let that = this;
        let _type = that.openType || 'outflow';
        //let _deviceId = that.$route.params.id;
        let _deviceId = that.$route.query.deviceEntityId;
        if(_type && _deviceId) {
          if(_type === 'outflow') {
            that.$http.post(`${that.$apihost}/waterdevices/${_deviceId}/max-outflow`,{
              max_outflow: that.rangeData.range
            }).then((res) => {
              if(res) {
                that.$emit('transferData', that.rangeData.range);
                that.$toast.success('设置成功！');
                this.$emit('close');
              }
            })
          } else {
            that.$http.post(`${that.$apihost}/waterdevices/${_deviceId}/temperature`,{
              temperature: that.rangeData.range,
              scenario: _type
            }).then((res) => {
              if(res) {
                that.$emit('transferData', that.rangeData.range);
                that.$toast.success('设置成功！');
                this.$emit('close');
              }
            })
          }
        }
      },
      close() {
        this.$emit('close');
      }
    }
  }
</script>
