<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .lot-box {
    .lot-item {
      position: relative;
      .mint-checkbox-input {
        position: absolute;
        left: 0;
        right: 0;
        top: 5px;
        width: 100%;
        height: calc(100% - 20px);
        z-index: 10;
        display: inline-block;
        opacity: 0;
      }
    }
  }
  .agreement {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>

<template>
  <div>
    <div class="title padding-m bg-yellow-4 font-default">选择要退租的设备</div>
    <div v-if="lotData" class="lot-box padding-bottom-xxl">
      <div v-for="(item, index) in lotData"
           class="lot-item padding-m flex border-bottom">
        <div class="flex-item">
          <div class="text-wrapper-2line">产品名称：{{ item.deviceName ? item.deviceName : '无产品名称' }}</div>
          <div class="margin-top-s">Mac地址：{{ item.deviceId ? item.deviceId : '无Mac地址' }}</div>
          <div class="margin-top-s text-wrapper-overline">安装地址：{{ item.address && item.address.fullAddress ? item.address.fullAddress : '无安装地址' }}</div>
        </div>
        <div class="mint-cell-checkbox padding-left-m">
          <input type="checkbox"
                 class="mint-checkbox-input"
                 :value="item.id"
                 v-model="lotCheck"
                 @click.stop="addLot({
                  id: item.id,
                  deviceId: item.deviceId
                 })"/>
          <i class="mint-checkbox-core"></i>
        </div>
      </div>
    </div>
    <div v-else class="valign-center" style="justify-content: center;flex-direction: column">
      <img src="/static/images/empty/no-list.png" class="tips" style="width: 150px;"/>
      <div>暂无设备批次数据~~</div>
    </div>
    <div class="agreement flex border-top">
      <button class="btn btn-block padding-m flex-item" @click="close()">关闭</button>
      <button class="btn btn-block btn-primary padding-m" @click="refund()">立即退租</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "company-refund",
    props: ['lotData'],
    data() {
      return {
        // 设备的选择
        lotCheck: [],
        // lot设备数据
        lotDeviceId: [],
        // 所选设备数据
      }
    },
//    created() {
//      let that = this;

//      that.$http.get(`${that.$apihost}/devices/list/${that.lotNo}`)
//        .then((lot) => {
//          console.log(lot);
//          that.lotData = lot;
//          console.log(that.lotData);
//        })
//    },
    methods: {
      /**
       * 增加/去除选中设备
       * @param data
       */
      addLot(data) {
        let that = this;
        let _check = that.lotCheck;
        let _flag = true;

        if(data && data.id && data.deviceId) {
          for(let i = 0,len = _check.length; i < len; i++) {
            if(_check[i] === data.id) {
              that.lotCheck.splice(data.id, 1);
              that.lotDeviceId.splice(data.deviceId, 1);
              _flag = false;
              break;
            }
          }
          if(_flag) {
            that.lotCheck.push(data.id);
            that.lotDeviceId.push(data.deviceId);
          }
        }
      },
      /**
       * 关闭
       */
      close() {
        this.$store.commit("hideLoading");
        this.$emit("cancel");
      },
      refund() {
        let that = this;
        let _check = that.lotCheck;
        let _device = that.lotDeviceId;
        if(_check && _check.length > 0 && _device && _device.length > 0) {
          that.$router.push({ path: '/devices/refund', query: {
            isRefund: true,
            deviceId: JSON.stringify(_check),
            macId: JSON.stringify(_device)
          }});
        } else {
          that.$toast.error('至少选择一个设备！');
        }
      }
    }
  }
</script>
