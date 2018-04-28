<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .filter-life {
    background: url("/static/images/devices/bg.png") no-repeat;
    background-size: 100% rem(290px);
    /*padding-top: rem(50px);*/
    /*background-position: 0 rem(50px);*/

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
</style>

<template>
  <div class="filter-life">
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
                           :class="{ 'greenProgress': Number((item.availablePercentage || 0)*100) >= 70, 'yellowProgress': Number((item.availablePercentage || 0)*100) < 70 && Number((item.availablePercentage || 0)*100) > 30, 'redProgress': Number((item.availablePercentage || 0)*100) <= 30,  }"></mt-progress>
              <span>预计可用  {{ item.estimatedDays && Number(item.estimatedDays) > 0 ? item.estimatedDays + '  天' : '估算中...' }}</span>
            </div>
          </div>
        </li>
      </ul>
      <app-empty-view v-if="!filterProgress || filterProgress.length === 0 ? showEmpty : hideEmpty" :isFullHeight="false"></app-empty-view>
    </div>
  </div>
</template>

<script>
  import AppEmptyView from '@/components/layouts/app-empty-view'

  export default{
    name: "iwater-filter",
    data () {
      return {
        // 设备数据
        iWater: {},
        filterProgress: [],
        filters: {
          num: 0,
          overdueNum: 0
        },
        // 是否开机
        power: false,
        showEmpty: true,
        hideEmpty: false,
        isOnline: false,
        deviceId: this.$route.params.deviceId,
        usrDeviceId: this.$route.params.id,
        isOwner: true,
        entity: {}
      }
    },
    created () {
      this.$store.state.showLoading = false;
      this.fetchData();
    },
    computed: {
      // 根据设备的开关机状态和是否离线状态
      canHandle() {
        return this.isOnline && this.entity && this.entity.iotDevice && this.entity.iotDevice.powerOn;
      }
    },
    methods: {
      /**
       * 初始化拉取数据
       */
      fetchData() {
        let res = {};
        this.$http.get(`${this.$apihost}/userdevices/${this.usrDeviceId}`)
          .then((data) => {
            this.entity = data;
            this.iWater = data && data.device;
            res = data && data.device;

            this.power = res.iotDevice && res.iotDevice.powerOn;
            this.isOnline = res.iotDevice && res.iotDevice.online;

            // 滤芯
            if(res.iotDevice && res.iotDevice.parts) {
              this.filterProgress = res.iotDevice.parts;
              this.filters.num = res.iotDevice.parts.length || 0;
              let overFilters = this.filterProgress.filter((r) => r.availablePercentage*100 < 5);
              this.filters.overdueNum = overFilters;
            }
          })
      },
      /**
       * 刷新滤芯状态
       */
      freshFilter() {
        this.$loading.show();
        this.$http.get(`${this.$apihost}/waterdevices/${this.deviceId}`)
          .then((res) => {
            this.$loading.hide();
            if (res.iotDevice.parts !== null) {
              this.filterProgress = res.iotDevice.parts;
              this.filters.num = res.iotDevice.parts.length || 0;
              let overFilters = this.filterProgress.filter((r) => r.availablePercentage*100 < 5)
              this.filters.overdueNum = overFilters;
            }
          })
      },
      /**
       * 滤芯详情
       * @param filter
       * @param index
       */
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
    },
    components: {
      AppEmptyView
    }
  }
</script>
