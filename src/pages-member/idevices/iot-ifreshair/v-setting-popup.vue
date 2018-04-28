<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .setting-row{
    margin: rem(25px) 0;
  }
  .setting-row__title {
    font-weight: 400;
    color: $font-light;
    margin-right: rem(12px);
  }

  .runmodel{
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    font-size: $font-size-s;
    color: $font-lighter;
    margin-left: 4px;

    .runmodel-icon{
      color: $font-light;
      width: 38px;
      height: 38px;
      line-height: 38px;
      border-radius: 50%;
      background: $gray-light-1;
      font-size: 20px;
      margin-bottom: 5px;
    }
  }
  .runmodel.active{
    .runmodel-icon{
      background: $primary;
      color: $white;
    }
  }
</style>

<template>
  <v-popup v-model="value" title="设置" position="bottom">
    <div class="padding-m">
      <div class="flex setting-row">
        <div class="setting-row__title">运行模式</div>
        <div class="flex-item">
          <div class="runmodel" :class="{active: ifreshair.runMode === 1}" @click="updateControlState('自动模式', 'runMode', 1)">
            <div class="runmodel-icon"><i class="iconfont icon-iot-zd"></i></div>
            <span>自动</span>
          </div>
          <div class="runmodel" :class="{active: ifreshair.runMode === 2}" @click="updateControlState('手动模式', 'runMode', 2)">
            <div class="runmodel-icon"><i class="iconfont icon-iot-sd"></i></div>
            <span>手动</span>
          </div>
          <div class="runmodel" :class="{active: ifreshair.runMode === 3}" @click="updateControlState('睡眠模式', 'runMode', 3)">
            <div class="runmodel-icon"><i class="iconfont icon-iot-sm"></i></div>
            <span>睡眠</span>
          </div>
          <div class="runmodel" :class="{active: ifreshair.runMode === 4}" @click="updateControlState('定时模式', 'runMode', 4)">
            <div class="runmodel-icon"><i class="iconfont icon-iot-ds"></i></div>
            <span>定时</span>
          </div>
          <div class="runmodel" :class="{active: ifreshair.runMode === 5}" @click="updateControlState('内循环模式', 'runMode', 5)">
            <div class="runmodel-icon"><i class="iconfont icon-iot-xh"></i></div>
            <span>内循环</span>
          </div>
        </div>
      </div>

      <div class="flex setting-row">
        <div class="setting-row__title">进风风速</div>
        <div class="flex-item">
          <v-range :min="0" :max="9" :value="ifreshair.inWindSpeed" :disabled="!isOnline" @getRange="onInWindSpeedChange"></v-range>
        </div>
        <div class="padding-s">{{ifreshair.inWindSpeed}}档</div>
      </div>
      <div class="flex setting-row">
        <div class="setting-row__title">排风风速</div>
        <div class="flex-item">
          <v-range :min="0" :max="9" :value="ifreshair.outWindSpeed" :disabled="!isOnline" @getRange="onOutWindSpeedChange"></v-range>
        </div>
        <div class="padding-s">{{ifreshair.outWindSpeed}}档</div>
      </div>
      <div class="flex setting-row">
        <div class="setting-row__title" style="width: 52px"></div>
        <div class="flex-item">
          <span class="valign-middle setting-row__title">辅热</span>
          <div class="inline-block"><v-switch v-model="isAuxHeatingOn" :disabled="!isOnline" @onchange="onAuxHeatingChange"></v-switch></div>
        </div>
        <div class="flex-item align-right">
          <span class="valign-middle setting-row__title">旁通</span>
          <div class="inline-block"><v-switch v-model="isBypassOn" :disabled="!isOnline" @onchange="onBypassChange"></v-switch></div>
        </div>
      </div>
    </div>

    <div class="padding-top clearfixed">
      <button type="button" class="btn btn-gray btn-lg btn-block" @click="value = false">关闭</button>
    </div>
  </v-popup>
</template>

<script>
  import VPopup from "@/components/ui/v-popup";
  import VRange from '@/components/ui/v-range';
  import VSwitch from '@/components/ui/v-switch';

  import storeTypes from "@/store/types";

  import _ from "loadash";
  import freshairDeviceApi from "@/apis/api-iot-freshairdevice";

  export default {
    name: "v-setting-popup",
    components: {VPopup, VRange, VSwitch},
    props: {
      // 用于控制显示隐藏popup
      value: Boolean,
      // 设备数据
      device: {
        type: Object,
        default: {}
      }
    },
    computed: {
      deviceEntityId: function () {
        return this.device.id || "";
      },
      ifreshair: function () {
        return this.device.iotDevice || {
          runMode: 0,
          inWindSpeed: 0,
          outWindSpeed: 0,
          auxHeating: 0,
          bypass: 0,
          online: false
        }
      },
      isOnline: function () {
        return this.ifreshair.online === true;
      },
      isAuxHeatingOn: function () {
        return this.ifreshair.auxHeating === 1;
      },
      isBypassOn: function () {
        return this.ifreshair.bypass === 1;
      }
    },
    watch: {
      value: function (newVal) {
        this.$emit("input", newVal);
      }
    },
    methods: {
      /**
       * 监听进风风速变化设置
       * @param inWindSpeed
       */
      onInWindSpeedChange: _.debounce(function(inWindSpeed) {
        if(inWindSpeed !== this.ifreshair.inWindSpeed) {
          this.ifreshair.inWindSpeed = inWindSpeed;
          this.updateControlState("进风风速", "inWindSpeed", inWindSpeed);
        }
      }, 600),

      /**
       * 监听排风风速变化设置
       * @param outWindSpeed
       */
      onOutWindSpeedChange: _.debounce(function(outWindSpeed) {
        if(outWindSpeed !== this.ifreshair.outWindSpeed) {
          this.ifreshair.outWindSpeed = outWindSpeed;
          this.updateControlState("排风风速", "outWindSpeed", outWindSpeed);
        }
      }, 600),

      /**
       * 监听辅热开关变化
       * @param isAuxHeatingOn 是否开启辅热
       */
      onAuxHeatingChange: _.debounce(function(isAuxHeatingOn) {
        this.ifreshair.auxHeating = isAuxHeatingOn === true ? 1 : 0;
        const itemName = isAuxHeatingOn === true ? "开启辅热" : "关闭辅热";
        this.updateControlState(itemName, 'auxHeating', this.ifreshair.auxHeating);
      }, 600),

      /**
       * 监听旁通开关变化
       * @param isBypassOn 是否开启旁通
       */
      onBypassChange: _.debounce(function(isBypassOn) {
        this.ifreshair.bypass = isBypassOn === true ? 1 : 0;
        const itemName = isBypassOn === true ? "开启旁通" : "关闭旁通";
        this.updateControlState(itemName, 'bypass', this.ifreshair.bypass);
      }, 600),

      /**
       * 更新控制状态
       *
       * @param itemName 控制项名称
       * @param itemCode 控制项代码, runMode(运行模式) | inWindSpeed(进风风速) | outWindSpeed(排风风速) | temperature(温度) | humidity(湿度) | auxHeating(辅热) | bypass(旁通)
       * @param val      控制项值，相关值参考如下：
       * - runMode: 0(自动), 1(手动), 2(睡眠), 3(循环)
       * - inWindSpeed: 0~9
       * - outWindSpeed: 0~9
       * - temperature: 0~60
       * - humidity: 0~90
       * - auxHeating: 0(关闭), 1(开启)
       * - bypass: 0(关闭), 1(开启)
       */
      updateControlState: function (itemName, itemCode, val) {
        if(this.isOnline === false) {
          this.$toast.error("离线状态不可操作");
          return;
        }
        this.$store.commit(storeTypes.ifreshair.updateCanLoadDetailFlag, false);

        this.$loading.show("正在设置" + itemName + "...");
        freshairDeviceApi.updateControlState(this.deviceEntityId, itemCode, val)
          .then((resp) => {
            this.$store.commit(storeTypes.ifreshair.updateCanLoadDetailFlag, true);
            this.$loading.hide();
            this.showInstructionExecMsg(resp, itemName);
            this.$emit("updateControlStateSuccess");
          })
      },

      /**
       * 显示指令执行结果提示
       * @param execResp        执行结果
       * @param instructionName 指令名称
       */
      showInstructionExecMsg: function (execResp, instructionName) {
        if(execResp !== true) {
          //this.$toast.success(instructionName + "设置成功");
          this.$toast.error(instructionName + "设置失败");
        }
      },
    }
  }
</script>
