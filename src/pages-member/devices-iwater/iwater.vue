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
        background-size: 100% rem(290px);
        padding: rem(50px) 0;
        background-position: 0 rem(50px);

        .title {
          font-weight: 100;
        }
        .pay-btn-box {
          position: relative;
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

            b {
              font-size: $font-size-l;
            }
            i {
              font-style: inherit;
            }
            span {
              width: 100%;
              display: inline-block;
            }

            .font-opacity {
              color: rgba($white,.7);
            }
          }
          .pursetCircle {
            flex: 2;
            text-align: center;
          }
        }
      }
      .operate-box {
        .btn-gruop-box {
          .btn-box {
            .operate-btn {
              width: rem(50px);
              height: rem(50px);
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
                background: $danger-light;
              }
              &.operate-5 {
                background: $primary-light;
              }
              &.operate-6 {
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
      padding-top: rem(50px);
      background-position: 0 rem(50px);

      .toggleStatistics {
        width: rem(200px);
        margin: $m auto;
        background: #fff;
        @include border-radius(rem(20px));

        .mint-tabbar {
          position: relative;
          background-color: #fff;
          background-image: none;
          border-radius: 20px;
          padding: rem(3px);

          .mint-tab-item {
            color: $primary;
            width: 21%;
            text-align: center;
            @include border-radius(rem(20px));
            min-width: inherit;
            border: none;
            padding: rem(8px);

            &.is-selected {
              color: #fff;
              background: $primary;
            }
          }
        }
      }
      #myChart {
        width: 100%;
        height: rem(300px);

        & > div {
          width: 100% !important;
        }
      }
      .realTime {
        h3 {
          font-weight: normal;
          @include border(bottom);
        }
        ul {
          li {
            display: flex;

            &:first-child {
              .real-logo {
                &:after {
                  height: 50%;
                  position: relative;
                  top: 50%;
                }
              }
            }
            &:last-child {
              .real-data {
                border-bottom: 0 none;
              }
            }

            .real-logo {
              flex: 0 0 20%;
              position: relative;

              &:after {
                width: rem(1px);
                height: 100%;
                background: $green-6;
                content: '';
                display: inline-block;
              }

              i {
                color: $green-6;
                display: inline-block;
                position: absolute;
                top: 0;

                &.normal {
                  @include border-radius(50%);
                  width: rem(8px);
                  height: rem(8px);
                  background: $green-6;
                  margin-left: -3px;
                  top: 50%;
                  margin-top: rem(-8px);
                }
                &.icon-iot-water {
                  font-size: $font-size-xl;
                  margin-left: rem(-13px);
                  top: 15%;
                  z-index: 999;
                }
              }
            }
          }
        }
      }
    }
      .filter-life {
        background: url("/static/images/devices/bg.png") no-repeat;
        background-size: 100% rem(290px);
        padding-top: rem(50px);
        background-position: 0 rem(50px);

        .perhaps-filter {
          .item-box {
            justify-content: center;
            .num-circle {
              width: rem(25px);
              height: rem(25px);
              background: rgba(0,0,0,.3);
              justify-content: center;
            }
          }
        }
        .fresh-filter {
          width: 90px;
          height: 90px;
          @include border-radius(50%);
          background: #fff;
          border: rem(8px) solid rgba(6, 123, 198, 0.68);
          margin: 0 auto;
          text-align: center;

          i {
            margin-top: 20%;
            display: inline-block;
            width: 100%;
            color: $primary;
            font-size: $font-size-l;
          }

          span {
            color: $primary;
            display: inline-block;
          }
        }
        .before-after {
          content: '';
          background: #fff;
          @include border-radius(50%);
          display: block;
          margin: 0 auto;
          position: relative;
        }
        .before-circle {
          &:before, &:after {
            @extend .before-after;
          }
          &:before {
            width: rem(30px);
            height: rem(10px);
            top: rem(-15px);
          }
          &:after {
            width: rem(20px);
            height: rem(10px);
            top: rem(-8px);
          }
        }
        .after-circle {
          &:before, &:after {
            @extend .before-after;
          }
          &:before {
            width: rem(15px);
            height: rem(7px);
            top: rem(5px);
          }
          &:after {
            width: rem(10px);
            height: rem(4px);
            top: rem(20px);
          }
        }
        .filter-list {
          ul {
            width: 100%;
            display: inline-block;

            li {
              width: 100%;
              background: #fff;
              @include border-radius(rem(50px));

              h4 {
                width: 40%;
                display: inline-block;
                float: left;
                font-size: $font-size-m;
                font-weight: normal;
                margin-bottom: 0;
                overflow: hidden;
              }
              .filter-num {
                width: 53%;
                display: inline-block;

                .mt-progress {
                  height: rem(25px);
                  line-height: rem(25px);
                }
                span {
                  color: #888;
                  font-size: $font-size-s;
                }
              }
            }
          }
        }
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
    <div class="iWater-main bg-white">
      <mt-navbar v-model="iWaterNavs" class="i-water-nav">
        <mt-tab-item v-for="item in iWaterTabs" :id="item.id" :key="item.id">{{ item.label }}</mt-tab-item>
      </mt-navbar>
      <!--智能净水-->
      <div class="purest-box" v-show="iWaterNav === 'purest'">
        <div class="purest">
          <div>
            <div class="pay-btn-box" v-if="iWater.deviceType == 'L'">
              <div class="pay-box flex" @click.stop="recharge()">
                <div class="flex-item">
                  <div class="font-m color-white font-bold-700">续费 <i class="iconfont icon-iot-youjiantou1 font-m font-bold-300"></i></div>
                  <div class="font-s font-family-num font-bold-300" style="color: rgba(255,255,255,.8);">到期：{{ $filters.formatDate(iWater.leaseDueDate).replace('-','/').replace('-','/').substring(2,10) }}</div>
                </div>
              </div>
            </div>
            <div class="title margin-top-xl margin-bottom-m align-center color-white font-l">
              <span v-if="!isOnline" class="font-m font-bold-700 color-warning">已离线</span>
              <span v-else-if="power">{{ tdsTitle }}</span>
            </div>
          </div>
          <div class="align-center margin-bottom-m" v-if="isOnline && !power">
            <span class="font-m font-bold-700 color-warning">已关机</span>
          </div>
          <div class="purestNum padding-left-m padding-right-m margin-top-l">
            <div class="beforePurest valign-center">
              <div>
                <b>{{ iWater.iotDevice && iWater.iotDevice.inWaterTds ? iWater.iotDevice.inWaterTds : 0 }}</b>
                <i class="font-s font-opacity">mg/L</i>
                <span class="font-s font-opacity">净化前TDS</span>
              </div>
            </div>
            <div class="pursetCircle">
              <canvas id="circle" width="300" height="300"  style="width: 150px;height: 150px;"></canvas>
            </div>
            <div class="afterPurest valign-center">
              <div>
                <b>{{ iWater.iotDevice && iWater.iotDevice.outWaterTds ? iWater.iotDevice.outWaterTds : 0 }}</b>
                <i class="font-s font-opacity">mg/L</i>
                <span class="font-s font-opacity">净化后TDS</span>
              </div>
            </div>
          </div>
        </div>
        <div class="operate-box margin-top-xl padding-bottom-xl bg-white">
          <ul class="flex align-center btn-gruop-box">
            <li @click.stop="onOrOff()" class="flex-item btn-box ripple">
              <div class="flex icon-box">
                <div class="operate-btn valign-center" :class="{ 'operate-1': isOnline && !(iWater && iWater.iotDevice && iWater.iotDevice.locked) }">
                  <i class="iconfont icon-iot-guanji"></i>
                </div>
              </div>
              <span>{{ power ? '关机' : '开机' }}</span>
            </li>
            <li @click.stop="clean()" class="flex-item btn-box ripple">
              <div class="flex icon-box">
                <div class="operate-btn valign-center"
                     :class="{ 'operate-2': canHandle && !(iWater && iWater.iotDevice && iWater.iotDevice.locked) }">
                  <i class="iconfont icon-iot-chongxi"></i>
                </div>
              </div>
              <span>一键冲洗</span>
            </li>
            <li @click.stop="restoreWiFi()" class="flex-item btn-box ripple">
              <div class="flex icon-box">
                <div class="operate-btn valign-center"
                     :class="{ 'operate-3': canHandle && !(iWater && iWater.iotDevice && iWater.iotDevice.locked) }">
                  <i class="iconfont icon-iot-wifi1"></i>
                </div>
              </div>
              <span>重新配网</span>
            </li>
          </ul>
          <ul class="flex align-center margin-top btn-gruop-box">
            <li class="flex-item btn-box ripple" @click.stop="detail()">
              <div class="flex icon-box">
                <div class="operate-btn valign-center operate-4">
                  <i class="iconfont icon-iot-setting"></i>
                </div>
              </div>
              <span>设备详情</span>
            </li>
            <li @click.stop="oauthManage()" class="flex-item btn-box ripple" v-if="isOwner">
              <div class="flex icon-box">
                <div class="operate-btn valign-center operate-5">
                  <i class="iconfont icon-iot-shouquan"></i>
                </div>
              </div>
              <span>授权管理</span>
            </li>
            <li @click.stop="book()" class="flex-item btn-box ripple">
              <div class="flex icon-box">
                <div class="operate-btn valign-center operate-6">
                  <i class="iconfont icon-iot-yuyue"></i>
                </div>
              </div>
              <span>服务预约</span>
            </li>
            <!--布局需要-->
            <li v-if="!isOwner" class="flex-item"></li>
            <!--<li @click="resets()">-->
            <!--<div class="operate-btn">-->
            <!--<i class="iconfont icon-iot-huifu"></i>-->
            <!--</div>-->
            <!--<span>恢复出厂设置</span>-->
            <!--</li>-->
          </ul>
        </div>
      </div>
      <!--净水统计-->
      <div class="statistics" v-show="iWaterNav === 'acount'">
        <div class="toggleStatistics">
          <mt-tabbar v-model="statisticsBtn" :value="statisticsBtn">
            <mt-tab-item v-for="item in statisticsBtnList" :id="item.value" :key="item.value" @click.native="statisticsToggle(item.value)">{{ item.label }}</mt-tab-item>
          </mt-tabbar>
        </div>
        <div class="bar" id="myChart" :style="barStyle" ref="myBarChart"></div>
        <div class="realTime margin-top-xl bg-white align-center padding-bottom-xl">
          <h3 class="align-left padding-m margin-bottom-zero">实时用水</h3>
          <ul>
            <li v-for="item in realWaterList" :key="item.outWaterFlow">
              <div class="real-logo">
                <i :class="item.logoStyle"></i>
              </div>
              <div class="real-data align-left padding-top padding-bottom">
                <h4 class="font-m">净水{{ item.outWaterFlow/1000 }}L</h4>
                <span class="font-light">{{ $filters.formatDate(item.dataDay) }}</span></div>
            </li>
          </ul>
          <app-empty-view v-if="realWaterList.length === 0 ? showEmpty : hideEmpty" :isFullHeight="false"></app-empty-view>
        </div>
      </div>
      <!--滤芯寿命-->
      <div class="filter-life" v-show="iWaterNav === 'filter'">
        <div class="perhaps-filter padding-l">
          <div class="flex">
            <div class="flex valign-center flex-item item-box color-white font-s">
              设备共有滤芯
              <span class="num-circle border-radius-circle margin-left-s margin-right-s valign-center font-l">{{ filters.num && filters.num > 0 ? filters.num : 0 }}</span>根
            </div>
            <div class="flex valign-center flex-item item-box color-white font-s">
              将过期滤芯
              <span class="num-circle border-radius-circle margin-left-s margin-right-s valign-center font-l"
                    :class="{ 'color-danger': filters.overdueNum && filters.overdueNum > 0 }">{{ filters.overdueNum && filters.overdueNum > 0 ? filters.overdueNum : 0 }}</span>
              根
            </div>
          </div>
        </div>
        <div class="fresh-filter padding" @click="freshFilter()">
          <i class="iconfont icon-iot-shuaxin"></i>
          <span class="margin-top-s">刷新状态</span>
        </div>
        <i class="before-circle"></i>
        <i class="after-circle"></i>
        <div class="filter-list margin-top-xl padding-m bg"
             :class="{ 'bg-white': !filterProgress || filterProgress.length === 0 }">
          <ul v-if="filterProgress && filterProgress.length > 0">
            <li v-for="(item,index) in filterProgress" class="margin-top" @click="filterDetail(item,index)">
              <div class="padding flex valign-center">
                <h4 class="margin-left">{{ item.name }}</h4>
                <div class="filter-num margin-right">
                  <mt-progress :value="(item.availablePercentage*100 || 0)"
                               :bar-height="10"
                               :class="{ 'greenProgress': Number((item.availablePercentage*100 || 0)) >= 70, 'yellowProgress': Number((item.availablePercentage*100 || 0)) < 70 && Number((item.availablePercentage*100 || 0)) > 30, 'redProgress': Number((item.availablePercentage*100 || 0)) <= 30,  }"></mt-progress>
                  <span>预计可用  {{ item.estimatedDays && Number(item.estimatedDays) > 0 ? item.estimatedDays + '  天' : '估算中...' }}</span>
                </div>
              </div>
            </li>
          </ul>
          <app-empty-view v-if="!filterProgress || filterProgress.length === 0 ? showEmpty : hideEmpty" :isFullHeight="false"></app-empty-view>
        </div>
      </div>
    </div>
  </app-view>
</template>

<script>
  import CircleBar from '@/assets/scripts/circle-bar'
  import moment from 'moment'
  import AppEmptyView from '@/components/layouts/app-empty-view'
  import VScript from "../../components/ui/v-script.vue";
  import waterdevicesApis from "@/apis/api-iot-waterdevices";
  import userdevicesApis from "@/apis/api-userdevices";

  import types from "@/store/types";

  // 引入 ECharts 主模块
  let echarts = require('echarts/lib/echarts');
  require('echarts/lib/chart/bar');

  export default{
    name: "devices-iwater",
    components: {
      VScript,
      AppEmptyView
    },
    data () {
      return {
        myBarChart: null,
        myLineChart: null,
        lineStyle: {
            width: '100%'
        },
        barStyle: {
          width: '100%'
        },
        iWaterNav: 'purest',
        iWaterTabs: [
          {
            id: 'purest',
            label: '智能净水'
          },
          {
            id: 'acount',
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
        statisticsBtn: 'w',
        statisticsBtnList: [
//          {
//            label: '日',
//            value: ''
//          },
          {
            label: '周',
            value: 'w'
          },
          {
            label: '月',
            value: 'm'
          },
          {
            label: '年',
            value: 'y'
          }
        ],
        barXData: [],
        filterProgress: [],
        filters: {
          num: 0,
          overdueNum: 0
        },
        barData: [],
        lineData: [],
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
        realWaterList: [],
        showEmpty: true,
        hideEmpty: false,
        isOnline: false,
        deviceId: '',
        usrDeviceId: this.$route.params.id,
        isOwner: true,
        entity: {},

        // 轮询标识
        loopInterval: 0,
      }
    },
    mounted() {
      document.getElementById('app').style.background = '#fff';
      this.$store.state.showLoading = false;

      this.fetchData();
      this.loopInterval = setInterval(this.fetchData, 10000);
    },
    beforeRouteLeave(to,from,next) {
      clearInterval(this.loopInterval);
      document.getElementById('app').style.background = 'initial';
      next();
    },
    computed: {
      iWaterNavs: {
        get() {
          return this.iWaterNav
        },
        set(val) {
          this.iWaterNav = val
        }
      },
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
        let res = {};
        userdevicesApis.detail(that.usrDeviceId)
          .then((data) => {
            that.entity = data;
            that.iWater = data && data.device;
            that.deviceId = data && data.device && data.device.id;
            res = data && data.device;

            // 判断到期日是否为今天，若是则引导充值
            let _now = that.$filters.formatDate(moment());
            if (res && res.leaseDueDate && that.$filters.formatDate(res.leaseDueDate) === _now) {
              this.$dlg.confirm("设备尚未充值，请充值后使用。", () => {
                that.recharge();
              });
            }

            if (data && data.userRole && data.userRole !== 'Owner') {
              that.isOwner = false;
            }
            // 智能净水
            that.$nextTick(() => {
              // 净水率
              let _iot = res.iotDevice;
              let _inWater = _iot && _iot.inWaterTds;
              let _outWater = _iot && _iot.outWaterTds;
              if (_iot && _inWater && _outWater && _inWater >= _outWater) {
                that.circleProgress = parseInt((1 - (Number(_outWater) / Number(_inWater))) * 100);
              }

              if (document.getElementById('circle') && document.getElementById('circle').getContext('2d')) {
                CircleBar.draw('#circle', this.circleProgress, undefined, true)
              }

              that.statisticsToggle(that.statisticsBtnList[0].value);
            });

            this.power = res.iotDevice && res.iotDevice.powerOn;
            this.isOnline = res.iotDevice && res.iotDevice.online;
            // 开发或测试环境或测试厂商模拟在线
            if(!this.$app.isProduct || this.$store.getters[types.oauth.getShopId] === "n6ZR6p") {
              this.isOnline = true;
            }

            // 产品预约参数
            this.bookQuery = {
              id: this.usrDeviceId,
              deviceId: this.deviceId,
              deviceName: res.deviceName,
              productId: res.productId,
              productImage: res.productImage,
              itemCode: res.itemCode,
              purchaseDate: res.purchaseDate,
              address: res && res.address && encodeURIComponent(JSON.stringify(res.address))
            }

            // 滤芯
            if (res.iotDevice && res.iotDevice.parts) {
              this.filterProgress = res.iotDevice.parts;
              this.filters.num = res.iotDevice.parts.length || 0;
              let overFilters = this.filterProgress.filter((r) => r.availablePercentage < 5);
              this.filters.overdueNum = overFilters;
            }

            if (res.iotDevice && res.iotDevice.outWaterTds) {
              let _title = '';
              let _tds = Number(res.iotDevice.outWaterTds);
              if (_tds < 60) {
                _title = '水质极好';
              } else if (_tds > 59 && _tds < 100) {
                _title = '水质很好';
              } else if (_tds > 99 && _tds < 300) {
                _title = '水质一般';
              } else if (_tds > 299) {
                _title = '水质污染';
              }
              this.tdsTitle = _title;
            }
            that.realWaterData();
          });
      },
      /**
       * 实时用水
       */
      realWaterData(){
        if(this.deviceId) {
          waterdevicesApis.datanodes(this.deviceId)
            .then((res) => {
              this.realWaterList = res.fileList
              this.realWaterList.forEach((value,index,array) => {
                if(index === 0){
                  array[index].logoStyle = {
                    'iconfont': true,
                    'icon-iot-water': true,
                    'normal': false
                  }
                }else{
                  array[index].logoStyle = {
                    'iconfont': false,
                    'icon-iot-water': false,
                    'normal': true
                  }
                }
              })
            })
        }
      },
      /**
       * 切换净水统计
       */
      statisticsToggle(val) {
        let that = this;
        let _id = that.deviceId;
        if(_id) {
          waterdevicesApis.report(_id, {
            report_type: val
          }).then((res) => {
            that.barData = [];
            that.barXData = [];
            switch (val) {
              case 'w':
                for(let i = 0, len = res.length; i < len; i++) {
                  let curWeekDay = moment(res[i].date).locale('zh-cn').format('dddd').substr(2,3);
                  that.barData.push(curWeekDay);
                  that.barXData.push(res[i].outWaterFlow);
                }
                that.waterBar(that.barData,that.barXData)
                break
              case 'm':
                res.forEach((value,index,array) => {
                  that.barData.push(that.$filters.formatDate(array[index].date, 'MM-DD'))
                  that.barXData.push(array[index].outWaterFlow)
                })
                that.waterBar(that.barData,that.barXData)
                break
              case 'y':
                res.forEach((value,index,array) => {
                  that.barData.push(that.$filters.formatDate(array[index].date, 'YYYY-MM'))
                  that.barXData.push(array[index].outWaterFlow)
                })
                this.waterBar(that.barData,that.barXData)
                break
              // no default
            }
          })
        }
      },
      /**
       * 设备详情
       */
      detail() {
        if(this.$route.query.urlQuery && this.$route.query.urlQuery.indexOf('jbr') > -1){
          this.$utils.loctnHref(`/devices/${this.$route.params.id}/view`,{ urlQuery: this.$route.query.urlQuery });
        }
        this.$utils.loctnHref(`/devices/${this.$route.params.id}/view`);
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
       * 用水统计
       * @param barData
       * @param barXData
       */
      waterBar(barData,barXData){
        this.myBarChart = echarts.init(document.getElementById('myChart'));
        this.myBarChart.setOption({
          title: '',
          tooltip: {},
          xAxis: {
            data: barData,
            axisLine: {
              lineStyle: {
                color: ['rgba(255,255,255,.1)']
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff',
                fontSize: '12'
              }
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            show: false
          },
          series: [{
            name: '今日用水',
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#fff',
                borderRadius: '20%'
              }
            },
            data: barXData,
            barWidth: 20
          }]
        })
        this.myBarChart.resize({
          width: document.getElementById('app').clientWidth
        })
      },
      /**
       * 刷新滤芯状态
       */
      freshFilter(){
        this.$store.commit("showLoading");
        waterdevicesApis.detail(this.deviceId)
          .then((res) => {
            this.$store.commit("hideLoading");
              if (res.iotDevice.parts !== null) {
                this.filterProgress = res.iotDevice.parts;
                this.filters.num = res.iotDevice.parts.length || 0;
                let overFilters = this.filterProgress.filter((r) => r.availablePercentage < 5)
                this.filters.overdueNum = overFilters;
              }
          })
      },
      filterDetail(filter,index) {
        this.$router.push({
          path: `/devices/${this.deviceId}/filter`,
          query: {
            power: this.canHandle,
            partProductId: filter.partProductId,
            index: index,
            availablePercentage: filter.availablePercentage,
            estimatedDays: filter.estimatedDays
          }
        })
      },
      /**
       * 个人租赁设备续费
       */
      recharge() {
        if(this.$filters.isNullStr(this.iWater.company)) {
          let rechargeUrl = "/devices/" + this.iWater.id + "/recharge";
          rechargeUrl += "?leaseProductId=" + this.iWater.leaseProductId;
          rechargeUrl += "&deviceName=" + this.iWater.deviceName;
          rechargeUrl += "&leaseDueDate=" + this.$filters.formatDate(this.iWater.leaseDueDate);
          this.$router.push(encodeURI(rechargeUrl));
        } else {
          this.$dlg.alert("企业租赁请联系商家进行续费。");
        }
      }
    }
  }
</script>
