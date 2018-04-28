<style scoped lang="scss" type="text/scss">
  @import '~variables';
  .popup-window{
    .popup-window-content{
      .popup-window-title{
        position: relative;
        width: auto;
        background: transparent;
        border: none;
        text-align: right;
        .close{
          font-size: 28px;
          line-height: 25px;
        }
      }
    }

  }
  .qrcode{
    text-align: center;
    margin-top: 50%;
  }
  .btn {
    border: rem(1px) solid $font-lighter;
    @extend %margin-left-s;
    @include border-radius(15px);
    &:last-child {
      background: $primary;
      background-color: $primary;
      color: $white;
      border: rem(1px) solid $primary;
    }
  }
  /*<!--.btn-default {-->*/
    /*<!--background-color: $white;-->*/
    /*<!--border-color: rgba($blue-3,.35);-->*/
    /*<!--color: $primary-light;-->*/
  /*<!--}-->*/
  .copy-tag {
    border: 1px solid $primary;
    padding: rem(1px) rem(3px);
    min-width: 20px;
    display: inline-block;
  }
</style>

<template>
  <div>
    <div v-if="order && order.status !== null">
      <mt-button class="btn btn-sm"
                 v-if="type === 'view'"
                 @click.stop="back">返回</mt-button>
      <mt-button class="btn btn-sm"
                 v-if="type === 'del' && order.status < 70"
                 @click.stop="delDevice(order)">删除设备</mt-button>
      <mt-button class="btn btn-sm"
                 v-if="order.orderType !== 'returnDeposit' && order.orderType !== 'common' && (order.status === 45 || order.status === 41 || (order.status === 40 && (order.orderType === 'install' || order.deviceType === 'L'))) && type === 'view'"
                 @click.stop="addDevice()">添加设备</mt-button>
      <mt-button class="btn btn-sm"
                 v-if="(order.status === 45 || order.status === 41 || (order.status === 40 && (order.deviceType === 'L' || order.orderType === 'install'))) && type !== 'copy-btn'"
                 @click.stop="finished">结束工单</mt-button>
      <mt-button class="btn btn-sm"
                 v-if="(order.status === 20 || order.status === 30) && type === 'view'"
                 @click.stop="reject">拒绝工单</mt-button>
      <mt-button class="btn btn-sm"
                 v-if="(order.status === 20 || order.status === 30) && (type === 'list' || type === 'view')"
                 @click.stop="transfer">转单</mt-button>
      <mt-button class="btn btn-sm"
                 v-if="(order.status === 20 || order.status === 30) && type !== 'copy-btn'"
                 @click.stop="process">开始执行</mt-button>
      <mt-button class="btn btn-sm"
                 v-if="(order.status === 40 && order.orderType === 'common') && type !== 'copy-btn'"
                 @click.stop="valuation">工单计价</mt-button>
      <!--<mt-button class="btn btn-sm"-->
                 <!--v-if="(order.status === 40 && order.deviceType !== 'L') && type !== 'copy-btn'"-->
                 <!--@click.stop="valuation">工单计价</mt-button>-->
      <mt-button class="btn btn-sm"
                 v-if="order.status === 60 && order.orderType !== 'returnDeposit' && type !== 'copy-btn'"
                 @click.stop="receipt">现金收款</mt-button>
      <mt-button class="btn btn-sm"
                 v-if="order.status === 60 && order.orderType === 'common' && type === 'view'"
                 @click.stop="revaluation">重新计价</mt-button>
      <!--<mt-button class="btn btn-primary btn-sm"
                 v-show="order.status === 41 && order.deviceEntityId !== null && order.orderType === 'lease' && type === 'view'"
                 @click.stop="experience">
        暂时不开发
        15天体验
      </mt-button>-->
    </div>
    <span v-if="type === 'copy-btn'">
      <v-script src="../../static/js/clipboard.min.js"></v-script>
    </span>
    <span class="copy-tag font-s margin-left-s color-primary border-radius"
          v-if="type === 'copy-btn' && address"
          :data-clipboard-text="address"
          @click.stop="copyAddress(address)">复制</span>
  </div>
</template>

<script>
  import types from "@/store/types";
  import App from "@/assets/scripts/app";
  import deviceApi from "@/apis/api-devices";
  import scanHandler from "@/assets/scripts-page/lease-scan";

  export default {
    name: "actions",
    props: ["type","order","address","index"],
    computed: {
      // 当前店铺
      curShop () {
        return this.$store.getters[types.oauth.getCurShop];
      }
    },
    methods: {
      /**
       * 开始执行
       */
      process() {
        this.$dlg.confirm("是否确定开始此工单?", () => {
          this.$http.post(this.$woshost + "/workorders/" + this.order.id + "/process")
            .then((resp) => {
              this.$messenger.alert('操作成功');
              setTimeout(() => {
                location.reload();
              }, 600);
            })
        });
      },
      /**
       * 删除设备
       */
      delDevice(item) {
        let that = this;
        if(that.type === 'del') {
          that.$http.del(`${that.$woshost}/workorders/${that.$route.params.id}/devices`,{
            device_id: item && item.deviceId
          })
            .then(() => {
//              that.$toast.success('删除设备成功！');
              that.$dlg.alert('删除设备成功！');
              setTimeout(() => {
                location.reload();
              }, 500);
            })
            .catch((err) => {
              if(err && err.errMsg) {
                that.$dlg.alert(err.errMsg);
              }
              return false;
            })
        }
      },
      /**
       * 添加设备的操作
       * @param deviceId
       */
      addDeviceEvent(deviceId) {
        let that = this;
        // 添加设备
        let addEvent = function () {
          that.$http.post(`${that.$woshost}/workorders/${that.order.id}/devices`, {
            device_id: deviceId
          })
            .then(() => {
//              that.$toast.success('添加设备成功！');
              that.$dlg.alert('添加设备成功！');
              setTimeout(() => {
                location.reload();
              }, 500);
            })
            .catch((err) => {
              if (err && err.errMsg) {
//                that.$toast.error(err.errMsg);
                that.$dlg.alert(err.errMsg);
              }
              return false;
            })
        };

        deviceApi.getDeviceQRCodeResult(deviceId)
          .then((resp) => {
            if(resp.deviceEntityId === "") {
              that.$dlg.alert("设备不存在。<br/> Tips: 请使用配网工具进行配网注册");
            } else {
              if(resp.deviceType !== "C" || !App.isProduct || (that.curShop && that.curShop.id === 'n6ZR6p')) {
                addEvent();
              } else {
                // 通过设备编码判断设备是否在线
                that.$http.get(`${that.$basehost}/open/v3/devices/${deviceId}/online`)
                  .then((isOnline) => {
                    if(isOnline) {
                      addEvent();
                    } else {
                      that.$dlg.alert("设备离线，无法添加设备。<br/> Tips: 请确保设备已配网成功");
                    }
                  })
              }
            }
          });
      },
      /**
       * 扫码添加设备
       */
      addDevice: function () {
        let that = this;
        let curUrl = App.accessTokenHost + "/wos/workOrder/" + that.order.id;

        if(that.$wechat.isInWechat()) {
          that.$wechat.init(curUrl, function () {
            that.$wechat.scanQRCode(function (deviceId) {
              that.addDeviceEvent(deviceId);
            })
          })
        } else if(that.$alipay.isInAlipay()) {
          that.$alipay.init(function () {
            that.$alipay.scanQRCode(function (deviceId) {
              that.addDeviceEvent(deviceId);
            })
          })
        } else {
          this.$dlg.prompt("手动输入二维码上12位设备编码", (resp) => {
            that.addDeviceEvent(resp);
          })
        }
      },

      /**
       * 结束工单
       */
      finished() {
        let that = this;
        let _title = '';
        let _type = that.order.orderType;

        let finishEvent = function() {
          that.$dlg.confirm("是否确定结束工单?", () => {
            that.$http.post(`${that.$woshost}/workorders/${that.order.id}/finished`)
              .then(() => {
                that.$toast.success('操作成功');
                setTimeout(() => {
                  location.reload();
                }, 600);
              })
              .catch((err) => {
                that.$toast.error(`抱歉：${(err && (err.errMsg || err.returnMsg))}`);
                return false;
              })
          });
        };

        if(_type === 'lease' || _type === 'install') {
          if(_type === 'lease') {
            _title = '租赁';
          } else if(_type === 'install') {
            _title = '装机';
          }

          // 租赁/装机数量
          let _count = 0;
          // 设备数量
          let _temp = 0;

          _count = that.order.deviceCount;
          that.$http.get(`${that.$woshost}/workorders/${that.order.id}/devices`)
            .then((device) => {
              _temp = Number(device.length);

              if(Number(_count) !== _temp) {
                that.$dlg.alert('结束工单前请扫码添加和' + _title + '数量一致的设备！');
                return false;
              } else {
                finishEvent();
              }
            })
        } else {
          finishEvent();
        }
      },
      /**
       * 拒绝
       */
      reject() {
        let that = this;
        this.$dlg.prompt("请输入拒绝原因", (reasonVal) => {
          let reason = {
            'reject_reason': reasonVal
          };
          this.$http.post(this.$woshost + "/workorders/" + this.order.id + "/reject",reason)
            .then((resp) => {
              that.$messenger.alert('操作成功');
              setTimeout(function () {
                that.$store.commit(types.wos.setPageData, null);
                that.$router.go(-1);
              },500)
            })
        });
      },
      /**
       * 转单
       */
      transfer() {
        this.$emit("transferModel");
      },
      /**
       * 工单计价
       */
      valuation() {
        this.$utils.loctnHref(`/wos/workOrder/${this.order.id}/valuation`);
      },
      /**
       * 现金收款
       */
      receipt() {
        let that = this;
        that.$dlg.confirm("是否确定该工单已收款?",  () => {
          that.$http.post(`${that.$woshost}/workorders/${that.order.id}/collect-payment`)
            .then((resp) => {
              that.$messenger.alert('操作成功');
              setTimeout(() => {
                location.reload();
              }, 600);
            });
        });
      },
      /**
       * 重新计价
       */
      revaluation() {
        this.$router.push({path: '/wos/workOrder/'+ this.order.id +'/valuation'});
      },
      /**
       * 15天体验
       */
      experience() {
        let that = this;
        that.$dlg.confirm("是否授权15天体验期?", () => {
          let params = {
            deviceEntityId: ''
          };
          that.$http.post(that.$woshost + '/workorders/' + that.order.id + 'f15d', params)
            .then((res) => {
              that.$messenger.alert('操作成功');
              setTimeout(() => {
                location.reload();
              }, 500);
            });
        });
      },
      /**
       * 返回
       */
      back() {
        history.back()
      },
      /**
       * 复制地址
       * @param _text 地址内容
       */
      copyAddress(_text) {
        let that = this;
        let clipboard = null;
        let $btn = document.getElementsByClassName('copy-tag');
        $btn = $btn && $btn[that.index];

        that.clipboard = new Clipboard($btn);
        clipboard = new Clipboard($btn);

        clipboard.on('success', function(e) {
          that.$messenger.success('复制成功');
          clipboard.destroy();
        });
        $btn.click();
      },
    }
  }
</script>
