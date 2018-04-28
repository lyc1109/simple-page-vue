<style scoped lang="scss" type="text/scss">
  @import "~variables";

  .header {
    width: 100%;
    overflow: hidden;
    justify-content: center;
  }
  .img-thumbnail {
    width: auto;
    max-width: fit-content;
    height: 100%;
    border: none;
  }
  .app-footer {
    &>div {
      @include border(top);

      .btn-box {
        float: right;
        height: rem(50px);

        .btn {
          @include border-radius(20px);
          border: rem(1px) solid $font-lighter;

          &:last-child {
            background: $primary;
            background-color: $primary;
            color: $white;
            border: rem(1px) solid $primary;
          }
        }
      }
    }
  }
  .logs-recharge {
    width: 100%;
    height: 100%;
  }
</style>
<style lang="scss" type="text/scss">
  .devices-view-address {
    .flex:first-child {
      align-items: flex-start;
      .cell-value {
        text-align: left;
        word-wrap: break-word;
        word-break: break-all;
        white-space: normal!important;
      }
    }
  }
</style>
<template>
  <div>
    <!--设备详情页面-->
    <app-view :has-footer="true">
      <!--设备图片-->
      <!--<div class="padding-xxl bg-white flex">-->
      <!--<div class="header valign-center border-radius">-->
      <!--<img class="img-thumbnail" v-lazy="$filters.img(deviceImg,'!w200')" width="200" height="200" />-->
      <!--</div>-->
      <!--</div>-->
      <!--设备详情-->
      <div class="padding-left-m bg-white">
        <div @click="editDevice('name')">
          <v-cell title="设备别名"
                  :value="entity.deviceName"
                  :isLink="true"
                  class="cell padding-m padding-left-zero">
          </v-cell>
        </div>
        <v-cell v-if="entity.itemCode"
        <v-cell v-if="entity.itemCode"
                title="产品型号"
                :value="entity.itemCode"
                class="cell padding-m padding-left-zero">
        </v-cell>
        <v-cell title="设备编码"
                :value="entity.deviceId || '无'"
                class="cell padding-m padding-left-zero"></v-cell>
        <!--<v-cell v-if="entity.deviceType != 'C'"-->
        <!--title="设备MAC"-->
        <!--:value="(entity.iotDevice && entity.iotDevice.deviceMac ? entity.iotDevice.deviceMac : '')"-->
        <!--class="cell padding-m padding-left-zero"></v-cell>-->
        <v-cell v-if="entity.company"
                title="公司名称"
                :value="entity.company"
                class="cell padding-m padding-left-zero"></v-cell>
        <div v-if="specOptions && specOptions.length > 0" class="padding-m padding-left-zero border-bottom">
          商品规格
          <div class="text-wrapper margin-top-m">
            <span v-for="spec in specOptions"
                  class="font-light margin-top margin-left">
            *{{ spec.name }}：{{ spec.value }}
          </span>
          </div>
        </div>
        <v-cell title="安装地址"
                :value="(entity.address && entity.address.fullAddress ? entity.address.fullAddress : '无')"
                class="cell padding-m padding-left-zero devices-view-address"></v-cell>
      </div>
      <div v-if="entity.deviceType === 'L'" class="padding-left-m bg-white margin-top">
        <v-cell v-if="entity.leaseDeposit"
                title="押金"
                :value="$filters.formatCurrency(entity.leaseDeposit/100)"
                class="cell padding-m padding-left-zero"></v-cell>
        <v-cell v-if="entity.leaseStartDate"
                title="租赁起始日"
                :value="$filters.formatDate(entity.leaseStartDate)"
                class="cell padding-m padding-left-zero"></v-cell>
        <v-cell v-if="entity.leaseDueDate"
                title="租赁到期日"
                :value="$filters.formatDate(entity.leaseDueDate)"
                class="cell padding-m padding-left-zero"></v-cell>
        <router-link v-if="entity.leaseOrderEntityId"
                     class="a-default"
                     :to="'/serviceorder/' + entity.leaseOrderEntityId +'/view'">
          <v-cell title="租赁详情" :isLink="true"
                  :value="entity.leaseOrderId"
                  class="cell padding-m padding-left-zero"></v-cell>
        </router-link>
        <div @click="showRechargeLogs">
          <v-cell title="缴费记录" :isLink="true"
                  class="cell padding-m padding-left-zero"></v-cell>
        </div>
      </div>
      <div v-else-if="entity.deviceType !== 'L'" class="padding-left-m bg-white margin-top">
        <v-cell title="购买日期"
                :value="entity.purchasedDate ? $filters.formatDate(entity.purchasedDate) : '无'"
                class="cell padding-m padding-left-zero"></v-cell>
        <div @click.stop="editDevice('date')">
          <v-cell title="发票日期"
                  :isLink="true"
                  :value="entity.invoiceDate ? $filters.formatDate(entity.invoiceDate) : '无'"
                  class="cell padding-m padding-left-zero"></v-cell>
        </div>
        <v-cell title="保修期"
                :value="entity.warrantyPeriod ? $filters.formatDate(entity.warrantyPeriod) : '无'"
                class="cell padding-m padding-left-zero"></v-cell>
        <div class="flex padding-right-m" @click.stop="editDevice('pic')">
          <div class="title">发票图片</div>
          <div v-if="entity.invoiceImagePath" class="margin-left-xxl padding-left-s square-uploadimg flex-item align-right">
            <v-image :imgShowList="[entity.invoiceImagePath]" :isUpload="false" :imgRight="true"></v-image>
          </div>
          <div v-else class="padding-m padding-right-s align-right flex-item">无</div>
          <i class="fa fa-angle-right font-lighter font-s"></i>
        </div>
      </div>

      <div class="padding-left-m margin-top bg-white">
        <div @click.stop="serviceOrder()">
          <v-cell title="设备服务订单" :isLink="true"
                  :value="orderCount + '个订单'"
                  class="cell padding-m padding-left-zero"></v-cell>
        </div>
        <router-link v-if="isOwner" class="a-default" :to="'/devices/' + entity.id +'/oauth'">
          <v-cell title="授权管理"
                  :value="'已授权'+ authorizeCount +'人'"
                  class="cell padding-m padding-left-zero" :isLink="true"></v-cell>
        </router-link>
      </div>
      <div class="padding-left-m bg-white margin-top" @click="restoreDevice">
        <v-cell title="恢复出厂设置" class="cell padding-m padding-left-zero" :isLink="true"></v-cell>
      </div>
      <!--底部操作按钮-->
      <div slot="footer">
        <div class="valign-center btn-box">
          <!--个人租赁设备的拥有者没有解绑按钮-->
          <button v-if="!(entity.deviceType === 'L' && isOwner)" type="button" class="btn btn-sm margin-right-s" @click="unbind()">解绑</button>
          <button v-if="entity.deviceType == 'L' && isOwner"
                  style="display: none1;" type="button"
                  class="btn btn-sm margin-right-s"
                  @click.stop="refund()">退租</button>
          <button type="button" class="btn btn-sm margin-right-s" @click="repair">一键报修</button>
          <button v-if="entity.deviceType == 'L' && !entity.company"
                  type="button" class="btn btn-sm margin-right-s"
                  @click.stop="recharge()">续费</button>
          <button type="button" class="btn btn-sm btn-round margin-right-m" @click="back()">返回</button>
        </div>
      </div>
    </app-view>

    <!-- 缴费记录 -->
    <mt-popup v-model="feePopup"
              popup-transition="popup-fade" class="logs-recharge">
      <logs-recharge @cancel="feePopup = false" :logs="logs"></logs-recharge>
    </mt-popup>

    <!-- 商务租赁退租选择设备 -->
    <mt-popup v-model="refundPopup" position="right" class="logs-recharge">
      <company-refund @cancel="refundPopup = false" :lotData="lotData"></company-refund>
    </mt-popup>

  </div>
</template>

<script>
  import VCell from '@/components/ui/v-cell.vue'
  import logsRecharge from "./recharge-logs.vue"
  import companyRefund from "./company-refund.vue"
  import VImage from '@/components/ui/v-image';

  export default {
    name: "devices-view",
    data() {
      return {
        // 设备图片
        deviceImg: '',
        // 设备数据
        entity: {},
        // 授权人数
        authorizeCount: 0,
        // 服务订单数量
        orderCount: 0,
        // 缴费记录弹窗是否显示
        feePopup: false,
        // 设备日志
        logs: '',
        // 是否是设备拥有者
        isOwner: '',
        // 设备规格数据
        specOptions: {},
        // 设备id
        renewId: '',
        // 商务租赁退租选择设备弹窗
        refundPopup: false,
        // 同一批次设备数据
        lotData: {},
        fromUrl: ''
      }
    },
    beforeRouteEnter(to,from,next) {
      next((vm) => {
        // 判断是否为佳贝尔环境
        if(from.path.indexOf('/jbr') > -1){
          vm.fromUrl = 'jbr'
        }
      })
    },
    created() {
      //获取基本信息
      this.$http.get(this.$apihost + '/userdevices/' + this.$route.params.id)
        .then((data) => {
          let _temp = data.device;
          this.entity = _temp;
          this.renewId = this.entity.id
          this.deviceImg = _temp.productImage;
          this.isOwner = data.userRole && data.userRole === 'Owner';
          //授权人数
          this.$http.get(this.$apihost + '/userdevices/' + _temp.id + '/authorizations/count')
            .then((authorcount) => {
              this.authorizeCount = authorcount;
            })
          //订单数量
          this.$http.get(this.$apihost + '/devices/' + _temp.id + '/serviceorders/count')
            .then((listcount) => {
              this.orderCount = listcount;
            })
          //缴费记录
          this.$http.get(this.$apihost + '/lease/devices/' + _temp.id + '/rechargeorders')
            .then((logs) => {
              this.logs = logs;
            })
          //产品规格描述
          if(_temp.productSpecId && _temp.productSpecId !== '') {
            this.$http.get(this.$apihost + '/productspecs/' + _temp.productSpecId)
              .then((spec) => {
                this.specOptions = spec.specItems;
              })
          }
        })
      this.$store.commit("hideLoading");
      if(this.$route.query.urlQuery && this.$route.query.urlQuery.indexOf('jbr') > -1){
        this.fromUrl = 'jbr'
      }
    },
    mounted() {
      let that = this;
      that.$nextTick(() => {
        window.onpopstate = function () {
          if(that.entity && that.entity.deviceType === 'C') {
            that.$router.replace('/devices');
          }
          if(that.fromUrl === 'jbr'){
            that.$router.replace('/jbr/home')
          }
        }
      })
    },
    beforeRouteLeave(to,from,next) {
      if(from.fullPath === '/devices/bind') {
        this.$router.replace('/devices');
      } else {
        next();
      }
    },
    computed: {
      imgShowList() {
        let _img = [];
        if(this.entity && this.entity.invoiceImagePath) {
          _img.push(this.$filters.img(this.entity.invoiceImagePath,'!w100'));
        }
        return _img;
      }
    },
    methods: {
      /**
       * 编辑设备信息
       * @param type
       */
      editDevice(type) {
        let _type = 'name';

        if(type) {
          _type = type;
        }
        this.$store.commit("showLoading");
        let _params = {
          type: _type,
          urlQuery: this.$route.query.urlQuery
        };
        this.$utils.loctnHref(`/devices/${this.$route.params.id}/edit`, _params);
      },
      /**
       * 一键报修
       */
      repair() {
        let that = this;
        that.$store.commit("showLoading");

        let _temp = that.entity;
        if(_temp) {
          let _params = {
            id: that.$route.params.id,
            deviceId: _temp.id,
            deviceName: _temp.deviceName,
            productId: _temp.productId,
            productImage: _temp.productImage,
            itemCode: _temp.itemCode,
            purchasedDate: that.$filters.formatDate(_temp.purchasedDate),
            address: _temp.address && encodeURIComponent(JSON.stringify(_temp.address))
          }
          that.$utils.loctnHref(`/serviceorder/create`, _params);
        }
      },
      /**
       * 显示缴费记录
       */
      showRechargeLogs() {
        this.feePopup = true;
      },
      /**
       * 恢复出厂设置
       */
      restoreDevice() {
        const that = this;
        that.$dlg.confirm("是否恢复出厂设置？", () => {
          that.$http.post(that.$apihost + '/waterdevices/' + that.entity.id + '/instruction/restore')
            .then((res) => {
              that.$http.get(this.$apihost + '/waterdevices/' + that.entity.id + '/instruction/restore')
                .then((code) => {
                  that.$toast.success('成功恢复出厂设置!');
                })
            })
        });
      },
      /**
       * 查看服务订单详细
       */
      serviceOrder() {
        this.$store.commit("showLoading");
        this.$router.push(`/devices/${this.entity.id}/orderlist`);
      },
      /**
       * 放大图片
       * @param index
       */
      showImg() {
        this.$bus.emit('v-show-img', 0);
      },

      /**
       * 续费
       */
      recharge() {
        const device = this.entity;
        let rechargeUrl = "/devices/" + device.id + "/recharge";
        rechargeUrl += "?leaseProductId=" + device.leaseProductId;
        rechargeUrl += "&deviceName=" + device.deviceName;
        rechargeUrl += "&leaseDueDate=" + this.$filters.formatDate(device.leaseDueDate);
        this.$router.push(encodeURI(rechargeUrl));
      },

      /**
       * 解绑
       */
      unbind() {
        let that = this;
        this.$dlg.confirm("是否解绑该设备吗？", function () {
          let _usrDeviceId = that.$route.params.id;

          if(_usrDeviceId) {
            that.$http.post(`${that.$apihost}/userdevices/${_usrDeviceId}/unbind`)
              .then((res) => {
                that.$toast.success('解绑成功！');
                that.$router.replace('/devices');
              })
          }
        });
      },
      /**
       * 退租
       */
      refund() {
        let that = this;
        that.$store.commit("showLoading");
        let _lotNo = that.entity && that.entity.lotNo;
        if(!_lotNo && that.entity) {
          let _temp = that.entity;
          let _ids = [];
          _ids.push(_temp.id);

          let _macs = [];
          _macs.push(_temp.deviceId);
          let _params = {
            isRefund: true,
            deviceId: _ids && JSON.stringify(_ids),
            macId: _macs && JSON.stringify(_macs),
            orderId: _temp.leaseOrderEntityId || '',
            urlQuery: that.$route.query.urlQuery && this.$route.query.urlQuery.indexOf('jbr') > -1 ? this.$route.query.urlQuery : ''
          };
          that.$utils.loctnHref('/devices/refund',_params);
        } else if(_lotNo) {
          // 商务租赁退租
          that.$http.get(`${that.$apihost}/devices/list/${_lotNo}`)
            .then((res) => {
              that.lotData = res;
              that.refundPopup = true;
            })
        }
      },
      /**
       * 返回
       */
      back() {
        let that = this;
        if(that.fromUrl === 'jbr') {
          that.$utils.loctnHref('/jbr/home')
        } else {
          if (that.entity.deviceType === 'C') {
            that.$utils.loctnHref('/devices');
          } else {
            window.history.go(-1);
          }
        }
      }
    },
    components: {
      VCell,
      logsRecharge,
      companyRefund,
      VImage,
    }
  }
</script>
