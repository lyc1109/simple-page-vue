<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .iwater-tds-box{
    position: relative;
    text-align: center;
    margin: 0 auto;
  }

  .iwater-tds{
    width: 60px;
    color: $white;
    position: absolute;
    top: 35%;

    .iwater-tds__val{
      font-size: 28px;
      font-weight: 300;
    }
    .iwater-tds__title{
      font-size: 12px;
      color: #95B8E1;
      margin-top: 3px;
    }
  }
  .iwater-tds.iwater-tds-in {
    left: -75px;
  }
  .iwater-tds.iwater-tds-out {
    right: -75px;
  }

  .iwater-tds__circlebar{
    margin: 0 auto;
    color: $white;
    font-size: 30px;
    font-weight: 600;
  }
</style>

<template>
  <div class="iwater-tds-box valign-center" :style="circlebarStyle">
    <div class="iwater-tds iwater-tds-in">
      <span class="iwater-tds__val">{{iwater.inWaterTds}}</span>
      <div class="iwater-tds__title">净化前TDS</div>
    </div>

    <div class="iwater-tds__circlebar">
      <v-circlebar :percent="waterRate" :style="circlebarStyle"></v-circlebar>
    </div>

    <div class="iwater-tds iwater-tds-out">
      <span class="iwater-tds__val">{{iwater.outWaterTds}}</span>
      <div class="iwater-tds__title">净化后TDS</div>
    </div>

  </div>
</template>

<script>
  import VCirclebar from "@/pages-member/idevices/iot-iwater/v-circlebar.vue";

  export default {
    name: "v-water-tds",
    desc: "水机TDS净化率小组件",
    components: {VCirclebar},
    props: {
      iwater: {
        type: Object,
        default: {
          inWaterTds: 0,
          outWaterTds: 0
        }
      }
    },
    computed: {
      waterRate: function () {
        let inTds = this.iwater.inWaterTds || 0;
        let outTds = this.iwater.outWaterTds || 0;
        if(inTds === 0 || outTds > inTds) {
          return 100;
        }
        let rate = Math.round((1 - outTds / inTds) * 100);
        if(rate > 100) {
          rate = 100;
        }
        return Number(rate);
      },

      circlebarWidth: function () {
        return Math.floor(this.$utils.getScreenWidth() / 2.2);
      },

      circlebarStyle: function () {
        // 计算质量图占据屏幕比例
        let width = this.circlebarWidth;
        return {
          width: width + "px",
          height: width + "px"
        }
      }
    }
  };
</script>

