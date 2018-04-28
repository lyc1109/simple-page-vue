<style scoped lang="scss" type="text/scss">
  @import '~variables';
  .setting-row{
    margin: rem(25px) 0;
  }

  .outflow-range /deep/ {
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

  .outflow-constants{
    width: rem(60px);
    height: rem(50px);
    text-align: center;
    border-radius: 50%;
    border: 1px solid #7AC4F0;
    color: #7AC4F0;
    margin: 30px auto;
    padding-top: rem(10px);
    cursor: pointer;
    i{
      font-size: 24px;
    }
    p{
      font-size: 12px;
    }
  }
</style>

<template>
  <v-popup v-model="value" title="单次最大出水量设置（毫升）" position="bottom">

    <div class="padding-m">
      <div class="flex setting-row">
        <div class="setting-row__title">常温水：</div>
        <div class="flex-item outflow-range">
          <v-range :min="120" :max="2000" :step="10" :value="iwater.maxOutFlow"  :disabled="!isOnline" @getRange="onMaxOutFlowChange"></v-range>
        </div>
        <div class="padding-s">{{iwater.maxOutFlow}}ml</div>
      </div>
      <div class="flex setting-row">
        <div class="setting-row__title">热开水：</div>
        <div class="flex-item outflow-range">
          <v-range :min="120" :max="2000" :step="10" :value="iwater.maxOutFlowForHot"  :disabled="!isOnline" @getRange="onMaxOutFlowForHotChange"></v-range>
        </div>
        <div class="padding-s">{{iwater.maxOutFlowForHot}}ml</div>
      </div>
    </div>

    <!--<div class="padding-m outflow-range">
      <v-range :min="120" :max="2000" :showVal="true" valTitle="最大出水量" :value="iwater.maxOutFlow" :disabled="!isOnline" @getRange="onMaxOutFlowChange"></v-range>
      <div class="margin-top-s">
        <div class="float-left font-s font-light">120ml</div>
        <div class="float-right font-s font-light">2000ml</div>
      </div>
    </div>-->

    <!--<div class="flex margin-top">
      <div class="flex-item">
        <div class="outflow-constants" @click="onMaxOutFlowChange(300)">
          <i class="iconfont icon-iot-cs"></i>
          <p>300ml</p>
        </div>
      </div>
      <div class="flex-item">
        <div class="outflow-constants" @click="onMaxOutFlowChange(800)">
          <i class="iconfont icon-iot-cs"></i>
          <p>800ml</p>
        </div>
      </div>
      <div class="flex-item">
        <div class="outflow-constants" @click="onMaxOutFlowChange(1200)">
          <i class="iconfont icon-iot-cs"></i>
          <p>1200ml</p>
        </div>
      </div>
      <div class="flex-item">
        <div class="outflow-constants" @click="onMaxOutFlowChange(1600)">
          <i class="iconfont icon-iot-cs"></i>
          <p>1600ml</p>
        </div>
      </div>
    </div>-->


    <div class="padding-top clearfixed">
      <button type="button" class="btn btn-primary btn-lg btn-block" @click="updateMaxOutFlow">确定</button>
    </div>
  </v-popup>
</template>

<script>
  import VPopup from "@/components/ui/v-popup";
  import VRange from '@/components/ui/v-range';

  import storeTypes from "@/store/types";
  import _ from "loadash";

  import iwaterApi from "@/apis/api-iot-waterdevices";

  export default {
    name: "v-setting-outwaterflow",
    desc: "水机出水量设置popup组件",
    components: {VPopup, VRange},
    props: {
      // 用于控制显示隐藏popup
      value: Boolean
    },
    computed: {
      device: function () {
        return this.$store.getters[storeTypes.idevice.getDevice] || {};
      },
      iwater: function () {
        let iwater = this.device.iotDevice || {
          waterDeviceType: 0,
          online: false,
          maxOutFlow: 120
        };
        if(iwater.maxOutFlow < 120) {
          iwater.maxOutFlow = 120;
        }
        if(iwater.maxOutFlow > 2000) {
          iwater.maxOutFlow = 2000;
        }
        return iwater;
      },
      isOnline: function () {
        return this.iwater.online === true;
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
       * 监听常温水最大出水量变化
       * @param temperatureForTea
       */
      onMaxOutFlowChange: _.debounce(function(maxOutFlow) {
        if(maxOutFlow !== this.iwater.maxOutFlow) {
          this.iwater.maxOutFlow = maxOutFlow;
        }
      }, 100),

      /**
       * 监听热开水最大出水量变化
       * @param temperatureForTea
       */
      onMaxOutFlowForHotChange: _.debounce(function(maxOutFlow) {
        if(maxOutFlow !== this.iwater.maxOutFlow) {
          this.iwater.maxOutFlowForHot = maxOutFlow;
        }
      }, 100),

      // 更新温度
      updateMaxOutFlow: function () {
        let that = this;
        iwaterApi.updateMaxOutFlow(this.device.id, this.iwater.maxOutFlow, this.iwater.maxOutFlowForHot)
          .then((resp) => {
            if (resp === true) {
              that.$toast.success("出水量设置成功");
            }
            that.$loading.hide();
            that.value = false;
          })
          .catch(() => {
            that.$loading.hide();
            that.$toast.error("出水量设置失败");
            that.value = false;
          })
      },
    }
  }
</script>
