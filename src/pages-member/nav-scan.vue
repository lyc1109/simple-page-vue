<style lang="scss" type="text/scss">
  @import "~variables";

</style>
<template>
  <div>
    <mt-field class="padding-left-m padding-right-m" label="设备编码" placeholder="请输入设备编码" v-model="deviceQRCode"></mt-field>
    <div class="align-center margin-top-m">
      <mt-button class="btn btn-sm btn-round btn-primary" @click="testScanApi(deviceQRCode)">扫码结果</mt-button>
      <mt-button class="btn btn-sm btn-round btn-success" @click="addDevice(deviceQRCode)">添加设备</mt-button>
    </div>
  </div>
</template>

<script>
  import types from "@/store/types";
  import App from "@/assets/scripts/app";
  import scanHandler from "@/assets/scripts-page/lease-scan";

  export default {
    name: "scan-test",
    data() {
      return {
        // 设备编码..
        deviceQRCode: ''
      }
    },
    methods: {
      testScanApi(res) {
        let curUrl = App.accessTokenHost + "/scan";
        let query = this.$route.query;
        if(query.nav) {
          curUrl += "?nav=" + query.nav;
        }
        if(query.tab) {
          curUrl += curUrl.indexOf("?") > -1 ? "&" : "?";
          curUrl += "tab=" + query.tab;
        }
        scanHandler.getDeviceQRCodeResult(res);
      },
      testScan(res) {
        let that = this;
        let _self = that;
        console.log(res);
        let _code = res;
        if(res) {
          //提示弹窗
          let tipsAlert = function (tips) {
            that.$dlg.alert(tips);
          };

          //错误弹窗
          let errorAlert = function (errMsg = '数据异常！请联系管理员') {
            that.$dlg.alert(errMsg);
          };

          if(_code) {
            _self.$http.get(`${_self.$apihost}/devices/${_code}/scan`)
              .then((data) => {
                let _result = data.scanResult;                                  // 扫码结果
                let _deviceType = data.deviceType;                              // 设备类型
                let _leaseProductId = data.leaseProductId;                      // 租赁产品id
                let _productId = data.productId;                                // 产品id
                let _deviceId = data.deviceEntityId;                            // 设备id
                let _userDeviceId = data.userDeviceEntityId;                    // 用户设备id
                let _leaseAct = Number(data.leaseAction);                       // 下一步的租赁操作,针对扫码结果为20的租赁设备

                //激活码相关操作
                let activeEvent = function (_activeCode) {
                  let _actLen = _activeCode.length;

                  let _activeEvent = function (value) {
                    if(value) {
                      _self.$http.post(`${_self.$apihost}/lease/devices/${_deviceId}/activate`,{
                        activation_code: value
                      })
                        .then(() => {
                          _self.$http.get(`${_self.$apihost}/userdevices`,{
                            page_no: 1,
                            page_size: 1,
                            page_sort: 'createdDate_desc'
                          })
                            .then((data) => {
                              if(data.totalElements > 0) {
                                let _temp = data.fileList[0];
                                _self.$router.push({ path: `/devices/usrDevice_${_temp.id}/device_${_temp.device && _temp.device.id}/iwater`});
                              }
                            })
                        })
                    }
                  }
                  if(_actLen === 1) {                                     // 激活码只有一哥则自动填
                    this.$dlg.confirm('激活码为' + _activeCode[0] + ',是否激活该设备？', function () {
                      _activeEvent(_activeCode[0]);
                    });
                  } else if(_actLen > 1) {
                    let _activeHtml = `<ul id="code-list">`;
                    for(let i = 0; i<_actLen; i++) {
                      _activeHtml += `<li class="padding-s color-primary code-li" data-key="${_activeCode[i]}">${_activeCode[i]}</li>`;
                    }
                    _activeHtml += `</ul>`;

                    this.$dlg.confirm(_activeHtml, function () {
                      let _selectedCode = _self.$store.getters[types.common.getActiveCode];
                      if(_selectedCode) {
                        _activeEvent(_selectedCode);
                      } else {
                        return false;
                      }
                    });

                    let T = function (el) {
                      el.addEventListener('click', function (event) {
                        let target = event.target;
                        if(target.className.indexOf('code-li') > -1 && target.nodeName === 'LI') {

                          let _key = target.getAttribute('data-key');
                          _self.$store.commit(types.common.setActiveCode, _key);
                          let _temp = document.getElementsByClassName('code-li');
                          for (let i = 0, len = _temp.length; i < len; i++) {
                            _temp[i].setAttribute('style', 'background: #fff');
                          }
                          target.setAttribute('style', 'background: #f3f3f3');
                        }
                      });
                      document.getElementsByClassName('code-li')[0].click;
                    }

                    _self.$nextTick(() => {
                      let thatList = document.getElementsByClassName('mint-msgbox');
                      if(thatList && thatList[0]) {
                        T(thatList[0]);
                      }
                    });
                  }
                }

                if(_result !== null && _result !== '' && _result !== undefined) {
                  if(_result === 99) {                                          // 该二维码不是系统授权的
                    tipsAlert('该设备二维码无效！');
                  } else if(_result === 98) {                                   // 该二维码相应的产品配置或租赁产品配置不存在
                    tipsAlert('用户产品配置无效！');
                  } else if(_result === 95) {                                   // 如果该设备为普通设备，那么转入到设备绑定
                    if(_deviceType) {                                           // 如果为非普通设备，提示配网
                      if(_deviceType === 'C') {
                        if(_productId) {
                          _self.$http.get(`${_self.$apihost}/products/${_productId}`)
                            .then((res) => {
                              let _params = {
                                name: res.name,
                                id: res.id,
                                itemCode: res.itemCode,
                                coverImage: res.coverImage
                              };
                              _self.$router.replace({
                                path: `devices/bind`,
                                query: {
                                  scanId: _code,
                                  data: encodeURIComponent(JSON.stringify(_params))
                                }
                              });
                            });
                        } else {
                          errorAlert();
                        }
                      } else if(_deviceType === 'L' || _deviceType === 'I') {
                        tipsAlert('该设备尚未注册,请先使用配网工具进行配网注册');
                      }
                    } else {
                      errorAlert();
                    }
                  } else if(_result === 20) {                                   // 该设备为未绑定或未激活设备
                    if(_deviceType) {
                      if(_deviceType === 'I') {                                 // 如果智能设备，则直接绑定
                        if(_code) {
                          this.$dlg.confirm("是否确定绑定该设备？", function () {
                            _self.$http.post(`${_self.$apihost}/userdevices/${_code}/bind`)
                              .then((data) => {
                                _self.$toast.success('绑定成功！');
                                let _usrDeId = data && data.id;
                                let _deId = data && data.device && data.device.id;
                                setTimeout(function () {
                                  _self.$router.push({ path: `/devices/usrDevice_${_usrDeId}/device_${_deId}/iwater` });
                                },1000);
                              });
                          });
                        } else {
                          errorAlert();
                        }
                      } else if(_deviceType === 'L') {                          // 如果租赁设备，则根据leaseAction进行下一步操作
                        if(_leaseAct !== undefined && _leaseAct !== null && _leaseAct !== '' && _deviceId) {
                          if(_leaseAct === 0) {                                 // 该设备需要使用激活码进行激活
                            if(_code) {                                         // 根据扫码获取的deviceId获取该用户可用的激活码
                              _self.$http.get(`${_self.$apihost}/lease/activationcodes/available/${_code}`)
                                .then((code) => {
                                  if(code && JSON.stringify(code) !== '[]') {   // 如果有激活码则让用户选择
                                    activeEvent(code);
                                  } else {                                      // 否则提示用户先去支付相应的租赁订单
                                    errorAlert('请先支付相应的租赁订单！');
                                  }
                                })
                            } else {
                              errorAlert();
                            }
                          } else if(_leaseAct === 10) {                          // 该设备需要直接支付（不论该用户是否有租赁订单和激活码）
                            if(_leaseProductId) {
                              if(_deviceId) {
                                // 兼容ios微信
                                _self.$utils.loctnHref(`/combo/${_deviceId}?scanId=${_code}`);
                                // window.location.href = `/userdevices/pay/deposit/${_deviceId}?scanId=${_code}`;
                                // _self.$router.push({
                                //   path: `/userdevices/pay/deposit/${_deviceId}`,
                                //   query: {
                                //     scanId: _code,
                                //   }
                                // });
                              } else if(_userDeviceId) {
                                _self.$http.get(`${_self.$apihost}/userdevices/${_userDeviceId}`)
                                  .then((res) => {
                                    let deviceId = res.device && res.device.id;

                                    if(deviceId) {
                                      // 兼容ios微信
                                      _self.$utils.loctnHref(`/combo/${deviceId}?scanId=${_code}`);
                                      // window.location.href = `/userdevices/pay/deposit/${deviceId}?scanId=${_code}`;
                                      // _self.$router.push({
                                      //   padth: `/userdevices/pay/deposit/${deviceId}`,
                                      //   query: {
                                      //     scanId: _code,
                                      //   }
                                      // });
                                    }
                                  });
                              } else {
                                errorAlert();
                              }
                            }
                          } else {
                            errorAlert();
                          }
                        } else {
                          errorAlert();
                        }
                      } else {
                        errorAlert();
                      }
                    } else {
                      errorAlert();
                    }
                  } else if(_result === 10) {                                   // 未授权设备,用户需要提交授权申请到设备拥有者
                    if(_code) {
                      this.$dlg.confirm("是否确定申请授权查看控制该设备？", function () {
                        _self.$http.post(`${_self.$apihost}/userdevices/${_code}/submit-authorization`)
                          .then(() => {
                            _self.$messenger.success('申请发送成功!');
                          });
                      });
                    } else {
                      errorAlert();
                    }
                  } else if(_result === 12) {                                   // 授权中设备,用户已提交授权申请到设备拥有者
                    tipsAlert('设备使用授权申请成功，等待拥有者通过申请即可查看设备！');
                  } else if(_result === 16) {                                   // 无权设备,拥有者拒绝授权给该用户
                    tipsAlert('您无权查看该设备！');
                  } else if(_result === 0) {                                     // 正常设备,用户可以查看设备详情
                    if(_userDeviceId && _deviceType) {
                      if(_deviceType === 'C') {
                        _self.$router.push(`/devices/${_userDeviceId}/view`);
                      } else {
                        if(!_deviceId) {
                          _self.$http.get(`${_self.$apihost}/userdevices/${_userDeviceId}`)
                            .then((res) => {
                              let deviceId = res.device && res.device.id;

                              if(deviceId) {
                                _self.$router.push({ path: `/devices/usrDevice_${_userDeviceId}/device_${deviceId}/iwater` });
                              }
                            });
                        } else {
                          _self.$router.push({ path: `/devices/usrDevice_${_userDeviceId}/device_${_deviceId}/iwater` });
                        }
                      }
                    } else {
                      errorAlert();
                    }
                  } else {
                    errorAlert();
                  }
                } else {
                  errorAlert();
                }
              })
          } else {
            errorAlert();
          }
        }
      },
      refundAlipay() {
        this.$http.post(`${this.$apihost}/alipay/test/serviceorders/3zOxwj/refund`)
          .then((res) => {
            const div = document.createElement('div');
            div.innerHTML = res;
            document.getElementById('app').appendChild(div);
            document.forms[0].submit();
          })
      },
      /**
       * 扫码添加设备
       */
      addDevice: function (_code) {
        let that = this;
//        this.$emit("cancel")
//        that.$wechat.init(that, function () {
//          that.$wechat.scanQRCode({
//            needResult: 1,
//            scanType: ["qrCode", "barCode"],
//            success: function (res) {
//              let _code = res.resultStr;

              if(_code) {
                // 通过设备编码获取设备id
                that.$http.get(`${that.$apihost}/devices/${_code}/scan`)
                  .then((res) => {
                    if(res && res.deviceEntityId) {
                      // 通过设备id判断设备是否在线
                      that.$http.get(`${that.$basehost}/open/v3/devices/${_code}/online`)
                        .then((isonline) => {
                          let _isonline = isonline;
                          if(window.location.host === '192.168.0.146:8000' || window.location.host === 't.m.xohaa.net') {
                            _isonline = true;
                          }
                          if(_isonline) {
                            // 设备在线才添加设备
                            that.$http.post(`${that.$woshost}/workorders/${that.order.id}/devices`, {
                              device_id: _code
                            })
                              .then(() => {
                                that.$toast.success('添加设备成功！');
                                setTimeout(() => {
                                  location.reload();
                                }, 500);
                              })
                          } else {
                            that.$toast.error('请确保设备在线！');
                          }
                        })
                    }
                  })
              }
//            }
//          })
//        })
      },
    }
  }
</script>
