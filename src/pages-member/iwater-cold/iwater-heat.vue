<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .iWater-main {
    position: absolute;
    left: 0;
    right: 0;

    .i-water-nav {
      background: $primary;
      border: 0 none;

      .mint-tab-item {
        color: #fff;

        &.is-selected {
          color: #fff;
          border-bottom-color: #fff;
          margin-bottom: 0;
        }
      }
    }
    .purest-box {
      .purest {
        background-color: $primary!important;
        background: url("/static/images/devices/bg.png") #fff no-repeat;
        background-size: 100% rem(280px);

        .title {
          font-weight: 100;
        }
        .pay-btn-box {
          position: relative;
          top: $l;
          .pay-box {
            position: absolute;
            right: 0;
            top: -9px;

            .flex-item {
              background: rgba(0,0,0,.15);
              padding: rem(5px) rem(5px) rem(5px) rem(20px);
              border-radius: 30px 0 0 30px;
              .color-brown {
                color: $brown-1;
              }
            }
          }
        }
        .purestNum {
          display: flex;

          .beforePurest, .afterPurest {
            flex: 1;
            color: #fff;
            text-align: center;
            justify-content: center;
            .line-border {
              border-top: 1px dotted rgba(255,255,255,.2);
            }
            .font-opacity {
              color: rgba($white,.7);
            }
          }
        }
      }
      .operate-box {
        .btn-gruop-box {
          .btn-box {
            .operate-btn {
              width: rem(40px);
              height: rem(40px);
              text-align: center;
              justify-content: center;
              background: $font-light;
              @include border-radius(50%);

              .iconfont {
                font-size: $font-size-l;
                color: $white;
              }
            }
            .icon-box {
              justify-content: center;
            }
            span {
              width: 100%;
              display: inline-block;
              line-height: rem(25px);
              margin-top: rem(5px);
              color: #888;
            }

            .operate-btn {
              &.operate-1 {
                background: $success;
              }
              &.operate-2 {
                background: $primary;
              }
              &.operate-3 {
                background: $warning;
              }
              &.operate-4 {
                background: $primary-light;
              }
              &.operate-5 {
                background: $primary-light;
              }
              &.operate-6 {
                background: $info;
              }
              &.operate-7 {
                background: $success;
              }
              &.operate-8 {
                background: $info;
              }
            }
          }
        }
      }
    }
    .statistics {
      background: url("/static/images/devices/bg.png") #fff no-repeat;
      background-size: 100% rem(400px);
    }
    .filter-life {
      background: url("/static/images/devices/bg.png") no-repeat;
      background-size: 100% rem(290px);
    }
    .point {
      transform: rotate(120deg);
    }
  }
  .dueDate{
    padding-bottom: rem(80px);
  }
  .recharge{
    @include border-radius(3px);
  }
</style>
<template>
  <app-view>
    <div class="iWater-main">
      <!--智能净水-->
      <div class="purest-box" v-show="iWaterNav === 'purest'">
        <div class="purest padding-top-l padding-bottom-l">
          <!--续费按钮-->
          <div>
            <div class="pay-btn-box" v-if="iWater.deviceType == 'L'">
              <div class="pay-box flex" @click.stop="recharge()">
                <div class="flex-item">
                  <div class="font-m color-white font-bold-700">续费 <i class="iconfont icon-iot-youjiantou1 font-m font-bold-300"></i></div>
                  <div class="font-s font-family-num font-bold-300" style="color: rgba(255,255,255,.6);">到期：{{ $filters.formatDate(iWater.leaseDueDate).replace('-','/').replace('-','/').substring(2,10) }}</div>
                </div>
              </div>
            </div>
            <div class="title margin-bottom-m align-center color-white font-l">
              <span v-if="!isOnline" class="font-m color-white">已离线</span>
              <span v-else-if="power">{{ tdsTitle }}</span>
            </div>
          </div>
          <!--设备状态显示-->
          <div class="align-center margin-bottom-m" v-if="isOnline && !power">
            <span class="font-m font-bold-700 color-warning">已关机</span>
          </div>
          <!--数据图示化-->
          <div class="purestNum padding-left-l padding-right-l margin-top-l">
            <div class="beforePurest valign-center">
              <div style="width: 100%;">
                <div class="font-l font-bold-500">{{ iWater.iotDevice && iWater.iotDevice.inWaterTds ? iWater.iotDevice.inWaterTds : 0 }}</div>
                <!--<i class="font-s font-opacity">mg/L</i>-->
                <!--<div class="line-border margin-top-s margin-bottom-s"></div>-->
                <div class="font-s font-opacity">净化前</div>
              </div>
            </div>
            <div class="pursetCircle">
              <canvas id="circle" width="300" height="300"  style="width: 150px;height: 150px;"></canvas>
            </div>
            <div class="afterPurest valign-center">
              <div style="width: 100%;">
                <div class="font-l font-bold-500">{{ iWater.iotDevice && iWater.iotDevice.outWaterTds ? iWater.iotDevice.outWaterTds : 0 }}</div>
                <!--<i class="font-s font-opacity">mg/L</i>-->
                <!--<div class="line-border margin-top-s margin-bottom-s"></div>-->
                <div class="font-s font-opacity">净化后</div>
              </div>
            </div>
          </div>
          <!--其余-->
          <!--<div class="status-box flex padding-bottom-m padding-top-s">
            <div class="flex-item status-item align-center color-white font-s">
              <i class="iconfont font-s icon-iot-wd"></i><span class="margin-left-s">{{ iWater.iotDevice && iWater.iotDevice.waterTemperature ? iWater.iotDevice.waterTemperature : 0 }} ℃</span>
            </div>
            <div class="flex-item status-item align-center color-white font-s">
              <i class="iconfont font-s icon-iot-ts"></i><span class="margin-left-s">{{ iWater.iotDevice && iWater.iotDevice.childLock ? (iWater.iotDevice.childLock === 1 ? '已开' : '未知') : '已关' }}</span>
            </div>
            <div class="flex-item status-item align-center color-white font-s">
              <i class="iconfont font-s icon-iot-zs"></i><span class="margin-left-s">制水中</span>
            </div>
            <div class="flex-item status-item align-center color-white font-s">
              <i class="iconfont font-s icon-iot-sj"></i><span class="margin-left-s">杀菌中</span>
            </div>
          </div>-->
        </div>
        <!--按钮组-->
        <div class="operate-box padding-top padding-bottom bg-white">
          <ul class="flex align-center btn-gruop-box">
            <li @click.stop="onOrOff()" class="flex-item btn-box ripple">
              <div class="flex icon-box">
                <div class="operate-btn valign-center" :class="{ 'operate-1': isOnline }">
                  <i class="iconfont icon-iot-guanji"></i>
                </div>
              </div>
              <span class="font-default">{{ power ? '关机' : '开机' }}</span>
            </li>
            <li @click.stop="setTime()" class="flex-item btn-box ripple">
              <div class="flex icon-box">
                <div class="operate-btn valign-center"
                     :class="{ 'operate-2': canHandle }">
                  <i class="iconfont icon-iot-chongxi"></i>
                </div>
              </div>
              <span class="font-s">定时</span>
            </li>
            <!--<li @click.stop="clean()" class="flex-item btn-box ripple">-->
              <!--<div class="flex icon-box">-->
                <!--<div class="operate-btn valign-center"-->
                     <!--:class="{ 'operate-2': canHandle }">-->
                  <!--<i class="iconfont icon-iot-chongxi"></i>-->
                <!--</div>-->
              <!--</div>-->
              <!--<span class="font-default">一键冲洗</span>-->
            <!--</li>-->
            <li @click.stop="switchTag('account')" class="flex-item btn-box ripple">
              <div class="flex icon-box">
                <div class="operate-btn valign-center operate-3">
                  <i class="iconfont icon-iot-jstj"></i>
                </div>
              </div>
              <span class="font-s">净水统计</span>
            </li>
            <!--<li @click.stop="switchTag('filter')" class="flex-item btn-box ripple">-->
              <!--<div class="flex icon-box">-->
                <!--<div class="operate-btn valign-center operate-4">-->
                  <!--<i class="iconfont icon-iot-lxsm"></i>-->
                <!--</div>-->
              <!--</div>-->
              <!--<span class="font-default">滤芯寿命</span>-->
            <!--</li>-->
            <li @click.stop="book()" class="flex-item btn-box ripple">
              <div class="flex icon-box">
                <div class="operate-btn valign-center operate-8">
                  <i class="iconfont icon-iot-yuyue"></i>
                </div>
              </div>
              <span class="font-s">服务预约</span>
            </li>
            <li class="flex-item btn-box ripple" @click.stop="detail()">
              <div class="flex icon-box">
                <div class="operate-btn valign-center operate-5">
                  <i class="iconfont icon-iot-setting"></i>
                </div>
              </div>
              <span class="font-s">设备详情</span>
            </li>
          </ul>
          <!--<ul class="flex align-center margin-top-s btn-gruop-box">-->
            <!--<li class="flex-item btn-box ripple" @click.stop="detail()">-->
              <!--<div class="flex icon-box">-->
                <!--<div class="operate-btn valign-center operate-5">-->
                  <!--<i class="iconfont icon-iot-setting"></i>-->
                <!--</div>-->
              <!--</div>-->
              <!--<span class="font-default">设备详情</span>-->
            <!--</li>-->
            <!--<li @click.stop="oauthManage()" class="flex-item btn-box ripple" v-if="isOwner">-->
              <!--<div class="flex icon-box">-->
                <!--<div class="operate-btn valign-center operate-6">-->
                  <!--<i class="iconfont icon-iot-shouquan"></i>-->
                <!--</div>-->
              <!--</div>-->
              <!--<span class="font-default">授权管理</span>-->
            <!--</li>-->
            <!--<li @click.stop="restoreWiFi()" class="flex-item btn-box ripple">-->
              <!--<div class="flex icon-box">-->
                <!--<div class="operate-btn valign-center"-->
                     <!--:class="{ 'operate-7': canHandle }">-->
                  <!--<i class="iconfont icon-iot-wifi1"></i>-->
                <!--</div>-->
              <!--</div>-->
              <!--<span class="font-default">清除WIFI配置</span>-->
            <!--</li>-->
            <!--<li @click.stop="book()" class="flex-item btn-box ripple">-->
              <!--<div class="flex icon-box">-->
                <!--<div class="operate-btn valign-center operate-8">-->
                  <!--<i class="iconfont icon-iot-yuyue"></i>-->
                <!--</div>-->
              <!--</div>-->
              <!--<span class="font-default">服务预约</span>-->
            <!--</li>-->
            <!--&lt;!&ndash;布局需要，当用户非拥有者时无授权管理&ndash;&gt;-->
            <!--<li v-if="!isOwner" class="flex-item"></li>-->
          <!--</ul>-->
        </div>
        <!--调整出水量等面板-->
        <div class="margin-top bg-white adjust-box">
          <div class="flex padding-m border-bottom" @click.stop="openHeat('milk')">
            <div class="flex-item">
              <i class="iconfont icon-iot-cs"></i>
              <span>热水温度</span>
            </div>
            <div class="adjust-num font-bold-700 font-m color-danger-light">{{ heatData && heatData.outflow ? heatData.outflow : 0 }} ℃</div>
            <i class="margin-left-s iconfont icon-iot-youjiantou1 font-lighter font-s"></i>
          </div>
          <div class="flex padding-m border-bottom" @click.stop="openHeat('tea')">
            <div class="flex-item">
              <i class="iconfont icon-paocha"></i>
              <span>冷水温度</span>
            </div>
            <div class="adjust-num font-bold-700 font-m color-primary">{{ heatData && heatData.tea ? heatData.tea : 0 }}  ℃</div>
            <i class="margin-left-s iconfont icon-iot-youjiantou1 font-lighter font-s"></i>
          </div>
          <div class="flex padding-m border-bottom" @click.stop="switchTag('filter')">
            <div class="flex-item">
              <i class="iconfont icon-paocha font-bold-500"></i>
              <span class="font-bold-500">滤芯寿命</span>
            </div>
            <div class="adjust-num font-bold-500 font-s font-light">共5根/待更新1根</div>
            <i class="margin-left-s iconfont icon-iot-youjiantou1 font-lighter font-s"></i>
          </div>
          <div class="flex padding-m border-bottom" @click.stop="oauthManage()">
            <div class="flex-item">
              <i class="iconfont icon-paocha font-bold-500"></i>
              <span class="font-bold-500">授权管理</span>
            </div>
            <div class="adjust-num font-bold-500 font-s font-light">已授权3人</div>
            <i class="margin-left-s iconfont icon-iot-youjiantou1 font-lighter font-s"></i>
          </div>
          <!--<div class="flex padding-m border-bottom" @click.stop="openHeat('milk')">
            <div class="flex-item">
              <i class="iconfont icon-iot-cn font-bold-500"></i>
              <span class="font-bold-500">冲奶</span>
            </div>
            <div class="adjust-num font-bold-500 color-danger-light">{{ heatData && heatData.milk ? heatData.milk : 0 }} ℃</div>
            <i class="margin-left-s iconfont icon-iot-youjiantou1 font-lighter font-s"></i>
          </div>-->
        </div>
      </div>
    </div>

    <!-- 调整面板弹窗 -->
    <mt-popup v-model="heatPopup"
              popup-transition="popup-fade"
              class="iwater-heat-page" style="height: 60%">
      <panel-heat :openType="openType" @transferData="transferHeat" @close="heatPopup=false"></panel-heat>
    </mt-popup>
  </app-view>
</template>

<script>
  import CircleBar from '@/assets/scripts/circle-bar'
  import moment from 'moment'
  import panelHeat from './panel-heat'
  import AppEmptyView from '@/components/layouts/app-empty-view'
  import waterdevicesApis from "@/apis/api-iot-waterdevices";
  import userdevicesApis from "@/apis/api-userdevices";

  // 引入 ECharts 主模块
  let echarts = require('echarts/lib/echarts');
  require('echarts/lib/chart/bar');

  import types from "@/store/types";

  export default{
    name: "devices-iwater",
    data () {
      return {
        iWaterNav: 'purest',
        iWaterTabs: [
          {
            id: 'purest',
            label: '智能净水'
          },
          {
            id: 'account',
            label: '净水统计'
          },
          {
            id: 'filter',
            label: '滤芯寿命'
          }
        ],
        // 设备数据
        iWater: {},
        // 水质状况
        tdsTitle: '',
        circleProgress: 100,
        bookQuery: {
          id: '',
          deviceId: '',
          deviceName: '',
          productId: '',
          productImage: '',
          itemCode: '',
          purchaseDate: ''
        },
        i: 0,
        timer: null,
        // 是否开机
        power: false,
        instruct: '',
        instructText: '',
        isOnline: false,
        deviceId: '',
        usrDeviceId: this.$route.params.id,
        isOwner: true,
        entity: {},
        // 加热调整面板弹窗
        heatPopup: false,
        // 加热弹窗类型 [outflow:出水量 | tea:泡茶 | milk:冲奶]
        openType: 'outflow',
        // 面板值
        heatData: {
          // 最大出水量
          outflow: 0,
          // 泡茶温度
          tea: 0,
          // 泡奶温度
          milk: 0
        },
        // 轮询标识
        loopInterval: 0,
      }
    },
    mounted: function () {
      this.$store.state.showLoading = false;
      this.fetchData();
      this.loopInterval = setInterval(this.fetchData, 5000);
    },
    beforeRouteLeave(to,from,next) {
      clearInterval(this.loopInterval);
      document.getElementById('app').style.background = 'initial';
      next();
    },
    computed: {
      curUser() {
        return this.$store.getters[types.oauth.getCurUser];
      },
      // 根据设备的开关机状态和是否离线状态
      canHandle() {
        return this.isOnline;
      }
    },
    methods: {
      /**
       * 初始化拉取数据
       */
      fetchData() {
        let that = this;
        let _id = that.$route.params.id;
        let res = {};
        userdevicesApis.detail(_id)
          .then((data) => {
            this.entity = data;
            this.iWater = data && data.device;
            res = data && data.device;
            this.deviceId = res && res.id;
            if(data && data.userRole && data.userRole !== 'Owner') {
              this.isOwner = false;
            }

            // 面板值赋值
            that.heatData = {
              // 最大出水量
              outflow: (res.iotDevice && res.iotDevice.maxOutFlow) ? res.iotDevice.maxOutFlow : 0,
              // 泡茶温度
              tea: (res.iotDevice && res.iotDevice.temperatureForTea) ? res.iotDevice.temperatureForTea : 0,
              // 泡奶温度
              milk: (res.iotDevice && res.iotDevice.temperatureForMilk) ? res.iotDevice.temperatureForMilk : 0
            }

            // 智能净水
            this.$nextTick(() => {
              // 净水率
              let _iot = res.iotDevice;
              let _inWater = _iot && _iot.inWaterTds;
              let _outWater = _iot && _iot.outWaterTds;
              if(_iot && _inWater && _outWater && _inWater >= _outWater) {
                this.circleProgress = parseInt((1 - (Number(_outWater) / Number(_inWater))) * 100);
              }

              if(document.getElementById('circle') && document.getElementById('circle').getContext('2d')) {
                let _isReload = (_iot && _iot.reloadWater && _iot.reloadWater === 1) || false;
                CircleBar.draw('#circle', this.circleProgress,undefined,false,_isReload);
              }
            })

            this.power = res.iotDevice && res.iotDevice.powerOn;
            this.isOnline = res.iotDevice && res.iotDevice.online;
            // 开发或测试环境模拟在线
            if(!this.$app.isProduct || this.$store.getters[types.oauth.getShopId] === "n6ZR6p") {
              this.isOnline = true;
            }

            this.bookQuery = {
              id: this.usrDeviceId,
              deviceId: this.deviceId,
              deviceName: res && res.deviceName,
              productId: res && res.productId,
              productImage: res && res.productImage,
              itemCode: res && res.itemCode,
              purchaseDate: res && res.purchaseDate,
              address: res && res.address && encodeURIComponent(JSON.stringify(res.address))
            };

            if(res.iotDevice && res.iotDevice.outWaterTds) {
              let _title = '';
              let _tds = Number(res.iotDevice.outWaterTds);
              if(_tds < 60) {
                _title = '水质极好';
              } else if(_tds > 59 && _tds < 100) {
                _title = '水质很好';
              } else if(_tds > 99 && _tds < 300) {
                _title = '水质一般';
              } else if(_tds > 299) {
                _title = '水质污染';
              }
              this.tdsTitle = _title;
            }
          })
      },
      /**
       * 设备详情
       */
      detail() {
        let that = this;
        //this.$store.commit("showLoading");
        that.$utils.loctnHref(`/devices/${this.$route.params.id}/view`);
      },
      /**
       * 服务预约
       */
      book() {
        this.$utils.loctnHref('/serviceorder/create', this.bookQuery);
      },

      /**
       * 获取指令执行结果
       * @param deviceEntityId   设备实体ID
       * @param instructionId    指令ID
       * @param instructionTitle 指令名称
       */
      getExecInstructionResp: function (deviceEntityId, instructionId, instructionTitle) {
        waterdevicesApis.getInstructionResult(deviceEntityId, instructionId)
          .then((resp) => {
            this.$loading.hide();
            console.log("执行结果：" + resp);
            if(resp === true) {
              this.$toast.success(instructionTitle + "执行成功");
            } else {
              this.$toast.error(instructionTitle + "执行失败");
            }
          })
      },

      /**
       * 一键冲洗
       */
      clean() {
        if(this.canHandle) {
          this.$dlg.confirm("确定一键冲洗？", () => {
            this.$loading.show("正在一键冲洗...");
            waterdevicesApis.executeInsturct(this.deviceId, 'flush')
              .then((res) => {
                this.instruct = res;
                this.instructText = '一键冲洗';
                this.getExecInstructionResp(this.deviceId, res, "一键冲洗");
              })
              .catch(() => {
                this.$loading.hide();
              })
          });
        }
      },
      /**
       * 开关机
       */
      onOrOff() {
        let that = this;
        let instructionText = this.power === true ? "关机" : "开机";
        if(that.isOnline) {
          this.$dlg.confirm(`确定${instructionText}？`, () => {
            this.$loading.show("正在" + instructionText + "...");
            waterdevicesApis.executeInsturct(that.deviceId, 'onoff')
              .then((res) => {
                that.instruct = res;
                that.instructText = instructionText;
                this.getExecInstructionResp(this.deviceId, res, instructionText);

                if(that.power) {
                  that.circleProgress = 0;
                }
              })
              .catch(() => {
                this.$loading.hide();
              })
          });
        }
      },
      /**
       * 重新配网
       */
      restoreWiFi() {
        if(this.canHandle) {
          this.$dlg.confirm("确定重新配网？", () => {
            this.$loading.show("正在清除WiFi配置...");
            waterdevicesApis.executeInsturct(this.deviceId, 'restoreWiFi')
              .then((res) => {
                this.instruct = res;
                this.instructText = '重新配网';
                this.getExecInstructionResp(this.deviceId, res, "重新配网");
              })
              .catch(() => {
                this.$loading.hide();
              })
          });
        }
      },

      /**
       * 授权管理
       */
      oauthManage() {
        if(this.isOwner) {
          this.$router.push(`/devices/${this.deviceId}/oauth`);
        }
      },
      /**
       * 个人租赁设备续费
       */
      recharge() {
        let that = this;
        let _company = that.iWater && that.iWater.company;
        if(!_company) {
          this.$store.commit("showLoading");
          let _params = {
            orderId: this.iWater.leaseProductId
          };
          that.$utils.loctnHref(`/userdevices/pay/deposit/${that.deviceId}`,_params);
        } else {
          this.$toast.show('请联系商家续费哦~');
        }
      },
      /**
       * 打开调整弹窗
       * @param type
       */
      openHeat(type) {
        let that = this;
        let _type = 'water';
        if(type) {
          _type = type;
        }
        that.openType = _type;
        that.heatPopup = true;
      },
      /**
       * 切换页面类型
       * @param type
       */
      switchTag(type) {
        let that = this;
        let _params = that.$route.params;
        let _type = 'purest';
        if(type) {
          _type = type;
        }
        if(_type && _params) {
          that.$utils.loctnHref(`/devices/${_params.id}/i${_type}`);
        }
      },
      /**
       * 调整面板值
       * @param data
       */
      transferHeat(data) {
        let that = this;
        let _type = that.openType;
        if(data) {
          that.heatData[_type] = data;
        }
      }
    },
    components: {
      AppEmptyView,
      panelHeat
    }
  }
</script>
