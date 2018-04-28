<style scoped lang="scss" type="text/scss">
  @import '~variables';
  .field-val{
    height: 34px;
    line-height: 34px;
    font-weight: 400;
    font-size: 14px;
  }
  .btn-action{
    min-width: 74px;
  }

  .runmodel-item {
    padding: rem(5px) rem(10px);
    background: $white;
    margin-left: rem(-1px);
    @include border();
    text-align: center;
    cursor: pointer;
  }
  .runmodel-item.active{
    background: $orange-1;
    color: $white;
  }

  .font-l{
    font-size: 22px;
  }
</style>

<template>
  <app-view>
    <div class="bg-white align-center">
      <div class="padding-m align-center font-m border-bottom">
        {{iFreshAir.deviceUdid}} / {{iFreshAir.deviceId}}
      </div>

      <div class="flex padding-bottom-s">
        <div class="flex-item">
          <div class="field-val color-red-1" v-html="isOnlineText"></div>
          <div class="font-light font-s">设备状态</div>
        </div>
        <div class="flex-item">
          <div class="field-val color-green-1" v-html="renderState(iFreshAir.maintainState)"></div>
          <div class="font-light font-s">保养状态</div>
        </div>
      </div>
      <div class="flex padding-bottom-s padding-top-s border-top">
        <div class="flex-item">
          <div class="field-val font-l color-blue-1">{{iFreshAir.pm25}}</div>
          <div class="font-light font-s">PM2.5 <span class="font-s">(ug/m³)</span></div>
        </div>
        <div class="flex-item">
          <div class="field-val font-l font-light">{{iFreshAir.voc}}</div>
          <div class="font-light font-s">VOC <span class="font-s">(ppm)</span></div>
        </div>
        <div class="flex-item">
          <div class="field-val font-l color-info">{{iFreshAir.hcho}}</div>
          <div class="font-light font-s">HCHO <span class="font-s">(ug/m³)</span></div>
        </div>
        <!--<div class="flex-item">
          <div class="field-val font-l color-red-1">{{iFreshAir.co2}}</div>
          <div class="font-light font-s">CO2 <span class="font-s">(ug/m³)</span></div>
        </div>-->
        <!--<div class="flex-item">
          <div class="field-val font-l color-green-1">{{iFreshAir.pm10}}</div>
          <div class="font-light font-s">PM10 <span class="font-s">(ug/m³)</span></div>
        </div>-->
      </div>
      <!--<div class="flex padding-bottom-s border-top">
        <div class="flex-item">
          <div class="field-val font-l font-light">{{iFreshAir.voc}}</div>
          <div class="font-light font-s">VOC <span class="font-s">(ppm)</span></div>
        </div>
        <div class="flex-item">
          <div class="field-val font-l color-info">{{iFreshAir.hcho}}</div>
          <div class="font-light font-s">HCHO <span class="font-s">(ug/m³)</span></div>
        </div>
        <div class="flex-item">
          <div class="field-val font-l color-red-1">{{iFreshAir.co2}}</div>
          <div class="font-light font-s">CO2 <span class="font-s">(ug/m³)</span></div>
        </div>
      </div>-->
      <div class="flex padding-bottom-s padding-top-s border-top">
        <div class="flex-item">
          <div class="field-val font-l color-darkblue-1">{{iFreshAir.humidityActual}} / {{iFreshAir.humiditySetting}}</div>
          <div class="font-light font-s">湿度 <span class="font-s">(%RH)</span></div>
        </div>
        <div class="flex-item">
          <div class="field-val font-l color-yellow-1">{{iFreshAir.temperatureActual}} / {{iFreshAir.temperatureSetting}}</div>
          <div class="font-light font-s">温度 <span class="font-s">(℃)</span></div>
        </div>
        <div class="flex-item">
          <div class="field-val font-l color-purple">{{iFreshAir.totalHours}}</div>
          <div class="font-light font-s">总运行时长 <span class="font-s">(小时)</span></div>
        </div>
      </div>
      <!--<div class="flex padding-bottom-s border-top">
        <div class="flex-item">
          <div class="field-val" v-html="renderState(iFreshAir.freshState)"></div>
          <div class="font-light font-s">清新状态</div>
        </div>
        <div class="flex-item">
          <div class="field-val" v-html="renderState(iFreshAir.bacteriostaticState)"></div>
          <div class="font-light font-s">抑菌状态</div>
        </div>
        <div class="flex-item">
          <div class="field-val" v-html="renderState(iFreshAir.maintainState)"></div>
          <div class="font-light font-s">保养状态</div>
        </div>
      </div>-->
    </div>

    <div class="bg-white">
      <div class="flex border-top padding">
        <div class="font-bold-300 padding-right-l padding-left-s">运行模式</div>
        <div class="flex-item font-bold-400 color-cyan">
          <span class="valign-middle">{{runModelText}}</span>
          <button type="button" class="btn btn-sm btn-action valign-middle margin-left-m" @click="isShowRunModelPopup = true" :disabled="!isOnline">设置模式</button>
        </div>
      </div>
      <div class="flex border-top">
        <div class="font-bold-300 padding-right-l padding-left-m">进风风速</div>
        <div class="flex-item padding" style="padding-left: 1px !important;">
          <v-range min="0" max="9" :showVal="false" :value="iFreshAir.inWindSpeed" @getRange="onInWindSpeedChange" :disabled="!canChangeWindSpeed"></v-range>
        </div>
        <div class="padding-s">{{iFreshAir.inWindSpeed}}</div>
      </div>
      <div class="flex border-top">
        <div class="font-bold-300 padding-right-l padding-left-m">排风风速</div>
        <div class="flex-item padding" style="padding-left: 1px !important;">
          <v-range min="0" max="9" :showVal="false" :value="iFreshAir.outWindSpeed" @getRange="onOutWindSpeedChange" :disabled="!canChangeWindSpeed"></v-range>
        </div>
        <div class="padding-s">{{iFreshAir.outWindSpeed}}</div>
      </div>
    </div>

    <div class="flex align-center margin-top-m">
      <div class="flex-item"><button type="button" class="btn btn-action" @click="isShowTempPopup = true" :disabled="!isOnline">温度设置</button></div>
      <div class="flex-item"><button type="button" class="btn btn-action" @click="isShowHumidityPopup = true" :disabled="!isOnline">湿度设置</button></div>
      <div class="flex-item"><button type="button" class="btn btn-action" @click="resetFilter" :disabled="!isOnline">滤芯重置</button></div>
    </div>

    <div class="flex margin-top align-center">
      <div class="flex-item">
        <button type="button" class="btn btn-action" v-if="iFreshAir.auxHeating == 0" @click="updateControlState('开启辅热', 'auxHeating', 1)" :disabled="!isOnline">开启辅热</button>
        <button type="button" class="btn btn-action" v-if="iFreshAir.auxHeating == 1" @click="updateControlState('关闭辅热', 'auxHeating', 0)" :disabled="!isOnline">关闭辅热</button>
      </div>
      <div class="flex-item">
        <button type="button" class="btn btn-action" v-if="iFreshAir.bypass == 0" @click="updateControlState('开启旁通', 'bypass', 1)" :disabled="!isOnline">开启旁通</button>
        <button type="button" class="btn btn-action" v-if="iFreshAir.bypass == 1" @click="updateControlState('关闭旁通', 'bypass', 0)" :disabled="!isOnline">关闭旁通</button>
      </div>
      <div class="flex-item">
        <button type="button" class="btn btn-action" v-if="!isSimDevice" disabled="!isOnline">重新配网</button>
      </div>
    </div>

    <div class="flex margin-top-m align-center">
      <div class="flex-item">
        <button type="button" class="btn btn-action" v-if="!iFreshAir.powerOn" @click="onoff()" :disabled="!isOnline">开机</button>
        <button type="button" class="btn btn-action" v-if="iFreshAir.powerOn" @click="onoff()" :disabled="!isOnline">关机</button>
      </div>
      <div class="flex-item">
        <button type="button" class="btn btn-action" @click="finish(false)">清理异常设备</button>
      </div>
      <div class="flex-item">
        <button type="button" class="btn btn-action" @click="finish(true)">厂测完成</button>
      </div>
    </div>

    <div class="padding align-center font-lighter margin-top-l" v-show="!isOnline">设备离线，灰色按钮表示不可操作</div>

    <div style="height: 25px"></div>

    <!--温度设置Popup-->
    <v-popup v-model="isShowTempPopup" position="bottom">
      <div class="flex padding border-bottom">
        <div class="flex-item font-bold">温度设置</div>
        <div class="align-right" @click="isShowTempPopup = false"><i class="fa fa-times-circle icon-m font-light"></i></div>
      </div>
      <div class="padding">
        <v-range :min="16" :max="30" :show-val="true" val-title="温度(℃)" :value="iFreshAir.temperatureSetting" @getRange="onTemperatureChange"></v-range>
      </div>
      <div class="padding-top-xl clearfixed">
        <button type="button" class="btn btn-primary btn-lg btn-block" @click="updateControlState('温度设置', 'temperature', temperature)">确定</button>
      </div>
    </v-popup>

    <!--湿度设置Popup-->
    <v-popup v-model="isShowHumidityPopup" position="bottom">
      <div class="flex padding border-bottom">
        <div class="flex-item font-bold">湿度设置</div>
        <div class="align-right" @click="isShowHumidityPopup = false"><i class="fa fa-times-circle icon-m font-light"></i></div>
      </div>
      <div class="padding">
        <v-range :min="40" :max="80" :show-val="true" val-title="湿度(%RH)" :value="iFreshAir.humiditySetting" @getRange="onHumidityChange"></v-range>
      </div>
      <div class="padding-top-xl clearfixed">
        <button type="button" class="btn btn-primary btn-lg btn-block" @click="updateControlState('湿度设置', 'humidity', humidity)">确定</button>
      </div>
    </v-popup>

    <!--运行模式设置Popup-->
    <v-popup v-model="isShowRunModelPopup" position="bottom" title="运行模式设置">
      <div class="padding flex margin-top-l margin-bottom-l">
        <div class="flex-item runmodel-item" :class="{active: iFreshAir.runMode === 1}" @click="updateControlState('运行模式', 'runMode', 1)">自动</div>
        <div class="flex-item runmodel-item" :class="{active: iFreshAir.runMode === 2}" @click="updateControlState('运行模式', 'runMode', 2)">手动</div>
        <div class="flex-item runmodel-item" :class="{active: iFreshAir.runMode === 3}" @click="updateControlState('运行模式', 'runMode', 3)">睡眠</div>
        <div class="flex-item runmodel-item" :class="{active: iFreshAir.runMode === 4}" @click="updateControlState('运行模式', 'runMode', 4)">定时</div>
        <div class="flex-item runmodel-item" :class="{active: iFreshAir.runMode === 5}" @click="updateControlState('运行模式', 'runMode', 5)">内循环</div>
      </div>
      <!--<div class="padding-top-xl clearfixed">
        <button type="button" class="btn btn-primary btn-lg btn-block" @click="updateControlState('湿度设置', 'humidity', humidity)">确定</button>
      </div>-->
    </v-popup>
  </app-view>
</template>
<script>
  import VPopup from '@/components/ui/v-popup'
  import VRange from '@/components/ui/v-range'

  import freshairApis from "@/apis/api-t-ifreshair";
  import iDeviceApis from "@/apis/api-t-idevice";
  import _ from "loadash";

  export default {
    name: "ifreshair-view",
    components: {
      VRange,
      VPopup
    },
    data() {
      return {
        iFreshAir: {},

        // 温度设置
        isShowTempPopup: false,
        temperature: 0,

        // 湿度设置
        isShowHumidityPopup: false,
        humidity: 0,

        // 轮询标识
        loopInterval: 0,

        // 进度变化时间，用于防止快速滑动不停提交请求
        rangeChangeTime: 0,

        // 运行模式设置
        isShowRunModelPopup: false,
      }
    },
    computed: {
      deviceId: function () {
        return this.$route.params.deviceId;
      },
      isOnline: function () {
        return this.iFreshAir.online === true;
      },
      isOnlineText: function () {
        return this.iFreshAir.online === true ? "<span class='color-success'>在线</span>" : "<span class='color-danger'>离线</span>";
      },
      isSimDevice: function () {
        // sim卡设备唯一标识固定长度15位
        const deviceUdid = this.iFreshAir.deviceUdid;
        return deviceUdid && deviceUdid.length === 15;
      },
      runModelText: function () {
        let mode = "";
        switch (this.iFreshAir.runMode) {
          case 1:
            mode = "自动";
            break;
          case 2:
            mode = "手动";
            break;
          case 3:
            mode = "睡眠";
            break;
          case 4:
            mode = "定时";
            break;
          case 5:
            mode = "内循环";
            break;
          default:
            mode = "未知";
            break;
        }
        return mode;
      },
      canChangeWindSpeed: function () {
        const mode = this.iFreshAir.runMode;
        return this.isOnline && !(mode === 1 || mode === 3);
      }
    },
    mounted(){
      this.loadDeviceDetail(true);
      this.loopInterval = setInterval(this.loadDeviceDetail, 5000);
    },
    beforeRouteLeave(to, from, next) {
      clearInterval(this.loopInterval);
      next();
    },
    methods: {
      // 加载设备详情
      loadDeviceDetail: function (isManual = false) {
        if(isManual) {
          this.$loading.show();
        }

        freshairApis.detail(this.deviceId)
          .then((device) => {
            if(isManual) {
              setTimeout(() => {
                this.$loading.hide();
              }, 1000);
            }

            if(typeof device === "undefined" || device === null) {
              this.$dlg.alert("编码 " + this.deviceId + " 的设备信息不存在，请确认编码是否正确。");
              return;
            }
            //console.log("设备信息：" + JSON.stringify(device));
            if(device.humiditySetting < 40) {
              device.humiditySetting = 40;
            }
            if(device.humiditySetting > 80) {
              device.humiditySetting = 80;
            }
            if(device.temperatureSetting < 16) {
              device.temperatureSetting = 16;
            }
            if(device.temperatureSetting > 30) {
              device.temperatureSetting = 30;
            }
            device.online = true;

            this.iFreshAir = device;
            this.temperature = device.temperatureActual;
            this.humidity = device.humidityActual;
          })
          .catch(() => {
            if(isManual) {
              this.$loading.hide();
            }
            this.$toast.error("设备信息加载失败");
          })
      },

      // 状态渲染
      renderState: function (state) {
        if(state === 0) {
          return "<span class='color-danger'>关闭</span>";
        }
        if(state === 1) {
          return "<span class='color-success'>开启</span>";
        }
        return "<span class='color-lighter'>未知</span>";
      },

      // 开关机
      onoff: function () {
        this.$loading.show();
        freshairApis.onoff(this.deviceId)
          .then((result) => {
            this.$loading.hide();
            this.showInstructionExecMsg(result, "开关机");
          })
      },

      // 重置滤芯
      resetFilter: function () {
        this.$loading.show();
        freshairApis.resetFilter(this.deviceId)
          .then((dto) => {
            this.$loading.hide();
            if(dto) {
              this.iFreshAir = dto;
            } else {
              this.loadDeviceDetail();
            }
            this.showInstructionExecMsg(true, "重置滤芯")
          })
          .catch(() => {
            this.$loading.hide();
            this.showInstructionExecMsg(false, "重置滤芯")
          })
      },

      // 取消重置滤芯
      unResetFilter: function () {
        this.$loading.show();
        freshairApis.unresetFilter(this.deviceId)
          .then((dto) => {
            this.$loading.hide();
            if(dto) {
              this.iFreshAir = dto;
            } else {
              this.loadDeviceDetail();
            }
            this.showInstructionExecMsg(true, "取消重置滤芯")
          })
          .catch(() => {
            this.$loading.hide();
            this.showInstructionExecMsg(false, "取消重置滤芯")
          })
      },

      /**
       * 显示指令执行结果提示
       * @param execResp        执行结果
       * @param instructionName 指令名称
       */
      showInstructionExecMsg: function (execResp, instructionName) {
        if(execResp === true) {
          this.$toast.success(instructionName + "执行成功");
        } else {
          this.$toast.error(instructionName + "执行失败");
        }
      },

      /**
       * 监听温度变化设置
       */
      onTemperatureChange: function (temperature) {
        this.temperature = temperature;
      },

      /**
       * 监听湿度变化设置
       */
      onHumidityChange: function (humidity) {
        this.humidity = humidity;
      },

      // 设置进风、排风风速
      onInWindSpeedChange: _.debounce(function(inWindSpeed) {
        if(inWindSpeed !== this.iFreshAir.inWindSpeed) {
          this.updateControlState("进风风速", "inWindSpeed", inWindSpeed);
        }
      }, 600),
      onOutWindSpeedChange: _.debounce(function(outWindSpeed) {
          if(outWindSpeed !== this.iFreshAir.outWindSpeed) {
            this.updateControlState("排风风速", "outWindSpeed", outWindSpeed);
          }
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
        if(this.iFreshAir.online === false) {
          this.$toast.error("离线状态不可操作");
          return;
        }
        this.isShowTempPopup = false;
        this.isShowHumidityPopup = false;
        this.isShowRunModelPopup = false;

        this.$loading.show();
        freshairApis.updateControlState(this.deviceId, itemCode, val)
          .then((resp) => {
            this.$loading.hide();
            this.showInstructionExecMsg(resp, itemName);

            this.loadDeviceDetail();
          })
      },

      finish: function (renew) {
        const that = this;
        let msg = renew ? "是否确定已厂测完成？" : "是否确定清理该设备信息";
        that.$dlg.confirm(msg, function () {
          iDeviceApis.finish(that.deviceId, renew)
            .then((resp) => {
              if(resp) {
                that.$toast.success("设备已成功处理");
                if(renew === false) {
                  that.$router.go(-1);
                }
              } else {
                that.$dlg.alert("抱歉，设备处理异常。");
              }
            })
            .catch((err) => {
              that.$dlg.alert("抱歉，设备处理异常。" + err);
            })
        })
      }
    }
  }
</script>
