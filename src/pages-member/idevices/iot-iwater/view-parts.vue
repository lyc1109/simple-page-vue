<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .count{
    display: inline-block;
    width: rem(30px);
    height: rem(30px);
    line-height: rem(30px);
    border-radius: 50%;
    background: rgba(0,0,0,.3);
    font-size: $font-size-m;
  }

  .iwater-parts__refresh {
    position: relative;
    width: rem(100px);
    height: rem(100px);
    border-radius: 50%;
    border: rem(8px) solid rgba(6, 123, 198, 0.68);
    @extend %valign-center;
    background: $white;
    text-align: center;
    margin: 10px auto;
    color: $primary;
  }
  .iwater-parts__bubble {
    position: absolute;
    width: rem(40px);
    height: rem(10px);
    border-radius: 50%;
    background: $white;

    left: rem(30px);
    bottom: rem(-3px);
  }
  .iwater-parts__bubble1 {
    width: rem(30px);
    height: rem(8px);
    left: rem(35px);
    bottom: rem(-25px);
  }
  .iwater-parts__bubble2 {
    width: rem(25px);
    height: rem(7px);
    left: rem(38px);
    bottom: rem(-50px);
  }
  .iwater-parts__bubble3 {
    width: rem(16px);
    height: rem(6px);
    left: rem(43px);
    bottom: rem(-70px);
  }

  .iwater-parts-item {
    padding: rem(10px) rem(20px) rem(10px) rem(20px);
    margin: rem(15px) rem(10px);
    border-radius: 45px;
    background: $white;

    .name {
      color: $font-title;
      font-weight: 400;
    }
  }

  .iwater-parts-item /deep/ {
    .mt-progress-runway{
      background: #C7F3D0;
    }
    .mt-progress-progress{
      background: $green-1;
    }
  }
  .iwater-parts-item-info /deep/ {
    .mt-progress-runway{
      background: lighten($blue-1, 35%);
    }
    .mt-progress-progress{
      background: $blue-1;
    }
  }
  .iwater-parts-item-warn /deep/ {
    .mt-progress-runway{
      background: lighten($warning, 35%);
    }
    .mt-progress-progress{
      background: $warning;
    }
  }
  .iwater-parts-item-danger /deep/ {
    .mt-progress-runway{
      background: lighten($orange-1, 35%);
    }
    .mt-progress-progress{
      background: $orange-1;
    }
  }
</style>

<template>
  <v-app>
    <div class="bg-box valign-center" :style="bgStyle">
      <div class="full-width">
        <div class="flex padding-m align-center font-white">
          <div class="flex-item">共有滤芯 <div class="count">{{parts.length}}</div> 根</div>
          <div class="flex-item">即将过期 <div class="count">{{overdueCount}}</div> 根</div>
        </div>

        <div class="iwater-parts__refresh" @click="loadDetail">
          <div class="full-width">
            <i class="iconfont icon-iot-shuaxin icon-l"></i>
            <div class="margin-top-s">刷新状态</div>
          </div>
          <div class="iwater-parts__bubble"></div>
          <div class="iwater-parts__bubble iwater-parts__bubble1"></div>
          <div class="iwater-parts__bubble iwater-parts__bubble2"></div>
          <div class="iwater-parts__bubble iwater-parts__bubble3"></div>
        </div>

        <div style="height: 50px;"></div>
      </div>
    </div>

    <div class="margin-top">
      <div class="iwater-parts-item"
           v-for="part in parts"
           :class="part.className"
           @click="viewPartDetail(part)">
        <div class="name text-wrapper">
          {{part.name}}
          <span class="color-danger font-bold" v-show="part.availablePercentage <= 5">（请更换滤芯）</span>
        </div>
        <mt-progress :value="part.availablePercentage" :bar-height="10"></mt-progress>

        <div class="flex font-s font-light">
          <!--<div class="flex-item">预计可用{{part.estimatedDays}}天</div>-->
          <div class="flex-item">剩余可用{{part.availablePercentage}}%</div>
          <div class="flex-item align-right">安装于 {{$filters.formatDate(part.installedAt)}}</div>
        </div>
      </div>
    </div>

    <v-iwater-part-view v-model="isShowPartPopup" :device="device" :part="curPart"></v-iwater-part-view>
  </v-app>
</template>

<script>
  import VIwaterPartView from "@/pages-member/idevices/iot-iwater/v-iwater-part-view.vue";

  import storeTypes from "@/store/types";

  import waterdevicesApis from "@/apis/api-iot-waterdevices";

  export default {
    name: "iwater-view-parts",
    desc: "水机滤芯界面",
    components: {VIwaterPartView},
    data: function () {
      return {
        curPart: {},
        isShowPartPopup: false
      }
    },
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

      parts: function () {
        let parts = this.iwater.parts;
        let newParts = []; // 存到新数组中，避免修改了原始数据
        if(parts.length > 0) {
          for(let i=0; i < parts.length; i++) {
            let item = parts[i];
            // 滤芯顺序，用于滤芯重置
            item.filterIndex = i;
            // 滤芯百分比计算
            if(item.availablePercentage > 1) {
              item.availablePercentage = 1
            }
            item.availablePercentage = Math.floor(item.availablePercentage * 100);
            // 滤芯可用进度条样式
            if(item.availablePercentage >= 50 && item.availablePercentage < 80) {
              item.className = "iwater-parts-item-info";
            } else if(item.availablePercentage >= 30 && item.availablePercentage < 50) {
              item.className = "iwater-parts-item-warn";
            } else if(item.availablePercentage < 30) {
              item.className = "iwater-parts-item-danger";
            }
            newParts.push(item);
          }
        }
        return newParts;
      },

      overdueCount: function () {
        let count = 0;
        let parts = this.parts;
        if(parts.length > 0) {
          for(let item of parts) {
            if(item.availablePercentage <= 5) {
              count++;
            }
          }
        }
        return count;
      },

      isOnline: function () {
        return this.iwater.online === true;
      },

      bgStyle: function () {
        let iwaterHeight = 250;
        return {
          'background-image': 'url(' + this.$filters.staticImg("/static/images/iwater/iwater-bg.png", '/resize,h_' + iwaterHeight) + ")",
          width: "100%",
          height: iwaterHeight + "px"
        }
      },
    },
    methods: {
      loadDetail: function () {
        this.$loading.show();
        waterdevicesApis.detail(this.device.id)
          .then((resp) => {
            setTimeout(() => {
              this.$loading.hide();
            }, 1000);

            // 开发或测试环境模拟在线
            if(!this.$app.isProduct || this.$store.getters[storeTypes.oauth.getShopId] === "n6ZR6p") {
              resp.iotDevice.online = true;
            }

            // 最小加热温度限制
            if(resp.iotDevice.temperatureForHot < 20) {
              resp.iotDevice.temperatureForHot = 20;
            }
            if(resp.iotDevice.temperatureForTea < 20) {
              resp.iotDevice.temperatureForTea = 20;
            }
            if(resp.iotDevice.temperatureForMilk < 20) {
              resp.iotDevice.temperatureForMilk = 20;
            }

            // 设置到状态管理中
            this.$store.commit(storeTypes.idevice.updateDevice, this.device);
          })
          .catch((err) => {
            this.$toast.warn("抱歉，设备信息加载失败。" + err);
          });
      },

      viewPartDetail: function (part){
        this.curPart = part;
        this.isShowPartPopup = true;
      }
    }
  }
</script>

