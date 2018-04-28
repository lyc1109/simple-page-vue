<style scoped lang="scss" type="text/scss">
  @import '~variables';
  .scan-btn {
    border: 1px solid $primary;
  }
  .search-btn {
    border: 1px solid $primary;
    background: $primary;
  }
  .check-span {
    width: $m;
    height: $m;
    display: inline-block;
  }
  .search-box {
    .mint-cell-checkbox {
      position: relative;
      .mint-checkbox-input {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 10;
        opacity: 0;
        display: inline-block;
      }
    }
  }
  .search-list-box {
    .item-img {
      width: $xxl;
      min-width: $xxl;
      height: $xxl;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .item-info {
      /*align-items: flex-start;*/
    }
  }
</style>

<template>
  <div>
    <v-popup v-model="showPopup" :fullWidth="false" position="''">
      <div class="notice-box">
      </div>
    </v-popup>
  </div>
</template>
<script>
  import vPopup from "@/components/ui/v-popup";

  export default {
    name: 'tpl-holiday-notice',
    data() {
      return {
        // 公告弹窗
//        showPopup: true,
        // 过期失效的毫秒时间戳
        unableTime: 1518055266000,
        // 定时器
        Timer: undefined
      }
    },
    computed: {
      // 公告弹窗是否显示
      showPopup() {
        let that = this;
        const nowTime = new Date().getTime();
        if(nowTime >= that.unableTime) {
          return false;
        }
        return true;
      }
    },
    components: {
      vPopup
    },
  }
</script>
