<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .statistics {
    background: url("/static/images/devices/bg.png") #fff no-repeat;
    background-size: 100% rem(400px);
    /*background-position: 0 rem(45px);*/
    /*padding-top: rem(50px);*/
  }
  .toggleStatistics {
    width: rem(200px);
    margin: 0 auto;
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
</style>

<template>
  <div class="statistics">
    <!--净水统计-->
    <div class="padding-l">
      <div class="toggleStatistics">
        <mt-tabbar v-model="statisticsBtn" :value="statisticsBtn">
          <mt-tab-item v-for="item in statisticsBtnList" :id="item.value" :key="item.value" @click.native="statisticsToggle(item.value)">{{ item.label }}</mt-tab-item>
        </mt-tabbar>
      </div>
    </div>
    <div class="bar" id="myChart" :style="barStyle" ref="myBarChart"></div>
    <div class="realTime padding-top-l bg-white align-center padding-bottom-xl">
      <h3 class="align-left padding-m margin-bottom-zero">用水记录</h3>
      <ul>
        <li v-for="item in realWaterList" :key="item.outWaterFlow">
          <div class="real-logo">
            <i :class="item.logoStyle"></i>
          </div>
          <div class="real-data align-left padding-top padding-bottom">
            <h4 class="font-m">净水{{ item.outWaterFlow/1000 }}L</h4>
            <span class="font-light">{{$filters.formatDate(item.startTime)}}</span></div>
        </li>
      </ul>
      <app-empty-view v-if="realWaterList.length === 0 ? showEmpty : hideEmpty" :isFullHeight="false"></app-empty-view>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import AppEmptyView from '@/components/layouts/app-empty-view'

  // 引入 ECharts 主模块
  let echarts = require('echarts/lib/echarts');
  require('echarts/lib/chart/bar');

  export default{
    name: "iwater-statistics",
    data () {
      return {
        // 用水统计图
        myBarChart: null,
        lineStyle: {
          width: '100%'
        },
        barStyle: {
          width: '100%'
        },
        statisticsBtn: 'w',
        statisticsBtnList: [
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
        barData: [],
        lineData: [],
        realWaterList: [],
        showEmpty: true,
        hideEmpty: false,
        isOnline: false,
        deviceId: this.$route.params.id,
        isOwner: true,
        entity: {}
      }
    },
    created () {
//      document.getElementById('app').style.background = '#fff';
      this.$store.state.showLoading = false;
      this.realWaterData();
    },
    mounted(){
      this.myBarChart = echarts.init(document.getElementById('myChart'), {});
      this.waterFetch();
    },
    beforeRouteLeave(to,from,next) {
      document.getElementById('app').style.background = 'initial';
      next();
    },
    computed: {
      curUser() {
        return this.$store.getters[types.oauth.getCurUser];
      },
    },
    methods: {
      /**
       * 实时用水
       */
      realWaterData(){
        this.$http.get(`${this.$apihost}/waterdevices/${this.deviceId}/datanodes`)
          .then((res) => {
            this.realWaterList = res.fileList
            this.realWaterList.forEach((value,index,array) => {
              array[index].logoStyle = {
                'iconfont': false,
                'icon-iot-water': false,
                'normal': true
              }
            })
          })
      },
      /**
       * 切换净水统计
       */
      statisticsToggle(val) {
        this.$http.get(`${this.$apihost}/waterdevices/${this.deviceId}/report`,{
          report_type: val
        })
          .then((res) => {
            this.barData = [];
            this.barXData = [];
            switch (val){
              case 'w':
                for(let i = 0, len = res.length; i < len; i++) {
                  let curWeekDay = moment(res[i].date).locale('zh-cn').format('dddd').substr(2,3);
                  this.barData.push(curWeekDay);
                  this.barXData.push(res[i].outWaterFlow);
                }
                this.waterBar(this.barData,this.barXData);
                break
              case 'm':
                res.forEach((value,index,array) => {
                  this.barData.push(this.$filters.formatDate(array[index].date, 'MM-DD'))
                  this.barXData.push(array[index].outWaterFlow)
                })
                this.waterBar(this.barData,this.barXData)
                break
              case 'y':
                res.forEach((value,index,array) => {
                  this.barData.push(this.$filters.formatDate(array[index].date, 'YYYY-MM'))
                  this.barXData.push(array[index].outWaterFlow)
                })
                this.waterBar(this.barData,this.barXData)
                break
              // no default
            }
          })
      },
      /**
       * 净水统计报表初始化数据
       */
      waterFetch(){
        this.$http.get(`${this.$apihost}/waterdevices/${this.deviceId}/report`,{
          report_type: this.statisticsBtnList[0].value
        })
          .then((res) => {
            for(let i = 0, len = res.length; i < len; i++) {
              let curWeekDay = moment(res[i].date).locale('zh-cn').format('dddd').substr(2,3);
              this.barData.push(curWeekDay);
              this.barXData.push(res[i].outWaterFlow);
            }
            this.waterBar(this.barData,this.barXData)
          })
      },
      /**
       * 用水统计
       * @param barData
       * @param barXData
       */
      waterBar(barData,barXData){
        console.log(barXData);
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
        });
        this.myBarChart.resize({
          width: this.$utils.getScreenWidth()
        });
      },
    },
    components: {
      AppEmptyView
    }
  }
</script>
