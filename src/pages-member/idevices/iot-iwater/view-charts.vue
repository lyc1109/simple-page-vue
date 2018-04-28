<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .iwater-charts-tabs{
    padding: rem(5px);
    width: rem(200px);
    margin: 0 auto;
    text-align: center;
    color: $primary;
    background: $white;
    border-radius: rem(30px);
    font-size: $s;

    .flex-item{
      padding: rem(5px) rem(9px);
      border-radius: rem(20px);
      cursor: pointer;
    }
    .flex-item.active{
      color: $white;
      background: $primary;
    }
  }

  #iwaterChart{
    overflow-x: auto;
  }
</style>

<template>
  <div>
    <div class="bg-box padding-top" :style="bgStyle">
      <div class="flex iwater-charts-tabs">
        <div class="flex-item" :class="{'active': curTab==='w'}" @click="toggleTab('w')">周</div>
        <div class="flex-item" :class="{'active': curTab==='m'}" @click="toggleTab('m')">月</div>
        <div class="flex-item" :class="{'active': curTab==='y'}" @click="toggleTab('y')">年</div>
      </div>
      <div id="iwaterChart" :style="echartStyle"></div>
      <div class="padding-bottom align-center font-s" style="color: rgba(255,255,255,.7);">净水统计表(单位: 升)</div>
    </div>

    <div class="text-title margin-top border-bottom padding">净水记录</div>
    <div class="padding">
      <v-timeline :data="dataNodes"></v-timeline>
    </div>
  </div>
</template>

<script>
  import VTimeline from "@/components/ui/v-timeline";

  import _ from "loadash";

  // 引入 ECharts 主模块
  let echarts = require('echarts/lib/echarts');
  require('echarts/lib/chart/bar');

  import storeTypes from "@/store/types";
  import waterdevicesApis from "@/apis/api-iot-waterdevices";

  export default{
    name: "iwater-view-charts",
    components: {VTimeline},
    computed: {
      device: function () {
        return this.$store.getters[storeTypes.idevice.getDevice];
      },

      iwater: function () {
        if(this.device.iotDevice) {
          return this.device.iotDevice;
        }
        return {
          parts: []
        };
      },

      bgStyle: function () {
        return {
          'background-image': 'url(' + this.$filters.staticImg("/static/images/iwater/iwater-bg.png", '/resize,h_300') + ")"
        }
      },

      echartStyle: function () {
        let screenWidth = this.$utils.getScreenWidth();
        return {
          'width': screenWidth + "px",
          'height': screenWidth*0.5 + "px"
        }
      }
    },
    data () {
      return {
        curTab: "w",
        // echart对象
        iwaterEchart: null,

        // 净水明细数据
        dataNodes: [],
      }
    },
    mounted(){
      this.initEchart();
      this.toggleTab("w");
    },
    methods: {
      toggleTab: function (tab) {
        this.curTab = tab;
        this.getReportData();
      },

      // 获取净水统计
      getReportData: function () {
        let now = this.$filters.formatDate(new Date());
        waterdevicesApis.report(this.device.id, {
          report_type: this.curTab,
          start_date: now,
        })
          .then((resp) => {
            //console.log("reportData: \n" + JSON.stringify(resp));
            if(resp.length <= 0) {
              return;
            }

            // 获取净水明细
            // 将第一条和最后一条作为起止日期
            let startItem = resp[0];
            let startDate = this.$filters.formatDate(startItem.date);
            this.getDataNodes(startDate, now);


            // 解析成X\Y坐标数据
            let xAxisData = [];
            let seriesData = [];
            for(let item of resp) {
              seriesData.push(Math.ceil(item.outWaterFlow/1000));

              let date = this.$filters.formatDate(item.date, "MM-DD");
              if(this.curTab === "y") {
                date = this.$filters.formatDate(item.date, "YYYY-MM");
              } else if(this.curTab === "m") {
                date = this.$filters.formatDate(item.date, "MM-DD");
              }
              xAxisData.push(date)
            }

            // 若数据超过28条，仅保留最后28条，否则统计图显示不完整
            if(xAxisData.length > 28) {
              let dropNum = xAxisData.length - 28;
              xAxisData = _.drop(xAxisData, dropNum);
              seriesData = _.drop(seriesData, dropNum);
            }

            // 设置echart相关属性
            let axisLabelInterval = 0;
            if(this.curTab === "m") {
              axisLabelInterval = 4;
            } else if(this.curTab === "y") {
              axisLabelInterval = 3;
            } else {
              axisLabelInterval = 1;
            }
            //console.log("xAxisData:" + JSON.stringify(xAxisData));
            //console.log("seriesData:" + JSON.stringify(seriesData));

            this.iwaterEchart.setOption({
              xAxis: {
                data: xAxisData,
                axisLabel: {
                  interval: axisLabelInterval
                },
              },
              series: [{
                data: seriesData,
                barMaxWidth: this.curTab === "m" ? 10 : 15
              }],
              grid: {
                //left: "15%",
                right: this.curTab === "m" ? 12 : "5%",
              }
            });
          })
      },

      // 获取净水明细
      getDataNodes: function (startDate, endDate) {
        waterdevicesApis.datanodes(this.device.id, {
          page_size: 100,
          page_sort: "id_desc",
          start_date: startDate,
          end_date: endDate,
        })
          .then((resp) => {
            let dataNodes = [];

            if(resp.fileList.length > 0) {
              let logContent;
              for(let item of resp.fileList) {
                logContent = "净水 ";
                if(item.outWaterFlow > 1000) {
                  logContent += item.outWaterFlow/1000 + "升"
                } else {
                  logContent += item.outWaterFlow + "毫升"
                }

                logContent += "<div class='margin-top-s font-s font-lighter'>";
                if (item.dataNodeType === "real-time") {
                  logContent += "" + this.$filters.formatTimeSec(item.endTime);
                } else {
                  logContent += "" + this.$filters.formatDate(item.endTime);
                }
                logContent += "</div>";
                dataNodes.push(logContent);
              }
            }

            this.dataNodes = dataNodes;
          })
      },

      // 初始化统计图表
      initEchart: function () {
        this.iwaterEchart = echarts.init(document.getElementById('iwaterChart'));
        this.iwaterEchart.setOption({
          title: {
            text: '净水统计'
          },
          tooltip: {
            show: true,
            trigger: "axis"
          },
          xAxis: {
            data: [],
            axisLine: {
              lineStyle: {
                color: ['rgba(255,255,255,.1)']
              }
            },
            axisLabel: {
              showMaxLabel: true,
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
            show: true,
            axisLine: {
              lineStyle: {
                color: ['rgba(255,255,255,.1)']
              }
            },
            splitLine: {
              show: false
            },
            splitNumber: 3,
            axisLabel: {
              showMaxLabel: true,
              textStyle: {
                color: '#fff',
                fontSize: '12'
              },
              // 使用升来显示刻度
              /*formatter: function (value, index) {
                //let newVal = Math.round(value/1000);
                let newVal = value;
                if (index === 0) {
                  newVal = newVal + "(升)"
                }
                return newVal;
              }*/
            },
            nameTextStyle: {
              color: '#fff',
              fontSize: '12'
            }
          },
          series: [{
            name: '用水量',
            type: 'bar',
            data: [],
            itemStyle: {
              normal: {
                color: 'rgba(255,255,255,.8)',
                borderRadius: '20%'
              }
            },
            barMaxWidth: 15,
            barGap: "20%"
          }],
          grid: {
            top: 30,
            left: "8%",
            right: "5%",
            bottom: 30,
          }
        })
      }
    },
  }
</script>
