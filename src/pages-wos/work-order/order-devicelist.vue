<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .flex .flex-item {
    flex: 1;
    width: 100%;
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }
  .device-box {
    overflow: auto;
    .product-detail {
      flex-direction: column;
    }
    .image-product-box {
      width: 20%;
      padding-top: 20%;
      position: relative;
      .image-product {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        justify-content: center;
        overflow: hidden;
        img {
          height: 100%;
          width: auto;
          max-width: fit-content;
        }
      }
    }
  }
</style>

<template>
  <div class="full-height" v-if="deviceData">
    <div class="device-box bg full-height padding-bottom-xxl">
      <div v-for="(item, index) in deviceData" class="ripple bg-white margin-top" :class="{ 'margin-top-zero': index === 0 }">
        <div class="border-radius flex padding-m">
          <div class="image-product-box">
            <div class="image-product border-radius border valign-center bg-white">
              <img v-lazy.container="$filters.img(item.productImage,'!q70')" :src="$filters.img(item.productImage,'!q70')" alt="">
            </div>
          </div>
          <div class="flex-item flex margin-left-m product-detail">
            <div class="text-title font-default text-wrapper-2line">{{ item.deviceName }}</div>
            <div class="flex-item"></div>
            <div class="font-light font-s font-family-num" v-if="item.deviceId">
              设备编码：{{ item.deviceId }}
            </div>
            <div class="font-light font-s font-family-num margin-top-s" v-if="item.iotDevice && item.iotDevice.deviceMac">
              Mac地址：{{ item.iotDevice.deviceMac }}
            </div>
            <div v-if="item.address && item.address.fullAddress"> {{ item.address.fullAddress }} </div>
          </div>
        </div>
        <div class="padding bg-gray-1 flex" v-if="status > 20 && status < 70">
          <div class="flex-item"></div>
          <actions type="del" :order="item"></actions>
        </div>
      </div>
    </div>
    <!--<div class="device-page-box valign-center" style="justify-content: center" v-if="!deviceData || deviceData.length <= 0">暂无数据</div>-->
    <div class="page-footer align-center" @click="cancel()">
      <div class="padding-m btn-primary color-white">关闭</div>
    </div>
  </div>
</template>

<script>
  import AppPage from '@/components/layouts/app-page';
  import actions from "../tpl/tpl-actions.vue"

  export default {
    name: "order-devicelist",
    props: ['status'],
    data() {
      return {
        // 设备数据
        deviceData: {}
      }
    },
    mounted() {
      // 设备数据
      this.$http.get(`${this.$woshost}/workorders/${this.$route.params.id}/devices`)
        .then((device) => {
          this.deviceData = device;
        })
    },
    methods: {
      /**
       * 取消
       */
      cancel() {
        this.$router.go(-1);
      }
    },
    components: {
      AppPage,
      actions
    }
  }
</script>
