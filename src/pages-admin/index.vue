<style scoped lang="scss" type="text/scss">
  @import '~variables';

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
    .agree-btn {
      width: $m;
      height: $m;
      background: $primary;
      justify-content: center;
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
  <div class="bg-white full-height">
    <app-view :hasFooter="false">
      <div class="padding-m align-center font-bold-500 border-bottom bg-gradient color-white">品智云管理工具箱</div>
      <div class="search-box">
        <div class="padding-left-m padding-right-m padding-top padding-bottom flex bg-gray-1">
          <div class="key-box flex flex-item">
            <i class="font-lighter iconfont icon-iot-search"></i>
            <input type="text" placeholder="请输入设备编码或设备Mac地址" class="key-input padding-left bg-light" v-model="keywords" @keyup="searchKey($event)">
            <i class="iconfont icon-iot-guanbi font-lighter" @click="clearInput" :style="{'display': keywords.length > 0 ? 'inline-block' : 'none' }"></i>
          </div>
          <div class="margin-left-m font-light valign-center" @click="searchDevice()">
            <i class="iconfont icon-IOT-sx"></i>
            <span>搜索</span>
          </div>
        </div>
        <div class="padding-top-m padding-bottom-m margin-left-m margin-right-m flex border-bottom">
          <div class="mint-cell-checkbox valign-center">
            <input type="checkbox" class="mint-checkbox-input" v-model="isSearchIOT"/>
            <i class="mint-checkbox-core"></i>
            <span class="margin-left-s">仅检索IOT设备</span>
          </div>
        </div>
        <div class="search-list-box">
          <div v-if="deviceList && deviceList.length > 0"
               v-for="(item, index) in deviceList"
               class="padding-m border-bottom flex bg-white"
               @click.stop="detail(item.id)">
            <div class="item-img border border-radius">
              <img v-lazy="$filters.img(item.productImage,'!wh100')" :src="$filters.img(item.productImage,'!wh100')" alt="">
            </div>
            <div class="item-info margin-left">
              <div class="">
                <div class="padding-right-s">设备编号：{{ item.deviceId ? item.deviceId : '无' }}</div>
                <div class="border-left padding-top-s">Mac地址：{{ item.deviceMac ? item.deviceMac : (item.iotDevice && item.iotDevice.deviceMac ? item.iotDevice.deviceMac : '无') }}</div>
              </div>
              <div v-if="!isSearchIOT" class="font-light margin-top text-wrapper-overline">{{ item.address && item.address.fullAddress ? item.address.fullAddress : '无设备安装地址' }}</div>
            </div>
          </div>
          <app-empty-view v-if="!deviceList || !deviceList.length || deviceList.length < 1" :isFullHeight="false"></app-empty-view>
        </div>
      </div>
    </app-view>
  </div>
</template>
<script>
  import types from "@/store/types";
  import AppEmptyView from '@/components/layouts/app-empty-view';

  export default {
    name: "admin-index",
    data() {
      return {
        // 搜索关键词
        keywords: '',
        // 是否正在比较前后两个关键词,与实时搜索有关
        isComparing: false,
        // 是否仅搜索IOT设备
        isSearchIOT: false,
        // 搜索结果
        deviceList: {}
      }
    },
    computed: {
      // 当前用户
      curUser() {
        return this.$store.getters[types.oauth.getCurUser];
      },
    },
    methods: {
      /**
       * 搜索设备
       */
      searchDevice() {
        let that = this;
        that.$http.get(`${that.$apihost}/admin/tools/devices/find`,{
          'q': that.keywords && that.keywords.toUpperCase(),
        })
          .then((data) => {
            that.deviceList = data;
            that.$store.state.showLoading = false;
          });
      },
      /**
       * 实时搜索
       */
      autoSearch() {
        if(!this.isComparing) {
          let that = this;
          let _openFlag = false;                //定时器开关标识
          let _compareKey = '';                 //与搜索词进行比较的存储器
          let T = function() {
            that.isComparing = true;            //是否允许比较搜索事件的标志
            if(_openFlag) {
              that.searchDevice();
              that.isComparing = false;
              clearTimeout(T);
              return false;
            }

            if(_compareKey !== that.keywords.toUpperCase()) {
              _compareKey = that.keywords && that.keywords.toUpperCase();
            } else if(!_openFlag) {
              _openFlag = true;
            }

            setTimeout(T,500);
          }
          if(that.keywords.length >= 3) {
            T();
          }
        }
      },
      /**
       * 清除输入
       */
      clearInput: function() {
        this.keywords = '';
        this.deviceList = {};
//        this.searchDevice();
      },
      /**
       * 判断是否实时搜索还是回车搜索
       * @param e
       */
      searchKey(e) {
        if(e.keyCode === 13) {
          this.searchDevice();
        } else {
          this.autoSearch();
        }
      },
      /**
       * 跳转到设备详情
       * @param _id
       */
      detail(_id) {
        this.$router.push(`/admin/tools/device/${_id}/view`);
      }
    },
    components: {
      AppEmptyView
    }
  }
</script>
