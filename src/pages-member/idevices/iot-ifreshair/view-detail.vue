<style scoped lang="scss" type="text/scss">
  @import "~variables";
  .iair-detail{
    width: 100%;
    min-height: 100%;
    position: relative;
  }
  .block {
    background: rgba(255, 255, 255, 0.5);
    padding: 0 5px;
    margin-bottom: 15px;
  }
  .slide-enter-active{
    @include slideInDown();
  }
  .slide-leave-active{
    @include slideOutUp();
  }
</style>

<template>
  <div class="iair-detail bg-box" :style="bgStyle">

    <div class="block">
      <v-cell class="cell" title="空气质量"><span slot="value" v-html="computeQualityText"></span></v-cell>
      <v-cell class="cell" title="温度(℃)" :value="ifreshair.temperatureActual"></v-cell>
      <v-cell class="cell" title="湿度(%RH)" :value="ifreshair.humidityActual"></v-cell>
      <v-cell class="cell" title="运行模式">
        <div slot="value">
          <span v-show="ifreshair.runMode < 1 || ifreshair.runMode > 5">未知</span>
          <span v-show="ifreshair.runMode === 1">自动</span>
          <span v-show="ifreshair.runMode === 2">手动</span>
          <span v-show="ifreshair.runMode === 3">睡眠</span>
          <span v-show="ifreshair.runMode === 4">定时</span>
          <span v-show="ifreshair.runMode === 5">内循环</span>
        </div>
      </v-cell>

      <transition name="slide">
        <div v-if="isShowMore">
          <v-cell class="cell" title="PM2.5" :value="ifreshair.pm25"></v-cell>
          <v-cell class="cell" title="二氧化碳(CO2)" :value="ifreshair.co2"></v-cell>
          <v-cell class="cell" title="甲醛(HCHO)" :value="ifreshair.hcho"></v-cell>
          <v-cell class="cell" title="挥发性有机化合物" :value="ifreshair.voc"></v-cell>
          <v-cell class="cell" title="风速"><span slot="value">{{ifreshair.inWindSpeed}}(进风) | {{ifreshair.outWindSpeed}}(排风)</span></v-cell>
          <v-cell class="cell" title="辅热">
            <div slot="value">
              <span class="color-danger" v-show="ifreshair.auxHeating === 0">关闭</span>
              <span class="color-cyan" v-show="ifreshair.auxHeating === 1">开启</span>
              <span class="font-light" v-show="ifreshair.auxHeating !== 0 && ifreshair.auxHeating !== 1">未知</span>
            </div>
          </v-cell>
          <v-cell class="cell" title="旁通">
            <div slot="value">
              <span class="color-danger" v-show="ifreshair.bypass === 0">关闭</span>
              <span class="color-cyan" v-show="ifreshair.bypass === 1">开启</span>
              <span class="font-light" v-show="ifreshair.bypass !== 0 && ifreshair.bypass !== 1">未知</span>
            </div>
          </v-cell>
          <v-cell class="cell" title="保养状态">
            <div slot="value">
              <span class="color-danger" v-show="ifreshair.maintainState === 0">关闭</span>
              <span class="color-cyan" v-show="ifreshair.maintainState === 1">保养中</span>
              <span class="font-light" v-show="ifreshair.maintainState !== 0 && ifreshair.maintainState !== 1">未知</span>
            </div>
          </v-cell>
          <v-cell class="cell" title="滤网使用时长(小时)" :value="ifreshair.filterHours"></v-cell>
          <v-cell class="cell" title="运行总时长(小时)" :value="ifreshair.totalHours"></v-cell>
        </div>
      </transition>

      <div class="align-center" style="margin-top: -1px">
        <button type="button" class="btn btn-sm font-lighter" style="width: 100px" @click="isShowMore = !isShowMore">
          <span v-show="!isShowMore"><span class="valign-middle">查看全部</span> <i class="fa fa-angle-down"></i></span>
          <span v-show="isShowMore"><span class="valign-middle">收起</span> <i class="fa fa-angle-up"></i></span>
        </button>
      </div>
    </div>

    <div class="border-top">
      <v-detail :isShowBack="false">
        <div slot="actions"><button type="button" class="btn btn-sm" @click="toggleViewType">返回</button></div>
      </v-detail>
    </div>

    <!--<div style="height: 50px;"></div>
    <div class="page-footer padding border-top align-right bg">
      <button type="button" class="btn btn-round btn-sm" @click="toggleViewType">返回</button>
    </div>-->
  </div>
</template>

<script>
  import VDetail from "@/pages-member/idevices/v-detail";

  export default {
    name: "ifreshair-view-default",
    components: {
      VDetail
    },
    props: {
      // 设备信息
      device: {
        type: Object,
        default: {}
      },
      // 用于控制切换主视图与详情页
      value: String
    },
    data: function () {
      return {
        isShowMore: false
      }
    },
    computed: {
      ifreshair: function(){
        return this.device.iotDevice || {};
      },

      bgStyle: function () {
        const ifreshairHeight = this.$utils.getScreenHeight();
        return {
          background: 'url(' + this.$filters.staticImg("/static/images/ifreshair/iair-bg-a.jpg", '/resize,h_' + ifreshairHeight) + ") repeat-y center",
        }
      },

      // 计算空气质量文本显示
      computeQualityText: function () {
        let qualityText = this.ifreshair.airQualityText || "优";
        qualityText += " (" + this.ifreshair.pm25 + ")";
        let qualityHtml = "<span class='color-green-1 font-m'>"+ qualityText +"</span>";
        let airQuality = this.ifreshair.quality;
        if(airQuality === 3 || airQuality === 4) {
          qualityHtml = "<span class='color-yellow-2 font-m'>"+ qualityText +"</span>";
        } else if(airQuality === 5 || airQuality === 6) {
          qualityHtml = "<span class='color-danger font-m'>"+ qualityText +"</span>";
        }
        return qualityHtml;
      },
    },
    methods: {
      toggleViewType() {
        this.$emit("input", "default");
      }
    }
  }
</script>
