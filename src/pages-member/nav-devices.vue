<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .header {
    position: relative;
    z-index: 10;
    background-color: $primary;
  }
  .device-box {
   /*margin-top: rem(50px);*/
  }
  .card {
    position: relative;
    //    @extend %margin-m;
  }

  .device-type {
    position: absolute;
    top: rem(12px);
    left: rem(-7px);

    width: rem(80px);
    height: rem(30px);
    background: $transparent no-repeat;
    background-size: rem(80px) rem(30px);
    z-index: 1;
    text-align: center;
    color: $white;
    line-height: rem(28px);
    font-size: $font-size-s;
  }

  .device-type.device-type-i {
    background-image: url("/static/images/devices/tag-i.png");
  }

  .device-type.device-type-l {
    background-image: url("/static/images/devices/tag-l.png");
  }

  .device-status {
    height: rem(25px);
    line-height: 25px;
    margin-top: rem(3px);
    font-size: $font-size-s;

    i {
      font-size: 16px;
      margin-top: -3px;
    }
  }

  .flex-left{
    flex: 0 0 rem(100px);

    img{
      width: rem(90px);
      height: rem(90px);
    }
  }
  .addDevices{
    width: 100%;
    z-index: 10;

    ul{
      width: 100%;
      display: inline-block;

      li{
        width: 100%;
        display: inline-block;
      }
    }
  }
  .device-btn-box .btn {
    @include border-radius(20px);
    border: rem(1px) solid $font-lighter;

    &:last-child {
      background: $primary;
      background-color: $primary;
      color: $white;
      border: rem(1px) solid $primary;
      .a-default {
        color: $white;
      }
    }
  }
</style>

<template>
  <div>
    <div class="header padding-m flex" @click="showActionSheetPopup = true">
      <div class="flex-item font-l font-white">我的设备</div>
      <div class="ripple padding-left padding-right">
        <i class="iconfont icon-iot-add font-white icon-xxl"></i>
      </div>
    </div>
    <app-view class="has-nav device-main" :hasPullRefresh="true" :pullRefresh="pullRefresh">
      <app-page type="device"
                :url="page.url"
                :params="page.params"
                :storeMutation="page.storeMutation"
                :storeGetter="page.storeGetter"
                @loaded="onPageLoaded"
                class="device-box bg">
        <div v-for="item in fileList"
             :key="item.id"
             v-if="fileList.length > 0"
             class="card margin-m">
          <div class="device-type device-type-i" v-if="item.device.deviceType === 'I'"> 智能设备 </div>
          <div class="device-type device-type-l" v-if="item.device.deviceType === 'L'"> 租赁设备 </div>

          <div class="flex padding ripple" @click="viewDevice(item)">
            <div class="flex-left">
              <img class="img-thumbnail" :src=" $filters.img(item.device.productImage, '!wh100') " v-lazy="$filters.img(item.device.productImage, '!wh100')"/>
            </div>
            <div class="flex-item padding-left">
              <div class="text-title text-wrapper">
                {{ item.device && item.device.deviceName ? item.device.deviceName : (item.device && item.device.productName ? item.device.productName : '无设备名称') }}
              </div>

              <!--<div class="device-status">-->
              <!--&lt;!&ndash;<div class="color-danger" v-if="item.device.deviceType === 'L' && !item.device.leaseProductActived">&ndash;&gt;-->
              <!--&lt;!&ndash;<i class="fa fa-ban"></i> 待激活&ndash;&gt;-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->

              <div v-if="item.device && (item.device.deviceType === 'I' || item.device.deviceType === 'L')">
                <div class="color-danger" v-if="item.device && item.device.iotDevice && item.device.iotDevice.locked">
                  <i class="fa fa-lock"></i> 已锁机
                </div>

                <div v-if="item.device.iotDevice != null && !item.device.iotDevice.locked">
                  <div v-if="item.device.iotDevice.online">
                        <span class="color-success" v-if="item.device.iotDevice.powerOn"><i
                          class="fa fa-wifi"></i> 在线</span>
                    <span class="color-danger" v-if="!item.device.iotDevice.powerOn"><i class="fa fa-power-off"></i> 已关机</span>
                  </div>
                  <div v-if="!item.device.iotDevice.online">
                    <span class="color-danger"><i class="fa fa-exclamation-triangle"></i> 已离线</span>
                  </div>
                </div>
              </div>
              <!--</div>-->


              <div class="font-s font-light margin-top" v-if="item.device.deviceType === 'C'">
                <div class="margin-bottom-s">产品型号：{{item.device.itemCode}}</div>
                <div>购买日期：{{ $filters.formatDate(item.device.purchasedDate) }}</div>
              </div>

              <div class="font-s font-light margin-top" v-if="item.device.deviceType !== 'C'">
                <div class="margin-bottom-s" v-if="item.device && item.device.deviceId">设备编码：{{item.device && item.device.deviceId}}</div>
                <!--<div class="margin-bottom-s" v-if="item.device && item.device.iotDevice">MAC：{{ item.device && item.device.iotDevice && item.device.iotDevice.deviceMac }}</div>-->
                <div>
                  <span v-if="item.device.deviceType === 'L'">租赁到期日：{{ $filters.formatDate(item.device.leaseDueDate) }}</span>
                  <span v-if="item.device.deviceType === 'I'">购买日期：{{ $filters.formatDate(item.device.purchasedDate) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-1 padding flex device-btn-box">
            <div class="flex-item"></div>
            <div>
              <!--<button type="button" class="btn btn-sm btn-danger btn-round"-->
              <!--v-if="item.device.deviceType === 'L' && !item.device.leaseProductActived" @click="activeDevice(item.device.id)">-->
              <!--去激活设备-->
              <!--</button>-->
              <button class="btn btn-sm margin-right">
                <router-link class="a-default" :to="{ path: '/serviceorder/create', query: getDeviceParams(item)}">
                  一键报修
                </router-link>
              </button>
              <button v-if="item.device && item.device.deviceType === 'L' && !item.device.company"
                      type="button" class="btn btn-sm margin-right"
                      @click.stop="recharge(item)">续费</button>
            </div>
          </div>
        </div>
      </app-page>
    </app-view>

    <v-popup position="bottom" v-model="showActionSheetPopup" :closeOnClickModal="true">
      <ul>
        <li class="border-bottom">
          <button type="button" class="btn btn-block font-m padding-m" @click="addDevice('scan')">扫一扫</button>
        </li>
        <li>
          <button type="button" class="btn btn-block font-m padding-m" @click="addDevice('manual')">手工录入</button>
        </li>
        <li class="border-top">
          <button type="button" class="btn btn-block font-m font-light padding-m" @click="showActionSheetPopup = false">取消</button>
        </li>
      </ul>
    </v-popup>

    <app-nav navId="devices" v-if="isShowNav"></app-nav>
  </div>
</template>

<script>
  import AppPage from '@/components/layouts/app-page';
  import AppNav from '@/pages-member/nav';
  import VPopup from '@/components/ui/v-popup'

  import types from "@/store/types";

  import App from "@/assets/scripts/app";
  import scanHandler from "@/assets/scripts-page/lease-scan";

  export default {
    name: "nav-device",
    components: {
      AppNav,
      AppPage,
      VPopup
    },
    data: function () {
      return {
        // 下拉刷新数据
        pullRefresh: {
          params: {
          },
          events: {
            topMethod: this.getListData,
          }
        },
        // 列表数据
        fileList: [],
        justOneIotDevice: true,
        selectedCode: '',

        showActionSheetPopup: false,
      }
    },
    computed: {
      page () {
        return {
          url: this.$apihost + "/userdevices",
          params: {
            page_size: 15,
            page_sort: 'createdDate_desc',
          },
          storeMutation: types.userDevices.setPageData
        }
      },

      // 是否显示nav
      isShowNav(){
        let query = this.$route.query;
        let nav = query.nav ? query.nav+"" : "true";
        return nav === "true";
      }
    },
    methods: {
      /**
       * 获取分页数据
       */
      getListData() {
        this.$bus.emit('page-refresh');
      },
      /**
       * 页面加载后操作
       * @param fileList
       */
      onPageLoaded (fileList) {
        this.$store.commit("hideLoading");
        this.fileList = fileList;
      },
      /**
       * 获取跳转传递参数
       *
       * @param userDevice
       */
      getDeviceParams (userDevice) {
        let that = this;
        let _temp = userDevice.device;
        return {
          id: userDevice.id,
          deviceId: _temp && _temp.id,
          deviceName: _temp && _temp.deviceName,
          productId: _temp && _temp.productId,
          productImage: _temp && _temp.productImage,
          itemCode: _temp && _temp.itemCode,
          purchasedDate: _temp && this.$filters.formatDate(_temp.purchasedDate),
          deviceType: _temp && _temp.deviceType,
          address: _temp && _temp.address && encodeURIComponent(JSON.stringify(_temp.address))
        }
      },

      /**
       * 续费
       * @param item
       */
      recharge(item) {
        const device = item.device;
        let rechargeUrl = "/devices/" + device.id + "/recharge";
        rechargeUrl += "?leaseProductId=" + device.leaseProductId;
        rechargeUrl += "&deviceName=" + device.deviceName;
        rechargeUrl += "&leaseDueDate=" + this.$filters.formatDate(device.leaseDueDate);
        this.$router.push(encodeURI(rechargeUrl));
      },

      // 添加设备
      addDevice(type){
        this.showActionSheetPopup = false;
        this.chooseDevicesPopup = false;
        if(type === 'scan') {
          if(this.$wechat.isInWechat() || this.$alipay.isInAlipay()) {
            let curUrl = App.accessTokenHost + "/devices";
            let query = this.$route.query;
            if(query.nav) {
              curUrl += "?nav=" + query.nav;
            }
            if(query.tab) {
              curUrl += curUrl.indexOf("?") > -1 ? "&" : "?";
              curUrl += "tab=" + query.tab;
            }
            scanHandler.scan(curUrl);
          } else {
            this.$dlg.prompt("手动输入二维码上12位设备编码", (resp) => {
              scanHandler.getDeviceQRCodeResult(resp);
            })
          }
        } else {
          this.$router.push("/devices/choose");
        }
      },

      /**
       * 进入设备详情
       * @param userDevice 用户设备
       */
      viewDevice: function(userDevice) {
        let device = userDevice.device;
        if(device.deviceType === "C" || device.iotDevice === null) {
          this.viewCommonDeviceUrl(userDevice);
        } else {
          let iotDevice = device.iotDevice;
          if(device.iotDeviceType === "iWater") {
            this.viewIWaterDevice(userDevice, iotDevice);
          } else if(device.iotDeviceType === "iAir") {
            this.viewIFreshAirDevice(userDevice, iotDevice);
          }
        }
      },

      /**
       * 普通设备查看
       * @param userDevice 用户设备
       */
      viewCommonDeviceUrl: function (userDevice) {
        this.$router.push(`/devices/${userDevice.id}/view`);
      },
      /**
       * 查看水机详情
       * @param userDevice 用户设备
       */
      viewIWaterDevice: function (userDevice, iwater) {
        const device = userDevice.device;
        /*const waterDeviceType = iwater.waterDeviceType;
        if(waterDeviceType === 1) {
          this.$router.push({ path: `/devices/waterdevices/heat/${userDevice.id}`, query: { deviceEntityId: device.id }});
        } else if(waterDeviceType === 2) {
          this.$router.push({ path: `/devices/waterdevices/cold/${userDevice.id}`, query: { deviceEntityId: device.id }});
        } else {
          this.$router.push(`/devices/waterdevices/iwater/${userDevice.id}`);
        }*/
        this.$router.push({
          path: "/iot/iwater/" + device.id,
          query: {
            userDeviceEntityId: userDevice.id,
            deviceId: device.deviceId
          }
        });
      },
      /**
       * 查看空净机详情
       * @param userDevice 用户设备
       * @param ifreshair  空净机
       */
      viewIFreshAirDevice: function (userDevice, ifreshair) {
        const device = userDevice.device;
        this.$router.push({
          path: "/iot/ifreshair/" + device.id,
          query: {
            deviceId: device.deviceId,
            userDeviceEntityId: userDevice.id
          }
        })
      }
    },
  };
</script>
