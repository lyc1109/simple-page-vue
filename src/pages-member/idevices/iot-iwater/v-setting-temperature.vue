<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .setting-row{
    margin: rem(25px) 0;
  }
  .setting-row__title {
    font-weight: 400;
    color: $font-light;
    margin-right: rem(10px);
    width: rem(65px);
    text-align: right;
  }

  .setting-row /deep/ {
    .range-box{
      padding-top: rem(6px);
    }

    .mt-range-thumb {
      border-radius: 0 50% 50%;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      box-shadow: 1px 0 3px rgba(0, 0, 0, 0.4);
    }
  }
</style>

<template>
  <v-popup v-model="value" :title="pupupTitle" position="bottom">
    <!-- 加热型水机 -->
    <div class="padding-m" v-if="iwater.waterDeviceType === 1">
      <div class="flex setting-row">
        <div class="setting-row__title">泡茶温度</div>
        <div class="flex-item">
          <v-range :min="20" :max="100" :value="iwater.temperatureForTea" :disabled="!isOnline" @getRange="onTemperatureForTeaChange"></v-range>
        </div>
        <div class="padding-s">{{iwater.temperatureForTea}}℃</div>
      </div>
      <div class="flex setting-row">
        <div class="setting-row__title">泡茶出水量</div>
        <div class="flex-item">
          <v-range :min="120" :max="2000" :step="10" :value="iwater.maxOutFlowForTea"  :disabled="!isOnline" @getRange="onMaxOutFlowForTeaChange"></v-range>
        </div>
        <div class="padding-s">{{iwater.maxOutFlowForTea}}ml</div>
      </div>

      <hr/>

      <div class="flex setting-row">
        <div class="setting-row__title">冲奶温度</div>
        <div class="flex-item">
          <v-range :min="20" :max="100" :value="iwater.temperatureForMilk" :disabled="!isOnline" @getRange="onTemperatureForMilkChange"></v-range>
        </div>
        <div class="padding-s">{{iwater.temperatureForMilk}} ℃</div>
      </div>
      <div class="flex setting-row">
        <div class="setting-row__title">冲奶出水量</div>
        <div class="flex-item">
          <v-range :min="120" :max="2000" :step="10" :value="iwater.maxOutFlowForMilk"  :disabled="!isOnline" @getRange="onMaxOutFlowForMilkChange"></v-range>
        </div>
        <div class="padding-s">{{iwater.maxOutFlowForMilk}}ml</div>
      </div>
    </div>

    <!-- 制冷型水机 -->
    <div class="padding-m" v-if="iwater.waterDeviceType === 2">
      <div class="flex setting-row">
        <div class="setting-row__title"><i class="iconfont icon-iot-jrwd color-orange-1"></i> 加热</div>
        <div class="flex-item">
          <v-range :min="20" :max="100" :value="iwater.temperatureForHot" :disabled="!isOnline" @getRange="onTemperatureForHotChange"></v-range>
        </div>
        <div class="padding-s">{{iwater.temperatureForHot}} ℃</div>
      </div>
      <div class="flex setting-row">
        <div class="setting-row__title"><i class="iconfont icon-iot-zlwd color-blue-2"></i> 制冷</div>
        <div class="flex-item">
          <v-range :min="0" :max="20" :value="iwater.temperatureForCold" :disabled="!isOnline" @getRange="onTemperatureForColdChange"></v-range>
        </div>
        <div class="padding-s">{{iwater.temperatureForCold}} ℃</div>
      </div>
    </div>

    <div class="padding-top clearfixed">
      <button type="button" class="btn btn-primary btn-lg btn-block" @click="updateTemperature">确定</button>
    </div>
  </v-popup>
</template>

<script>
  import VPopup from "@/components/ui/v-popup";
  import VRange from '@/components/ui/v-range';
  import VSwitch from '@/components/ui/v-switch';


  import storeTypes from "@/store/types";
  import _ from "loadash";

  import iwaterApi from "@/apis/api-iot-waterdevices";
  import IotIwater from "@/assets/scripts-page/iot-iwater.js";

  export default {
    name: "v-setting-temperature",
    desc: "水机温度设置popup组件",
    components: {VPopup, VRange, VSwitch},
    props: {
      // 用于控制显示隐藏popup
      value: Boolean
    },
    computed: {
      device: function () {
        return this.$store.getters[storeTypes.idevice.getDevice] || {};
      },
      iwater: function () {
        return this.device.iotDevice || {
          waterDeviceType: 0,
          online: false,
          temperatureForTea: 85,
          temperatureForMilk: 40,
          temperatureForHot: 85,
          temperatureForCold: 40,
        }
      },
      isOnline: function () {
        return this.iwater.online === true;
      },
      pupupTitle: function () {
        return this.iwater.waterDeviceType === 1 ? "场景温度与出水量设置" : "温度设置";
      }
    },
    watch: {
      value: function (newVal) {
        this.$emit("input", newVal);

        // 显示设置时暂停自动拉取设备详情，避免设置过程与后台返回数据造成冲突
        this.$store.commit(storeTypes.idevice.updateCanLoadDetailFlag, !newVal);
      }
    },
    methods: {
      /**
       * 监听泡茶温度设置
       * @param temperatureForTea
       */
      onTemperatureForTeaChange: _.debounce(function(temperatureForTea) {
        if(temperatureForTea !== this.iwater.temperatureForTea) {
          this.iwater.temperatureForTea = temperatureForTea;
        }
      }, 100),

      /**
       * 监听冲奶温度设置
       * @param temperatureForMilk
       */
      onTemperatureForMilkChange: _.debounce(function(temperatureForMilk) {
        if(temperatureForMilk !== this.iwater.temperatureForMilk) {
          this.iwater.temperatureForMilk = temperatureForMilk;
        }
      }, 100),

      /**
       * 监听热水温度设置
       * @param temperatureForHot
       */
      onTemperatureForHotChange: _.debounce(function(temperatureForHot) {
        if(temperatureForHot !== this.iwater.temperatureForHot) {
          this.iwater.temperatureForHot = temperatureForHot;
        }
      }, 100),

      /**
       * 监听冷水温度设置
       * @param temperatureForCold
       */
      onTemperatureForColdChange: _.debounce(function(temperatureForCold) {
        if(temperatureForCold !== this.iwater.temperatureForCold) {
          this.iwater.temperatureForCold = temperatureForCold;
        }
      }, 100),

      /**
       * 监听泡茶水最大出水量变化
       * @param maxOutFlow
       */
      onMaxOutFlowForTeaChange: _.debounce(function(maxOutFlow) {
        if(maxOutFlow !== this.iwater.maxOutFlow) {
          this.iwater.maxOutFlowForTea = maxOutFlow;
        }
      }, 100),

      /**
       * 监听冲奶水最大出水量变化
       * @param maxOutFlow
       */
      onMaxOutFlowForMilkChange: _.debounce(function(maxOutFlow) {
        if(maxOutFlow !== this.iwater.maxOutFlow) {
          this.iwater.maxOutFlowForMilk = maxOutFlow;
        }
      }, 100),

      // 更新温度
      updateTemperature: function () {
        if(this.iwater.waterDeviceType === 1) {
          if(this.iwater.temperatureForTea === 0 || this.iwater.temperatureForMilk === 0) {
            this.$toast.success("加热温度必须大于0℃");
            return;
          }
          this.updateTemperatureForScenario();
        } else if(this.iwater.waterDeviceType === 2) {
          if(this.iwater.temperatureForHot === 0) {
            this.$toast.success("加热温度必须大于0℃");
            return;
          }

          IotIwater.updateTemperatureEx(this.device.id, this.iwater.temperatureForHot, this.iwater.temperatureForCold)
            .then(() => {
              this.value = false;
            });
        }
      },

      // 更新场景温度
      updateTemperatureForScenario: function () {
        this.$loading.show("正在设置出水温度");
        let that = this;
        let deviceEntityId = this.device.id;
        // 更新泡茶温度
        iwaterApi.updateTemperature(deviceEntityId, "tea", this.iwater.temperatureForTea, this.iwater.maxOutFlowForTea)
          .then((resp1) => {
            if (resp1 === true) {
              // 更新冲奶温度
              iwaterApi.updateTemperature(deviceEntityId, "milk", this.iwater.temperatureForMilk, this.iwater.maxOutFlowForMilk)
                .then((resp) => {
                  if (resp === true) {
                    that.$toast.success("出水温度设置成功");
                  }
                  that.$loading.hide();
                  that.value = false;
                })
            } else {
              that.$loading.hide();
              that.$toast.error("出水温度设置失败");
              that.value = false;
            }
          })
      }
    }
  }
</script>
