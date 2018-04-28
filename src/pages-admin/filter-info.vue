<style scoped lang="scss" type="text/scss">
  @import '~variables';

  .btn-sm {
    border: 1px solid $primary;
    background: $primary;
    color: $white;
    margin: 0;
    padding: rem(2px) rem(15px);
  }
  .danger-btn {
    padding: rem(6px) 0;
    border: 1px solid rgba($danger, .5);
    background: $white;
    color: $danger;
  }
  .confirm-page {
    width: 100%;
  }
  .filter-box {
    .filter-item {
      .font-light {
        width: rem(75px);
      }
    }
  }
</style>

<template>
  <div class="bg-white full-height" style="overflow: auto">
    <app-view :hasFooter="false">
      <div class="padding-m align-center font-bold-500 border-bottom bg-gradient color-white">品智云管理工具箱</div>
      <div class="filter-box">
        <div v-if="entity && entity.length"
             v-for="(item, index) in entity"
             class="filter-info padding-m">
          <div class="filter-item">
            <div class="flex">
              <div class="flex-item font-m font-bold-500">{{ item.name ? item.name : '无' }}：</div>
              <span class="btn-sm border-radius"
                    @click.stop="confirmIstr('filter',index)">复位</span>
            </div>
            <div class="margin-top-s">
              <div class="flex">
                <div class="font-light">滤芯编码：</div>
                <div class="flex-item font-default font-bold-500">{{ item.partCode ? item.partCode : '无' }}</div>
              </div>
              <div class="flex">
                <div class="font-light">安装日期：</div>
                <div class="flex-item font-default font-bold-500">{{ item.installedAt ? $filters.formatDate(item.installedAt, 'YYYY-MM-DD HH:mm:ss') : '无' }}</div>
              </div>
              <!--<div class="flex">-->
                <!--<div class="font-light">出水总量：</div>-->
                <!--<div class="flex-item font-default font-bold-500">56.23升</div>-->
              <!--</div>-->
              <div class="flex">
                <div class="font-light">可用%：</div>
                <div class="flex-item font-default font-bold-500">{{ item.availablePercentage ? item.availablePercentage : 0 }}%</div>
              </div>
            </div>
          </div>
        </div>
        <app-empty-view v-if="!entity || !entity.length"></app-empty-view>
      </div>
      <div class="btn-sm danger-btn margin-m align-center border-radius" @click.stop="confirmIstr('reset')">重置设备滤芯</div>

      <!--二次确认-->
      <mt-popup v-model="confirmPopup"
                pop-transition="popup-fade"
                :closeOnClickModal="false"
                class="confirm-page">
        <div style="width: 100%;height: 100%;">
          <div class="mint-msgbox-wrapper" style="position: absolute; z-index: 2003;">
            <div class="mint-msgbox" style="width: 85%!important;">
              <div class="mint-msgbox-header">
                <div class="mint-msgbox-title">提示</div>
              </div>
              <div class="mint-msgbox-content">
                <div v-show="!isReset" class="mint-msgbox-message">是否确认复位该滤芯？</div>
                <div v-show="isReset" class="mint-msgbox-message">是否确认重置设备数据？</div>
              </div>
              <div class="mint-msgbox-btns">
                <button class="mint-msgbox-btn mint-msgbox-cancel " @click.stop="cancelIstr()">取消</button>
                <button class="mint-msgbox-btn mint-msgbox-confirm"
                        :class="{ 'disabled-btn': isTiming && isDoIstr }"
                        @click.stop="istrCode()">
                  <span v-if="isTiming && isDoIstr" class="font-family-num">{{ timeText && timeText > 0 ? '（' + timeText + '）' : '' }}</span>确定</button>
              </div>
            </div>
          </div>
        </div>
      </mt-popup>
    </app-view>
  </div>
</template>
<script>
  import types from "@/store/types";
  import AppEmptyView from '@/components/layouts/app-empty-view';

  export default {
    name: "admin-filters",
    data() {
      return {
        // 滤芯数据
        entity: {},
        // 设备编码
        deviceId: '',
        // 倒计时数字
        timeText: '',
        // 是否在倒计时
        isTiming: false,
        // 是否重置设备数据
        isReset: false,
        // 是否执行指令
        isDoIstr: true,
        // 二次确认弹窗
        confirmPopup: false,
        // 错误提示
        errMsg: '',
      }
    },
    computed: {
      // 当前用户
      curUser() {
        return this.$store.getters[types.oauth.getCurUser];
      },
    },
    created: function () {
      let that = this;
      that.$http.get(`${that.$apihost}/devices/${that.$route.params.id}`)
        .then((data) => {
          if(data) {
            that.iotDevice = data && data.iotDevice;
            that.entity = that.iotDevice && that.iotDevice.parts;
            that.deviceId = (that.iotDevice && that.iotDevice.deviceMac) || data.deviceId || '';
          }
        })
      that.$store.state.showLoading = false;
    },
    methods: {
      /**
       * 倒计时执行方法
       * @param _callback
       * @param _time
       */
      countdown(_callback, _time) {
        let that = this;
        that.isTiming = true;
        let _timeCount = 31;
        if(_time) {
          _timeCount = Number(_time);
        }

        let T = function () {
          if(!that.isDoIstr) {
            clearTimeout(T);
            return false;
          }
          if(!that.isTiming) {
            // 回调
            _callback && _callback();
            return false;
          }
          if(_timeCount > 1) {
            _timeCount--;
            that.timeText = _timeCount < 10 ? '0' + _timeCount : _timeCount;
            setTimeout(T,1000);
          } else {
            that.isTiming = false;
            T();
          }
        }
        T();
      },

      /**
       * 执行指令
       * @returns {string}
       */
      istrCode() {
        let that = this;
        let _isReset = that.isReset;
        let _url = '';

        if(_isReset) {
          let _deviceId = that.deviceId;
          if(_deviceId) {
            _url = `${that.$apihost}/admin/tools/devices/${_deviceId}/filters/recreate`;
          }
        } else {
          let _index = that.filterIndex;
          _url = `${that.$apihost}/waterdevices/${that.$route.params.id}/resetFilter/${Number(_index) + 1}`;
        }

        if(!that.isTiming) {
          that.countdown(function() {
            that.$http.post(`${_url}`)
              .then((res) => {
                that.confirmPopup = false;
                that.isTiming = false;
                that.isReset = false;
                that.$toast.success('执行指令成功!');
//                setTimeout(() => {
//                  location.reload();
//                }, 600);
              })
          });
        }
      },
      /**
       * 取消执行指令
       */
      cancelIstr() {
        let that = this;
        that.confirmPopup = false;
        setTimeout(function () {
          that.isDoIstr = false;
          that.isTiming = false;
          that.isReset = '';
        },50);
      },
      /**
       * 二次确认
       * @param _type
       * @param _index
       */
      confirmIstr(_type, _index) {
        let that = this;
        let type = 'filter'
        if(_type) {
          type = _type;
        }
        if(type && type === 'reset') {
          that.isReset = true;
        } else {
          that.filterIndex = _index;
        }
        that.isDoIstr = true;
        that.isTiming = false;
        that.confirmPopup = true;
      },
    },
    components: {
      AppEmptyView
    }
  }
</script>
